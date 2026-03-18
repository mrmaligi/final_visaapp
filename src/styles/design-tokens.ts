/**
 * VisaFlow Design Tokens
 * Extracted from Stitch Design: 1decee23a6b840d796a61b3c0a002b1b.html
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    DEFAULT: '#0056b3',
    hover: '#1d4ed8', // blue-700 for hover states
    light: '#3b82f6',
  },
  
  // Accent Colors
  accent: {
    blue50: '#eff6ff',
    blue100: '#dbeafe',
  },
  
  // Background Colors
  background: {
    white: '#ffffff',
    gray50: '#f9fafb',
    slate900: '#0f172a',
  },
  
  // Text Colors
  text: {
    primary: '#0f172a',    // slate-900
    secondary: '#475569',  // slate-600
    muted: '#94a3b8',      // slate-400
    white: '#ffffff',
  },
  
  // Border Colors
  border: {
    light: '#f3f4f6',      // gray-100
    medium: '#e5e7eb',     // gray-200
    dark: '#1e293b',       // slate-800
  },
} as const;

export const typography = {
  // Font Family
  fontFamily: {
    sans: "'Inter', sans-serif",
  },
  
  // Font Sizes (Tailwind scale mapped to pixel values)
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Line Heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export const spacing = {
  // Container
  container: {
    maxWidth: '80rem', // max-w-7xl = 1280px
    padding: {
      mobile: '1rem',   // px-4
      tablet: '1.5rem', // px-6
      desktop: '2rem',  // px-8
    },
  },
  
  // Section Padding
  section: {
    small: '3rem',      // py-12
    medium: '4rem',     // py-16
    large: '6rem',      // py-24
  },
  
  // Component Spacing
  component: {
    gap: {
      sm: '1rem',       // gap-4
      md: '2rem',       // gap-8
      lg: '3rem',       // gap-12
    },
    padding: {
      card: '2rem',     // p-8
      button: '1rem 2rem', // px-8 py-4
      buttonSmall: '0.625rem 1.5rem', // px-6 py-2.5
    },
  },
  
  // Layout
  layout: {
    navHeight: '5rem',  // h-20
    iconSize: {
      sm: '2rem',       // w-8 h-8
      md: '2.5rem',     // w-10 h-10
      lg: '3.5rem',     // w-14 h-14
    },
  },
} as const;

export const borderRadius = {
  sm: '0.25rem',      // rounded
  DEFAULT: '0.5rem',  // rounded-lg
  md: '0.375rem',     // rounded-md
  lg: '0.5rem',       // rounded-lg
  xl: '0.75rem',      // rounded-xl
  '2xl': '1rem',      // rounded-2xl
  '3xl': '1.5rem',    // rounded-3xl
  full: '9999px',     // rounded-full
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const;

export const transitions = {
  DEFAULT: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  fast: '150ms ease-in-out',
  slow: '300ms ease-in-out',
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

export const zIndex = {
  header: '50',
  dropdown: '40',
  modal: '50',
  tooltip: '60',
} as const;

// Combined design tokens export
export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
} as const;

export default designTokens;
