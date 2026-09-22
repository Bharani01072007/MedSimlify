export const COLORS = {
  primary: '#2563EB',      // Medical Blue
  secondary: '#10B981',    // Health Green
  accent: '#F59E0B',       // Warning/Alert Orange
  background: '#F9FAFB',   // Light Gray
  cardBackground: '#FFFFFF',// White
  textPrimary: '#1F2937',  // Dark Gray
  textSecondary: '#6B7280',// Medium Gray
  error: '#EF4444',        // Red
  success: '#10B981',      // Green
  border: '#E5E7EB',       // Light Border
  divider: '#F3F4F6'
};

export const TYPOGRAPHY = {
  h1: { fontSize: 24, fontWeight: '700' as const, color: COLORS.textPrimary },
  h2: { fontSize: 20, fontWeight: '700' as const, color: COLORS.textPrimary },
  h3: { fontSize: 18, fontWeight: '600' as const, color: COLORS.textPrimary },
  body: { fontSize: 16, fontWeight: '400' as const, color: COLORS.textPrimary },
  bodyBold: { fontSize: 16, fontWeight: '600' as const, color: COLORS.textPrimary },
  small: { fontSize: 14, fontWeight: '400' as const, color: COLORS.textSecondary },
  caption: { fontSize: 12, fontWeight: '300' as const, color: COLORS.textSecondary }
};

export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  cardRadius: 12,
  buttonRadius: 8
};
