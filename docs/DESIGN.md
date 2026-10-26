# Design System — Portfolio v2

Source of truth: daisyUI theme `portfolio` (`@plugin "daisyui/theme"`), Tailwind CSS v4.
Fonts: Geist Sans (`--font-sans`) and Geist Mono (`--font-mono`).

## 1. Visual Theme & Atmosphere

Sharp, raw, editorial. A near-white canvas with a single loud signal color (red) and a cool indigo counterpoint.
Zero rounded corners, hairline borders, and a subtle noise/depth texture give it a printed, brutalist-lite feel.
Rules of thumb:

- Red is the only attention color. Use it for CTAs, links and emphasis, never as a large background wash.
- Hierarchy comes from type scale and whitespace, not from shadows or rounding.
- Everything is square. No pill buttons, no rounded cards, no rounded avatars.

## 2. Color Palette & Roles

All values are OKLCH, taken directly from the theme.

### Surfaces (cool gray, hue ~250-265)

| Role | Token | Value |
|---|---|---|
| Page background | `base-100` | `oklch(98% 0.002 247.839)` |
| Section / card background | `base-200` | `oklch(96% 0.003 264.542)` |
| Borders, dividers, inset | `base-300` | `oklch(92% 0.006 264.531)` |
| Default text | `base-content` | `oklch(21% 0.034 264.665)` |

### Brand

| Role | Token | Value | On-color text |
|---|---|---|---|
| Primary: CTA, links, key emphasis (signal red) | `primary` | `oklch(63% 0.237 25.331)` | `oklch(98% 0 0)` |
| Secondary: supporting highlights, tags (soft indigo) | `secondary` | `oklch(67% 0.182 276.935)` | `oklch(25% 0.09 281.288)` |
| Accent: hover/pressed, deep emphasis (dark red) | `accent` | `oklch(44% 0.177 26.899)` | `oklch(98% 0.001 106.423)` |
| Neutral: same red as primary | `neutral` | `oklch(63% 0.237 25.331)` | `oklch(98% 0.002 247.839)` |

### Status

| Role | Token | Value | On-color text |
|---|---|---|---|
| Info (deep red) | `info` | `oklch(50% 0.213 27.518)` | `oklch(98% 0.016 73.684)` |
| Success (green) | `success` | `oklch(79% 0.209 151.711)` | `oklch(26% 0.065 152.934)` |
| Warning (orange) | `warning` | `oklch(75% 0.183 55.934)` | `oklch(26% 0.079 36.259)` |
| Error (red, = primary) | `error` | `oklch(63% 0.237 25.331)` | `oklch(97% 0.013 17.38)` |

Usage notes:

- Always pair a color with its `-content` token for text on top of it.
- `neutral`, `primary` and `error` share one value. Do not rely on color alone to tell an error from a CTA; add an icon or label.
- `info` is red-family, not blue. Differentiate it with iconography.

## 3. Typography

- Sans: Geist Sans for everything. Mono: Geist Mono for code, labels, metadata, numbers.
- Display/headings: tight tracking (`-0.02em` to `-0.04em`), weight 600-700, large scale contrast against body.
- Body: 16px / 1.6, weight 400, `base-content`.
- Eyebrows and meta: Geist Mono, uppercase, 11-12px, `+0.08em` tracking.
- Note: `globals.css` still sets `body { font-family: Arial, Helvetica, sans-serif; }`. That overrides Geist and should be removed so the theme font takes effect.

## 4. Component Stylings

Geometry tokens:

| Token | Value | Effect |
|---|---|---|
| `--radius-selector` | `0rem` | Checkbox, toggle, badge: square |
| `--radius-field` | `0rem` | Input, select, button: square |
| `--radius-box` | `0rem` | Card, modal, alert: square |
| `--size-selector` | `0.1875rem` | Compact selector sizing |
| `--size-field` | `0.21875rem` | Compact field sizing |
| `--border` | `0.5px` | Hairline borders on all components |
| `--depth` | `1` | Subtle depth effect enabled |
| `--noise` | `1` | Grain texture enabled |

- **Buttons:** square, hairline border. Primary = solid red with `primary-content` text; hover shifts to `accent`. Secondary/ghost = transparent with `base-300` border, `base-content` text.
- **Cards:** `base-200` fill, `0.5px base-300` border, no radius, no heavy shadow.
- **Inputs:** `base-100` fill, `0.5px` border in `base-300`; focus ring/border in `primary`.
- **Links:** `primary`, underline on hover.
- **Badges/tags:** square; `secondary` fill for neutral tags, status colors for state.

## 5. Layout Principles

- Spacing on a 4px base; generous section spacing (96-160px vertical on desktop).
- Max content width ~1200px, centered; asymmetric grids preferred over uniform 3-column card rows.
- Separate sections with `base-300` hairlines or a `base-100` / `base-200` background alternation, not boxes inside boxes.
- Mobile-first: single column under 768px, same hairline-and-whitespace language.

## 6. Depth & Elevation

- Flat by default. Depth comes from `--depth: 1` and `--noise: 1` in the theme, plus the `base-100` to `base-200` to `base-300` surface ladder.
- Avoid large blurred shadows. If a floating layer is needed (modal, dropdown), use a 0.5px `base-300` border and a faint, tight shadow only.

## 7. Motion

- Short and precise: 150-250ms, ease-out. Opacity/translate only (no layout-shifting animation).
- Hover on interactive elements: color step (`primary` to `accent`) or a 1px translate. No bouncy springs.
- Respect `prefers-reduced-motion`.

## 8. Do / Don't

**Do**
- Keep corners at 0 and borders at 0.5px.
- Use red sparingly so it stays a signal.
- Use Geist Mono for small meta text.

**Don't**
- No rounded buttons, cards, or avatars.
- No purple/blue gradients, no glow, no heavy drop shadows.
- Don't use `info` as a "blue" informational color; it is red.

## 9. Themes

- Theme name: `portfolio`, `color-scheme: light`, `default: false`, `prefersdark: false`.
- A dark block was provided, but its values are identical to the light theme (base-100 is still `98%` lightness) and it reuses the same name `portfolio`. Until it gets its own name and dark surface values, treat this system as **light only**.
  - Suggested dark base values: `base-100 oklch(16% 0.02 264)`, `base-200 oklch(20% 0.025 264)`, `base-300 oklch(26% 0.03 264)`, `base-content oklch(96% 0.003 264)`. Keep the brand and status colors.

## 10. Source CSS (as provided)

### Light

```css
@plugin "daisyui/theme" {
  name: "portfolio";
  default: false;
  prefersdark: false;
  color-scheme: "light";
  --color-base-100: oklch(98% 0.002 247.839);
  --color-base-200: oklch(96% 0.003 264.542);
  --color-base-300: oklch(92% 0.006 264.531);
  --color-base-content: oklch(21% 0.034 264.665);
  --color-primary: oklch(63% 0.237 25.331);
  --color-primary-content: oklch(98% 0 0);
  --color-secondary: oklch(67% 0.182 276.935);
  --color-secondary-content: oklch(25% 0.09 281.288);
  --color-accent: oklch(44% 0.177 26.899);
  --color-accent-content: oklch(98% 0.001 106.423);
  --color-neutral: oklch(63% 0.237 25.331);
  --color-neutral-content: oklch(98% 0.002 247.839);
  --color-info: oklch(50% 0.213 27.518);
  --color-info-content: oklch(98% 0.016 73.684);
  --color-success: oklch(79% 0.209 151.711);
  --color-success-content: oklch(26% 0.065 152.934);
  --color-warning: oklch(75% 0.183 55.934);
  --color-warning-content: oklch(26% 0.079 36.259);
  --color-error: oklch(63% 0.237 25.331);
  --color-error-content: oklch(97% 0.013 17.38);
  --radius-selector: 0rem;
  --radius-field: 0rem;
  --radius-box: 0rem;
  --size-selector: 0.1875rem;
  --size-field: 0.21875rem;
  --border: 0.5px;
  --depth: 1;
  --noise: 1;
}
```

### Dark (as provided, values identical to light)

```css
@plugin "daisyui/theme" {
  name: "portfolio";
  default: false;
  prefersdark: false;
  color-scheme: "dark";
  --color-base-100: oklch(98% 0.002 247.839);
  --color-base-200: oklch(96% 0.003 264.542);
  --color-base-300: oklch(92% 0.006 264.531);
  --color-base-content: oklch(21% 0.034 264.665);
  --color-primary: oklch(63% 0.237 25.331);
  --color-primary-content: oklch(98% 0 0);
  --color-secondary: oklch(67% 0.182 276.935);
  --color-secondary-content: oklch(25% 0.09 281.288);
  --color-accent: oklch(44% 0.177 26.899);
  --color-accent-content: oklch(98% 0.001 106.423);
  --color-neutral: oklch(63% 0.237 25.331);
  --color-neutral-content: oklch(98% 0.002 247.839);
  --color-info: oklch(50% 0.213 27.518);
  --color-info-content: oklch(98% 0.016 73.684);
  --color-success: oklch(79% 0.209 151.711);
  --color-success-content: oklch(26% 0.065 152.934);
  --color-warning: oklch(75% 0.183 55.934);
  --color-warning-content: oklch(26% 0.079 36.259);
  --color-error: oklch(63% 0.237 25.331);
  --color-error-content: oklch(97% 0.013 17.38);
  --radius-selector: 0rem;
  --radius-field: 0rem;
  --radius-box: 0rem;
  --size-selector: 0.1875rem;
  --size-field: 0.21875rem;
  --border: 0.5px;
  --depth: 1;
  --noise: 1;
}
```
