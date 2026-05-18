// =============================================================================
// Main Layout Component with Toaster Integration
// =============================================================================

import React, { type ReactNode } from 'react';
import { ThemeToggle } from './theme-toggle';

// =============================================================================
// Layout Props Interface
// =============================================================================

export interface LayoutProps {
  children: ReactNode;
  className?: string;
}

// =============================================================================
// Main Layout Component
// =============================================================================

export const Layout: React.FC<LayoutProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

// =============================================================================
// Page Layout Component
// =============================================================================

export interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  container?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  className = '',
  container = true,
  maxWidth = 'lg'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={`py-8 ${className}`}>
      {container && (
        <div className={`mx-auto px-0 sm:px-4 ${maxWidthClasses[maxWidth]}`}>
          {/* Page Header */}
          {(title || description) && (
            <div className="mb-8 text-center">
              {title && (
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-4 text-lg text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}
          
          {/* Page Content */}
          {children}
        </div>
      )}
      
      {!container && children}
    </div>
  );
};

// =============================================================================
// Section Layout Component
// =============================================================================

export interface SectionLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const SectionLayout: React.FC<SectionLayoutProps> = ({
  children,
  title,
  description,
  className = '',
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16'
  };

  return (
    <section className={`${paddingClasses[padding]} ${className}`}>
      {/* Section Header */}
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      
      {/* Section Content */}
      {children}
    </section>
  );
};

// =============================================================================
// Card Layout Component
// =============================================================================

export interface CardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const CardLayout: React.FC<CardLayoutProps> = ({
  children,
  title,
  description,
  className = '',
  padding = 'md',
  shadow = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  return (
    <div className={`bg-card text-card-foreground rounded-lg border ${shadowClasses[shadow]} ${className}`}>
      {/* Card Header */}
      {(title || description) && (
        <div className={`${paddingClasses[padding]} border-b pb-4`}>
          {title && (
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      
      {/* Card Content */}
      <div className={paddingClasses[padding]}>
        {children}
      </div>
    </div>
  );
};

// =============================================================================
// Grid Layout Component
// =============================================================================

export interface GridLayoutProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  cols = 1,
  gap = 'md',
  className = ''
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12'
  };

  const gapClasses = {
    none: '',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10'
  };

  return (
    <div className={`grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

// =============================================================================
// Flex Layout Component
// =============================================================================

export interface FlexLayoutProps {
  children: ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  className?: string;
}

export const FlexLayout: React.FC<FlexLayoutProps> = ({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  gap = 'none',
  wrap = false,
  className = ''
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  };

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const gapClasses = {
    none: '',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  return (
    <div className={`flex ${directionClasses[direction]} ${alignClasses[align]} ${justifyClasses[justify]} ${gapClasses[gap]} ${wrap ? 'flex-wrap' : 'flex-nowrap'} ${className}`}>
      {children}
    </div>
  );
};

// =============================================================================
// Container Layout Component
// =============================================================================

export interface ContainerLayoutProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  className?: string;
}

export const ContainerLayout: React.FC<ContainerLayoutProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'md',
  center = true,
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-0 sm:px-4',
    md: 'px-0 sm:px-6',
    lg: 'px-0 sm:px-8',
    xl: 'px-0 sm:px-10'
  };

  return (
    <div className={`${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${center ? 'mx-auto' : ''} ${className}`}>
      {children}
    </div>
  );
};

// =============================================================================
// Export All Layout Components
// =============================================================================

export default Layout;
