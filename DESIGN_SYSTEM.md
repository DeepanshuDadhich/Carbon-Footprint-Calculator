# CalCarbo Design System Documentation

This document captures the complete design system of the Carbon Footprint Calculator application for future reference and recreation.

## 🎨 Color Palette

### Primary Colors
- **Accent Color**: `#3A4A5C` (Dark blue-gray)
- **Accent Light**: `#4A5A6C`
- **Accent Lighter**: `#5A6A7C`

### Background Colors
- **Black**: `#000000`
- **Black Light**: `#1A1A1A`
- **Black Lighter**: `#2D2D2D`

### Card Colors
- **Card BG**: `#2A2A3A` (Dark purple-gray)
- **Card BG Light**: `#3A3A4A`
- **Card BG Lighter**: `#4A4A5A`

### Text Colors
- **Text Light**: `#E8E8E8` (Primary text)
- **Text Medium**: `#B0B0B0` (Secondary text)
- **Text Dark**: `#808080` (Tertiary text)
- **Placeholder**: `#6B7280`

### Input Colors
- **Input Background**: `#F5F5F5` (Light gray for contrast)
- **Input Text**: `#1A1A1A` (Dark text on light background)

## 📝 Typography

### Font Families
- **Primary**: `'Inter', 'Nunito', system-ui, sans-serif`
- Google Fonts: Inter (weights: 300, 400, 500, 600, 700) and Nunito (weights: 300, 400, 500, 600, 700)

### Font Sizes
- **Heading 1**: `text-3xl` (30px) - Bold, with glow effects
- **Heading 2**: `text-2xl` (24px) - Bold
- **Heading 3**: `text-lg` (18px) - Semibold
- **Body**: `text-sm` (14px) - Regular
- **Small**: `text-xs` (12px) - Regular

### Font Weights
- **Bold/Extrabold**: Headings, important text
- **Semibold**: Subheadings
- **Medium**: Labels, buttons
- **Regular**: Body text

## 🎭 Background Design

### Animated Background
- **Base**: Fixed position, full viewport
- **Gradient**: Multi-stop gradient from black to accent colors
  - Colors: `#000000 → #1a1a1a → #2d2d2d → #3A4A5C → #2d2d2d → #1a1a1a → #000000`
  - Animation: `carbonGradientShift` (25s infinite ease)
  
### Background Effects
1. **Smoke Plumes** (::before pseudo-element)
   - Radial gradients simulating industrial smoke
   - Animation: `smokeRise` (30s infinite ease-in-out)
   - Opacity: 0.1-0.15

2. **Carbon Molecule Pattern** (::after pseudo-element)
   - SVG pattern overlay
   - Animation: `carbonFloat` (40s infinite linear)
   - Opacity: 0.4

3. **Emission Particles** (.leaf-pattern)
   - CO2 molecule SVG patterns
   - Floating particles
   - Animation: `emissionDrift` (35s infinite linear)
   - Opacity: 0.3

## 🧩 Component Patterns

### Cards
```css
- Background: bg-stone-gray (#2A2A3A with 0.85 opacity)
- Backdrop Filter: blur(10px)
- Border: 1px solid rgba(58, 74, 92, 0.3)
- Border Radius: rounded-card (20px)
- Shadow: shadow-soft (0 5px 20px rgba(0, 0, 0, 0.05))
- Hover Shadow: shadow-soft-hover (0 8px 25px rgba(0, 0, 0, 0.08))
- Padding: p-6 (24px)
- Animation: card-animate (fadeInUp 0.5s ease-out)
```

### Header
- **Background**: `bg-black-light/90` with `backdrop-blur-md`
- **Border**: Bottom border with `border-accent-color/30`
- **Position**: Sticky top-0, z-index 50
- **Logo**: 
  - "Cal" in text-light with glow effect
  - "Carbo" in accent-color-lighter with glow effect
  - Gradient underline
- **Region Selector**: Dropdown with dark theme
- **Help Button**: Hover effect with scale animation

### Footer
- **Background**: `bg-stone-gray`
- **Border**: Top border with `border-text-dark/20`
- **Layout**: 3-column grid on desktop, stacked on mobile
- **Text**: Small, medium weight, text-medium color

### Input Cards
- Same card styling as above
- **Labels**: `text-sm font-medium text-text-light`
- **Inputs**: 
  - Light background (#F5F5F5) for contrast
  - Dark text (#1A1A1A)
  - Border: `border-dark-brown-light`
  - Focus: `focus:ring-2 focus:ring-accent-color`
- **Help Text**: `text-xs text-text-medium`

### Buttons

#### Primary Button
```css
- Background: bg-accent-color (#3A4A5C)
- Hover: bg-accent-color-light
- Text: text-text-light
- Padding: px-10 py-3
- Border Radius: rounded-lg
- Shadow: shadow-soft
- Hover Effect: Scale animation on hover
- Loading State: Spinner with opacity transition
```

#### Secondary Button
```css
- Background: bg-dark-brown-light
- Border: border-dark-brown-lighter
- Text: text-text-light
- Hover: bg-dark-brown-lighter
```

### Stat Cards
- Grid: 4 columns on desktop, 2 on tablet, 1 on mobile
- Same card styling
- **Label**: `text-sm text-text-medium font-medium`
- **Value**: `text-3xl font-bold text-text-light` (responsive sizing)
- **Unit**: `text-xs text-text-dark`
- Staggered animation delays (0s, 0.1s, 0.2s, 0.3s)

### Chart (Pie Chart)
- Container: Same card styling
- **Colors**: Vibrant palette
  - Purple: `rgba(139, 92, 246, 0.85)`
  - Blue: `rgba(59, 130, 246, 0.85)`
  - Pink: `rgba(236, 72, 153, 0.85)`
  - Green: `rgba(34, 197, 94, 0.85)`
  - Orange: `rgba(251, 146, 60, 0.85)`
- **Legend**: Bottom position, custom styling
- **Tooltip**: Dark theme with accent border

### Tips Panel
- Same card styling
- **Tip Cards**: 
  - Border: `border-dark-brown-light`
  - Background: `bg-dark-brown`
  - Padding: `p-4`
- **Simulation Banner**:
  - Background: `bg-dark-green/20`
  - Border: `border-accent-color/40`
  - Animation: `spring-expand`
- **Preview Button**: `bg-dark-green/20` with `text-dark-green-lighter`

## ✨ Animations

### Keyframe Animations

1. **fadeInUp**
   - From: opacity 0, translateY(20px)
   - To: opacity 1, translateY(0)
   - Duration: 0.5s
   - Easing: ease-out

2. **fadeIn**
   - From: opacity 0
   - To: opacity 1
   - Duration: 0.4s
   - Easing: ease-out

3. **springExpand**
   - Scale animation with spring effect
   - Duration: 0.4s
   - Easing: cubic-bezier(0.34, 1.56, 0.64, 1)

4. **carbonGradientShift**
   - Background position animation
   - Duration: 25s
   - Infinite loop

5. **smokeRise**
   - Transform and opacity animation
   - Duration: 30s
   - Infinite loop

6. **carbonFloat**
   - Rotation and translation
   - Duration: 40s
   - Infinite loop

7. **emissionDrift**
   - Translation and rotation
   - Duration: 35s
   - Infinite loop

8. **carbonSpin / carbonSpinReverse**
   - Loading spinner animations
   - Duration: 1s / 0.8s
   - Infinite linear

9. **ripple**
   - Button click effect
   - Scale from 0 to 4
   - Duration: 0.6s

### Transition Classes
- **Card Hover**: `transition-all`
- **Page Load**: `transition-opacity duration-500/700`
- **Slide In**: `transform transition-all duration-700`
- **Button Hover**: Scale and color transitions

## 📐 Layout Structure

### Page Container
```jsx
<div className="min-h-screen relative">
  <div className="nature-background"></div>
  <div className="leaf-pattern"></div>
  <Header />
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0">
    {/* Content */}
  </main>
  <Footer />
</div>
```

### Grid Layouts
- **Input Page**: Single column, max-width 3xl, centered
- **Results Page**: 2-column grid on desktop (lg:grid-cols-2)
  - Left: Stats, Chart, Equivalents
  - Right: Tips, Details, Save/Share

### Responsive Breakpoints
- **Mobile**: Default (single column)
- **Tablet**: `sm:` (640px+)
- **Desktop**: `md:` (768px+), `lg:` (1024px+)

## 🎯 Interactive Elements

### Scroll Behavior
- **Bouncy Scroll**: Custom hook for enhanced scroll experience
- **Smooth Scroll**: `scroll-behavior: smooth`
- **Overscroll**: `overscroll-behavior-y: none`

### Loading States
- **Loader**: Carbon-themed spinner (carbon-loader)
- **Overlay**: Dark backdrop with blur
- **Text**: Centered with loading message

### Focus States
- **Inputs**: `focus:ring-2 focus:ring-accent-color`
- **Buttons**: Same ring effect
- **Accessibility**: Proper focus indicators

## 🎨 Custom Scrollbar
```css
- Width: 8px
- Track: var(--black-lighter)
- Thumb: var(--accent-color)
- Hover: var(--accent-color-light)
- Border Radius: 4px
```

## 📱 Responsive Design

### Mobile First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Hidden elements: `hidden sm:inline`

### Container Max Widths
- **Main Container**: `max-w-7xl` (1280px)
- **Form Container**: `max-w-3xl` (768px)
- **Card Content**: Full width within container

## 🔧 Utility Classes

### Spacing
- Consistent use of Tailwind spacing scale
- Common: `p-6`, `px-4`, `py-2`, `gap-4`, `space-y-6`

### Borders
- `border-dark-brown-light`
- `border-accent-color/30`
- `border-text-dark/20`

### Shadows
- `shadow-soft`
- `shadow-soft-hover`

### Opacity
- `/90`, `/80`, `/50`, `/40`, `/30`, `/20` for overlays

## 🎭 Special Effects

### Glow Effects
- Text glow: `drop-shadow-[0_0_8px_rgba(58,74,92,0.6)]`
- Background glow: `blur-lg opacity-70`

### Backdrop Blur
- Header: `backdrop-blur-md`
- Cards: `backdrop-filter: blur(10px)`
- Loading overlay: `backdrop-blur-sm`

### Gradient Underlines
- `bg-gradient-to-r from-transparent via-accent-color/70 to-transparent`

## 📋 Component Hierarchy

1. **App** (Router)
   - InputPage
   - ResultsPage

2. **InputPage**
   - Header
   - InputForm
     - CommuteCard
     - ElectricityCard
     - DietCard
     - FlightsCard
   - Footer

3. **ResultsPage**
   - Header
   - StatCards
   - Pie Chart
   - EquivalentsStrip
   - TipsPanel
   - CalculationDetails
   - SaveSharePanel
   - Footer

## 🎨 Design Principles

1. **Dark Theme**: Consistent dark color scheme throughout
2. **High Contrast**: Light inputs on dark backgrounds for readability
3. **Smooth Animations**: All interactions have smooth transitions
4. **Visual Hierarchy**: Clear typography and spacing hierarchy
5. **Accessibility**: Proper focus states, ARIA labels, semantic HTML
6. **Responsive**: Mobile-first, works on all screen sizes
7. **Performance**: Optimized animations, efficient rendering
8. **Consistency**: Reusable components and utility classes

## 🔄 State Management Patterns

- **Local State**: useState for component-level state
- **Local Storage**: Auto-save functionality
- **URL Navigation**: React Router for page navigation
- **State Persistence**: Save/load from localStorage

## 📦 Key Dependencies

- React 18.2.0
- React Router DOM 7.9.6
- Tailwind CSS 3.3.6
- Chart.js 4.4.0
- react-chartjs-2 5.2.0
- Vite 5.0.8

---

**Note**: This design system should be used as a reference when recreating a similar interface for a new project. All color values, spacing, typography, and component patterns are documented here for consistency.

