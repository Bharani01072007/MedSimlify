import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const DoctorDashboardScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning, Dr. Sharma 👋</Text>
          <Text style={styles.hospitalText}>City Hospital - General Medicine</Text>
        </View>
        <TouchableOpacity style={styles.docAvatar} onPress={() => navigation.navigate('PatientMain')}>
          <Text style={styles.docAvatarText}>👩‍⚕️</Text>
        </TouchableOpacity>
      </View>

      {/* Doctor Stats Cards (3 across) */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>12</Text>
          <Text style={styles.statLabel}>Today's Patients</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: COLORS.accent }]}>5</Text>
          <Text style={styles.statLabel}>Pending Reports</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: COLORS.secondary }]}>₹8,500</Text>
          <Text style={styles.statLabel}>Today's Earnings</Text>
        </View>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickRow}>
        <TouchableOpacity 
          style={styles.quickBtn}
          onPress={() => navigation.navigate('PatientList')}
        >
          <Text style={styles.quickIcon}>👥</Text>
          <Text style={styles.quickText}>Patient Roster</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickBtn}
          onPress={() => navigation.navigate('CreatePrescription')}
        >
          <Text style={styles.quickIcon}>📝</Text>
          <Text style={styles.quickText}>New Prescription</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickBtn}
          onPress={() => navigation.navigate('ClinicAnalytics')}
        >
          <Text style={styles.quickIcon}>📈</Text>
          <Text style={styles.quickText}>Clinic Analytics</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Appointments Queue */}
      <Text style={styles.sectionHeader}>Today's Patient Schedule</Text>

      <View style={styles.queueCard}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>10:00 AM</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.patientName}>Rajesh Kumar (34M)</Text>
          <Text style={styles.patientCondition}>Dengue Follow-up | Platelets: 80,000</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewProfileBtn}
          onPress={() => navigation.navigate('PatientProfileDoctor')}
        >
          <Text style={styles.viewProfileText}>Open Chart</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.queueCard}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>10:30 AM</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.patientName}>Anita Sharma (45F)</Text>
          <Text style={styles.patientCondition}>Hypertension & Diabetes Check</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewProfileBtn}
          onPress={() => navigation.navigate('PatientProfileDoctor')}
        >
          <Text style={styles.viewProfileText}>Open Chart</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  greeting: {
    ...TYPOGRAPHY.h1,
    fontSize: 22,
    color: COLORS.primary
  },
  hospitalText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary
  },
  docAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  docAvatarText: {
    fontSize: 24
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md
  },
  statCard: {
    width: '31%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.sm,
    alignItems: 'center',
    elevation: 2
  },
  statVal: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    fontSize: 22
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    marginTop: 2
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md
  },
  quickBtn: {
    width: '31%',
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.sm,
    alignItems: 'center'
  },
  quickIcon: {
    fontSize: 24,
    marginBottom: 4
  },
  quickText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center'
  },
  sectionHeader: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm
  },
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 2
  },
  timeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 12
  },
  timeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.primary
  },
  patientName: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 15
  },
  patientCondition: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary
  },
  viewProfileBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  viewProfileText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: '#FFF'
  }
});
