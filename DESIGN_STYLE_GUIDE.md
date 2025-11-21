# HR Admin App - Comprehensive Design Style Guide

This document outlines the complete design system used in the HR Admin application. Use this guide to replicate the design style in other applications.

---

## Table of Contents
1. [Typography](#typography)
2. [Color System](#color-system)
3. [Spacing & Layout](#spacing--layout)
4. [Grid System](#grid-system)
5. [Border Radius](#border-radius)
6. [Components](#components)
7. [Layout Structure](#layout-structure)
8. [Responsive Design](#responsive-design)
9. [Shadows & Depth](#shadows--depth)
10. [Animations & Transitions](#animations--transitions)

---

## Typography

### Font Families
- **Primary Font**: Nunito Sans (Google Fonts)
  - Weights: 400 (Regular), 600 (Semibold), 700 (Bold)
- **Secondary Font**: Plus Jakarta Sans (Google Fonts)
  - Weights: 400, 500, 600
- **Monospace**: System monospace

### Font Variation Settings
All text elements use:
```css
font-variation-settings: 'YTLC' 500, 'wdth' 100;
```

### Font Scale & Line Heights

| Element | Size | Line Height | Weight | Usage |
|---------|------|-------------|--------|-------|
| **H1** | 48px | 72px | Bold (700) | Page titles (rarely used) |
| **H2** | 36px | 54px | Bold (700) | Main headings, dashboard sections |
| **H3** | 24px | 36px | Bold (700) | Section headings |
| **H4** | 20px | 30px | Semibold (600) | Subsection headings |
| **Body** | 16px | 24px | Regular (400) | Standard body text |
| **Caption** | 14px | 20px | Regular (400) / Semibold (600) | Labels, small text |
| **Chip/Badge** | 12px | 16px | Medium (500) / Semibold (600) | Status badges, tags |

### Specific Typography Patterns

**Page Title (Desktop)**
```css
font-size: 36px;
line-height: 54px;
font-weight: 700;
color: #0b0f17;
```

**Page Title (Mobile)**
```css
font-size: 20px;
line-height: 30px;
font-weight: 600;
color: #0b0f17;
```

**Section Heading**
```css
font-size: 18px;
line-height: 30px;
font-weight: 600;
color: #0b0f17;
```

**Form Labels**
```css
font-size: 14px;
line-height: 20px;
font-weight: 600;
color: #0b0f17;
```

**Input Text**
```css
font-size: 14px;
line-height: 20px;
font-weight: 400;
color: #0b0f17;
```

**Table Headers**
```css
font-size: 12px;
line-height: 16px;
font-weight: 600;
color: #797b7f;
text-transform: uppercase;
```

---

## Color System

### Primary Colors
```css
--color-primary: #2c7be5;           /* Main brand blue */
--color-primary-lightest: #e4eefc;  /* Very light blue */
--color-primary-light: #80b0ef;     /* Light blue */
--color-primary-medium-light: #5695ea;
--color-primary-medium-dark: #1a4a89; /* Hover states */
--color-primary-darkest: #12315c;
```

### Neutral / Gray Scale
```css
--color-neutral-lightest: #ededee;  /* Borders, dividers */
--color-neutral-light: #d2d3d4;     /* Secondary borders */
--color-neutral-medium-light: #a5a7a9; /* Disabled text */
--color-neutral-medium: #797b7f;    /* Secondary text */
--color-neutral-dark: #4c4f54;      /* Body text */
--color-neutral-darkest: #0b0f17;   /* Headings, primary text */
```

### Background Colors
```css
--color-background: #ffffff;        /* Main background */
--color-off-white: #f9fafb;        /* Page background, subtle backgrounds */
--color-white: #ffffff;            /* Card backgrounds */
--color-dark: #1f2329;             /* Dark elements */
```

### Semantic Colors

**Success**
```css
Primary: #10b981 (green-500)
Background: #d1fae5 (green-100)
Text: #10b981
Dot: #10b981
```

**Warning**
```css
Primary: #f59e0b (amber-500)
Background: #fff7ed (amber-50)
Text: #f59e0b
```

**Error/Danger**
```css
Primary: #ef4444 (red-500)
Background: #fee2e2 (red-100)
Text: #ef4444
Border: #f04438
```

**Info**
```css
Primary: #2c7be5 (brand blue)
Background: #e4eefc
Text: #2c7be5
```

**Neutral/Inactive**
```css
Primary: #6b7280 (gray-500)
Background: #f3f4f6 (gray-100)
Text: #6b7280
```

### Status Badge Colors

| Status | Background | Text | Dot |
|--------|-----------|------|-----|
| Active | #d1fae5 | #10b981 | #10b981 |
| On Leave | #fff7ed | #f59e0b | #f59e0b |
| Onboarding | #f3f4f6 | #6b7280 | #6b7280 |
| Deactivated | #fee2e2 | #ef4444 | #ef4444 |
| Pending | #fdffeb | #f5c320 | #f5c320 |
| Approved | #ecfdf3 | #027a48 | #027a48 |
| Rejected | #fef2f1 | #a32e26 | #a32e26 |
| Cancelled | #f3f4f6 | #6b7280 | #6b7280 |

---

## Spacing & Layout

### Spacing Scale (8px baseline)
```css
--space-1: 8px;    /* Baseline unit */
--space-2: 16px;   /* 2x baseline */
--space-3: 24px;   /* Small gap */
--space-4: 32px;
--space-5: 40px;
--space-6: 48px;
--space-8: 64px;   /* Medium gap */
--space-12: 96px;  /* Large gap */
```

### Component Spacing

**Card Padding**
- Standard: `16px` (mobile) / `24px` (desktop)
- Large cards: `24px` (mobile) / `32px` (desktop)

**Form Elements**
- Gap between fields: `20px` (5 units)
- Label to input: `6px`
- Input padding: `14px` horizontal, `10px` vertical
- Button padding: `20px` horizontal (small), `24px` horizontal (large)

**Page Padding**
- Mobile: `16px` (px-4)
- Desktop: `24px` (px-6)
- Content wrapper: `24px` top/bottom on mobile, `32px` on desktop

**Section Gaps**
- Between major sections: `24px` (gap-6)
- Between cards: `16px` (gap-4) on mobile, `24px` (gap-6) on desktop
- Between list items: `12px` (gap-3)

---

## Grid System

### Container Widths
```css
--grid-margin: 96px;
--grid-columns: 12;
--grid-gutter: 16px;
```

### Responsive Grid Patterns

**Dashboard Stats (4 columns)**
```css
grid-template-columns: repeat(1, 1fr);      /* Mobile */
md:grid-template-columns: repeat(2, 1fr);   /* Tablet */
xl:grid-template-columns: repeat(4, 1fr);   /* Desktop */
gap: 16px;  /* Mobile */
lg:gap: 24px; /* Desktop */
```

**Two Column Layout**
```css
grid-template-columns: repeat(1, 1fr);      /* Mobile */
xl:grid-template-columns: repeat(2, 1fr);   /* Desktop */
gap: 16px;
lg:gap: 24px;
```

**Form Grid (2 columns)**
```css
grid-template-columns: repeat(1, 1fr);      /* Mobile */
md:grid-template-columns: repeat(2, 1fr);   /* Desktop */
gap: 16px;
```

---

## Border Radius

```css
--radius-sm: 5px;   /* Small elements */
--radius: 8px;      /* Standard (buttons, inputs, cards) */
--radius-md: 12px;  /* Large cards, modals */
--radius-lg: 16px;  /* Very large containers */
--radius-full: 9999px; /* Pills, badges, avatars */
```

### Component Specific Radii
- **Buttons**: 8px
- **Input Fields**: 8px
- **Cards**: 12px
- **Modals**: 12px
- **Badges/Pills**: 16px (rounded-full for status dots)
- **Avatars**: 50% (rounded-full)
- **Dropdown Menus**: 8px
- **Tables**: 12px (container), no radius on cells

---

## Components

### 1. Buttons

#### Primary Button
```css
height: 40px;              /* Standard */
height: 48px;              /* Large */
padding: 0 20px;           /* Standard */
padding: 0 24px;           /* Large */
background: #2c7be5;
color: #ffffff;
border-radius: 8px;
font-size: 14px;           /* Standard */
font-size: 16px;           /* Large */
font-weight: 600;
line-height: 20px;         /* Standard */
line-height: 24px;         /* Large */
transition: all 200ms ease;

/* Hover */
background: #1a4a89;

/* Disabled */
opacity: 0.6;
cursor: not-allowed;
```

#### Secondary Button
```css
height: 40px;
padding: 0 20px;
background: #ffffff;
color: #4c4f54;
border: 1px solid #ededee;
border-radius: 8px;
font-size: 14px;
font-weight: 600;
transition: all 200ms ease;

/* Hover */
background: #f9fafb;
```

#### Destructive Button
```css
background: #ef4444;
color: #ffffff;

/* Hover */
background: #dc2626;
```

#### Icon Button
```css
width: 32px;
height: 32px;
padding: 8px;
border-radius: 8px;
background: transparent;
color: #797b7f;

/* Hover */
background: #f9fafb;
color: #0b0f17;
```

### 2. Input Fields

#### Text Input
```css
height: 40px;
padding: 10px 14px;
background: #ffffff;
border: 1px solid #ededee;
border-radius: 8px;
font-size: 14px;
line-height: 20px;
color: #0b0f17;

/* Placeholder */
color: #a5a7a9;

/* Focus */
outline: 2px solid #2c7be5;
border-color: transparent;

/* Error */
border-color: #ef4444;

/* Disabled */
background: #ededee;
color: #a5a7a9;
cursor: not-allowed;
```

#### Textarea
```css
padding: 10px 14px;
min-height: 80px;    /* 3-4 rows */
border: 1px solid #ededee;
border-radius: 8px;
font-size: 14px;
line-height: 20px;
resize: vertical;    /* or none */
```

#### Select/Dropdown
```css
height: 40px;
padding: 10px 14px;
background: #ffffff;
border: 1px solid #ededee;
border-radius: 8px;
font-size: 14px;
appearance: none;    /* Remove default arrow */

/* Add custom arrow icon */
background-image: url("chevron-down-icon");
background-position: right 12px center;
background-repeat: no-repeat;
```

#### Search Input
```css
height: 40px;
padding-left: 40px;  /* Space for icon */
padding-right: 14px;
background: #f9fafb;
border: 1px solid #ededee;
border-radius: 8px;
font-size: 14px;

/* Icon positioning */
position: relative;
/* Icon: absolute, left: 12px, top: 50%, transform: translateY(-50%) */
```

#### Checkbox
```css
width: 16px;
height: 16px;
border: 1px solid #ededee;
border-radius: 4px;
background: #ffffff;
cursor: pointer;

/* Checked */
background: #2c7be5;
border-color: #2c7be5;
/* Add checkmark SVG as background-image */

/* Label */
font-size: 14px;
font-weight: 600;
color: #797b7f;
margin-left: 8px;
```

### 3. Cards

#### Standard Card
```css
background: #ffffff;
border: 1px solid #ededee;
border-radius: 12px;
padding: 16px;       /* Mobile */
padding: 24px;       /* Desktop */
```

#### Stat Card
```css
background: #ffffff;
border: 1px solid #ededee;
border-radius: 12px;
padding: 16px;

/* Header */
font-size: 14px;
line-height: 20px;
color: #797b7f;
font-weight: 400;
margin-bottom: 13px;

/* Divider */
height: 1px;
background: #ededee;
margin-bottom: 36px;

/* Value */
font-size: 36px;
line-height: 54px;
font-weight: 700;
color: #0b0f17;
```

### 4. Tables

#### Table Structure
```css
/* Container */
background: #ffffff;
border: 1px solid #ededee;
border-radius: 12px;
overflow: hidden;

/* Header Row */
background: #f9fafb;
height: 48px;
padding: 0 16px;

/* Header Cell */
font-size: 12px;
font-weight: 600;
color: #797b7f;
text-align: left;
padding: 12px 16px;

/* Data Row */
height: 72px;         /* Standard row height */
border-bottom: 1px solid #ededee;
padding: 0 16px;

/* Hover State */
background: #f9fafb;
cursor: pointer;

/* Cell */
font-size: 14px;
font-weight: 400;
color: #0b0f17;
padding: 16px;
```

#### Pagination
```css
/* Container */
display: flex;
justify-content: space-between;
align-items: center;
padding: 16px 24px;
border-top: 1px solid #ededee;

/* Info Text */
font-size: 14px;
color: #797b7f;

/* Page Buttons */
width: 32px;
height: 32px;
border-radius: 4px;
border: 1px solid #e5e7eb;
background: #ffffff;
color: #797b7f;

/* Active Page */
background: #2c7be5;
color: #ffffff;
border-color: #2c7be5;

/* Arrow Buttons */
width: 32px;
height: 32px;
border-radius: 4px;
border: 1px solid #e5e7eb;

/* Disabled */
opacity: 0.5;
cursor: not-allowed;
```

### 5. Modals

#### Modal Overlay
```css
position: fixed;
inset: 0;
background: rgba(0, 0, 0, 0.5);  /* black/50 */
z-index: 50;
display: flex;
align-items: center;
justify-content: center;
padding: 16px;
```

#### Modal Container
```css
background: #ffffff;
border-radius: 12px;
width: 100%;
max-width: 600px;      /* Standard */
max-width: 420px;      /* Small */
max-width: 800px;      /* Large */
max-height: 90vh;
overflow-y: auto;
```

#### Modal Header
```css
background: #2c7be5;   /* Branded header */
height: 68px;
padding: 0 24px;
display: flex;
align-items: center;
justify-content: space-between;
border-radius: 12px 12px 0 0;

/* Title */
font-size: 20px;       /* Mobile */
font-size: 24px;       /* Desktop */
line-height: 30px;
line-height: 36px;     /* Desktop */
font-weight: 700;
color: #ffffff;

/* Close Button */
width: 24px;
height: 24px;
color: #ffffff;
background: transparent;
border-radius: 50%;

/* Hover */
background: rgba(255, 255, 255, 0.1);
```

#### Modal Body
```css
padding: 20px 24px;
```

#### Modal Footer
```css
padding: 16px 24px;
border-top: 1px solid #f3f4f6;
display: flex;
justify-content: flex-end;
gap: 12px;
```

#### Confirmation Modal (Alternative Style)
```css
/* Header */
background: #ffffff;
padding: 16px 24px;
border-bottom: 1px solid #ededee;

/* Title */
font-size: 18px;
font-weight: 600;
color: #0b0f17;

/* Body */
padding: 20px 24px;
font-size: 14px;
line-height: 20px;
color: #4b4e56;
```

### 6. Badges & Status Indicators

#### Status Badge
```css
display: inline-flex;
align-items: center;
gap: 6px;
padding: 2px 6px 2px 8px;
border-radius: 16px;
font-size: 12px;
font-weight: 500;

/* Dot */
width: 6px;
height: 6px;
border-radius: 50%;
background: currentColor;

/* Example: Success */
background: #ecfdf3;
color: #027a48;
```

#### Count Badge
```css
display: inline-flex;
align-items: center;
justify-content: center;
min-width: 20px;
height: 20px;
padding: 0 6px;
background: #2c7be5;
color: #ffffff;
border-radius: 10px;
font-size: 10px;
font-weight: 600;
```

### 7. Toast Notifications

```css
/* Container */
position: fixed;
top: 16px;
right: 16px;
z-index: 100;
display: flex;
align-items: center;
gap: 12px;
padding: 12px 16px;
border-radius: 8px;
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Success */
background: #10b981;
color: #ffffff;

/* Error */
background: #ef4444;
color: #ffffff;

/* Info */
background: #2c7be5;
color: #ffffff;

/* Icon */
width: 20px;
height: 20px;
flex-shrink: 0;

/* Message */
font-size: 14px;
font-weight: 500;
flex: 1;

/* Close Button */
width: 16px;
height: 16px;
color: currentColor;
opacity: 0.8;

/* Hover */
opacity: 1;

/* Animation */
animation: slideInFromRight 300ms ease-out;
```

### 8. Dropdowns & Menus

#### Dropdown Container
```css
position: absolute;
top: 100%;
left: 0;              /* or right: 0 for right-aligned */
margin-top: 8px;
background: #ffffff;
border: 1px solid #ededee;
border-radius: 8px;
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
padding: 8px 0;
min-width: 180px;
max-height: 300px;
overflow-y: auto;
z-index: 50;
```

#### Dropdown Item
```css
width: 100%;
padding: 8px 16px;
font-size: 14px;
font-weight: 500;
color: #0b0f17;
text-align: left;
background: transparent;
transition: background 150ms ease;

/* Hover */
background: #f9fafb;

/* Active/Selected */
background: #e4eefc;
color: #2c7be5;
```

#### Dropdown with Search
```css
/* Search Container */
padding: 12px;
border-bottom: 1px solid #ededee;

/* Search Input */
width: 100%;
height: 32px;
padding: 6px 12px 6px 32px;
border: 1px solid #ededee;
border-radius: 4px;
font-size: 14px;

/* Search Icon */
position: absolute;
left: 8px;
top: 8px;
width: 16px;
height: 16px;
color: #797b7f;
```

### 9. Avatar

#### Avatar Sizes
```css
/* Small */
width: 32px;
height: 32px;
border-radius: 50%;

/* Medium (Default) */
width: 40px;
height: 40px;
border-radius: 50%;

/* Large */
width: 48px;
height: 48px;
border-radius: 50%;

/* Extra Large */
width: 64px;
height: 64px;
border-radius: 50%;
```

#### Avatar with Status Indicator
```css
/* Container */
position: relative;

/* Status Dot */
position: absolute;
bottom: -2px;
right: -2px;
width: 12px;
height: 12px;
border-radius: 50%;
background: #12b76a;    /* Online: green */
border: 2px solid #ffffff;
```

#### Avatar Initials Fallback
```css
display: flex;
align-items: center;
justify-content: center;
background: #2c7be5;    /* or gradient */
color: #ffffff;
font-size: 12px;        /* Small */
font-size: 14px;        /* Medium */
font-size: 16px;        /* Large */
font-weight: 600;
```

### 10. Empty States

```css
/* Container */
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 64px 16px;     /* py-16 px-4 */
text-align: center;

/* Icon Container */
width: 64px;
height: 64px;
border-radius: 50%;
background: #f3f4f6;
display: flex;
align-items: center;
justify-content: center;
margin-bottom: 16px;

/* Icon */
width: 32px;
height: 32px;
color: #9ca3af;

/* Title */
font-size: 16px;
font-weight: 600;
color: #0b0f17;
margin-bottom: 8px;

/* Description */
font-size: 14px;
color: #6b7280;
max-width: 300px;
margin-bottom: 16px;

/* Action Button */
/* Use primary button styles */
```

### 11. Skeleton Loaders

```css
/* Base Skeleton */
background: #e5e7eb;
border-radius: 4px;
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Common Elements */
/* Line */
height: 16px;
background: #e5e7eb;

/* Circle */
width: 40px;
height: 40px;
border-radius: 50%;

/* Rectangle */
height: 100px;
border-radius: 8px;
```

### 12. Scrollbar

```css
/* Thin Scrollbar */
scrollbar-width: thin;
scrollbar-color: #d2d3d4 transparent;

/* Webkit Browsers */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #d2d3d4;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a5a7a9;
}
```

---

## Layout Structure

### 1. Overall Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌──────────┐  ┌──────────────────────┐    │
│  │          │  │     HEADER           │    │
│  │          │  │                      │    │
│  │ SIDEBAR  │  ├──────────────────────┤    │
│  │          │  │                      │    │
│  │          │  │     MAIN CONTENT     │    │
│  │  Fixed   │  │                      │    │
│  │  264px   │  │    Scrollable        │    │
│  │          │  │                      │    │
│  │          │  │                      │    │
│  └──────────┘  └──────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### 2. Sidebar

```css
/* Desktop (lg and up) */
position: fixed;
left: 0;
top: 0;
height: 100vh;
width: 264px;
background: #ffffff;
border-right: 2px solid #ededee;
overflow-y: auto;
display: flex;
flex-direction: column;

/* Mobile */
display: none;  /* Hidden, replaced with mobile menu */
```

**Sidebar Structure:**
```
Logo Section
  - Logo + Brand Name
  - Badge ("Admin")
  - Padding: 40px top, 16px horizontal

Divider (1px line)

Navigation Items
  - Margin-top: 79px
  - Gap: 12px between items
  - Width: 232px (centered)

Bottom Section
  - Divider
  - Settings Item
  - Logout Button
  - Margin-bottom: 40px
```

**Navigation Item:**
```css
/* Default */
display: flex;
align-items: center;
gap: 12px;
padding: 10px 16px;
border-radius: 8px;
font-size: 14px;
line-height: 20px;
color: #797b7f;
transition: background 200ms ease;

/* Hover */
background: #f9fafb;

/* Active */
background: #2c7be5;
color: #ffffff;
font-weight: 600;
```

### 3. Header

```css
/* Container */
position: sticky;
top: 0;
z-index: 50;
width: 100%;
background: #f9fafb;

/* Desktop */
padding: 32px 24px;
display: flex;
align-items: center;
justify-content: space-between;

/* Mobile */
padding: 20px 16px;
display: flex;
flex-direction: column;
gap: 16px;
```

**Header Elements:**
```
Desktop:
  - Left: Page Title (H2)
  - Right: Search + Notification + Profile

Mobile:
  - Row 1: Logo + Menu Button
  - Row 2: Page Title + Actions (Notification, Profile)
  - Row 3: Search Bar
```

**Search Bar (Desktop):**
```css
width: 300px;
height: 40px;
padding: 10px 12px;
background: #f9fafb;
border: 1px solid #ededee;
border-radius: 8px;
display: flex;
align-items: center;
gap: 12px;

/* Icon */
width: 12px;
height: 12px;
color: #a5a7a9;

/* Input */
font-size: 14px;
color: #0b0f17;
placeholder-color: #a5a7a9;
```

**Notification Bell:**
```css
position: relative;
width: 32px;
height: 32px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 50%;
background: transparent;
transition: background 200ms ease;

/* Hover */
background: rgba(44, 123, 229, 0.1);

/* Badge */
position: absolute;
top: -2px;
right: -2px;
width: 16px;
height: 16px;
background: #ef4444;
color: #ffffff;
border-radius: 50%;
font-size: 10px;
font-weight: 600;
```

**Profile Avatar:**
```css
position: relative;
width: 32px;
height: 32px;
border-radius: 50%;
overflow: hidden;

/* Status Indicator */
position: absolute;
bottom: -2px;
right: -2px;
width: 12px;
height: 12px;
background: #12b76a;
border: 2px solid #ffffff;
border-radius: 50%;
```

**Bottom Border (Desktop):**
```css
margin: -16px 24px 0;
height: 1px;
background: #d2d3d4;
```

### 4. Main Content Area

```css
/* Container */
margin-left: 264px;    /* Desktop - sidebar width */
flex: 1;
display: flex;
flex-direction: column;
min-width: 0;

/* Mobile */
margin-left: 0;

/* Content Padding */
padding: 24px 16px;    /* Mobile */
padding: 32px 24px;    /* Desktop */
max-width: 100%;
width: 100%;
```

### 5. Page Background

```css
background: #f9fafb;
min-height: 100vh;
```

---

## Responsive Design

### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px     /* Sidebar appears */
xl: 1280px     /* Multi-column layouts expand */
2xl: 1536px
```

### Responsive Patterns

#### 1. Sidebar
```css
/* Mobile: Hidden */
display: none;

/* Desktop (lg+): Fixed sidebar */
display: block;
position: fixed;
width: 264px;

/* Content adjusts */
main { margin-left: 0; }      /* Mobile */
main { margin-left: 264px; }  /* Desktop */
```

#### 2. Header
```css
/* Mobile: Stacked layout */
flex-direction: column;
gap: 16px;
padding: 20px 16px;

/* Desktop: Horizontal layout */
flex-direction: row;
justify-content: space-between;
padding: 32px 24px;
```

#### 3. Grid Layouts
```css
/* Stats Cards */
grid-cols: 1;           /* Mobile */
md:grid-cols: 2;        /* Tablet */
xl:grid-cols: 4;        /* Desktop */

/* Two Column Sections */
grid-cols: 1;           /* Mobile */
xl:grid-cols: 2;        /* Desktop */
```

#### 4. Tables
```css
/* Desktop: Full table */
display: table;
overflow-x: auto;

/* Mobile: Card view or horizontal scroll */
/* Option A: Convert to cards */
display: block;
/* Each row becomes a card */

/* Option B: Horizontal scroll */
overflow-x: auto;
min-width: 1150px;  /* Table min-width */
/* Container scrolls horizontally */
```

#### 5. Modals
```css
/* Container */
max-width: 90vw;        /* Mobile */
max-width: 600px;       /* Desktop */
max-height: 90vh;

/* Header */
font-size: 20px;        /* Mobile */
font-size: 24px;        /* Desktop */

/* Footer */
flex-direction: column-reverse;  /* Mobile */
flex-direction: row;             /* Desktop */
```

#### 6. Typography
```css
/* Page Title */
font-size: 24px;        /* Mobile */
line-height: 36px;
font-size: 36px;        /* Desktop */
line-height: 54px;

/* Section Heading */
font-size: 18px;        /* Mobile */
font-size: 20px;        /* Desktop */
```

---

## Shadows & Depth

### Elevation Levels

```css
/* Level 0: Flat */
box-shadow: none;

/* Level 1: Subtle - Inputs, Cards */
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px 0 rgba(0, 0, 0, 0.06);

/* Level 2: Default - Dropdowns, Tooltips */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Level 3: Raised - Modals, Popovers */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Level 4: Floating - Toasts */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Level 5: Maximum - Dialogs */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Usage Guidelines

- **Cards**: Use Level 0 (border only) or Level 1
- **Buttons**: No shadow by default, use Level 1 on hover (optional)
- **Dropdowns/Menus**: Level 2-3
- **Modals**: Level 3-4
- **Toasts**: Level 4
- **Focus States**: Use outline instead of shadow

---

## Animations & Transitions

### Transition Timings

```css
/* Fast - Micro-interactions */
transition-duration: 150ms;
/* Hover states, button presses */

/* Normal - Most transitions */
transition-duration: 200ms;
/* Dropdowns, color changes */

/* Slow - Complex transitions */
transition-duration: 300ms;
/* Modals, slides, fades */

/* Easing */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);  /* Default */
transition-timing-function: cubic-bezier(0.4, 0, 1, 1);    /* Ease-in */
transition-timing-function: cubic-bezier(0, 0, 0.2, 1);    /* Ease-out */
```

### Common Transitions

```css
/* Color Changes */
transition: background-color 200ms ease,
            color 200ms ease;

/* Transform + Color */
transition: transform 200ms ease,
            background-color 200ms ease;

/* Opacity Fade */
transition: opacity 300ms ease;

/* All Properties */
transition: all 200ms ease;  /* Use sparingly */
```

### Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

animation: fadeIn 300ms ease-out;
```

#### Slide In (Toast)
```css
@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

animation: slideInFromRight 300ms ease-out;
```

#### Pulse (Skeleton Loaders)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

#### Scale (Buttons, Cards)
```css
/* Hover effect */
transition: transform 150ms ease;

&:hover {
  transform: scale(1.02);
}

&:active {
  transform: scale(0.98);
}
```

#### Dropdown Slide & Fade
```css
@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

animation: dropdownSlide 200ms ease-out;
```

### Hover States

```css
/* Buttons */
background: #2c7be5;
transition: background-color 200ms ease;

&:hover {
  background: #1a4a89;
}

/* Cards */
transition: background-color 150ms ease;

&:hover {
  background: #f9fafb;
}

/* Links/Text */
color: #2c7be5;
transition: color 150ms ease;

&:hover {
  color: #1a4a89;
  text-decoration: underline;
}

/* Icons */
color: #797b7f;
transition: color 200ms ease,
            background-color 200ms ease;

&:hover {
  color: #0b0f17;
  background: #f9fafb;
}
```

### Loading States

```css
/* Spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

animation: spin 1s linear infinite;

/* Progress Bar */
@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

animation: progress 1.5s ease-in-out infinite;
```

### Focus States

```css
/* Default Focus Ring */
outline: 2px solid #2c7be5;
outline-offset: 2px;

/* Input Focus */
border-color: transparent;
box-shadow: 0 0 0 2px #2c7be5;

/* Button Focus */
outline: 2px solid #2c7be5;
outline-offset: 2px;
```

---

## Additional Design Patterns

### 1. Form Layout Patterns

**Single Column Form**
```css
display: flex;
flex-direction: column;
gap: 20px;
max-width: 600px;
```

**Two Column Form**
```css
display: grid;
grid-template-columns: 1fr;        /* Mobile */
md:grid-template-columns: 1fr 1fr; /* Desktop */
gap: 16px;
```

**Form Section**
```css
/* Section spacing */
margin-bottom: 32px;

/* Section title */
font-size: 16px;
font-weight: 600;
color: #0b0f17;
margin-bottom: 16px;
```

### 2. Data Display Patterns

**Label-Value Pair**
```css
/* Label */
font-size: 12px;
font-weight: 600;
color: #797b7f;
text-transform: uppercase;
margin-bottom: 4px;

/* Value */
font-size: 14px;
font-weight: 400;
color: #0b0f17;
```

**Progress Bar**
```css
/* Container */
width: 100%;
height: 8px;
background: #e5e7eb;
border-radius: 4px;
overflow: hidden;

/* Fill */
height: 100%;
background: #2c7be5;
border-radius: 4px;
transition: width 300ms ease;
```

**Divider**
```css
/* Horizontal */
height: 1px;
background: #ededee;
margin: 16px 0;    /* or 24px */

/* With Text */
display: flex;
align-items: center;
text-align: center;
gap: 16px;

&::before,
&::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ededee;
}
```

### 3. Filter & Search Patterns

**Filter Bar**
```css
display: flex;
align-items: center;
gap: 12px;
flex-wrap: wrap;    /* Mobile */
padding: 16px;
background: #ffffff;
border-radius: 8px;
```

**Filter Button**
```css
height: 34px;
padding: 0 12px;
border: 1px solid #e5e7eb;
border-radius: 8px;
font-size: 14px;
color: #6b7280;
background: #ffffff;
display: flex;
align-items: center;
gap: 8px;
transition: all 200ms ease;

/* With count badge */
/* Add pill with count */

/* Active state */
border-color: #2c7be5;
background: #ebf5ff;
color: #2c7be5;
```

### 4. Icon Usage

**Icon Sizes**
```css
--icon-xs: 12px;
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

**Icon in Button**
```css
/* Left icon */
margin-right: 8px;

/* Right icon */
margin-left: 8px;

/* Icon only button */
padding: 8px;
width: 32px;
height: 32px;
```

**Icon Colors**
```css
/* Default */
color: #797b7f;

/* Active/Hover */
color: #0b0f17;

/* Primary */
color: #2c7be5;

/* Danger */
color: #ef4444;

/* Success */
color: #10b981;
```

---

## Implementation Notes

### Technology Stack
- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS v4
- **Fonts**: Google Fonts (Nunito Sans, Plus Jakarta Sans)
- **State Management**: React Query (TanStack Query) for server state
- **Icons**: Custom SVG components
- **Form Handling**: Controlled components with React hooks

### CSS Variables Setup

In your main CSS file:

```css
:root {
  --background: #ffffff;
  --foreground: #0b0f17;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-nunito-sans);
  --font-jakarta: var(--font-plus-jakarta-sans);

  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Brand Colors */
  --color-primary: #2c7be5;
  --color-dark: #1f2329;
  --color-off-white: #f9fafb;
  --color-white: #ffffff;

  /* Primary Variants */
  --color-primary-lightest: #e4eefc;
  --color-primary-light: #80b0ef;
  --color-primary-medium-light: #5695ea;
  --color-primary-medium-dark: #1a4a89;
  --color-primary-darkest: #12315c;

  /* Neutral / Gray Variants */
  --color-neutral-lightest: #ededee;
  --color-neutral-light: #d2d3d4;
  --color-neutral-medium-light: #a5a7a9;
  --color-neutral-medium: #797b7f;
  --color-neutral-dark: #4c4f54;
  --color-neutral-darkest: #0b0f17;

  /* Spacing */
  --space-1: 8px;
  --space-3: 24px;
  --space-8: 64px;

  /* Border Radius */
  --radius-sm: 5px;
  --radius: 8px;

  /* Grid System */
  --grid-margin: 96px;
  --grid-columns: 12;
  --grid-gutter: 16px;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-nunito-sans), -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  font-variation-settings: "YTLC" 500, "wdth" 100;
}
```

### Tailwind Config Extensions

If using Tailwind v4 with custom colors, ensure your config includes:

```js
// tailwind.config.js or equivalent
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          lightest: '#e4eefc',
          light: '#80b0ef',
          DEFAULT: '#2c7be5',
          dark: '#1a4a89',
          darkest: '#12315c',
        },
        neutral: {
          lightest: '#ededee',
          light: '#d2d3d4',
          'medium-light': '#a5a7a9',
          medium: '#797b7f',
          dark: '#4c4f54',
          darkest: '#0b0f17',
        },
        'off-white': '#f9fafb',
      },
      fontFamily: {
        sans: ['var(--font-nunito-sans)', 'sans-serif'],
        jakarta: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
      },
    },
  },
};
```

### Best Practices

1. **Consistency**: Always use the design tokens (colors, spacing, typography) defined in this guide
2. **Mobile First**: Build for mobile first, then enhance for larger screens
3. **Accessibility**: 
   - Maintain color contrast ratios (WCAG AA minimum)
   - Use semantic HTML
   - Add proper ARIA labels where needed
   - Ensure keyboard navigation works
4. **Performance**:
   - Lazy load images
   - Use skeleton loaders for async content
   - Optimize icons (use SVG sprites if many icons)
5. **Component Composition**: Build small, reusable components that follow these patterns

---

## Quick Reference Cheat Sheet

### Common Component Sizes

| Component | Height | Padding H | Padding V | Font Size |
|-----------|--------|-----------|-----------|-----------|
| Button (sm) | 32px | 16px | 6px | 14px |
| Button (md) | 40px | 20px | 10px | 14px |
| Button (lg) | 48px | 24px | 12px | 16px |
| Input | 40px | 14px | 10px | 14px |
| Select | 40px | 14px | 10px | 14px |
| Table Row | 72px | 16px | 16px | 14px |
| Modal Header | 68px | 24px | - | 24px |
| Card | - | 16-24px | 16-24px | - |

### Common Spacing Values
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 48px

### Common Z-Index Layers
```css
--z-base: 0;
--z-dropdown: 10;
--z-sticky: 20;
--z-fixed: 30;
--z-modal-backdrop: 40;
--z-modal: 50;
--z-popover: 60;
--z-tooltip: 70;
--z-toast: 100;
```

---

## Conclusion

This design system emphasizes:
- **Clarity**: Clean, readable typography with clear hierarchy
- **Consistency**: Systematic use of spacing, colors, and components
- **Professionalism**: Subtle, refined aesthetics suitable for enterprise applications
- **Usability**: Accessible, intuitive interfaces with clear feedback
- **Modularity**: Reusable components that compose well together

When adapting this design system to a new application with different colors:
1. Replace the primary color palette while maintaining the same structure (lightest, light, medium, dark, darkest)
2. Keep the neutral gray scale for consistency
3. Maintain all spacing, typography, and component patterns
4. Adjust semantic colors (success, warning, error) if needed for brand consistency
5. Test color contrast ratios to ensure accessibility

This guide provides the foundation for creating a cohesive, professional application interface that users will find familiar and easy to use.

