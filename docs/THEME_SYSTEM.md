# 🎨 Complete Theme System & UI Components

## Overview

This document describes the comprehensive theme system and UI component library that replaces the missing Next.js UI components. The system provides a complete design token system, theme switching, and a full set of reusable UI components.

## 🏗️ Architecture

### File Structure
```
src/styles/
├── _variables.scss     # Design tokens, colors, spacing, typography
├── _mixins.scss        # Reusable SASS mixins and utilities
├── _theme.scss         # Theme system and base styles
├── _ui-components.scss # Complete UI component library
└── main.scss          # Main file that imports everything
```

### Import Order
The files are imported in a specific order to ensure proper dependency resolution:
1. `_variables.scss` - Design tokens and configuration
2. `_mixins.scss` - Reusable patterns (depends on variables)
3. `_theme.scss` - Theme system (depends on variables and mixins)
4. `_ui-components.scss` - UI components (depends on all above)
5. `main.scss` - Main styles and markdown-specific styles

## 🎨 Design System

### Color Palette
The system uses OKLCH color space for better color relationships and accessibility:

```scss
// Light theme colors
$colors: (
  light: (
    background: oklch(1 0 0),           // Pure white
    foreground: oklch(0.145 0 0),       // Near black
    primary: oklch(0.205 0 0),          // Dark gray
    secondary: oklch(0.97 0 0),         // Light gray
    muted: oklch(0.97 0 0),             // Very light gray
    border: oklch(0.922 0 0),           // Light border
    // ... more colors
  ),
  dark: (
    background: oklch(0.145 0 0),       // Near black
    foreground: oklch(0.985 0 0),       // Near white
    primary: oklch(0.985 0 0),          // Near white
    secondary: oklch(0.269 0 0),        // Dark gray
    // ... more colors
  )
);
```

### Spacing Scale
Consistent spacing using a mathematical scale:
```scss
$spacing: (
  xs: 0.25rem,    // 4px
  sm: 0.5rem,     // 8px
  md: 1rem,       // 16px
  lg: 1.5rem,     // 24px
  xl: 2rem,       // 32px
  xxl: 3rem       // 48px
);
```

### Typography Scale
```scss
$font-sizes: (
  xs: 0.75rem,    // 12px
  sm: 0.875rem,   // 14px
  base: 1rem,     // 16px
  lg: 1.125rem,   // 18px
  xl: 1.25rem,    // 20px
  '2xl': 1.5rem,  // 24px
  '3xl': 1.875rem, // 30px
  '4xl': 2.25rem  // 36px
);
```

### Breakpoints
```scss
$breakpoints: (
  sm: 640px,      // Mobile landscape
  md: 768px,      // Tablet portrait
  lg: 1024px,     // Tablet landscape
  xl: 1280px,     // Desktop
  '2xl': 1536px   // Large desktop
);
```

## 🌓 Theme Switching

### CSS Custom Properties
All design tokens are exposed as CSS custom properties for dynamic theming:

```scss
:root {
  --background: #{map-get(map-get($colors, light), background)};
  --foreground: #{map-get(map-get($colors, light), foreground)};
  --primary: #{map-get(map-get($colors, light), primary)};
  // ... more properties
}

.dark {
  --background: #{map-get(map-get($colors, dark), background)};
  --foreground: #{map-get(map-get($colors, dark), foreground)};
  --primary: #{map-get(map-get($colors, dark), primary)};
  // ... more properties
}
```

### Usage in Components
```scss
.my-component {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}
```

## 🧩 UI Components

### Button System
```scss
// Base button
.btn {
  @include button-base;
  // ... base styles
}

// Variants
.btn-primary { @include button-variant(primary); }
.btn-secondary { @include button-variant(secondary); }
.btn-outline { @include button-variant(outline); }
.btn-ghost { /* ghost styles */ }
.btn-destructive { /* destructive styles */ }

// Sizes
.btn-sm { /* small styles */ }
.btn-lg { /* large styles */ }
.btn-xl { /* extra large styles */ }

// Icon button
.btn-icon { /* icon button styles */ }
```

### Form Components
```scss
.input { /* input styles */ }
.textarea { /* textarea styles */ }
.select { /* select styles */ }

// Size variants
.input-sm { /* small styles */ }
.input-lg { /* large styles */ }
```

### Card Components
```scss
.card {
  .card-header {
    .card-title { /* title styles */ }
    .card-description { /* description styles */ }
  }
  .card-content { /* content styles */ }
  .card-footer { /* footer styles */ }
}
```

### Badge Components
```scss
.badge {
  &.badge-primary { /* primary styles */ }
  &.badge-secondary { /* secondary styles */ }
  &.badge-destructive { /* destructive styles */ }
  &.badge-outline { /* outline styles */ }
  
  &.badge-sm { /* small styles */ }
  &.badge-lg { /* large styles */ }
}
```

### Alert Components
```scss
.alert {
  .alert-title { /* title styles */ }
  .alert-description { /* description styles */ }
  
  &.alert-default { /* default styles */ }
  &.alert-destructive { /* destructive styles */ }
  &.alert-warning { /* warning styles */ }
  &.alert-info { /* info styles */ }
  &.alert-success { /* success styles */ }
}
```

### Dialog Components
```scss
.dialog-overlay { /* overlay styles */ }
.dialog-content {
  .dialog-header { /* header styles */ }
  .dialog-body { /* body styles */ }
  .dialog-footer { /* footer styles */ }
}
```

### Navigation Components
```scss
.navigation-menu {
  .navigation-list {
    .navigation-item {
      .navigation-link { /* link styles */ }
      .navigation-link-active { /* active styles */ }
    }
  }
}
```

### Layout Components
```scss
.container { /* responsive container */ }
.grid { /* grid system */ }
.flex { /* flexbox utilities */ }
```

## 🔧 Mixins

### Theme Management
```scss
@mixin theme-colors($theme) {
  @each $name, $value in map-get($colors, $theme) {
    --#{$name}: #{$value};
  }
}
```

### Responsive Design
```scss
@mixin responsive($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// Usage
@include responsive(md) {
  .component {
    font-size: 1.2em;
  }
}
```

### Component Patterns
```scss
@mixin button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // ... more base styles
}

@mixin button-variant($variant: primary) {
  @if $variant == primary {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }
  // ... more variants
}
```

### Modern Effects
```scss
@mixin glass-effect($opacity: 0.1) {
  background: rgba(255, 255, 255, $opacity);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@mixin text-gradient($start-color, $end-color) {
  background: linear-gradient(135deg, $start-color, $end-color);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## 📱 Responsive Design

### Mobile-First Approach
```scss
// Base styles (mobile)
.component {
  font-size: 1rem;
  padding: 1rem;
}

// Tablet and up
@include responsive(md) {
  .component {
    font-size: 1.2rem;
    padding: 1.5rem;
  }
}

// Desktop and up
@include responsive(lg) {
  .component {
    font-size: 1.4rem;
    padding: 2rem;
  }
}
```

### Grid System
```scss
.grid {
  &.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  &.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  &.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  
  @include responsive(md) {
    &.md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    &.md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
}
```

## 🎯 Usage Examples

### Basic Button
```html
<button class="btn btn-primary">Click me</button>
<button class="btn btn-secondary btn-lg">Large Button</button>
<button class="btn btn-outline btn-sm">Small Outline</button>
```

### Card Layout
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <p class="card-description">Card description</p>
  </div>
  <div class="card-content">
    <p>Card content goes here</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Form Layout
```html
<form class="form">
  <div class="form-group">
    <label class="form-label">Email</label>
    <input type="email" class="input" placeholder="Enter your email">
    <p class="form-description">We'll never share your email</p>
  </div>
  <div class="form-actions">
    <button type="submit" class="btn btn-primary">Submit</button>
    <button type="button" class="btn btn-secondary">Cancel</button>
  </div>
</form>
```

### Alert Messages
```html
<div class="alert alert-success">
  <div class="alert-title">Success!</div>
  <div class="alert-description">Your changes have been saved.</div>
</div>

<div class="alert alert-warning">
  <div class="alert-title">Warning</div>
  <div class="alert-description">Please review your input.</div>
</div>
```

### Navigation Menu
```html
<nav class="navigation-menu">
  <ul class="navigation-list">
    <li class="navigation-item">
      <a href="#" class="navigation-link navigation-link-active">Home</a>
    </li>
    <li class="navigation-item">
      <a href="#" class="navigation-link">About</a>
    </li>
    <li class="navigation-item">
      <a href="#" class="navigation-link">Contact</a>
    </li>
  </ul>
</nav>
```

## 🚀 Advanced Features

### Custom Properties
```scss
// Define custom properties
:root {
  --custom-color: #ff6b6b;
  --custom-spacing: 2rem;
}

// Use in components
.custom-component {
  color: var(--custom-color);
  margin: var(--custom-spacing);
}
```

### CSS-in-JS Style
```scss
// Dynamic class generation
@for $i from 1 through 12 {
  .col-#{$i} {
    grid-column: span #{$i};
  }
}

// Conditional styles
.component {
  @if $theme == 'dark' {
    background-color: var(--background-dark);
  } @else {
    background-color: var(--background-light);
  }
}
```

### Animation System
```scss
// Keyframe animations
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Animation classes
.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
```

## 🔍 Browser Support

### CSS Features
- **CSS Custom Properties**: Modern browsers (IE11+ with polyfill)
- **CSS Grid**: Modern browsers (IE11+ with polyfill)
- **Flexbox**: Modern browsers (IE10+)
- **Backdrop Filter**: Modern browsers (Safari 9+, Chrome 76+)

### Fallbacks
```scss
.component {
  background-color: #ffffff; // Fallback
  background-color: var(--background); // Modern browsers
  
  @supports (backdrop-filter: blur(10px)) {
    backdrop-filter: blur(10px);
  }
}
```

## 📚 Best Practices

### 1. Use Design Tokens
```scss
// ✅ Good
.component {
  padding: var(--spacing-md);
  color: var(--primary);
}

// ❌ Bad
.component {
  padding: 1rem;
  color: #007acc;
}
```

### 2. Leverage Mixins
```scss
// ✅ Good
.button {
  @include button-base;
  @include button-variant(primary);
}

// ❌ Bad
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // ... repeat for every button
}
```

### 3. Mobile-First Responsiveness
```scss
// ✅ Good
.component {
  font-size: 1rem; // Mobile first
  
  @include responsive(md) {
    font-size: 1.2rem; // Tablet and up
  }
}

// ❌ Bad
.component {
  font-size: 1.2rem; // Desktop first
  
  @media (max-width: 767px) {
    font-size: 1rem; // Mobile override
  }
}
```

### 4. Semantic Class Names
```scss
// ✅ Good
.btn-primary
.card-header
.navigation-link

// ❌ Bad
.blue-button
.top-section
.nav-item
```

## 🎨 Customization

### Adding New Colors
```scss
// In _variables.scss
$colors: (
  light: (
    // ... existing colors
    custom: oklch(0.6 0.2 45), // New custom color
  ),
  dark: (
    // ... existing colors
    custom: oklch(0.4 0.2 45), // Dark variant
  )
);

// In _theme.scss
:root {
  // ... existing properties
  --custom: #{map-get(map-get($colors, light), custom)};
}

.dark {
  // ... existing properties
  --custom: #{map-get(map-get($colors, dark), custom)};
}
```

### Adding New Components
```scss
// In _ui-components.scss
.custom-component {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  
  &:hover {
    background-color: var(--muted);
  }
  
  // Variants
  &.custom-component-large {
    padding: var(--spacing-lg);
    font-size: var(--font-size-lg);
  }
}
```

### Extending Mixins
```scss
// In _mixins.scss
@mixin custom-effect($intensity: 0.1) {
  box-shadow: 0 0 20px rgba(0, 0, 0, $intensity);
  transform: scale(1.02);
  transition: all 0.3s ease;
}

// Usage
.component {
  @include custom-effect(0.2);
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. CSS Custom Properties Not Working
```scss
// Ensure proper fallbacks
.component {
  background-color: #ffffff; // Fallback
  background-color: var(--background); // Modern browsers
}
```

#### 2. SASS Import Errors
```scss
// Check import order
@import 'variables';    // First
@import 'mixins';       // Second
@import 'theme';        // Third
@import 'ui-components'; // Fourth
```

#### 3. Theme Switching Issues
```scss
// Ensure proper class application
.dark {
  // All dark theme variables
}

// Check JavaScript theme switching
document.documentElement.classList.add('dark');
```

#### 4. Responsive Issues
```scss
// Verify breakpoint usage
@include responsive(md) {
  // Styles for md breakpoint and up
}

// Check viewport meta tag
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## 📖 Resources

- **SASS Documentation**: https://sass-lang.com/
- **CSS Custom Properties**: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- **OKLCH Colors**: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
- **CSS Grid**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
- **Flexbox**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout

---

**Status**: ✅ **Complete** - Full theme system and UI component library implemented!
