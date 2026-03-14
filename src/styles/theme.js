// Central design tokens for the application (OSCAR palette)
export const theme = {
  colors: {
    oscarBlue: '#0056B3', // OSCAR blue
    oscarGray: '#E9ECEF', // OSCAR Gray
    oscarWhite: '#F8F9FA', // OSCAR White
    oscarBlack: '#000000', // OSCAR Black
    oscarRed: '#C82333', // OSCAR Red
    oscarGreen: '#28A745', // OSCAR Green
    oscarYellow: '#FFEAA7', // OSCAR Yellow
    paleSky: '#757575',
    shark: '#212529',
    barleyWhite: '#FFF3CD',
    yukonGold: '#856404',
    // Appointment type colors
    appointment: {
      newPatient: '#816300',
      followUp: '#0056B3',
      physical: '#5F0088',
      consultation: '#930076',
      urgentCare: '#470007',
    },
  },
  // typography
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
  // standard shadows
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 8px rgba(33,37,41,0.08)',
    lg: '0 12px 24px rgba(33,37,41,0.12)',
  },
};

export default theme;

