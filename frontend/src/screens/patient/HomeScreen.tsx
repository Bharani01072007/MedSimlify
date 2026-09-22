import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const HomeScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning, Rajesh! 👋</Text>
          <Text style={styles.subGreeting}>Let's keep track of your recovery</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileAvatar}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>💊 Today's Medicines</Text>
          <Text style={styles.summaryBadge}>3/4 taken ✅</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '75%' }]} />
        </View>
        <Text style={styles.nextDoseText}>⏰ Next: Paracetamol 650mg at 2:00 PM</Text>
      </View>

      {/* Quick Actions Grid (2x2) */}
      <Text style={styles.sectionHeader}>Quick Actions</Text>
      <View style={styles.gridContainer}>
        <TouchableOpacity 
          style={[styles.gridCard, styles.uploadCard]}
          onPress={() => navigation.navigate('UploadReport')}
        >
          <Text style={styles.gridIcon}>📤</Text>
          <Text style={[styles.gridTitle, { color: '#FFF' }]}>Upload Report</Text>
          <Text style={[styles.gridSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>AI Simplification</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridCard}
          onPress={() => navigation.navigate('ReportHistory')}
        >
          <Text style={styles.gridIcon}>📊</Text>
          <Text style={styles.gridTitle}>My Reports</Text>
          <Text style={styles.gridSubtitle}>Lab & Prescriptions</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridCard}
          onPress={() => navigation.navigate('MedicinesList')}
        >
          <Text style={styles.gridIcon}>💊</Text>
          <Text style={styles.gridTitle}>Medicines</Text>
          <Text style={styles.gridSubtitle}>Dose Reminders</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridCard}
          onPress={() => navigation.navigate('Appointments')}
        >
          <Text style={styles.gridIcon}>📅</Text>
          <Text style={styles.gridTitle}>Appointments</Text>
          <Text style={styles.gridSubtitle}>Doctor Visits</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity Card */}
      <Text style={styles.sectionHeader}>Recent Activity</Text>
      <TouchableOpacity 
        style={styles.activityCard}
        onPress={() => navigation.navigate('ReportResults')}
      >
        <View style={styles.activityIconBg}>
          <Text style={styles.activityIcon}>📋</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.activityTitle}>CBC with Dengue Profile</Text>
          <Text style={styles.activitySubtitle}>Last uploaded 2 hours ago</Text>
          <Text style={styles.activityTag}>⚠️ Platelets: 80,000 (Low)</Text>
        </View>
        <Text style={styles.arrowIcon}>chevron-right</Text>
      </TouchableOpacity>

      {/* AI Assistant Banner */}
      <TouchableOpacity 
        style={styles.aiBanner}
        onPress={() => navigation.navigate('AIHealthAssistant')}
      >
        <Text style={styles.aiBannerIcon}>🤖</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.aiBannerTitle}>Have a health question?</Text>
          <Text style={styles.aiBannerSubtitle}>Ask AI Assistant about diet, test reports & recovery</Text>
        </View>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  greeting: {
    ...TYPOGRAPHY.h1,
    fontSize: 22,
    color: COLORS.textPrimary
  },
  subGreeting: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileAvatar: {
    fontSize: 24
  },
  summaryCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  summaryTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary
  },
  summaryBadge: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    color: COLORS.secondary
  },
  progressBarBg: {
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    marginBottom: 10
  },
  progressBarFill: {
    height: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 5
  },
  nextDoseText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  sectionHeader: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.md
  },
  gridCard: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: 12,
    elevation: 2
  },
  uploadCard: {
    backgroundColor: COLORS.primary
  },
  gridIcon: {
    fontSize: 28,
    marginBottom: 8
  },
  gridTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: 2
  },
  gridSubtitle: {
    ...TYPOGRAPHY.caption
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2
  },
  activityIconBg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  activityIcon: {
    fontSize: 22
  },
  activityTitle: {
    ...TYPOGRAPHY.bodyBold
  },
  activitySubtitle: {
    ...TYPOGRAPHY.caption,
    marginBottom: 4
  },
  activityTag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: '700'
  },
  arrowIcon: {
    fontSize: 16,
    color: COLORS.textSecondary
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  aiBannerIcon: {
    fontSize: 32,
    marginRight: 12
  },
  aiBannerTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary
  },
  aiBannerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary
  }
});
