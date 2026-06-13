# 🎨 Design Tokens & Color Palette Reference

## Color Palette System

### Primary Colors (Brand Blues)
```
Primary Dark:    #1e40af (Navy Blue) - Main brand color
Primary:         #3b82f6 (Bright Blue) - Primary interactive elements
Primary Light:   #60a5fa (Light Blue) - Hover/secondary states
Secondary:       #0ea5e9 (Cyan) - Accent color for highlights
```

### Accent Colors (Premium Gold)
```
Gold:            #d4af37 (Premium Gold) - Luxury/premium indicator
Gold Warm:       #f59e0b (Amber) - Warm accent
Gold Light:      #fcd34d (Light Amber) - Backgrounds
```

### Semantic Colors
```
Success:         #10b981 (Emerald Green) - Positive actions
Success Light:   #6ee7b7 (Light Mint)
Warning:         #f59e0b (Amber) - Caution/pending
Warning Light:   #fcd34d (Light Amber)
Danger/Error:    #ef4444 (Red) - Errors/rejections
Danger Light:    #fca5a5 (Light Red)
Info:            #0ea5e9 (Cyan) - Information
Info Light:      #7dd3fc (Light Cyan)
```

### Neutral Colors (Grayscale)
```
Slate 50:        #f8fafc (Almost white)
Slate 100:       #f1f5f9 (Very light)
Slate 200:       #e2e8f0 (Light backgrounds)
Slate 300:       #cbd5e1 (Borders)
Slate 400:       #94a3b8 (Placeholder text)
Slate 500:       #64748b (Disabled text)
Slate 600:       #475569 (Body text)
Slate 700:       #334155 (Dark text)
Slate 800:       #1e293b (Dark gray)
Slate 900:       #0f172a (Almost black)
```

### Gradient Combinations
```
Primary Gradient:    #1e40af → #3b82f6 → #0ea5e9
Accent Gradient:     #d4af37 → #fbbf24 → #f59e0b
Success Gradient:    #10b981 → #34d399 → #6ee7b7
Danger Gradient:     #ef4444 → #f87171 → #fca5a5
Warning Gradient:    #f59e0b → #fbbf24 → #fcd34d
```

---

## Typography System

### Font Stack
```
Display/Headings:    Outfit (Geometric sans-serif for modern feel)
Body/Content:        Inter (Highly readable, clean)
Code/Technical:      IBM Plex Mono (Professional monospace)
Luxury/Hero:         Playfair Display (Serif for premium sections)
```

### Font Sizes (Modular Scale 1.25)
```
Display XL:          48px / 3rem    (2.5rem) - font-weight: 700
Display LG:          42px / 2rem    - font-weight: 700
Heading 1:           32px / 1.875rem - font-weight: 600
Heading 2:           24px / 1.5rem  - font-weight: 600
Heading 3:           20px / 1.25rem - font-weight: 500
Heading 4:           18px / 1.125rem - font-weight: 500
Body Large:          16px / 1rem    - font-weight: 400
Body:                14px / 0.875rem - font-weight: 400
Body Small:          12px / 0.75rem - font-weight: 400
Caption:             11px / 0.688rem - font-weight: 500
```

### Font Weights
```
Light:               300
Regular:             400
Medium:              500
Semibold:            600
Bold:                700
Extra Bold:          800
```

### Line Heights
```
Tight:               1.1
Snug:                1.2
Normal:              1.5
Relaxed:             1.6
Loose:               1.8
```

---

## Spacing Scale (4px base)

```
0:      0px
0.5:    2px
1:      4px      (1 unit)
1.5:    6px
2:      8px      (2 units)
3:      12px     (3 units)
4:      16px     (4 units) ← Most common
5:      20px
6:      24px     (6 units)
8:      32px     (8 units)
12:     48px
16:     64px
```

### Common Spacing Pairs
```
Compact:     gap-2 (8px)
Normal:      gap-4 (16px)
Relaxed:     gap-6 (24px)
Generous:    gap-8 (32px)
```

---

## Border Radius Scale

```
Small:       4px   - Form elements, small components
Medium:      8px   - Buttons, cards, moderate components
Large:       12px  - Large cards, containers
Extra Large: 16px  - Hero sections, major elements
Full:        9999px - Pills, avatars
```

### Usage Guidelines
```
Forms/Inputs:       4px (sharp, business-like)
Buttons:            8px (friendly, modern)
Cards:              12px (prominent, spacious)
Large Sections:     16px (epic, premium)
Avatars/Badges:     9999px (circular)
```

---

## Shadow System

### Elevation Levels
```
Level 1 (sm):       0 1px 2px rgba(0,0,0,0.05)
Level 2 (md):       0 4px 6px rgba(0,0,0,0.1)
Level 3 (lg):       0 10px 15px rgba(0,0,0,0.1)
Level 4 (xl):       0 20px 25px rgba(0,0,0,0.15)
Level 5 (2xl):      0 25px 50px rgba(0,0,0,0.2)
```

### Glow Effects
```
Blue Glow:          0 0 20px rgba(59, 130, 246, 0.15)
Gold Glow:          0 0 20px rgba(212, 175, 55, 0.2)
Success Glow:       0 0 20px rgba(16, 185, 129, 0.15)
```

### When to Use Each Level
```
Level 1: Subtle elevation (disabled state, minimal hierarchy)
Level 2: Default cards, modest depth
Level 3: Prominent cards, modals
Level 4: Floating elements, hero cards
Level 5: Maximum elevation, important overlays
```

---

## Component Color Mappings

### Buttons
```
Primary Button:
  Background:     gradient(#1e40af → #3b82f6)
  Text:           White
  Hover:          Enhanced shadow, slight scale up
  
Secondary Button:
  Background:     #f8fafc
  Text:           #1e40af
  Border:         #e2e8f0
  Hover:          #e2e8f0 background
  
Outline Button:
  Background:     Transparent
  Text:           #1e40af
  Border:         #1e40af
  Hover:          #1e40af background, white text
```

### Status Indicators
```
Success:           #10b981 (with light bg #d1fae5)
Warning:           #f59e0b (with light bg #fef3c7)
Danger:            #ef4444 (with light bg #fee2e2)
Info:              #0ea5e9 (with light bg #cffafe)
Neutral:           #64748b (with light bg #f1f5f9)
```

### Tables
```
Header:            Gradient bg (#f8fafc → #f1f5f9)
Header Text:       #334155
Row Border:        #e2e8f0
Row Hover:         Subtle blue tint (rgba(59,130,246,0.03))
Text:              #475569
```

### Forms
```
Input Border:      #e2e8f0
Input Focus:       #1e40af
Input Focus Ring:  rgba(30,64,175,0.1)
Label:             #334155
Placeholder:       #94a3b8
Error Border:      #ef4444
Success Border:    #10b981
```

---

## Animation/Transition Timings

### Speed Classifications
```
Fast:              150ms cubic-bezier(0.4, 0, 0.2, 1)
Base:              250ms cubic-bezier(0.4, 0, 0.2, 1)
Slow:              350ms cubic-bezier(0.4, 0, 0.2, 1)
Extra Slow:        500ms cubic-bezier(0.4, 0, 0.2, 1)
```

### When to Use
```
Fast (150ms):      Hover state changes, quick interactions
Base (250ms):      Default transitions, smooth interactions
Slow (350ms):      Page transitions, modal opens
Extra Slow (500ms): Loading states, important state changes
```

### Easing Functions
```
ease-in-out:       cubic-bezier(0.4, 0, 0.2, 1) [Standard]
ease-out:          cubic-bezier(0.0, 0, 0.2, 1) [Quick start]
ease-in:           cubic-bezier(0.4, 0, 1, 1)   [Slow start]
linear:            0, 0, 1, 1                   [Constant speed]
```

---

## Breakpoints (Responsive Design)

```
Mobile:            0px - 640px    (default)
Tablet:            640px - 1024px (md: prefix)
Desktop:           1024px - 1280px (lg: prefix)
Large Desktop:     1280px+        (xl: prefix)
```

### Tailwind Responsive Prefixes
```
sm:  @media (min-width: 640px)
md:  @media (min-width: 768px)
lg:  @media (min-width: 1024px)
xl:  @media (min-width: 1280px)
2xl: @media (min-width: 1536px)
```

---

## Opacity/Transparency Scale

```
0:    0%   (fully transparent)
5:    5%
10:   10%
20:   20%
25:   25%
30:   30%
40:   40%
50:   50%
60:   60%
70:   70%
75:   75%
80:   80%
90:   90%
95:   95%
100:  100% (fully opaque)
```

### Common Usage
```
Disabled state:        opacity-50
Hover overlay:         opacity-10 to opacity-20
Text on colored bg:    opacity-70 to opacity-90
Icon accents:          opacity-60
Disabled text:         opacity-40
```

---

## Z-Index Scale

```
0:       Static positioning
10:      Floating elements (cards)
20:      Dropdowns, popovers
30:      Fixed headers, sticky elements
40:      Modals (backdrop)
50:      Modal content
60:      Tooltips, popovers (highest)
```

### Usage
```
Sticky nav:            z-30
Dropdown menu:         z-20
Modal overlay:         z-40
Modal content:         z-50
Tooltip:               z-60
```

---

## Implementation Examples

### Creating a Custom Color
```css
.bg-brand-premium {
  background: linear-gradient(135deg, #1e40af, #d4af37);
}

.text-brand-premium {
  background: linear-gradient(135deg, #1e40af, #d4af37);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Creating a Card with Brand Style
```css
.card-brand {
  background: white;
  border-radius: 12px;           /* Large */
  padding: 24px;                 /* 6 units */
  border: 1px solid #e2e8f0;     /* Slate-200 */
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);  /* Level 2 */
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  border-top: 3px solid;
  border-image: linear-gradient(90deg, #1e40af, #d4af37) 1;
}

.card-brand:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0,0,0,0.15);
}
```

---

## Dark Mode Considerations (Future)

For dark mode implementation:
```
Background:        #0f172a (Brand Dark) instead of white
Text:              #f8fafc (Brand Light) instead of dark gray
Cards:             #1e293b with 1px border #334155
Input:             #334155 background with #475569 text
Shadows:           More prominent (2x opacity)
Glows:             Increased opacity by 50%
```

---

## Accessibility Checklist

- [ ] Color contrast >= 4.5:1 for body text
- [ ] Color contrast >= 3:1 for large text (18pt+)
- [ ] Non-color indicators for status (icons, text)
- [ ] Focus states visible (outline or highlight)
- [ ] Icons >= 24px for interactive elements
- [ ] Text scaling works (100% - 200%)
- [ ] Animations respect prefers-reduced-motion
- [ ] Touch targets >= 44px min size
- [ ] Sufficient spacing between interactive elements

---

## Performance Optimization Tips

1. **Use CSS variables** for theme switching
2. **Minimize gradient usage** in nested elements
3. **Batch shadow effects** in CSS
4. **Use will-change sparingly** on animated elements
5. **Preload fonts** to prevent FOUT (Flash of Unstyled Text)
6. **Optimize animation frame rate** (60fps target)

---

## Quick Reference Card

**For Tailwind Classes:**
```
Color:      text-slate-600, bg-blue-500, border-amber-300
Spacing:    p-4, m-6, gap-3, px-4, py-2
Rounded:    rounded-md, rounded-lg, rounded-xl
Shadow:     shadow, shadow-lg, shadow-glow-blue
Text:       font-bold, text-lg, leading-relaxed
Border:     border-2, border-l-4, border-slate-200
```

**For Enhanced Classes:**
```
Cards:      card-enhanced, card-glass, hover-lift
Buttons:    btn-primary, btn-outline, btn-secondary
Badges:     badge-success, badge-warning, badge-danger
Text:       gradient-text-primary, gradient-text-success
Animation:  animate-fade-in-up, animate-scale-in
```
