import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const ReportComparisonScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>📊 Compare Reports & Trends</Text>
      <Text style={styles.subtitle}>Side-by-side analysis of lab parameters over time</Text>

      {/* Platelet Trend Bar/Graph Representation */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Platelet Count Trend (13-Sep to 14-Sep)</Text>
        
        <View style={styles.graphContainer}>
          <View style={styles.graphColumn}>
            <Text style={styles.graphValue}>120,000</Text>
            <View style={[styles.graphBar, { height: 100, backgroundColor: COLORS.secondary }]} />
            <Text style={styles.graphLabel}>13-Sep</Text>
          </View>

          <View style={styles.graphColumn}>
            <Text style={[styles.graphValue, { color: COLORS.error }]}>80,000 ⚠️</Text>
            <View style={[styles.graphBar, { height: 60, backgroundColor: COLORS.error }]} />
            <Text style={styles.graphLabel}>14-Sep (Today)</Text>
          </View>
        </View>

        <Text style={styles.trendAlert}>🔴 Declining Trend: Platelets dropped by 40,000 /uL in 24 hours.</Text>
      </View>

      {/* Comparison Table */}
      <Text style={styles.sectionTitle}>Comparative Parameter Table</Text>
      <View style={styles.tableCard}>
        <View style={styles.tableRowHeader}>
          <Text style={[styles.tableCellHeader, { flex: 2 }]}>Test Name</Text>
          <Text style={[styles.tableCellHeader, { flex: 1 }]}>13-Sep</Text>
          <Text style={[styles.tableCellHeader, { flex: 1 }]}>14-Sep</Text>
          <Text style={[styles.tableCellHeader, { flex: 1.2 }]}>Change</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2, fontWeight: '700' }]}>Platelet Count</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>120,000</Text>
          <Text style={[styles.tableCell, { flex: 1, color: COLORS.error, fontWeight: '700' }]}>80,000</Text>
          <Text style={[styles.tableCell, { flex: 1.2, color: COLORS.error, fontWeight: '700' }]}>↓ 33.3% Drop</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Dengue NS1</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Positive</Text>
          <Text style={[styles.tableCell, { flex: 1, color: COLORS.error }]}>Positive</Text>
          <Text style={[styles.tableCell, { flex: 1.2, color: COLORS.error }]}>Active</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Hemoglobin</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>14.5 g/dL</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>14.2 g/dL</Text>
          <Text style={[styles.tableCell, { flex: 1.2, color: COLORS.secondary }]}>Stable</Text>
        </View>
      </View>

      {/* AI Insight Card */}
      <View style={styles.aiInsightCard}>
        <Text style={styles.aiInsightTitle}>💡 AI CLINICAL INSIGHT</Text>
        <Text style={styles.aiInsightText}>
          The 33.3% drop in platelet count within 24 hours is typical during Days 3-5 of Dengue fever. Maintain continuous oral fluid intake (ORSL/Coconut water) and repeat CBC blood test tomorrow at 8:00 AM.
        </Text>
      </View>

      <TouchableOpacity style={styles.downloadBtn}>
        <Text style={styles.downloadBtnText}>📥 Download Trend Summary PDF</Text>
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
  chartCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2
  },
  chartTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.md
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: SPACING.sm
  },
  graphColumn: {
    alignItems: 'center',
    width: 80
  },
  graphValue: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    marginBottom: 6
  },
  graphBar: {
    width: 44,
    borderRadius: 8
  },
  graphLabel: {
    ...TYPOGRAPHY.caption,
    marginTop: 8,
    fontWeight: '600'
  },
  trendAlert: {
    ...TYPOGRAPHY.small,
    color: COLORS.error,
    fontWeight: '700',
    marginTop: 4
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: 8
  },
  tableCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    elevation: 2
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
    marginBottom: 8
  },
  tableCellHeader: {
    ...TYPOGRAPHY.small,
    fontWeight: '700'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider
  },
  tableCell: {
    ...TYPOGRAPHY.small
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
    marginBottom: 6
  },
  aiInsightText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary,
    lineHeight: 20
  },
  downloadBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: SPACING.lg
  },
  downloadBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF'
  }
});
