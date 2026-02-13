/**
 * Theme inspired by Bank App (LouBank) iOS UI Kit – dark mode, yellow primary, rounded corners.
 * Use for visual styling only; app structure and content stay unchanged.
 */
export default {
  // Backgrounds
  background: '#1C1C1E',
  surface: '#2C2C2E',
  card: '#2C2C2E',
  inputBg: '#3A3A3C',

  // Primary & accents (from Figma: yellow primary, light green secondary)
  primary: '#FFD700',
  primaryDark: '#E6C200',
  secondary: '#90EE90',
  secondaryMuted: 'rgba(144, 238, 144, 0.3)',

  // Text
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#949494',
  textOnPrimary: '#1C1C1E',

  // Borders & dividers
  border: '#3A3A3C',
  divider: '#3A3A3C',

  // Semantic (keep for status badges, logout, etc.)
  success: '#90EE90',
  warning: '#FFB347',
  error: '#FF6B6B',
  info: '#87CEEB',

  // UI
  overlay: 'rgba(0,0,0,0.6)',
  shadow: '#000000',

  // Radii (Figma: rounded corners throughout)
  radiusSm: 8,
  radius: 12,
  radiusLg: 16,
  radiusXl: 20,
  radiusRound: 999,

  // Typography (Figma-style: clean sans – Inter matches SF Pro–like clarity)
  fontFamily: 'Inter_400Regular',
  fontFamilyMedium: 'Inter_500Medium',
  fontFamilySemiBold: 'Inter_600SemiBold',
  fontFamilyBold: 'Inter_700Bold',
};
