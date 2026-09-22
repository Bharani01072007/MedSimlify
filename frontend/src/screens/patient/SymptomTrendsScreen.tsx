import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const SymptomTrendsScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>📊 Symptom Trends</Text>
      <Text style={styles.subtitle}>Track your fever recovery & pain reduction over time</Text>

      {/* Fever Trend Representation */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fever Temperature Trend (°F)</Text>
        
        <View style={styles.graphRow}>
          <View style={styles.barItem}>
            <Text style={styles.barVal}>102.4</Text>
            <View style={[styles.bar, { height: 110, backgroundColor: COLORS.error }]} />
            <Text style={styles.barDay}>Day 1</Text>
          </View>

          <View style={styles.barItem}>
            <Text style={styles.barVal}>101.8</Text>
            <View style={[styles.bar, { height: 95, backgroundColor: COLORS.error }]} />
            <Text style={styles.barDay}>Day 2</Text>
          </View>

          <View style={styles.barItem}>
            <Text style={styles.barVal}>101.2</Text>
            <View style={[styles.bar, { height: 80, backgroundColor: COLORS.accent }]} />
            <Text style={styles.barDay}>Day 3</Text>
          </View>

          <View style={styles.barItem}>
            <Text style={styles.barVal}>99.1</Text>
            <View style={[styles.bar, { height: 45, backgroundColor: COLORS.secondary }]} />
            <Text style={styles.barDay}>Today</Text>
          </View>
        </View>

        <Text style={styles.trendArrow}>↓ Fever improving by 0.8°F per day 🟢</Text>
      </View>

      {/* AI Recovery Insight */}
      <View style={styles.aiInsightCard}>
        <Text style={styles.aiInsightTitle}>💡 AI RECOVERY INSIGHT</Text>
        <Text style={styles.aiInsightText}>
          Your fever has consistently dropped below 100°F. Expected complete recovery in 2-3 days. Continue hydration and finish your 5-day medicine schedule.
        </Text>
      </View>

      <TouchableOpacity style={styles.shareBtn}>
        <Text style={styles.shareBtnText}>📤 Share Trends with Dr. Sharma</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: 2
  },
  subtitle: {
    ...TYPOGRAPHY.small,
    marginBottom: SPACING.md
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2
  },
  cardTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.md
  },
  graphRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 130,
    marginBottom: 10
  },
  barItem: {
    alignItems: 'center',
    width: 60
  },
  barVal: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    marginBottom: 4
  },
  bar: {
    width: 32,
    borderRadius: 6
  },
  barDay: {
    ...TYPOGRAPHY.caption,
    marginTop: 6
  },
  trendArrow: {
    ...TYPOGRAPHY.small,
    color: COLORS.secondary,
    fontWeight: '700'
  },
  aiInsightCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: SPACING.md
  },
  aiInsightTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
    marginBottom: 4
  },
  aiInsightText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary
  },
  shareBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 14,
    alignItems: 'center'
  },
  shareBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF'
  }
});
