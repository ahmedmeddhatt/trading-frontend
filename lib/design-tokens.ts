// Design tokens for trading platform
// Mobile-first, fintech-grade design system

export const colors = {
  // Base colors
  dark: {
    base: '#0a0a0a',
    surface: '#121212',
    elevated: '#1a1a1a',
    border: '#2a2a2a',
  },
  // Accent colors
  green: {
    primary: '#00ff88',
    hover: '#00cc6f',
    light: '#33ffaa',
    dark: '#00cc6f',
  },
  red: {
    primary: '#ff4444',
    hover: '#cc3333',
    light: '#ff6666',
    dark: '#cc3333',
  },
  // Neutral colors
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#a3a3a3',
    tertiary: '#737373',
    inverse: '#0a0a0a',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['SF Mono', 'Monaco', 'monospace'],
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  glow: '0 0 20px rgba(0, 255, 136, 0.3)',
} as const;

export const transitions = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
} as const;



