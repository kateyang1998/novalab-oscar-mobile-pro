// Central design tokens for the application
export const theme = {
  colors: {
    primary: '#007AFF',
    primaryDark: '#0051A8',
    accent: '#FFC107',
    success: '#34C759',
    warning: '#FFCC00',
    danger: '#FF3B30',
    neutral0: '#FFFFFF',
    neutral1: '#F7F7F8',
    neutral2: '#E5E5EA',
    neutral7: '#8E8E93',
    neutral9: '#1C1C1E',
  },
  font: {
    family:
      'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    baseSize: '16px',
    sizes: { xs: '12px', sm: '14px', md: '16px', lg: '18px' },
    weights: { regular: 400, medium: 500, bold: 700 },
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
  radius: { sm: '4px', md: '8px', lg: '12px' },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px' },
};

export default theme;

