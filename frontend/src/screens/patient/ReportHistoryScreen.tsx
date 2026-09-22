import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const ReportHistoryScreen = ({ navigation }: any) => {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Lab', 'X-ray', 'Rx', 'Discharge'];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>📁 My Health Records</Text>
      
      {/* Search Input */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search reports by test or hospital..."
        />
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity 
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Compare Button Banner */}
      <TouchableOpacity 
        style={styles.compareBanner}
        onPress={() => navigation.navigate('ReportComparison')}
      >
        <Text style={styles.compareIcon}>📊</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.compareTitle}>Compare Reports & View Trends</Text>
          <Text style={styles.compareSubtitle}>Track platelet drops or recovery progress over time</Text>
        </View>
        <Text style={styles.compareArrow}>→</Text>
      </TouchableOpacity>

      {/* Month Timeline: September 2026 */}
      <Text style={styles.monthHeader}>September 2026</Text>

      <TouchableOpacity 
        style={styles.reportCard}
        onPress={() => navigation.navigate('ReportResults')}
      >
        <View style={styles.reportCardLeft}>
          <Text style={styles.reportIcon}>📊</Text>
          <View>
            <Text style={styles.reportTitle}>CBC with Dengue Profile</Text>
            <Text style={styles.reportDate}>14-Sep-2026, 11:00 AM</Text>
            <Text style={styles.reportAbnormal}>🔴 Platelets: 80,000 /uL (Low)</Text>
          </View>
        </View>
        <Text style={styles.badgeText}>Lab</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.reportCard}
        onPress={() => navigation.navigate('ReportResults')}
      >
        <View style={styles.reportCardLeft}>
          <Text style={styles.reportIcon}>📊</Text>
          <View>
            <Text style={styles.reportTitle}>CBC Baseline Test</Text>
            <Text style={styles.reportDate}>13-Sep-2026, 10:30 AM</Text>
            <Text style={styles.reportNormal}>🟢 Platelets: 120,000 /uL (Normal)</Text>
          </View>
        </View>
        <Text style={styles.badgeText}>Lab</Text>
      </TouchableOpacity>

      <Text style={styles.monthHeader}>August 2026</Text>

      <TouchableOpacity style={styles.reportCard}>
        <View style={styles.reportCardLeft}>
          <Text style={styles.reportIcon}>💊</Text>
          <View>
            <Text style={styles.reportTitle}>Outpatient Prescription</Text>
            <Text style={styles.reportDate}>22-Aug-2026</Text>
            <Text style={styles.reportNormal}>Dr. Priya Sharma - City Hospital</Text>
          </View>
        </View>
        <Text style={styles.badgeText}>Rx</Text>
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
    marginBottom: SPACING.sm
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.buttonRadius,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  filterText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '700'
  },
  compareBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  compareIcon: {
    fontSize: 28,
    marginRight: 12
  },
  compareTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary
  },
  compareSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary
  },
  compareArrow: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '700'
  },
  monthHeader: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    marginTop: 4
  },
  reportCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 2
  },
  reportCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  reportIcon: {
    fontSize: 28,
    marginRight: 12
  },
  reportTitle: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 15
  },
  reportDate: {
    ...TYPOGRAPHY.caption,
    marginBottom: 2
  },
  reportAbnormal: {
    ...TYPOGRAPHY.small,
    color: COLORS.error,
    fontWeight: '600',
    fontSize: 13
  },
  reportNormal: {
    ...TYPOGRAPHY.small,
    color: COLORS.secondary,
    fontSize: 13
  },
  badgeText: {
    ...TYPOGRAPHY.caption,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '700'
  }
});
