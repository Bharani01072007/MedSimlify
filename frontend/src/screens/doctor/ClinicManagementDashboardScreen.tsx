import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const ClinicManagementDashboardScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>📈 Clinic Analytics & Management</Text>

      {/* Revenue & Visits Overview */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Monthly Practice Revenue</Text>
        <Text style={styles.revenueText}>₹ 2,45,000</Text>
        <Text style={styles.growthText}>↑ 18% increase compared to last month</Text>
      </View>

      {/* Common Diagnoses Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top Diagnoses (This Month)</Text>

        <View style={styles.diagRow}>
          <Text style={styles.diagName}>Dengue & Viral Fevers</Text>
          <Text style={styles.diagPercent}>42%</Text>
        </View>

        <View style={styles.diagRow}>
          <Text style={styles.diagName}>Hypertension & Cardiac</Text>
          <Text style={styles.diagPercent}>28%</Text>
        </View>

        <View style={styles.diagRow}>
          <Text style={styles.diagName}>Type 2 Diabetes Mellitus</Text>
          <Text style={styles.diagPercent}>18%</Text>
        </View>
      </View>
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
    marginBottom: SPACING.md
  },
  statsCard: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md
  },
  cardTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF',
    fontSize: 16
  },
  revenueText: {
    ...TYPOGRAPHY.h1,
    color: '#FFF',
    fontSize: 32,
    marginVertical: 4
  },
  growthText: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.85)'
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    elevation: 2
  },
  diagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider
  },
  diagName: {
    ...TYPOGRAPHY.bodyBold
  },
  diagPercent: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary
  }
});
