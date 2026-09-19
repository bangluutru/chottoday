# HƯỚNG DẪN TRIỂN KHAI PALETTE "CHOTTO" CHO AI-TOOLS / TOOLIO

**Đối tượng đọc:** AI coder / developer đang làm việc trên repo `ai-tools`.
**Mục tiêu:** thêm trục lựa chọn **bảng màu (palette)** cho người dùng — `toolio` (hiện tại, điềm tĩnh/kỹ thuật) hoặc `chotto` (trẻ trung, theo bộ nhận diện Chotto) — **độc lập** với trục `light | dark | system` đã có.

> Tài liệu màu trực quan kèm theo: `Chotto - Bang mau giao dien.dc.html` (9 trang A4, in được).
> Nguồn màu gốc: `Chotto - So tay thuong hieu.dc.html`, trang 09–10.

---

## 0. RÀNG BUỘC BẤT BIẾN (đọc trước khi viết code)

1. **Không đổi tên token.** Toàn bộ 37 token màu trong `hub/src/index.css` giữ nguyên tên; palette chỉ gán lại **giá trị**. Hệ quả: **0 dòng thay đổi** trong 12 miniapp và `packages/core`.
2. **Không hardcode hex.** Quy tắc bất biến của `design.md` §23.8 vẫn áp dụng tuyệt đối. Không có `bg-white`, `text-slate-900`, `#2FC5D0` rời rạc trong component.
3. **Không đổi layout.** Lưới `max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8`, thang 8px, `fontSize` scale, `lucide-react` — giữ nguyên 100%.
4. **Palette là cấu hình toàn cục.** Miniapp không được tự ghi đè palette (vi phạm `design.md` Rule 5).
5. **Token mới phải khai báo ở CẢ HAI palette.** Nhóm `--accent-violet*` và `--cat-*` cần có giá trị cho `toolio` nữa, nếu không giao diện sẽ rỗng màu khi người dùng chuyển về Toolio.
6. **Mọi màu chữ phải ≥ 4.5:1.** Mã thương hiệu gốc (`#66B96B`, `#2FC5D0`, `#FBA93E`, `#F15A53`, `#AB8DF5`) **chỉ dùng làm mảng nền**, không bao giờ làm màu chữ trên nền sáng (chỉ đạt 2.0–2.4:1).

---

## 1. KIẾN TRÚC

Thêm thuộc tính `data-palette` lên `<html>`, song song với `data-theme` đang có:

```html
<html data-palette="chotto" data-theme="light" class="light">
```

Bốn tổ hợp hợp lệ:

| `data-palette` | `data-theme` | Diện mạo |
|:---|:---|:---|
| `toolio` | `dark` | Nền `#090D16`, nhấn cyan `#0ea5e9` — **mặc định hiện tại, không đổi** |
| `toolio` | `light` | Nền `#f8fafc`, nhấn sky `#0369A1` — **không đổi** |
| `chotto` | `dark` | Nền navy `#0F1626`, thẻ Mực `#1E2A44`, nhấn Ngọc `#2FC5D0` |
| `chotto` | `light` | Nền Giấy `#FBF9F5`, thẻ trắng, nhấn Ngọc đậm `#0A6E78` |

### Về độ ưu tiên CSS (quan trọng)

Khối hiện tại `:root, [data-theme="dark"]` có specificity `(0,1,0)`; `[data-theme="light"]` cũng `(0,1,0)`.
Khối Chotto dùng **hai thuộc tính** → `(0,2,0)` → **luôn thắng**, không cần `!important`.

Bắt buộc dùng bộ chọn hai thuộc tính cho cả hai chế độ (không dùng `[data-palette="chotto"]` trần, vì nó có specificity thấp hơn và sẽ ghi đè sai khi `data-theme="light"`):

```css
[data-palette="chotto"][data-theme="dark"],
[data-palette="chotto"]:not([data-theme="light"]) { /* dark */ }

[data-palette="chotto"][data-theme="light"] { /* light */ }
```

`applyThemeToDom()` hiện tại **luôn** set `data-theme`, nên nhánh `:not(...)` chỉ là lưới an toàn cho lần render đầu.

---

## 2. DANH SÁCH FILE CẦN SỬA / TẠO

| # | File | Việc |
|:--|:---|:---|
| 1 | `hub/src/index.css` | **Sửa** — thêm 3 khối: token mới cho palette Toolio, Chotto Dark, Chotto Light |
| 2 | `packages/core/src/theme/paletteManager.js` | **Tạo mới** — SOT cho palette, đối xứng với `themeManager.js` |
| 3 | `packages/core/src/theme/usePalette.js` | **Tạo mới** — hook, đối xứng với `useTheme.js` |
| 4 | `hub/src/components/PaletteToggle.jsx` | **Tạo mới** — control chọn palette |
| 5 | `hub/src/components/SettingsModal.jsx` | **Sửa** — thêm mục "Bảng màu" |
| 6 | `hub/src/App.jsx` | **Sửa** — gọi `usePalette()` cạnh `useTheme()` |
| 7 | `hub/index.html` | **Sửa** — script inline chống nháy màu (FOUC) |
| 8 | `hub/tailwind.config.js` | **Sửa** — khai báo `accent-violet` + `cat-*` |
| 9 | `packages/core/tests/paletteManager.test.js` | **Tạo mới** — unit test |
| 10 | `design.md` + `docs/DESIGN_SYSTEM_REFERENCE.md` | **Sửa** — ghi nhận trục palette mới |

---

## 3. `hub/src/index.css`

### 3.1 Bổ sung token mới vào khối Toolio Dark (`:root, [data-theme="dark"]`)

Chèn vào **cuối** khối RGB channels hiện có:

```css
  /* Accent phụ (mới) — Toolio dark */
  --accent-violet-rgb: 167 139 250;            /* #a78bfa violet-400 */
  --accent-violet-container-rgb: 124 58 237;   /* #7c3aed violet-600 */
  --on-accent-violet-container-rgb: 255 255 255;

  /* Màu danh mục (mới) — Toolio dark */
  --cat-life-rgb: 78 222 163;
  --cat-doc-rgb: 148 163 184;
  --cat-work-rgb: 255 184 110;
  --cat-health-rgb: 255 180 171;
  --cat-study-rgb: 167 139 250;
  --cat-tool-rgb: 137 206 255;
```

Và vào cuối khối "Direct CSS values":

```css
  --accent-violet: #a78bfa;
  --accent-violet-container: #7c3aed;
  --on-accent-violet-container: #ffffff;
  --cat-life: #4edea3;
  --cat-doc: #94a3b8;
  --cat-work: #ffb86e;
  --cat-health: #ffb4ab;
  --cat-study: #a78bfa;
  --cat-tool: #89ceff;
  --font-display: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
```

### 3.2 Bổ sung token mới vào khối `[data-theme="light"]`

```css
  --accent-violet-rgb: 109 40 217;             /* #6d28d9 violet-700, 6.8:1 trên trắng */
  --accent-violet-container-rgb: 139 92 246;
  --on-accent-violet-container-rgb: 255 255 255;
  --cat-life-rgb: 6 95 70;
  --cat-doc-rgb: 71 85 105;
  --cat-work-rgb: 146 64 14;
  --cat-health-rgb: 185 28 28;
  --cat-study-rgb: 109 40 217;
  --cat-tool-rgb: 3 105 161;

  --accent-violet: #6d28d9;
  --accent-violet-container: #8b5cf6;
  --on-accent-violet-container: #ffffff;
  --cat-life: #065f46;
  --cat-doc: #475569;
  --cat-work: #92400e;
  --cat-health: #b91c1c;
  --cat-study: #6d28d9;
  --cat-tool: #0369a1;
```

### 3.3 Khối CHOTTO DARK — dán ngay sau khối `[data-theme="light"]`

```css
/* ==========================================================================
   PALETTE: CHOTTO — Dark
   Nguồn: Sổ tay thương hiệu Chotto, trang 09–10
   ========================================================================== */
[data-palette="chotto"][data-theme="dark"],
[data-palette="chotto"]:not([data-theme="light"]) {
  /* RGB channels */
  --surface-canvas-rgb: 15 22 38;
  --surface-dim-rgb: 20 28 46;
  --surface-rgb: 24 33 52;
  --surface-bright-rgb: 44 58 88;
  --surface-subtle-rgb: 35 46 73;
  --surface-container-lowest-rgb: 11 18 32;
  --surface-container-low-rgb: 22 30 48;
  --surface-container-rgb: 30 42 68;           /* Mực #1E2A44 */
  --surface-container-high-rgb: 38 51 79;
  --surface-container-highest-rgb: 46 60 92;
  --surface-variant-rgb: 38 51 79;
  --border-subtle-rgb: 51 64 92;
  --border-card-rgb: 40 53 83;
  --outline-rgb: 138 150 172;
  --outline-variant-rgb: 62 74 102;
  --on-surface-rgb: 242 239 232;
  --on-surface-variant-rgb: 185 194 212;
  --inverse-surface-rgb: 242 239 232;
  --inverse-on-surface-rgb: 30 42 68;
  --primary-rgb: 92 220 230;                   /* Ngọc sáng */
  --on-primary-rgb: 5 50 58;
  --primary-container-rgb: 47 197 208;         /* Ngọc #2FC5D0 */
  --on-primary-container-rgb: 6 48 58;
  --brand-cyan-bright-rgb: 47 197 208;
  --secondary-rgb: 143 217 150;                /* Xanh Lá sáng */
  --on-secondary-rgb: 11 48 24;
  --secondary-container-rgb: 102 185 107;      /* Xanh Lá #66B96B */
  --on-secondary-container-rgb: 15 48 25;
  --brand-emerald-deep-rgb: 102 185 107;
  --tertiary-rgb: 255 201 122;                 /* Cam sáng */
  --on-tertiary-rgb: 63 34 0;
  --tertiary-container-rgb: 251 169 62;        /* Cam Nắng #FBA93E */
  --on-tertiary-container-rgb: 74 42 0;
  --error-rgb: 255 156 150;                    /* San Hô sáng */
  --on-error-rgb: 89 16 12;
  --error-container-rgb: 122 33 29;
  --on-error-container-rgb: 255 225 223;
  --accent-violet-rgb: 196 174 255;            /* Tím Lam sáng */
  --accent-violet-container-rgb: 171 141 245;  /* Tím Lam #AB8DF5 */
  --on-accent-violet-container-rgb: 36 17 80;
  --cat-life-rgb: 143 217 150;
  --cat-doc-rgb: 169 181 201;
  --cat-work-rgb: 255 201 122;
  --cat-health-rgb: 255 156 150;
  --cat-study-rgb: 196 174 255;
  --cat-tool-rgb: 92 220 230;

  /* Direct CSS values */
  --bg-primary: #0F1626;
  --surface-canvas: #0F1626;
  --surface-dim: #141C2E;
  --surface: #182134;
  --surface-bright: #2C3A58;
  --surface-subtle: #232E49;
  --surface-container-lowest: #0B1220;
  --surface-container-low: #161E30;
  --surface-container: #1E2A44;
  --surface-container-high: #26334F;
  --surface-container-highest: #2E3C5C;
  --surface-variant: #26334F;
  --border-subtle: #33405C;
  --border-card: #283553;
  --on-surface: #F2EFE8;
  --on-surface-variant: #B9C2D4;
  --outline: #8A96AC;
  --outline-variant: #3E4A66;
  --primary: #5CDCE6;
  --on-primary: #05323A;
  --primary-container: #2FC5D0;
  --on-primary-container: #06303A;
  --brand-cyan-bright: #2FC5D0;
  --secondary: #8FD996;
  --on-secondary: #0B3018;
  --secondary-container: #66B96B;
  --on-secondary-container: #0F3019;
  --brand-emerald-deep: #66B96B;
  --tertiary: #FFC97A;
  --on-tertiary: #3F2200;
  --tertiary-container: #FBA93E;
  --on-tertiary-container: #4A2A00;
  --error: #FF9C96;
  --on-error: #59100C;
  --error-container: #7A211D;
  --on-error-container: #FFE1DF;
  --accent-violet: #C4AEFF;
  --accent-violet-container: #AB8DF5;
  --on-accent-violet-container: #241150;
  --cat-life: #8FD996;
  --cat-doc: #A9B5C9;
  --cat-work: #FFC97A;
  --cat-health: #FF9C96;
  --cat-study: #C4AEFF;
  --cat-tool: #5CDCE6;

  /* Bán kính mềm hơn + phông thương hiệu (tuỳ chọn, xem §8) */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --font-display: 'Nunito', system-ui, sans-serif;
  --font-body: 'Be Vietnam Pro', system-ui, sans-serif;
}
```

### 3.4 Khối CHOTTO LIGHT

```css
/* ==========================================================================
   PALETTE: CHOTTO — Light
   ========================================================================== */
[data-palette="chotto"][data-theme="light"] {
  /* RGB channels */
  --surface-canvas-rgb: 251 249 245;           /* Giấy #FBF9F5 */
  --surface-dim-rgb: 244 241 234;
  --surface-rgb: 255 255 255;
  --surface-bright-rgb: 255 255 255;
  --surface-subtle-rgb: 244 241 234;
  --surface-container-lowest-rgb: 255 255 255;
  --surface-container-low-rgb: 251 249 245;
  --surface-container-rgb: 255 255 255;
  --surface-container-high-rgb: 239 235 226;
  --surface-container-highest-rgb: 230 226 217;
  --surface-variant-rgb: 244 241 234;
  --border-subtle-rgb: 230 226 217;            /* Đường kẻ #E6E2D9 */
  --border-card-rgb: 230 226 217;
  --outline-rgb: 102 109 122;                  /* 5.20:1 trên trắng */
  --outline-variant-rgb: 216 211 200;
  --on-surface-rgb: 30 42 68;                  /* Mực #1E2A44, 13.6:1 */
  --on-surface-variant-rgb: 58 67 84;          /* 9.5:1 */
  --inverse-surface-rgb: 30 42 68;
  --inverse-on-surface-rgb: 251 249 245;
  --primary-rgb: 10 110 120;                   /* Ngọc đậm, 5.97:1 */
  --on-primary-rgb: 255 255 255;
  --primary-container-rgb: 10 110 120;
  --on-primary-container-rgb: 255 255 255;
  --brand-cyan-bright-rgb: 10 110 120;
  --secondary-rgb: 47 122 67;                  /* Xanh Lá đậm, 5.27:1 */
  --on-secondary-rgb: 255 255 255;
  --secondary-container-rgb: 102 185 107;
  --on-secondary-container-rgb: 15 48 25;
  --brand-emerald-deep-rgb: 47 122 67;
  --tertiary-rgb: 143 83 16;                   /* Cam đậm, 6.15:1 */
  --on-tertiary-rgb: 255 255 255;
  --tertiary-container-rgb: 251 169 62;
  --on-tertiary-container-rgb: 74 42 0;
  --error-rgb: 179 43 38;                      /* San Hô đậm, 6.38:1 */
  --on-error-rgb: 255 255 255;
  --error-container-rgb: 253 231 228;
  --on-error-container-rgb: 142 33 29;
  --accent-violet-rgb: 103 65 196;             /* Tím Lam đậm, 6.71:1 */
  --accent-violet-container-rgb: 171 141 245;
  --on-accent-violet-container-rgb: 38 18 79;
  --cat-life-rgb: 47 122 67;
  --cat-doc-rgb: 30 42 68;
  --cat-work-rgb: 143 83 16;
  --cat-health-rgb: 179 43 38;
  --cat-study-rgb: 103 65 196;
  --cat-tool-rgb: 10 110 120;

  /* Direct CSS values */
  --bg-primary: #FBF9F5;
  --surface-canvas: #FBF9F5;
  --surface-dim: #F4F1EA;
  --surface: #FFFFFF;
  --surface-bright: #FFFFFF;
  --surface-subtle: #F4F1EA;
  --surface-container-lowest: #FFFFFF;
  --surface-container-low: #FBF9F5;
  --surface-container: #FFFFFF;
  --surface-container-high: #EFEBE2;
  --surface-container-highest: #E6E2D9;
  --surface-variant: #F4F1EA;
  --border-subtle: #E6E2D9;
  --border-card: #E6E2D9;
  --on-surface: #1E2A44;
  --on-surface-variant: #3A4354;
  --outline: #666D7A;
  --outline-variant: #D8D3C8;
  --primary: #0A6E78;
  --on-primary: #FFFFFF;
  --primary-container: #0A6E78;
  --on-primary-container: #FFFFFF;
  --brand-cyan-bright: #0A6E78;
  --secondary: #2F7A43;
  --on-secondary: #FFFFFF;
  --secondary-container: #66B96B;
  --on-secondary-container: #0F3019;
  --brand-emerald-deep: #2F7A43;
  --tertiary: #8F5310;
  --on-tertiary: #FFFFFF;
  --tertiary-container: #FBA93E;
  --on-tertiary-container: #4A2A00;
  --error: #B32B26;
  --on-error: #FFFFFF;
  --error-container: #FDE7E4;
  --on-error-container: #8E211D;
  --accent-violet: #6741C4;
  --accent-violet-container: #AB8DF5;
  --on-accent-violet-container: #26124F;
  --cat-life: #2F7A43;
  --cat-doc: #1E2A44;
  --cat-work: #8F5310;
  --cat-health: #B32B26;
  --cat-study: #6741C4;
  --cat-tool: #0A6E78;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --font-display: 'Nunito', system-ui, sans-serif;
  --font-body: 'Be Vietnam Pro', system-ui, sans-serif;
}
```

### 3.5 Bổ sung `@layer utilities`

Khối `@layer utilities` hiện tại khai báo tay một số class. Thêm:

```css
  .text-accent-violet { color: var(--accent-violet); }
  .bg-accent-violet-container { background-color: var(--accent-violet-container); }
  .text-on-accent-violet-container { color: var(--on-accent-violet-container); }
  .border-outline-variant { border-color: var(--outline-variant); }
```

### 3.6 Chuyển màu mượt

`body` đã có `transition: background-color .2s, color .2s`. Bổ sung để đổi palette không bị giật:

```css
* { transition: border-color .2s ease, background-color .2s ease, color .2s ease; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
```

> Nếu lo ảnh hưởng hiệu năng khi render bảng lớn, giới hạn selector: `body, header, footer, [class*="surface"], [class*="border"]`.

---

## 4. `packages/core/src/theme/paletteManager.js` (TẠO MỚI)

Viết đối xứng hoàn toàn với `themeManager.js` để giữ nhất quán kiến trúc.

```js
/**
 * Single Source of Truth (SOT) Palette Manager for AI-Tools Hub and Miniapps.
 * Trục palette độc lập với trục theme (light/dark/system).
 * Supports: 'toolio' | 'chotto'
 */

export const PALETTE_STORAGE_KEY = 'ai_tools_palette';

export const PALETTES = Object.freeze({
  TOOLIO: 'toolio',
  CHOTTO: 'chotto',
});

export const DEFAULT_PALETTE = PALETTES.TOOLIO;

const VALID_PALETTES = [PALETTES.TOOLIO, PALETTES.CHOTTO];

/** @returns {'toolio' | 'chotto'} */
export function getStoredPalette(storage) {
  try {
    const s = storage || (typeof window !== 'undefined' ? window.localStorage : null);
    if (!s) return DEFAULT_PALETTE;
    const value = s.getItem(PALETTE_STORAGE_KEY);
    return VALID_PALETTES.includes(value) ? value : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
}

export function setStoredPalette(palette, storage) {
  try {
    const s = storage || (typeof window !== 'undefined' ? window.localStorage : null);
    if (!s) return;
    s.setItem(PALETTE_STORAGE_KEY, VALID_PALETTES.includes(palette) ? palette : DEFAULT_PALETTE);
  } catch {
    // Gracefully handle storage errors (e.g., privacy mode quota)
  }
}

export function applyPaletteToDom(palette, doc) {
  const d = doc || (typeof document !== 'undefined' ? document : null);
  if (!d || !d.documentElement) return;
  const value = VALID_PALETTES.includes(palette) ? palette : DEFAULT_PALETTE;
  d.documentElement.setAttribute('data-palette', value);
}

/** @returns {{ palette: string }} */
export function applyPalette(palette, options = {}) {
  const value = VALID_PALETTES.includes(palette) ? palette : DEFAULT_PALETTE;
  setStoredPalette(value, options.storage);
  applyPaletteToDom(value, options.doc);
  return { palette: value };
}

export function initPalette(options = {}) {
  const palette = getStoredPalette(options.storage);
  applyPaletteToDom(palette, options.doc);
  return { palette };
}

/** Đồng bộ giữa các tab. @returns {() => void} unsubscribe */
export function subscribePalette(callback, options = {}) {
  const w = options.win || (typeof window !== 'undefined' ? window : null);
  if (!w) return () => {};
  const handleStorageChange = (e) => {
    if (e.key === PALETTE_STORAGE_KEY) {
      const palette = getStoredPalette(options.storage);
      applyPaletteToDom(palette, options.doc);
      callback({ palette });
    }
  };
  w.addEventListener('storage', handleStorageChange);
  return () => w.removeEventListener('storage', handleStorageChange);
}
```

---

## 5. `packages/core/src/theme/usePalette.js` (TẠO MỚI)

Bám sát chữ ký của `useTheme.js` hiện có (`{ themePreference, resolvedTheme, setTheme }`).

```js
import { useState, useEffect, useCallback } from 'react';
import {
  getStoredPalette,
  applyPalette,
  applyPaletteToDom,
  subscribePalette,
  DEFAULT_PALETTE,
} from './paletteManager.js';

/**
 * @returns {{ palette: 'toolio'|'chotto', setPalette: (p: string) => void, togglePalette: () => void }}
 */
export function usePalette() {
  const [palette, setPaletteState] = useState(DEFAULT_PALETTE);

  useEffect(() => {
    const stored = getStoredPalette();
    applyPaletteToDom(stored);
    setPaletteState(stored);
    return subscribePalette(({ palette: next }) => setPaletteState(next));
  }, []);

  const setPalette = useCallback((next) => {
    const { palette: applied } = applyPalette(next);
    setPaletteState(applied);
  }, []);

  const togglePalette = useCallback(() => {
    setPalette(getStoredPalette() === 'chotto' ? 'toolio' : 'chotto');
  }, [setPalette]);

  return { palette, setPalette, togglePalette };
}
```

---

## 6. `hub/src/components/PaletteToggle.jsx` (TẠO MỚI)

2 lựa chọn ngắn → dùng segmented control, không dùng dropdown. Chỉ dùng token màu; chiều cao ≥ 40px trên mobile.

```jsx
import React from 'react';
import { Palette } from 'lucide-react';
import { usePalette } from '@ai-tools/core/theme/usePalette.js';

const LABELS = {
  vi: { title: 'Bảng màu', toolio: 'Toolio', chotto: 'Chotto' },
  en: { title: 'Color palette', toolio: 'Toolio', chotto: 'Chotto' },
  ja: { title: 'カラーパレット', toolio: 'Toolio', chotto: 'Chotto' },
};

export default function PaletteToggle({ displayLang = 'vi', className = '' }) {
  const { palette, setPalette } = usePalette();
  const t = LABELS[displayLang] || LABELS.vi;

  const item = (id, label, dot) => {
    const active = palette === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => setPalette(id)}
        aria-pressed={active}
        className={`h-10 sm:h-9 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
          active
            ? 'bg-surface-container-high text-on-surface shadow-sm'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className={`flex items-center gap-1 ${className}`} role="group" aria-label={t.title}>
      <Palette size={14} className="text-outline shrink-0 mr-1" aria-hidden="true" />
      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-subtle border border-border-subtle">
        {item('toolio', t.toolio, 'bg-primary-container')}
        {item('chotto', t.chotto, 'bg-cat-tool')}
      </div>
    </div>
  );
}
```

> **Vị trí đặt:** trong `SettingsModal.jsx` (ưu tiên — tránh làm navbar 64px chật thêm). Nếu muốn ra navbar, đặt **bên trái** `ThemeToggle` trong cụm phải và ẩn ở mobile (`hidden md:flex`), theo đúng đặc tả `DESIGN_SYSTEM_REFERENCE.md` §1.4.

---

## 7. Đấu nối

### 7.1 `hub/src/App.jsx`

```js
import { useTheme } from '@ai-tools/core/theme/useTheme.js';
import { usePalette } from '@ai-tools/core/theme/usePalette.js';
// ...
useTheme();
usePalette();   // <-- thêm dòng này ngay cạnh
```

### 7.2 `hub/src/components/SettingsModal.jsx`

Thêm một section ngay dưới mục chọn Theme, cùng kiểu trình bày:

```jsx
import PaletteToggle from './PaletteToggle';
// ...
<div className="border-t border-border-subtle/50 pt-4">
  <div className="text-xs font-semibold text-on-surface mb-1">
    {displayLang === 'vi' ? 'Bảng màu' : displayLang === 'en' ? 'Color palette' : 'カラーパレット'}
  </div>
  <p className="text-xs text-on-surface-variant mb-3">
    {displayLang === 'vi'
      ? 'Toolio: điềm tĩnh, kỹ thuật. Chotto: ấm và trẻ trung hơn. Cả hai đều có chế độ sáng và tối.'
      : displayLang === 'en'
      ? 'Toolio: calm and technical. Chotto: warmer and friendlier. Both support light and dark.'
      : 'Toolio: 落ち着いた技術系。Chotto: 温かく親しみやすい。両方ライト・ダーク対応。'}
  </p>
  <PaletteToggle displayLang={displayLang} />
</div>
```

### 7.3 `hub/index.html` — chống nháy màu (FOUC)

Thêm vào `<head>`, **trước** mọi `<link rel="stylesheet">`. Phải chạy đồng bộ cùng script khởi tạo theme đang có:

```html
<script>
  (function () {
    try {
      var p = localStorage.getItem('ai_tools_palette');
      document.documentElement.setAttribute(
        'data-palette',
        (p === 'chotto' || p === 'toolio') ? p : 'toolio'
      );
    } catch (e) {
      document.documentElement.setAttribute('data-palette', 'toolio');
    }
  })();
</script>
```

### 7.4 `hub/tailwind.config.js`

Thêm vào `theme.extend.colors`:

```js
'accent-violet': 'rgb(var(--accent-violet-rgb) / <alpha-value>)',
'accent-violet-container': 'rgb(var(--accent-violet-container-rgb) / <alpha-value>)',
'on-accent-violet-container': 'rgb(var(--on-accent-violet-container-rgb) / <alpha-value>)',
'cat-life': 'rgb(var(--cat-life-rgb) / <alpha-value>)',
'cat-doc': 'rgb(var(--cat-doc-rgb) / <alpha-value>)',
'cat-work': 'rgb(var(--cat-work-rgb) / <alpha-value>)',
'cat-health': 'rgb(var(--cat-health-rgb) / <alpha-value>)',
'cat-study': 'rgb(var(--cat-study-rgb) / <alpha-value>)',
'cat-tool': 'rgb(var(--cat-tool-rgb) / <alpha-value>)',
```

Vì `cat-*` được sinh động (không có trong markup tĩnh), khai báo safelist để Tailwind không tree-shake:

```js
safelist: [
  { pattern: /^(bg|text|border)-cat-(life|doc|work|health|study|tool)$/ },
  { pattern: /^(bg|text|border)-accent-violet(-container)?$/ },
],
```

---

## 8. Tuỳ chọn: bán kính & phông (KHÔNG bật mặc định)

Palette Chotto khai báo `--radius-*` mềm hơn và `--font-display` / `--font-body` theo thương hiệu. **Chúng chỉ có tác dụng nếu component đọc biến** — hiện các component dùng `rounded-xl` của Tailwind nên chưa ảnh hưởng gì. Bật theo hai bước, chỉ khi được chấp thuận:

1. `tailwind.config.js` → `theme.extend.borderRadius`:
   ```js
   borderRadius: {
     sm: 'var(--radius-sm)',
     md: 'var(--radius-md)',
     lg: 'var(--radius-lg)',
     xl: 'var(--radius-xl)',
   },
   ```
2. `fontFamily.sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif']` và thêm `display: ['var(--font-display)', 'Nunito', 'sans-serif']`.
   Nạp phông Nunito + Be Vietnam Pro **có điều kiện** (chỉ khi `data-palette="chotto"`) để không tăng payload cho người dùng Toolio.

`font-mono` (JetBrains Mono) **giữ nguyên** cho cả hai palette.

---

## 9. KIỂM ĐỊNH BẮT BUỘC TRƯỚC KHI MERGE

### 9.1 Unit test — `packages/core/tests/paletteManager.test.js`

Tối thiểu 6 case (viết theo mẫu test `themeManager` đã có):

1. `getStoredPalette()` trả `'toolio'` khi localStorage rỗng.
2. `getStoredPalette()` trả `'toolio'` khi giá trị lưu là rác (`'neon'`).
3. `getStoredPalette()` không throw khi `localStorage` ném lỗi (chế độ riêng tư).
4. `applyPalette('chotto')` set `data-palette="chotto"` lên `documentElement` **và** ghi localStorage.
5. `applyPalette('chotto')` **không** chạm tới `data-theme` (hai trục độc lập).
6. `subscribePalette` gọi callback khi có `StorageEvent` với đúng key, và unsubscribe gỡ listener.

### 9.2 Kiểm định tương phản — `axe-core`

Chạy `scripts/verify-miniapp-browser.mjs` (hoặc `audit-miniapp.mjs`) cho **cả 4 tổ hợp**, yêu cầu **0 vi phạm `color-contrast`**:

| palette | theme |
|:---|:---|
| toolio | dark |
| toolio | light |
| chotto | dark |
| chotto | light |

Tỷ lệ đã đo sẵn của palette Chotto (thuật toán W3C Relative Luminance):

| Màu chữ | Trên nền | Tỷ lệ | Kết luận |
|:---|:---|---:|:---:|
| `#1E2A44` on-surface | `#FBF9F5` Giấy | 13.6:1 | PASS |
| `#3A4354` on-surface-variant | `#FBF9F5` Giấy | 9.5:1 | PASS |
| `#0A6E78` primary | `#FFFFFF` trắng | 5.97:1 | PASS |
| `#FFFFFF` on-primary | `#0A6E78` nút | 5.97:1 | PASS |
| `#2F7A43` secondary | `#FFFFFF` trắng | 5.27:1 | PASS |
| `#8F5310` tertiary | `#FFFFFF` trắng | 6.15:1 | PASS |
| `#B32B26` error | `#FFFFFF` trắng | 6.38:1 | PASS |
| `#6741C4` accent-violet | `#FFFFFF` trắng | 6.71:1 | PASS |
| `#666D7A` outline | `#FFFFFF` trắng | 5.20:1 | PASS |
| `#F2EFE8` on-surface | `#0F1626` navy | 15.8:1 | PASS |
| `#B9C2D4` on-surface-variant | `#1E2A44` Mực | 7.98:1 | PASS |
| `#8A96AC` outline | `#1E2A44` Mực | 4.79:1 | PASS |
| `#5CDCE6` primary | `#1E2A44` Mực | 8.73:1 | PASS |
| `#FF9C96` error | `#1E2A44` Mực | 7.11:1 | PASS |
| `#06303A` on-primary-container | `#2FC5D0` nút Ngọc | 6.72:1 | PASS |

### 9.3 Checklist thủ công

- [ ] Chuyển palette → **không** reload trang, **không** nháy trắng.
- [ ] Reload sau khi chuyển → giữ đúng lựa chọn (no FOUC).
- [ ] Mở 2 tab, đổi palette ở tab A → tab B tự đồng bộ.
- [ ] Chuyển palette **trong khi** một miniapp đang xử lý tệp → tiến trình không bị reset.
- [ ] Duyệt cả 12 miniapp ở `chotto/light` và `chotto/dark`: không sót `bg-white`, `border-slate-200`, `text-slate-900`, `bg-blue-50` (grep toàn repo).
- [ ] Modal, dropzone, step wizard, bảng kết quả, băng lỗi — đúng token ở cả 4 tổ hợp.
- [ ] `@media print` vẫn ra nền trắng chữ đen ở cả 4 tổ hợp.
- [ ] 375px / 768px / 1024px / 1440px: không lệch lề, không tràn ngang.
- [ ] `npm run lint` → 0 lỗi; toàn bộ test cũ vẫn pass.

---

## 10. CẤM (sẽ bị revert)

1. **Hardcode hex Chotto trong component.** `className="bg-[#2FC5D0]"` → dùng `bg-primary-container`.
2. **Đổi tên token hoặc bỏ token cũ.** Sẽ phá 12 miniapp.
3. **Khai báo token mới chỉ ở palette Chotto.** Phải có ở cả `toolio` (§3.1–3.2).
4. **Dùng mã thương hiệu gốc làm màu chữ trên nền sáng.** `#66B96B` chỉ đạt 2.3:1 — dùng `#2F7A43`.
5. **Chữ trắng trên Cam Nắng `#FBA93E` hoặc Xanh Lá `#66B96B`.** Dùng chữ Mực (`--on-tertiary-container`, `--on-secondary-container`).
6. **Cho miniapp tự chọn palette.** Vi phạm `design.md` Rule 5 (No Isolated Tool Themes).
7. **Dùng bộ chọn `[data-palette="chotto"]` trần cho khối dark.** Specificity sai → hỏng chế độ sáng (§1).
8. **Dùng quá 2 màu nhấn trên một màn hình.** Ngoại lệ duy nhất: logo và dãy màu danh mục ở trang Hub.

---

## 11. TÓM TẮT THỨ TỰ THỰC HIỆN

1. `index.css`: bổ sung token mới cho Toolio (§3.1–3.2) → chạy app, xác nhận **không đổi gì** về mặt hình ảnh.
2. `index.css`: thêm 2 khối Chotto (§3.3–3.4) → test tay bằng cách set `data-palette="chotto"` trong DevTools.
3. `paletteManager.js` + test (§4, §9.1).
4. `usePalette.js` + `App.jsx` (§5, §7.1).
5. `index.html` FOUC script (§7.3).
6. `PaletteToggle.jsx` + `SettingsModal.jsx` (§6, §7.2).
7. `tailwind.config.js` + safelist (§7.4).
8. Chạy axe-core 4 tổ hợp (§9.2) + checklist (§9.3).
9. Cập nhật `design.md` và `docs/DESIGN_SYSTEM_REFERENCE.md`: ghi nhận trục `data-palette` và bảng token Chotto.
