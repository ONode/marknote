# 🎨 Complete Icons & Logos System

## Overview

This document describes the comprehensive icons and logos system that includes Next.js CSS logos, technology icons, and a complete icon library. The system provides both SASS-based icon styles and React components for easy integration.

## 🏗️ Architecture

### File Structure
```
src/
├── styles/
│   ├── _icons.scss          # SASS-based icon styles and animations
│   └── main.scss           # Main SASS file (imports icons)
└── components/
    └── icons.tsx           # React icon components
```

### Import Order
The icons system is integrated into the main SASS architecture:
1. `_variables.scss` - Design tokens
2. `_mixins.scss` - Reusable patterns
3. `_theme.scss` - Theme system
4. `_ui-components.scss` - UI components
5. `_icons.scss` - Icon styles and animations
6. `main.scss` - Main styles (imports everything)

## 🎯 Next.js CSS Logos

### Next.js Logo
The system includes the official Next.js logo with proper styling:

```scss
.next-logo {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
  
  .next-logo-path {
    fill: currentColor;
    transition: fill 0.2s ease;
  }
  
  &:hover .next-logo-path {
    fill: var(--primary);
  }
  
  // Size variants
  &.next-logo-sm { width: 1em; height: 1em; }
  &.next-logo-lg { width: 2em; height: 2em; }
  &.next-logo-xl { width: 3em; height: 3em; }
}
```

### Vercel Logo
Includes the Vercel logo (Next.js parent company):

```scss
.vercel-logo {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
  
  .vercel-logo-path {
    fill: currentColor;
    transition: fill 0.2s ease;
  }
  
  &:hover .vercel-logo-path {
    fill: var(--primary);
  }
}
```

## 🧩 Icon Base System

### Core Icon Classes
All icons inherit from the base `.icon` class:

```scss
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 0;
  overflow: hidden;
}
```

### Size Variants
Consistent sizing across all icons:

```scss
.icon {
  &.icon-xs { width: 0.75em; height: 0.75em; }      // 12px
  &.icon-sm { width: 0.875em; height: 0.875em; }     // 14px
  &.icon-base { width: 1em; height: 1em; }           // 16px
  &.icon-lg { width: 1.25em; height: 1.25em; }       // 20px
  &.icon-xl { width: 1.5em; height: 1.5em; }         // 24px
  &.icon-2xl { width: 2em; height: 2em; }            // 32px
  &.icon-3xl { width: 3em; height: 3em; }            // 48px
}
```

### Color Variants
Semantic color system for icons:

```scss
.icon {
  &.icon-primary { color: var(--primary); }
  &.icon-secondary { color: var(--secondary); }
  &.icon-muted { color: var(--muted-foreground); }
  &.icon-destructive { color: var(--destructive); }
  &.icon-success { color: var(--chart-2); }
  &.icon-warning { color: #f59e0b; }
  &.icon-info { color: var(--chart-3); }
}
```

## 🚀 Technology Icons

### React Icon
Animated React logo with orbital rings:

```scss
.icon-react {
  position: relative;
  
  &::before {
    // Main React circle
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
  
  .icon-react-orbital {
    // Orbital rings
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1.5em;
    height: 1.5em;
    border: 1px solid currentColor;
    border-radius: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
  }
}
```

### TypeScript Icon
Official TypeScript branding:

```scss
.icon-typescript {
  position: relative;
  
  &::before {
    // TypeScript blue background
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #3178c6;
    border-radius: 0.25em;
  }
  
  &::after {
    // "TS" text
    content: 'TS';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 0.6em;
    font-weight: bold;
    font-family: var(--font-mono);
  }
}
```

### Bun Icon
Bun runtime logo with bread emoji:

```scss
.icon-bun {
  position: relative;
  
  &::before {
    // Bun background
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fbf2e4;
    border-radius: 50%;
    border: 2px solid #f7931e;
  }
  
  &::after {
    // Bread emoji
    content: '🍞';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8em;
  }
}
```

## 🎨 Common UI Icons

### Navigation Icons
Essential navigation patterns:

```scss
.icon-menu {
  position: relative;
  
  &::before,
  &::after,
  .icon-menu-line {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: currentColor;
    transition: all 0.2s ease;
  }
  
  &::before { top: 0.25em; }
  .icon-menu-line { top: 50%; transform: translateY(-50%); }
  &::after { bottom: 0.25em; }
  
  // Animated menu icon
  &.icon-menu-animated {
    &::before {
      transform: rotate(45deg);
      top: 50%;
      margin-top: -1px;
    }
    
    .icon-menu-line { opacity: 0; }
    
    &::after {
      transform: rotate(-45deg);
      bottom: 50%;
      margin-bottom: -1px;
    }
  }
}
```

### Action Icons
Common action patterns:

```scss
.icon-close {
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: currentColor;
    transition: all 0.2s ease;
  }
  
  &::before { transform: translate(-50%, -50%) rotate(45deg); }
  &::after { transform: translate(-50%, -50%) rotate(-45deg); }
  
  &:hover { transform: scale(1.1); }
}

.icon-check {
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0.25em;
    left: 0.25em;
    width: 0.5em;
    height: 0.75em;
    border: 2px solid currentColor;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }
}
```

### Directional Icons
Arrow and chevron patterns:

```scss
.icon-chevron {
  &-up,
  &-down,
  &-left,
  &-right {
    position: relative;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0.5em;
      height: 2px;
      background-color: currentColor;
      transition: all 0.2s ease;
    }
    
    &::before { transform: translate(-50%, -50%) rotate(45deg); }
    &::after { transform: translate(-50%, -50%) rotate(-45deg); }
  }
  
  &-up { transform: rotate(0deg); }
  &-down { transform: rotate(180deg); }
  &-left { transform: rotate(90deg); }
  &-right { transform: rotate(270deg); }
}
```

## 🔄 Loading and Progress Icons

### Spinner Icon
Animated loading spinner:

```scss
.icon-spinner {
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: icon-spin 1s linear infinite;
}

@keyframes icon-spin {
  to { transform: rotate(360deg); }
}
```

### Loading Dots
Three-dot loading animation:

```scss
.icon-loading {
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.5em;
    height: 0.5em;
    border-radius: 50%;
    background-color: currentColor;
    animation: icon-loading 1.4s ease-in-out infinite both;
  }
  
  &::before {
    margin-left: -0.75em;
    animation-delay: -0.32s;
  }
  
  &::after {
    margin-left: 0.25em;
    animation-delay: -0.16s;
  }
}

@keyframes icon-loading {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
```

## 📁 File and Folder Icons

### File Icon
Generic file representation:

```scss
.icon-file {
  position: relative;
  
  &::before {
    // File outline
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 2px solid currentColor;
    border-radius: 0.25em;
    background-color: transparent;
  }
  
  &::after {
    // File corner fold
    content: '';
    position: absolute;
    top: 0.125em;
    right: 0.125em;
    width: 0.5em;
    height: 0.5em;
    background-color: currentColor;
    border-radius: 0.125em;
  }
  
  // File type variants
  &.icon-file-text::after {
    background-color: transparent;
    border: 2px solid currentColor;
    width: 0.75em;
    height: 0.5em;
  }
  
  &.icon-file-image::after {
    background: linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%);
  }
  
  &.icon-file-code::after {
    background: repeating-linear-gradient(
      0deg,
      currentColor,
      currentColor 2px,
      transparent 2px,
      transparent 4px
    );
  }
}
```

### Folder Icon
Folder representation:

```scss
.icon-folder {
  position: relative;
  
  &::before {
    // Folder body
    content: '';
    position: absolute;
    top: 0.25em;
    left: 0;
    width: 100%;
    height: 0.75em;
    border: 2px solid currentColor;
    border-radius: 0.25em 0.25em 0 0;
    background-color: transparent;
  }
  
  &::after {
    // Folder tab
    content: '';
    position: absolute;
    top: 0.125em;
    left: 0.125em;
    width: 0.5em;
    height: 0.25em;
    border: 2px solid currentColor;
    border-radius: 0.125em 0.125em 0 0;
    background-color: currentColor;
  }
  
  &.icon-folder-open::before {
    border-radius: 0.25em;
    height: 100%;
  }
}
```

## 🌐 Social Media Icons

### GitHub Icon
GitHub logo with hover effects:

```scss
.icon-github {
  .icon-github-path {
    fill: currentColor;
    transition: fill 0.2s ease;
  }
  
  &:hover .icon-github-path {
    fill: var(--primary);
  }
}
```

### Twitter Icon
Twitter/X logo:

```scss
.icon-twitter {
  .icon-twitter-path {
    fill: currentColor;
    transition: fill 0.2s ease;
  }
  
  &:hover .icon-twitter-path {
    fill: var(--primary);
  }
}
```

### LinkedIn Icon
LinkedIn logo:

```scss
.icon-linkedin {
  .icon-linkedin-path {
    fill: currentColor;
    transition: fill 0.2s ease;
  }
  
  &:hover .icon-linkedin-path {
    fill: var(--primary);
  }
}
```

## 🎭 Icon Animations

### Animation Classes
Pre-built animation patterns:

```scss
.icon-animate {
  &-spin {
    animation: icon-spin 1s linear infinite;
  }
  
  &-pulse {
    animation: icon-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  &-bounce {
    animation: icon-bounce 1s infinite;
  }
  
  &-shake {
    animation: icon-shake 0.5s ease-in-out infinite;
  }
}

@keyframes icon-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes icon-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-0.25em); }
}

@keyframes icon-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-0.125em); }
  75% { transform: translateX(0.125em); }
}
```

## 🔧 Icon Utilities

### Icon with Text
Text and icon combination:

```scss
.icon-text {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  
  .icon-text-icon {
    flex-shrink: 0;
  }
  
  .icon-text-content {
    flex: 1;
  }
}
```

### Icon Button
Clickable icon wrapper:

```scss
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius);
  background-color: transparent;
  border: 1px solid var(--border);
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--muted);
    border-color: var(--border);
  }
  
  &:focus {
    outline: none;
    border-color: var(--ring);
    box-shadow: 0 0 0 2px var(--ring);
  }
  
  // Size variants
  &.icon-button-sm { width: 2rem; height: 2rem; }
  &.icon-button-lg { width: 3rem; height: 3rem; }
  
  // Color variants
  &.icon-button-primary {
    background-color: var(--primary);
    border-color: var(--primary);
    color: var(--primary-foreground);
    
    &:hover {
      background-color: color-mix(in srgb, var(--primary) 90%, black);
    }
  }
}
```

## 📱 Responsive Icons

### Breakpoint-Specific Sizing
Responsive icon sizing:

```scss
@include responsive(sm) {
  .icon {
    &.sm\:icon-lg {
      width: 1.25em;
      height: 1.25em;
    }
    
    &.sm\:icon-xl {
      width: 1.5em;
      height: 1.5em;
    }
  }
}

@include responsive(md) {
  .icon {
    &.md\:icon-lg {
      width: 1.25em;
      height: 1.25em;
    }
    
    &.md\:icon-xl {
      width: 1.5em;
      height: 1.5em;
    }
    
    &.md\:icon-2xl {
      width: 2em;
      height: 2em;
    }
  }
}
```

## ⚛️ React Components

### Icon Props Interface
TypeScript interface for all icons:

```typescript
export interface IconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  color?: 'primary' | 'secondary' | 'muted' | 'destructive' | 'success' | 'warning' | 'info';
  onClick?: () => void;
  title?: string;
}
```

### Next.js Logo Component
```typescript
export const NextLogo: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Next.js'
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    base: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
    '3xl': 'w-24 h-24'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted-foreground',
    destructive: 'text-destructive',
    success: 'text-chart-2',
    warning: 'text-yellow-600',
    info: 'text-chart-3'
  };

  return (
    <svg
      className={`next-logo ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 128 128"
      fill="currentColor"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        className="next-logo-path"
        d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"
      />
    </svg>
  );
};
```

### Technology Icons
```typescript
export const ReactIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'React'
}) => {
  // ... size and color classes
  
  return (
    <svg
      className={`icon-react ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 128 128"
      fill="currentColor"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <g>
        <circle cx="64" cy="64" r="11.4" className="icon-react-orbital"/>
        <g className="icon-react-orbital">
          <circle cx="64" cy="64" r="11.4"/>
          <circle cx="64" cy="64" r="11.4" transform="rotate(60 64 64)"/>
          <circle cx="64" cy="64" r="11.4" transform="rotate(120 64 64)"/>
        </g>
      </g>
    </svg>
  );
};
```

## 🎯 Usage Examples

### SASS Usage
```scss
// Basic icon
.my-icon {
  @extend .icon;
  @extend .icon-lg;
  @extend .icon-primary;
}

// Custom icon styling
.custom-icon {
  @extend .icon;
  @extend .icon-xl;
  color: var(--custom-color);
  
  &:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease;
  }
}
```

### React Usage
```tsx
import { NextLogo, ReactIcon, MenuIcon } from './components/icons';

function Header() {
  return (
    <header className="flex items-center gap-4 p-4">
      <NextLogo size="lg" color="primary" />
      <h1 className="text-xl font-bold">My App</h1>
      <MenuIcon 
        size="base" 
        color="muted" 
        onClick={() => setMenuOpen(true)}
        className="ml-auto"
      />
    </header>
  );
}

function TechStack() {
  return (
    <div className="flex items-center gap-2">
      <ReactIcon size="sm" color="info" />
      <TypeScriptIcon size="sm" color="info" />
      <BunIcon size="sm" color="warning" />
    </div>
  );
}
```

### HTML Usage
```html
<!-- Basic icon -->
<i class="icon icon-lg icon-primary icon-check"></i>

<!-- Next.js logo -->
<div class="next-logo next-logo-lg"></div>

<!-- Animated menu icon -->
<button class="icon-menu icon-menu-animated"></button>

<!-- Icon with text -->
<div class="icon-text">
  <i class="icon-text-icon icon icon-sm icon-primary icon-file"></i>
  <span class="icon-text-content">Document.pdf</span>
</div>

<!-- Icon button -->
<button class="icon-button icon-button-primary">
  <i class="icon icon-sm icon-primary-foreground icon-plus"></i>
</button>
```

## 🔍 Browser Support

### CSS Features
- **CSS Animations**: Modern browsers (IE10+)
- **CSS Transforms**: Modern browsers (IE9+)
- **CSS Transitions**: Modern browsers (IE10+)
- **CSS Custom Properties**: Modern browsers (IE11+ with polyfill)

### SVG Features
- **SVG Support**: Modern browsers (IE9+)
- **SVG Animations**: Modern browsers (IE10+)
- **SVG Filters**: Modern browsers (IE10+)

## 📚 Best Practices

### 1. Use Semantic Colors
```scss
// ✅ Good
.icon-success { color: var(--chart-2); }
.icon-warning { color: #f59e0b; }

// ❌ Bad
.icon-green { color: green; }
.icon-yellow { color: yellow; }
```

### 2. Leverage Size Variants
```scss
// ✅ Good
.icon-lg { width: 1.25em; height: 1.25em; }

// ❌ Bad
.custom-size { width: 20px; height: 20px; }
```

### 3. Use Animation Classes
```scss
// ✅ Good
.icon-spinner { animation: icon-spin 1s linear infinite; }

// ❌ Bad
.custom-spinner { animation: spin 1s linear infinite; }
```

### 4. Maintain Accessibility
```tsx
// ✅ Good
<NextLogo title="Next.js" aria-label="Next.js Logo" />

// ❌ Bad
<NextLogo />
```

## 🎨 Customization

### Adding New Icons
```scss
// In _icons.scss
.icon-custom {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: currentColor;
    border-radius: 50%;
  }
  
  // Variants
  &.icon-custom-filled::before {
    background-color: currentColor;
  }
  
  &.icon-custom-outline::before {
    background-color: transparent;
    border: 2px solid currentColor;
  }
}
```

### Adding New React Components
```typescript
// In icons.tsx
export const CustomIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Custom'
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    base: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
    '3xl': 'w-24 h-24'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted-foreground',
    destructive: 'text-destructive',
    success: 'text-chart-2',
    warning: 'text-yellow-600',
    info: 'text-chart-3'
  };

  return (
    <svg
      className={`icon-custom ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* SVG path data */}
    </svg>
  );
};
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Icons Not Displaying
```scss
// Check if icon classes are imported
@import 'icons';

// Ensure proper inheritance
.my-icon {
  @extend .icon;
  @extend .icon-lg;
}
```

#### 2. Icon Sizing Issues
```scss
// Verify size classes
.icon-lg {
  width: 1.25em !important;
  height: 1.25em !important;
}

// Check parent container
.icon-container {
  font-size: 16px; // Base font size for em calculations
}
```

#### 3. Color Not Applying
```scss
// Ensure color variables are defined
:root {
  --primary: #007acc;
  --secondary: #6c757d;
}

// Check color inheritance
.icon-primary {
  color: var(--primary) !important;
}
```

#### 4. Animations Not Working
```scss
// Verify keyframe definitions
@keyframes icon-spin {
  to { transform: rotate(360deg); }
}

// Check animation properties
.icon-spinner {
  animation: icon-spin 1s linear infinite;
  animation-play-state: running;
}
```

## 📖 Resources

- **SVG Reference**: https://developer.mozilla.org/en-US/docs/Web/SVG
- **CSS Animations**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations
- **Icon Design Principles**: https://material.io/design/iconography
- **Accessibility Guidelines**: https://www.w3.org/WAI/ARIA/apg/

---

**Status**: ✅ **Complete** - Full icons and logos system implemented with Next.js CSS logos!
