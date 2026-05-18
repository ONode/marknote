# 🏗️ Complete Layout System with Toaster Integration

## Overview

This document describes the comprehensive layout system that provides structured, reusable layout components with integrated toast notifications. The system includes a main layout wrapper, specialized layout components, and seamless toaster integration for user feedback.

## 🏗️ Architecture

### File Structure
```
src/
├── components/
│   ├── layout.tsx           # Main layout system with toaster
│   ├── theme-provider.tsx   # Theme context provider
│   └── ui/
│       └── sonner.tsx       # Toast component wrapper
└── styles/
    └── main.scss           # Main styles (imports all partials)
```

### Component Hierarchy
```
Layout (Root)
├── ThemeProvider
├── Header (Optional)
├── Main Content
├── Footer (Optional)
└── Toaster (Global)
```

## 🎯 Main Layout Component

### Basic Usage
```tsx
import Layout from './components/layout';

function App() {
  return (
    <Layout defaultTheme="system" showHeader={true} showFooter={true}>
      <div>Your content here</div>
    </Layout>
  );
}
```

### Props Interface
```typescript
export interface LayoutProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}
```

### Features
- **Theme Integration**: Automatically wraps content with ThemeProvider
- **Header/Footer Toggle**: Optional header and footer components
- **Toaster Integration**: Global toast notifications
- **Responsive Design**: Mobile-first responsive layout
- **Accessibility**: Proper semantic HTML structure

## 🎨 Header Component

### Features
- **Sticky Positioning**: Stays at top during scroll
- **Backdrop Blur**: Modern glassmorphism effect
- **Navigation Links**: Built-in navigation structure
- **Brand Logo**: Customizable brand identity
- **Responsive**: Mobile-friendly navigation

### Structure
```tsx
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-14 items-center">
    {/* Brand Logo */}
    <div className="mr-4 flex">
      <a className="mr-6 flex items-center space-x-2" href="/">
        <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
          <span className="text-primary-foreground text-sm font-bold">M</span>
        </div>
        <span className="hidden font-bold sm:inline-block">
          Markdown Viewer
        </span>
      </a>
    </div>
    
    {/* Navigation */}
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <a href="/docs">Documentation</a>
      <a href="/examples">Examples</a>
      <a href="https://github.com/your-repo">GitHub</a>
    </nav>
  </div>
</header>
```

## 🦶 Footer Component

### Features
- **Technology Credits**: Built with Bun, React, TypeScript
- **Responsive Layout**: Adapts to mobile and desktop
- **External Links**: GitHub repository links
- **Copyright Notice**: Professional footer structure

### Structure
```tsx
<footer className="border-t bg-background">
  <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
    <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
      <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
        Built with{" "}
        <a href="https://bun.sh" target="_blank" rel="noreferrer">
          Bun
        </a>
        ,{" "}
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          React
        </a>
        , and{" "}
        <a href="https://www.typescriptlang.org" target="_blank" rel="noreferrer">
          TypeScript
        </a>
        .
      </p>
    </div>
    <div className="flex items-center gap-4">
      <p className="text-sm text-muted-foreground">
        © 2024 Markdown Viewer. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

## 🔔 Toaster Integration

### Global Toaster
The toaster is automatically included in every layout:

```tsx
<Toaster
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      background: 'var(--background)',
      color: 'var(--foreground)',
      border: '1px solid var(--border)',
    },
  }}
/>
```

### Toast Usage
```tsx
import { toast } from 'sonner';

// Success toast
toast.success('Operation completed!', {
  description: 'Your changes have been saved successfully.',
});

// Error toast
toast.error('Something went wrong!', {
  description: 'Please try again or contact support.',
});

// Info toast
toast.info('New update available!', {
  description: 'Version 2.0 is now available for download.',
});

// Warning toast
toast.warning('Please review your input!', {
  description: 'Some fields may need attention.',
});
```

### Toast Types
- **Success**: Green styling for successful operations
- **Error**: Red styling for errors and failures
- **Info**: Blue styling for informational messages
- **Warning**: Yellow styling for warnings and cautions

## 📄 Page Layout Component

### Basic Usage
```tsx
import { PageLayout } from './components/layout';

function MyPage() {
  return (
    <PageLayout
      title="Welcome to Our App"
      description="A comprehensive guide to getting started"
      maxWidth="lg"
    >
      <div>Page content here</div>
    </PageLayout>
  );
}
```

### Props Interface
```typescript
export interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  container?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}
```

### Max Width Options
- **sm**: 384px (max-w-sm)
- **md**: 448px (max-w-md)
- **lg**: 512px (max-w-lg)
- **xl**: 576px (max-w-xl)
- **2xl**: 672px (max-w-2xl)
- **full**: 100% (max-w-full)

## 🎯 Section Layout Component

### Basic Usage
```tsx
import { SectionLayout } from './components/layout';

function MySection() {
  return (
    <SectionLayout
      title="Features"
      description="Discover what makes our app special"
      padding="lg"
    >
      <div>Section content here</div>
    </SectionLayout>
  );
}
```

### Props Interface
```typescript
export interface SectionLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}
```

### Padding Options
- **none**: No padding
- **sm**: 16px (py-4)
- **md**: 32px (py-8)
- **lg**: 48px (py-12)
- **xl**: 64px (py-16)

## 🃏 Card Layout Component

### Basic Usage
```tsx
import { CardLayout } from './components/layout';

function MyCard() {
  return (
    <CardLayout
      title="Card Title"
      description="Card description text"
      padding="lg"
      shadow="lg"
    >
      <div>Card content here</div>
    </CardLayout>
  );
}
```

### Props Interface
```typescript
export interface CardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}
```

### Shadow Options
- **none**: No shadow
- **sm**: Small shadow (shadow-sm)
- **md**: Medium shadow (shadow-md)
- **lg**: Large shadow (shadow-lg)
- **xl**: Extra large shadow (shadow-xl)

## 🎲 Grid Layout Component

### Basic Usage
```tsx
import { GridLayout } from './components/layout';

function MyGrid() {
  return (
    <GridLayout cols={3} gap="lg">
      <div>Grid item 1</div>
      <div>Grid item 2</div>
      <div>Grid item 3</div>
    </GridLayout>
  );
}
```

### Props Interface
```typescript
export interface GridLayoutProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
```

### Column Options
- **1-6**: Standard grid columns
- **12**: Bootstrap-style 12-column grid

### Gap Options
- **none**: No gap
- **sm**: 16px gap (gap-4)
- **md**: 24px gap (gap-6)
- **lg**: 32px gap (gap-8)
- **xl**: 40px gap (gap-10)

## 🔄 Flex Layout Component

### Basic Usage
```tsx
import { FlexLayout } from './components/layout';

function MyFlex() {
  return (
    <FlexLayout
      direction="row"
      align="center"
      justify="between"
      gap="md"
      wrap={true}
    >
      <div>Flex item 1</div>
      <div>Flex item 2</div>
    </FlexLayout>
  );
}
```

### Props Interface
```typescript
export interface FlexLayoutProps {
  children: ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  className?: string;
}
```

### Direction Options
- **row**: Horizontal layout (default)
- **col**: Vertical layout
- **row-reverse**: Reverse horizontal layout
- **col-reverse**: Reverse vertical layout

### Alignment Options
- **start**: Align to start
- **end**: Align to end
- **center**: Center alignment
- **baseline**: Baseline alignment
- **stretch**: Stretch to fill

### Justify Options
- **start**: Justify to start
- **end**: Justify to end
- **center**: Center justification
- **between**: Space between items
- **around**: Space around items
- **evenly**: Even space distribution

## 📦 Container Layout Component

### Basic Usage
```tsx
import { ContainerLayout } from './components/layout';

function MyContainer() {
  return (
    <ContainerLayout
      maxWidth="lg"
      padding="md"
      center={true}
    >
      <div>Container content here</div>
    </ContainerLayout>
  );
}
```

### Props Interface
```typescript
export interface ContainerLayoutProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  className?: string;
}
```

### Features
- **Max Width Control**: Responsive container sizing
- **Padding Options**: Customizable horizontal padding
- **Centering**: Optional horizontal centering
- **Responsive**: Adapts to different screen sizes

## 🎨 Styling Integration

### CSS Custom Properties
The layout system uses CSS custom properties for theming:

```scss
:root {
  --background: #ffffff;
  --foreground: #171717;
  --card: #ffffff;
  --card-foreground: #171717;
  --border: #e5e5e5;
  --primary: #171717;
  --primary-foreground: #ffffff;
  --muted: #f5f5f5;
  --muted-foreground: #737373;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --card: #0a0a0a;
  --card-foreground: #ededed;
  --border: #262626;
  --primary: #ededed;
  --primary-foreground: #0a0a0a;
  --muted: #262626;
  --muted-foreground: #a3a3a3;
}
```

### Utility Classes
The system provides utility classes for common patterns:

```scss
// Spacing utilities
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }

// Margin utilities
.m-4 { margin: 1rem; }
.m-6 { margin: 1.5rem; }
.m-8 { margin: 2rem; }

// Flexbox utilities
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
```

## 📱 Responsive Design

### Breakpoint System
```scss
$breakpoints: (
  sm: 640px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
  '2xl': 1536px
);
```

### Responsive Utilities
```tsx
// Responsive grid
<GridLayout cols={1} className="md:grid-cols-2 lg:grid-cols-3">
  {/* Content */}
</GridLayout>

// Responsive padding
<SectionLayout padding="md" className="lg:py-16">
  {/* Content */}
</SectionLayout>

// Responsive max-width
<PageLayout maxWidth="lg" className="xl:max-w-4xl">
  {/* Content */}
</PageLayout>
```

## 🔧 Advanced Usage

### Custom Layout Combinations
```tsx
function ComplexLayout() {
  return (
    <Layout showHeader={true} showFooter={false}>
      <PageLayout title="Dashboard" maxWidth="full">
        <GridLayout cols={12} gap="lg">
          {/* Sidebar */}
          <div className="col-span-3">
            <CardLayout title="Navigation" padding="md">
              <nav>Sidebar content</nav>
            </CardLayout>
          </div>
          
          {/* Main Content */}
          <div className="col-span-9">
            <SectionLayout title="Main Content" padding="lg">
              <CardLayout title="Content" padding="lg" shadow="lg">
                <div>Main content area</div>
              </CardLayout>
            </SectionLayout>
          </div>
        </GridLayout>
      </PageLayout>
    </Layout>
  );
}
```

### Dynamic Layouts
```tsx
function DynamicLayout({ showSidebar, showHeader }) {
  return (
    <Layout showHeader={showHeader}>
      <PageLayout maxWidth="full">
        <GridLayout cols={showSidebar ? 12 : 1} gap="lg">
          {showSidebar && (
            <div className="col-span-3">
              <CardLayout title="Sidebar">Sidebar content</CardLayout>
            </div>
          )}
          
          <div className={showSidebar ? "col-span-9" : "col-span-1"}>
            <SectionLayout title="Content">Main content</SectionLayout>
          </div>
        </GridLayout>
      </PageLayout>
    </Layout>
  );
}
```

### Toast Integration Examples
```tsx
function FormWithToasts() {
  const handleSubmit = async (data) => {
    try {
      await submitForm(data);
      toast.success('Form submitted successfully!', {
        description: 'Your data has been saved.',
      });
    } catch (error) {
      toast.error('Submission failed!', {
        description: error.message,
      });
    }
  };

  const handleValidation = () => {
    toast.warning('Please check your input!', {
      description: 'Some fields may need attention.',
    });
  };

  return (
    <CardLayout title="Contact Form" padding="lg">
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <FlexLayout direction="row" gap="md" justify="end">
          <button type="button" onClick={handleValidation}>
            Validate
          </button>
          <button type="submit">Submit</button>
        </FlexLayout>
      </form>
    </CardLayout>
  );
}
```

## 🧪 Testing

### Component Testing
```tsx
import { render, screen } from '@testing-library/react';
import Layout from './components/layout';

test('renders layout with header and footer', () => {
  render(
    <Layout showHeader={true} showFooter={true}>
      <div>Test content</div>
    </Layout>
  );
  
  expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
  expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
  expect(screen.getByText('Test content')).toBeInTheDocument();
});

test('renders layout without header and footer', () => {
  render(
    <Layout showHeader={false} showFooter={false}>
      <div>Test content</div>
    </Layout>
  );
  
  expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  expect(screen.getByText('Test content')).toBeInTheDocument();
});
```

### Toast Testing
```tsx
import { toast } from 'sonner';

test('shows success toast', () => {
  toast.success('Test message');
  
  // Check if toast is rendered
  expect(screen.getByText('Test message')).toBeInTheDocument();
});
```

## 🚀 Performance Optimization

### Lazy Loading
```tsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function OptimizedLayout() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </Layout>
  );
}
```

### Memoization
```tsx
import { memo } from 'react';

const MemoizedCard = memo(({ title, children }) => (
  <CardLayout title={title}>{children}</CardLayout>
));

function OptimizedGrid() {
  return (
    <GridLayout cols={3}>
      <MemoizedCard title="Card 1">Content 1</MemoizedCard>
      <MemoizedCard title="Card 2">Content 2</MemoizedCard>
      <MemoizedCard title="Card 3">Content 3</MemoizedCard>
    </GridLayout>
  );
}
```

## 🔍 Browser Support

### CSS Features
- **CSS Grid**: Modern browsers (IE11+ with polyfill)
- **CSS Flexbox**: Modern browsers (IE10+)
- **CSS Custom Properties**: Modern browsers (IE11+ with polyfill)
- **Backdrop Filter**: Modern browsers (IE11+ with polyfill)

### JavaScript Features
- **React 18**: Modern browsers (IE11+ with polyfill)
- **TypeScript**: Compiles to ES5+ for broad compatibility
- **ES6+ Features**: Transpiled for older browsers

## 📚 Best Practices

### 1. Use Semantic Layouts
```tsx
// ✅ Good
<Layout showHeader={true} showFooter={true}>
  <PageLayout title="About Us">
    <SectionLayout title="Our Mission">
      <CardLayout title="Vision">Content</CardLayout>
    </SectionLayout>
  </PageLayout>
</Layout>

// ❌ Bad
<div className="layout">
  <div className="page">
    <div className="section">
      <div className="card">Content</div>
    </div>
  </div>
</div>
```

### 2. Leverage Toast Notifications
```tsx
// ✅ Good
try {
  await saveData();
  toast.success('Data saved successfully!');
} catch (error) {
  toast.error('Failed to save data', {
    description: error.message,
  });
}

// ❌ Bad
alert('Data saved successfully!');
```

### 3. Use Responsive Design
```tsx
// ✅ Good
<GridLayout cols={1} className="md:grid-cols-2 lg:grid-cols-3">
  {/* Content */}
</GridLayout>

// ❌ Bad
<GridLayout cols={3}>
  {/* Content - may be too cramped on mobile */}
</GridLayout>
```

### 4. Maintain Accessibility
```tsx
// ✅ Good
<Layout>
  <PageLayout title="Accessible Page">
    <main role="main">
      <h1>Page Title</h1>
      <p>Page description</p>
    </main>
  </PageLayout>
</Layout>

// ❌ Bad
<Layout>
  <div>
    <div>Page Title</div>
    <div>Page description</div>
  </div>
</Layout>
```

## 🎯 Common Use Cases

### Dashboard Layout
```tsx
function Dashboard() {
  return (
    <Layout showHeader={true} showFooter={false}>
      <PageLayout title="Dashboard" maxWidth="full">
        <GridLayout cols={12} gap="lg">
          {/* Sidebar */}
          <div className="col-span-3">
            <CardLayout title="Navigation" padding="md">
              <nav>Dashboard navigation</nav>
            </CardLayout>
          </div>
          
          {/* Main Content */}
          <div className="col-span-9">
            <GridLayout cols={2} gap="md">
              <CardLayout title="Stats" padding="md">
                <div>Statistics content</div>
              </CardLayout>
              <CardLayout title="Charts" padding="md">
                <div>Charts content</div>
              </CardLayout>
            </GridLayout>
          </div>
        </GridLayout>
      </PageLayout>
    </Layout>
  );
}
```

### Form Layout
```tsx
function ContactForm() {
  return (
    <Layout>
      <PageLayout title="Contact Us" maxWidth="md">
        <CardLayout title="Send Message" padding="lg">
          <form>
            <FlexLayout direction="col" gap="md">
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <textarea placeholder="Message"></textarea>
              <FlexLayout direction="row" gap="md" justify="end">
                <button type="button" onClick={() => toast.info('Form validated')}>
                  Validate
                </button>
                <button type="submit" onClick={() => toast.success('Message sent!')}>
                  Send
                </button>
              </FlexLayout>
            </FlexLayout>
          </form>
        </CardLayout>
      </PageLayout>
    </Layout>
  );
}
```

### Landing Page Layout
```tsx
function LandingPage() {
  return (
    <Layout showHeader={true} showFooter={true}>
      <PageLayout maxWidth="full">
        {/* Hero Section */}
        <SectionLayout padding="xl" className="text-center">
          <h1 className="text-5xl font-bold">Welcome to Our App</h1>
          <p className="text-xl text-muted-foreground mt-4">
            The best solution for your needs
          </p>
        </SectionLayout>
        
        {/* Features Section */}
        <SectionLayout title="Features" padding="xl">
          <GridLayout cols={3} gap="lg">
            <CardLayout title="Feature 1" padding="lg">
              <div>Feature description</div>
            </CardLayout>
            <CardLayout title="Feature 2" padding="lg">
              <div>Feature description</div>
            </CardLayout>
            <CardLayout title="Feature 3" padding="lg">
              <div>Feature description</div>
            </CardLayout>
          </GridLayout>
        </SectionLayout>
      </PageLayout>
    </Layout>
  );
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Toaster Not Showing
```tsx
// ✅ Ensure toaster is imported in layout
import { Toaster } from './ui/sonner';

// ✅ Check if toast function is imported correctly
import { toast } from 'sonner'; // Not from './components/ui/sonner'
```

#### 2. Layout Components Not Rendering
```tsx
// ✅ Check import statements
import Layout, { PageLayout, SectionLayout } from './components/layout';

// ✅ Ensure proper component nesting
<Layout>
  <PageLayout>
    <SectionLayout>
      <div>Content</div>
    </SectionLayout>
  </PageLayout>
</Layout>
```

#### 3. Theme Not Switching
```tsx
// ✅ Check ThemeProvider setup
<ThemeProvider defaultTheme="system" storageKey="ui-theme">
  {/* Content */}
</ThemeProvider>

// ✅ Verify CSS custom properties are loaded
:root {
  --background: #ffffff;
  --foreground: #171717;
}
```

#### 4. Responsive Issues
```tsx
// ✅ Use responsive utilities
<GridLayout cols={1} className="md:grid-cols-2 lg:grid-cols-3">

// ✅ Check breakpoint definitions
$breakpoints: (
  sm: 640px,
  md: 768px,
  lg: 1024px
);
```

## 📖 Resources

- **React Documentation**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **CSS Grid Guide**: https://css-tricks.com/snippets/css/complete-guide-grid/
- **Flexbox Guide**: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- **Toast Notifications**: https://sonner.emilkowal.ski/

---

**Status**: ✅ **Complete** - Full layout system with toaster integration implemented!
