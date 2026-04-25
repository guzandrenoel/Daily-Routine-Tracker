export const lightTheme = {
  colors: {
    background: '#F8F4EF',
    surface: '#FFFFFF',
    textPrimary: '#162433',
    textSecondary: '#4E6676',
    mutedText: '#7D8A97',
    accent: '#18A6A0',
    accentSoft: '#55CFC2',
    accentTint: 'rgba(24, 166, 160, 0.12)',
    cardShadow: '#000000',
    border: '#E9DDD1',
  },
};

export const darkTheme = {
  colors: {
    background: '#0F141B',
    surface: '#171F2B',
    textPrimary: '#FFFFFF',
    textSecondary: '#C9D2E0',
    mutedText: 'rgba(255,255,255,0.60)',
    accent: '#18A6A0',
    accentSoft: '#55CFC2',
    accentTint: 'rgba(24, 166, 160, 0.18)',
    cardShadow: '#000000',
    border: 'rgba(255,255,255,0.12)',
  },
};

// ✅ Backwards compatible: other screens importing `colors` still work
export const colors = lightTheme.colors;