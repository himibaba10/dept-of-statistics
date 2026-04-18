# Design System — Dept. of Statistics, University of Chittagong

## Identity

Academic & trustworthy. Navy authority, crisp white space, serif headings that command respect.
NOT corporate software. NOT a Bootstrap template. A distinguished institution.

## Colors

- **Primary navy:** `#0F2A6B` (deeper, more authoritative than before)
- **Accent gold:** `#C9972B` (academic excellence, warmth, distinction)
- **Surface:** `#F7F9FC` (off-white, not blinding)
- **Card bg:** `#FFFFFF`
- **Text primary:** `#0A1628`
- **Text secondary:** `#4A5568`
- **Border subtle:** `#E2E8F0`
- **Navy light tint:** `#EEF2FF`

## Typography

- **Headings:** `Playfair Display` — serif, authoritative, academic
- **Body:** `Nunito Sans` (already in project) — clean, readable
- **Section labels:** uppercase tracking-widest, small, gold accent

## Layout Principles

- Full-bleed hero with gradient overlay + text, no carousel padding artifacts
- Stats: horizontal strip with subtle separator lines, not cards
- Sections: consistent left-aligned section headers with gold underline accent
- Generous whitespace: `py-16` to `py-24` between sections
- Max width `1280px`, centered

## Hero

- Full-width, full-bleed (no rounded corners, no padding)
- Dark navy gradient overlay (left side) + image (right)
- Big serif headline, gold accent line underneath
- Subtle background pattern (diagonal lines or dots)
- Auto-play carousel with dot indicators (not arrow buttons)

## StatsGrid

- Horizontal strip with navy background
- 4 stats in a row, separated by vertical lines
- Numbers in large serif font, gold color
- No individual cards — unified strip

## ChairmanMessage

- Clean 2-col layout: serif quote large on left, photo on right
- Elegant blockquote style with gold left border
- Photo in subtle border frame

## NoticeBoardPreview

- Clean list, each item with a gold left-accent on hover
- Date in small caps gold, title in dark navy
- "View All" as a subtle text link

## CampusGallery

- Masonry/rows grid with hover zoom
- Section title with gold underline

## Navbar

- White bg, border-bottom
- Logo: serif "Statistics" in navy
- Nav links: clean, no underlines
- Sticky, subtle shadow on scroll

## Footer

- Navy background, white text
- Multi-column: About, Links, Contact
- Gold accent on hover

## Animations

- CSS `@keyframes` fade-in-up on scroll (use Intersection Observer)
- Smooth hover transitions: 200ms ease
- No jarring jumps
