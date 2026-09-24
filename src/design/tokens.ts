export const color = {
  light: {
    bg: '#fff',
    text: '#000',
    secondary: '#444',
    muted: '#767676',
    border: '#ddd',
    borderSubtle: '#eee',
    link: '#000',
    linkHover: '#595959',
    error: '#c44',
  },
  dark: {
    bg: '#000',
    text: '#fff',
    secondary: '#bbb',
    muted: '#a3a3a3',
    border: '#333',
    borderSubtle: '#222',
    link: '#fff',
    linkHover: '#a3a3a3',
    error: '#e55',
  },
} as const;

export const cardColor = {
  bg: color.dark.bg,
  text: color.dark.text,
  muted: color.dark.muted,
  mutedOnImage: '#e5e5e5',
  secondaryOnImage: '#d4d4d4',
  divider: '#2a2a2a',
} as const;

export const font = {
  sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace',
} as const;

export const weight = {
  normal: 400,
  medium: 500,
  semibold: 600,
} as const;

export const tracking = {
  wide: '0.05em',
  wider: '0.12em',
  display: '0.28em',
  tight: '-0.01em',
  tighter: '-0.02em',
} as const;

export const typeScale = {
  xs: '0.6875rem',
  sm: '0.75rem',
  base: '0.875rem',
  lg: '1rem',
  xl: '1.125rem',
  '2xl': '1.375rem',
} as const;
