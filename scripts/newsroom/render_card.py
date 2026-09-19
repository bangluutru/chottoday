#!/usr/bin/env python3
"""
Newsroom — vẽ ảnh card 1200x630 cho mỗi tin.

Vì sao render bằng template thay vì sinh ảnh bằng AI: model sinh ảnh viết sai
dấu tiếng Việt và bịa kanji. Một tấm card nói về 在留カード mà kanji sai thì
tệ hơn là không có ảnh. Template thì chữ luôn đúng, màu luôn đúng brand, và
kết quả lặp lại được.

Màu và bo góc lấy từ src/styles/tokens.css. Font là đúng hai font thương hiệu
(Nunito cho tiêu đề, Be Vietnam Pro cho phần còn lại), vendor qua npm nên chạy
giống nhau ở máy và trên CI runner.

CHỐT AN TOÀN: mọi ký tự đều được kiểm tra có nằm trong font hay không TRƯỚC
khi vẽ. Thiếu glyph thì dừng với lỗi rõ ràng, thay vì lặng lẽ xuất ra một tấm
ảnh đầy ô vuông rồi mới phát hiện lúc đã đăng lên fanpage.
"""

import argparse
import json
import sys
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

REPO_ROOT = Path(__file__).resolve().parents[2]
FONT_DIR = REPO_ROOT / 'node_modules' / '@expo-google-fonts'

WIDTH, HEIGHT = 1200, 630
MARGIN = 72

# --- Token màu, chép từ src/styles/tokens.css ---------------------------------
PAPER = '#FBF9F5'
CARD = '#FFFFFF'
INK = '#1E2A44'
TEXT_SECONDARY = '#3A4354'
TEXT_MUTED = '#666D7A'
BORDER_CARD = '#E6E2D9'

# Sáu nhóm chủ đề + ba nhóm bổ sung, ánh xạ về colorKey trong categoryMap.js.
TOPIC_COLORS = {
    'life':     {'accent': '#66B96B', 'text': '#2F7A43', 'bg': '#EDF7EE'},
    'doc':      {'accent': '#1E2A44', 'text': '#1E2A44', 'bg': '#ECEFF5'},
    'work':     {'accent': '#FBA93E', 'text': '#8F5310', 'bg': '#FEF6EB'},
    'health':   {'accent': '#F15A53', 'text': '#B32B26', 'bg': '#FDEEED'},
    'study':    {'accent': '#AB8DF5', 'text': '#6741C4', 'bg': '#F6F2FE'},
    'tool':     {'accent': '#2FC5D0', 'text': '#0A6E78', 'bg': '#E9F8F9'},
    'newcomer': {'accent': '#66B96B', 'text': '#2F7A43', 'bg': '#EDF7EE'},
    'job':      {'accent': '#1E2A44', 'text': '#1E2A44', 'bg': '#ECEFF5'},
    'family':   {'accent': '#FBA93E', 'text': '#8F5310', 'bg': '#FEF6EB'},
}

TOPIC_LABELS = {
    'life': 'ĐỜI SỐNG & NHÀ Ở',
    'doc': 'GIẤY TỜ & HÀNH CHÍNH',
    'work': 'VIỆC LÀM & TIỀN',
    'health': 'SỨC KHOẺ & KHẨN CẤP',
    'study': 'TIẾNG NHẬT & HỌC TẬP',
    'tool': 'CÔNG CỤ CHOTTO',
    'newcomer': 'MỚI SANG NHẬT',
    'job': 'CÔNG VIỆC',
    'family': 'GIA ĐÌNH & GIÁO DỤC',
}

FONTS = {
    'title': FONT_DIR / 'nunito' / '800ExtraBold' / 'Nunito_800ExtraBold.ttf',
    'chip': FONT_DIR / 'be-vietnam-pro' / '600SemiBold' / 'BeVietnamPro_600SemiBold.ttf',
    'body': FONT_DIR / 'be-vietnam-pro' / '400Regular' / 'BeVietnamPro_400Regular.ttf',
    'meta': FONT_DIR / 'be-vietnam-pro' / '500Medium' / 'BeVietnamPro_500Medium.ttf',
}

# Font dự phòng cho kanji/kana, thứ mà font thương hiệu không phủ.
JP_FALLBACK_CANDIDATES = [
    Path('/etc/alternatives/fonts-japanese-gothic.ttf'),
    Path('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'),
    Path('/usr/share/fonts/truetype/fonts-japanese-gothic.ttf'),
]


class MissingGlyphError(RuntimeError):
    """Chữ cần vẽ có ký tự mà font không có. Dừng, đừng vẽ ra tofu."""


def _cmap(font_path):
    """Tập code point mà một file font phủ."""
    ttf = TTFont(str(font_path), fontNumber=0, lazy=True)
    covered = set()
    for table in ttf['cmap'].tables:
        covered.update(table.cmap.keys())
    ttf.close()
    return covered


def find_jp_fallback():
    for candidate in JP_FALLBACK_CANDIDATES:
        if candidate.exists():
            return candidate
    return None


def assert_covered(text, font_path, coverage_cache, label):
    """
    Kiểm tra từng ký tự. Ký tự nào font thương hiệu không có thì báo lỗi kèm
    đúng ký tự và vị trí, để sửa nguồn chữ chứ không phải đoán.
    """
    if font_path not in coverage_cache:
        coverage_cache[font_path] = _cmap(font_path)
    covered = coverage_cache[font_path]

    missing = sorted({ch for ch in text if ord(ch) not in covered and ch not in '\n\t'})
    if missing:
        detail = ', '.join(f'{ch!r} (U+{ord(ch):04X})' for ch in missing)
        raise MissingGlyphError(
            f'{label}: font {font_path.name} thiếu {len(missing)} ký tự: {detail}\n'
            f'  Chữ: {text[:120]}'
        )


def split_by_coverage(text, primary_coverage):
    """
    Cắt chuỗi thành các đoạn liền nhau theo việc font chính có phủ hay không.
    Trả về [(đoạn, dùng_font_chính)], để vẽ kanji bằng font dự phòng mà vẫn
    giữ nguyên thứ tự chữ.
    """
    runs = []
    for ch in text:
        use_primary = ord(ch) in primary_coverage
        if runs and runs[-1][1] == use_primary:
            runs[-1][0] += ch
        else:
            runs.append([ch, use_primary])
    return [(chunk, primary) for chunk, primary in runs]


def draw_mixed_text(draw, xy, text, primary_font, fallback_font, fill, primary_coverage):
    """Vẽ chữ trộn Việt–Nhật, tự chuyển font theo từng đoạn."""
    x, y = xy
    for chunk, use_primary in split_by_coverage(text, primary_coverage):
        font = primary_font if use_primary or fallback_font is None else fallback_font
        draw.text((x, y), chunk, font=font, fill=fill)
        x += draw.textlength(chunk, font=font)
    return x


def measure_mixed(draw, text, primary_font, fallback_font, primary_coverage):
    width = 0
    for chunk, use_primary in split_by_coverage(text, primary_coverage):
        font = primary_font if use_primary or fallback_font is None else fallback_font
        width += draw.textlength(chunk, font=font)
    return width


def wrap_to_width(draw, text, primary_font, fallback_font, primary_coverage, max_width):
    """Xuống dòng theo chiều rộng thật, không theo số ký tự."""
    words = text.split()
    lines, current = [], ''
    for word in words:
        trial = f'{current} {word}'.strip()
        if measure_mixed(draw, trial, primary_font, fallback_font, primary_coverage) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def render_card(item, out_path, max_title_lines=4):
    topic = item.get('topic') or 'doc'
    colors = TOPIC_COLORS.get(topic, TOPIC_COLORS['doc'])
    label = TOPIC_LABELS.get(topic, 'CHOTTO')

    title = (item.get('title') or '').strip()
    organization = (item.get('organization') or '').strip()
    published = (item.get('publishedAt') or '')[:10]

    if not title:
        raise ValueError('Tin không có tiêu đề, không vẽ được card')

    coverage_cache = {}
    jp_fallback_path = find_jp_fallback()

    # Nhãn chip và dòng thương hiệu là chữ của mình, phải nằm trọn trong font
    # thương hiệu — thiếu là lỗi của TOPIC_LABELS, sửa ngay tại chỗ.
    assert_covered(label, FONTS['chip'], coverage_cache, 'Nhãn chủ đề')
    assert_covered('chottoday.com', FONTS['meta'], coverage_cache, 'Dòng thương hiệu')

    title_font = ImageFont.truetype(str(FONTS['title']), 52)
    chip_font = ImageFont.truetype(str(FONTS['chip']), 20)
    meta_font = ImageFont.truetype(str(FONTS['meta']), 22)
    brand_font = ImageFont.truetype(str(FONTS['meta']), 24)

    title_coverage = coverage_cache.setdefault(FONTS['title'], _cmap(FONTS['title']))
    meta_coverage = coverage_cache.setdefault(FONTS['meta'], _cmap(FONTS['meta']))

    jp_title_font = ImageFont.truetype(str(jp_fallback_path), 52) if jp_fallback_path else None
    jp_meta_font = ImageFont.truetype(str(jp_fallback_path), 22) if jp_fallback_path else None

    # Tiêu đề tin là chữ của nguồn, có thể chứa kanji. Không ép nó nằm trong
    # font thương hiệu; nhưng nếu cũng không có font dự phòng thì phải dừng.
    if jp_fallback_path is None:
        assert_covered(title, FONTS['title'], coverage_cache, 'Tiêu đề tin')
    if organization and jp_fallback_path is None:
        assert_covered(organization, FONTS['meta'], coverage_cache, 'Tên cơ quan')

    image = Image.new('RGB', (WIDTH, HEIGHT), PAPER)
    draw = ImageDraw.Draw(image)

    # Thẻ trắng, viền phẳng 1px, đúng .chotto-card
    card_box = (MARGIN - 24, MARGIN - 24, WIDTH - MARGIN + 24, HEIGHT - MARGIN + 24)
    draw.rounded_rectangle(card_box, radius=16, fill=CARD, outline=BORDER_CARD, width=1)
    # Dải màu chủ đề bên trái, đúng .card-* trong global.css
    draw.rounded_rectangle(
        (card_box[0], card_box[1], card_box[0] + 8, card_box[3]),
        radius=4, fill=colors['accent']
    )

    x = MARGIN + 8
    y = MARGIN + 4

    # Chip chủ đề
    chip_w = draw.textlength(label, font=chip_font) + 32
    draw.rounded_rectangle((x, y, x + chip_w, y + 38), radius=19, fill=colors['bg'])
    draw.text((x + 16, y + 8), label, font=chip_font, fill=colors['text'])
    y += 68

    # Tiêu đề, căn giữa theo chiều dọc trong khoảng trống giữa chip và chân
    # card. Tiêu đề một dòng và tiêu đề bốn dòng vì thế trông cân như nhau,
    # thay vì dòng ngắn thì treo lơ lửng trên đầu.
    LINE_HEIGHT = 66
    max_text_width = WIDTH - MARGIN * 2 - 16
    lines = wrap_to_width(draw, title, title_font, jp_title_font, title_coverage, max_text_width)
    truncated = len(lines) > max_title_lines
    shown = lines[:max_title_lines]

    foot_y = HEIGHT - MARGIN - 18
    divider_y = foot_y - 26
    block_height = len(shown) * LINE_HEIGHT
    y = y + max(0, (divider_y - 24 - y - block_height) // 2)

    for line in shown:
        draw_mixed_text(draw, (x, y), line, title_font, jp_title_font, INK, title_coverage)
        y += LINE_HEIGHT
    if truncated:
        draw.text((x, y - 8), '…', font=title_font, fill=INK)

    # Chân card: nguồn + ngày bên trái, thương hiệu bên phải
    draw.line((x, divider_y, WIDTH - MARGIN, divider_y), fill=BORDER_CARD, width=1)

    meta_parts = [p for p in (organization, published) if p]
    if meta_parts:
        draw_mixed_text(
            draw, (x, foot_y), ' · '.join(meta_parts),
            meta_font, jp_meta_font, TEXT_MUTED, meta_coverage
        )

    brand = 'chottoday.com'
    brand_w = draw.textlength(brand, font=brand_font)
    draw.text((WIDTH - MARGIN - brand_w, foot_y - 2), brand, font=brand_font, fill=colors['text'])

    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(out_path, 'PNG', optimize=True)
    return out_path


def main():
    parser = argparse.ArgumentParser(description='Vẽ card tin 1200x630 cho fanpage')
    parser.add_argument('--item', help='JSON một tin (title, topic, organization, publishedAt)')
    parser.add_argument('--items-file', help='File JSON chứa mảng tin')
    parser.add_argument('--out', required=True, help='File PNG, hoặc thư mục khi dùng --items-file')
    args = parser.parse_args()

    if not FONT_DIR.exists():
        print(f'❌ Chưa có font thương hiệu ở {FONT_DIR} — chạy `npm ci` trước.', file=sys.stderr)
        return 1

    try:
        if args.items_file:
            items = json.loads(Path(args.items_file).read_text(encoding='utf-8'))
            out_dir = Path(args.out)
            for index, item in enumerate(items, start=1):
                path = render_card(item, out_dir / f'card-{index:02d}.png')
                print(f'  ✓ {path}')
        else:
            item = json.loads(args.item)
            print(f'  ✓ {render_card(item, args.out)}')
    except MissingGlyphError as exc:
        print(f'❌ Thiếu glyph, không xuất ảnh:\n{exc}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
