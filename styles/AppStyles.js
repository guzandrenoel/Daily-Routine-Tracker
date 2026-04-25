import { StyleSheet } from 'react-native';
import { colors } from './theme';

export default StyleSheet.create({
  splashContainer: { flex: 1, backgroundColor: colors.background, overflow: 'hidden' },
  glowTopLeft: {
    position: 'absolute',
    top: -80,
    left: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.accentTint,
  },
  glowBottomRight: {
    position: 'absolute',
    right: -90,
    bottom: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(24, 166, 160, 0.10)',
  },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 90, paddingBottom: 34 },
  heroBlock: { alignItems: 'center', width: '100%' },
  logoCard: {
    width: 148,
    height: 148,
    borderRadius: 36,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  logo: { width: 120, height: 120 },
  brand: { fontSize: 42, fontWeight: '900', color: colors.textPrimary, letterSpacing: -1.2 },
  description: { marginTop: 8, fontSize: 18, fontWeight: '700', color: colors.textSecondary },
  tapToEnter: { fontSize: 13, fontWeight: '800', color: colors.accent },
});