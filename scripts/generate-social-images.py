#!/usr/bin/env python3
"""
CHOTTO Social Image Generator (Phase 4)
Generates 1200x630 OpenGraph share images following the CHOTTO Brand Guide.
Colors:
- Giấy (Background): #FAF8F5
- Mực (Text): #1A1D20
- Secondary Text: #5A626A
- Border / Line: #E5E0D8
- Category Accents:
  - doc: #2B6CB0 (Blue)
  - work: #2F855A (Green)
  - brand orange: #E66A2B
"""

import os
from PIL import Image, ImageDraw, ImageFont

OG_WIDTH = 1200
OG_HEIGHT = 630
OUT_DIR = 'public/images/og'

os.makedirs(OUT_DIR, exist_ok=True)

# Font selection
FONT_BOLD_PATH = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
FONT_REG_PATH = '/System/Library/Fonts/Supplemental/Arial.ttf'

if not os.path.exists(FONT_BOLD_PATH):
    FONT_BOLD_PATH = '/System/Library/Fonts/Helvetica.ttc'
if not os.path.exists(FONT_REG_PATH):
    FONT_REG_PATH = '/System/Library/Fonts/Helvetica.ttc'

font_logo = ImageFont.truetype(FONT_BOLD_PATH, 38)
font_category = ImageFont.truetype(FONT_BOLD_PATH, 20)
font_title = ImageFont.truetype(FONT_BOLD_PATH, 54)
font_desc = ImageFont.truetype(FONT_REG_PATH, 26)
font_badge = ImageFont.truetype(FONT_BOLD_PATH, 18)
font_domain = ImageFont.truetype(FONT_BOLD_PATH, 22)

CARDS = [
    {
        'filename': 'og-default.png',
        'category': 'HƯỚNG DẪN & CÔNG CỤ THIẾT YẾU',
        'category_color': '#E66A2B',
        'category_bg': '#FFF5EB',
        'title': 'Vấn đề nhỏ, có Chotto\ngiúp một chút.',
        'subtitle': 'Thông tin, hướng dẫn thủ tục hành chính, thuế, việc làm\nvà công cụ hữu ích cho người Việt tại Nhật Bản.',
        'badge': 'CHƠN THỰC · ĐỘC LẬP · ĐÃ ĐỐI CHIẾU NGUỒN',
        'accent': '#E66A2B',
    },
    {
        'filename': 'og-mat-the-zairyu.png',
        'category': 'GIẤY TỜ & HÀNH CHÍNH',
        'category_color': '#2B6CB0',
        'category_bg': '#EBF8FF',
        'title': 'Mất thẻ cư trú (Zairyu Card)\nthì làm gì?',
        'subtitle': 'Quy trình 3 bước: Báo mất tại Koban lấy giấy xác nhận,\nchuẩn bị ảnh 3x4cm và làm lại tại Nyukan trong 14 ngày.',
        'badge': 'ĐỐI CHIẾU NGUỒN: CỤC XUẤT NHẬP CẢNH NHẬT BẢN (ISA)',
        'accent': '#2B6CB0',
    },
    {
        'filename': 'og-luong-30man.png',
        'category': 'VIỆC LÀM & TIỀN',
        'category_color': '#2F855A',
        'category_bg': '#F0FFF4',
        'title': 'Lương 30 man thực nhận\nbao nhiêu hàng tháng?',
        'subtitle': 'Cơ cấu 4 khoản khấu trừ: Bảo hiểm y tế, Nenkin, Bảo hiểm\nviệc làm và Thuế (thu nhập + thị dân). Ước tính Tedori.',
        'badge': 'ĐỐI CHIẾU NGUỒN: CỤC THUẾ QUỐC GIA (NTA) & NENKIN',
        'accent': '#2F855A',
    },
]

for card in CARDS:
    img = Image.new('RGB', (OG_WIDTH, OG_HEIGHT), color='#FAF8F5')
    draw = ImageDraw.Draw(img)

    # 1. Subtle Outer Border
    draw.rectangle([(20, 20), (OG_WIDTH - 20, OG_HEIGHT - 20)], outline='#E8E3DA', width=2)

    # 2. Left Brand Accent Bar
    draw.rectangle([(20, 20), (28, OG_HEIGHT - 20)], fill=card['accent'])

    # 3. Top Header: Logo + Domain
    draw.text((90, 70), 'chotto', fill='#1A1D20', font=font_logo)
    # Draw colored logo dot
    draw.ellipse([(205, 80), (218, 93)], fill='#E66A2B')

    # Domain
    draw.text((OG_WIDTH - 280, 78), 'chottoday.com', fill='#5A626A', font=font_domain)

    # Divider line
    draw.line([(90, 130), (OG_WIDTH - 90, 130)], fill='#E8E3DA', width=1)

    # 4. Category Badge
    cat_text = card['category']
    # Calculate text bounding box
    bbox = draw.textbbox((0, 0), cat_text, font=font_category)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    pill_x = 90
    pill_y = 165
    pill_w = text_w + 28
    pill_h = 36
    draw.rounded_rectangle([(pill_x, pill_y), (pill_x + pill_w, pill_y + pill_h)], radius=18, fill=card['category_bg'], outline=card['category_color'], width=1)
    draw.text((pill_x + 14, pill_y + 7), cat_text, fill=card['category_color'], font=font_category)

    # 5. Title (multiline supported)
    draw.text((90, 225), card['title'], fill='#1A1D20', font=font_title, spacing=16)

    # 6. Subtitle
    draw.text((90, 395), card['subtitle'], fill='#5A626A', font=font_desc, spacing=12)

    # 7. Bottom Trust Badge
    badge_y = 515
    draw.line([(90, badge_y - 18), (OG_WIDTH - 90, badge_y - 18)], fill='#E8E3DA', width=1)
    
    # Shield icon or bullet
    draw.ellipse([(90, badge_y + 4), (102, badge_y + 16)], fill='#2F855A')
    draw.text((115, badge_y), card['badge'], fill='#2F855A', font=font_badge)

    out_path = os.path.join(OUT_DIR, card['filename'])
    img.save(out_path, 'PNG', quality=95)
    print(f'Generated {out_path} ({OG_WIDTH}x{OG_HEIGHT})')

print('All social images successfully generated.')
