// =============================================================================
// React Icons Component Library
// =============================================================================

import React from 'react';

// =============================================================================
// Icon Props Interface
// =============================================================================

export interface IconProps {
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  color?: 'primary' | 'secondary' | 'muted' | 'destructive' | 'success' | 'warning' | 'info';
  onClick?: () => void;
  title?: string;
}

// =============================================================================
// Next.js Specific Icons
// =============================================================================

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

export const VercelLogo: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Vercel'
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
      className={`vercel-logo ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 283 64"
      fill="currentColor"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        className="vercel-logo-path"
        d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-11.56-8.9-20.49-19.66-20.49zm-9.46 14.5c.25-3.9 3.88-6.5 9.46-6.5 5.58 0 9.21 2.6 9.46 6.5h-18.92zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-11.56-8.9-20.49-19.66-20.49zm-9.45 14.5c.25-3.9 3.88-6.5 9.45-6.5 5.58 0 9.21 2.6 9.45 6.5h-18.9zM200.24 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-11.56-8.9-20.49-19.66-20.49zm-9.45 14.5c.25-3.9 3.88-6.5 9.45-6.5 5.58 0 9.21 2.6 9.45 6.5h-18.9zM82.48 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-11.56-8.9-20.49-19.66-20.49zm-9.45 14.5c.25-3.9 3.88-6.5 9.45-6.5 5.58 0 9.21 2.6 9.45 6.5h-18.9zM36.34 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-11.56-8.9-20.49-19.66-20.49zm-9.45 14.5c.25-3.9 3.88-6.5 9.45-6.5 5.58 0 9.21 2.6 9.45 6.5h-18.9zM0 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-11.56-8.9-20.49-19.66-20.49zm-9.45 14.5c.25-3.9 3.88-6.5 9.45-6.5 5.58 0 9.21 2.6 9.45 6.5h-18.9z"
      />
    </svg>
  );
};

// =============================================================================
// Technology Icons
// =============================================================================

export const ReactIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'React'
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

export const TypeScriptIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'TypeScript'
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

  return (
    <svg
      className={`icon-typescript ${sizeClasses[size]} ${className}`}
      viewBox="0 0 128 128"
      fill="currentColor"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect width="128" height="128" rx="8" fill="#3178c6"/>
      <text x="64" y="80" textAnchor="middle" fill="white" fontSize="48" fontFamily="monospace" fontWeight="bold">TS</text>
    </svg>
  );
};

export const BunIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Bun'
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

  return (
    <svg
      className={`icon-bun ${sizeClasses[size]} ${className}`}
      viewBox="0 0 128 128"
      fill="currentColor"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <circle cx="64" cy="64" r="64" fill="#fbf2e4" stroke="#f7931e" strokeWidth="4"/>
      <text x="64" y="80" textAnchor="middle" fontSize="64">🍞</text>
    </svg>
  );
};

// =============================================================================
// Common UI Icons
// =============================================================================

export const MenuIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Menu'
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
      className={`icon-menu ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <line x1="3" y1="6" x2="21" y2="6" className="icon-menu-line"/>
      <line x1="3" y1="12" x2="21" y2="12" className="icon-menu-line"/>
      <line x1="3" y1="18" x2="21" y2="18" className="icon-menu-line"/>
    </svg>
  );
};

export const CloseIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Close'
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
      className={`icon-close ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
};

export const SearchIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Search'
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
      className={`icon-search ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  );
};

export const CheckIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Check'
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
      className={`icon-check ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  );
};

export const PlusIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Plus'
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
      className={`icon-plus ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
};

export const MinusIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Minus'
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
      className={`icon-minus ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
};

// =============================================================================
// Directional Icons
// =============================================================================

export const ChevronDownIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Chevron Down'
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
      className={`icon-chevron-down ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  );
};

export const ChevronUpIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Chevron Up'
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
      className={`icon-chevron-up ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <polyline points="18,15 12,9 6,15"/>
    </svg>
  );
};

export const ChevronLeftIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Chevron Left'
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
      className={`icon-chevron-left ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <polyline points="15,18 9,12 15,6"/>
    </svg>
  );
};

export const ChevronRightIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Chevron Right'
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
      className={`icon-chevron-right ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <polyline points="9,18 15,12 9,6"/>
    </svg>
  );
};

// =============================================================================
// Loading Icons
// =============================================================================

export const SpinnerIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Loading'
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
      className={`icon-spinner ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

// =============================================================================
// File Icons
// =============================================================================

export const FileIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'File'
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
      className={`icon-file ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14,2 14,8 20,8"/>
    </svg>
  );
};

export const FolderIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'Folder'
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
      className={`icon-folder ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.89l-.812-1.22A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
    </svg>
  );
};

// =============================================================================
// Social Media Icons
// =============================================================================

export const GitHubIcon: React.FC<IconProps> = ({ 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title = 'GitHub'
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
      className={`icon-github ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      onClick={onClick}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
};

// =============================================================================
// Icon Wrapper Component
// =============================================================================

export const IconWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  size?: IconProps['size'];
  color?: IconProps['color'];
  onClick?: () => void;
  title?: string;
}> = ({ 
  children, 
  className = '', 
  size = 'base',
  color = 'primary',
  onClick,
  title 
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
    <div
      className={`icon ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      aria-label={title}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};


