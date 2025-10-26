# Ride App - Branding Guide

## App Identity

**Name:** Ride App  
**Tagline:** Order a Ride

## Color Palette

### Primary Colors

- **Yellow (Primary):** `#fdb927`
  - Used for: Main accent, car icons, highlights, pricing
  - HSL: `45 93% 58%`
  - Usage: Primary branding element, represents energy and movement

- **Green (Secondary):** `#10b981`
  - Used for: Call-to-action buttons, active states, pickup locations
  - HSL: `160 84% 39%`
  - Usage: "Order a Ride" button, success states, positive actions

### Background Colors

- **Dark Background:** `#1a1d1f`
  - Used for: Main app background
  - HSL: `160 10% 10%`
  - Creates high contrast with bright accent colors

- **Dark Card:** `#252a2e`
  - Used for: Cards, panels, elevated surfaces
  - HSL: `160 10% 12%`
  - Slightly lighter than background for depth

### Supporting Colors

- **White Text:** `#ffffff` / `rgb(255, 255, 255)`
  - Used for: Primary text content, headings

- **Gray 300:** `#d1d5db`
  - Used for: Secondary text, labels

- **Gray 400:** `#9ca3af`
  - Used for: Muted text, descriptions

- **Gray 700:** `#374151`
  - Used for: Borders on dark backgrounds

- **Gray 800:** `#1f2937`
  - Used for: Card borders, dividers

## Typography

- **Font Family:** Inter (Google Fonts)
- **Font Weights:**
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700

## Component Styling

### Buttons

#### Primary Action Button (Order a Ride)
```css
background-color: #10b981 (green)
hover: #059669 (darker green)
text: white
font-weight: semibold
padding: 0.75rem 1.5rem
border-radius: 0.75rem
```

#### Secondary Button
```css
background-color: #fdb927 (yellow)
hover: #e5a71f
text: black
font-weight: semibold
```

#### Outline Button
```css
border: 1px solid #374151
text: #d1d5db
background: transparent
hover background: #1f2937
```

### Cards

```css
background: #252a2e
border: 1px solid #1f2937
border-radius: 0.75rem
padding: 1rem
```

### Status Badges

- **Requested/Finding Driver:** Yellow (`#fdb927`)
- **Accepted/En Route:** Blue (`#3b82f6`)
- **In Progress:** Green (`#10b981`)
- **Completed:** Green (`#10b981`)
- **Cancelled:** Gray

### Icons

- **Car Icon:** Yellow (`#fdb927`)
- **Pickup Location:** Green (`#10b981`)
- **Destination:** Yellow (`#fdb927`)
- **Price/Dollar:** Yellow (`#fdb927`)

## Usage Guidelines

### Dark Mode First
The app is designed with a dark-first approach. The dark background creates a modern, premium feel while reducing eye strain.

### High Contrast
Always ensure sufficient contrast between text and backgrounds:
- White text (#ffffff) on dark backgrounds
- Yellow/Green only on dark backgrounds
- Never use yellow or green text on light backgrounds

### Consistency
- Use green exclusively for primary actions ("Order a Ride")
- Use yellow for branding elements, pricing, and highlights
- Keep card backgrounds consistent at `#252a2e`
- Use borders sparingly at `#1f2937` or `#374151`

### Accessibility
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text
- All interactive elements should have visible focus states

## Logo & Branding Elements

### Car Icon
- The friendly yellow car represents approachability and reliability
- Always maintain aspect ratio
- Minimum size: 48x48px
- Recommended: Display on dark backgrounds for maximum impact

### App Name Display
```
Ride App
```
- Font: Inter Bold
- Color: White on dark, or Yellow for emphasis
- Never abbreviate in main UI

## Theme Variables

### CSS Custom Properties
```css
--brand-yellow: #fdb927;
--brand-green: #10b981;
--brand-dark: #1a1d1f;
--brand-dark-card: #252a2e;
--brand-border: #1f2937;
--brand-gray-300: #d1d5db;
--brand-gray-400: #9ca3af;
--brand-gray-700: #374151;
--brand-gray-800: #1f2937;
```

### Tailwind Classes
```
bg-brand-yellow
bg-brand-green
bg-brand-dark
bg-brand-dark-card
text-brand-yellow
text-brand-green
border-gray-800
text-gray-300
text-gray-400
```

## Implementation Notes

- Dark theme is enforced by default
- All components use consistent spacing (Tailwind scale)
- Border radius: 0.75rem (12px) for cards and buttons
- Transitions: 300ms ease for hover states
- Shadow: Minimal use, only for elevated elements

## Files Updated

- `app/globals.css` - Theme colors and utilities
- `app/layout.tsx` - App name and meta tags
- `tailwind.config.ts` - Brand color definitions
- `public/manifest.json` - PWA branding
- All component files - Dark theme implementation

---

**Version:** 1.0  
**Last Updated:** 2024