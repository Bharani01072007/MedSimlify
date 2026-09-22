import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const AppointmentsScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>📅 My Appointments</Text>
      
      <Text style={styles.sectionHeader}>Upcoming Appointment</Text>
      <View style={styles.appointmentCard}>
        <View style={styles.docHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>👩‍⚕️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.docName}>Dr. Priya Sharma</Text>
            <Text style={styles.docSpec}>General Medicine | City Hospital</Text>
            <Text style={styles.appTime}>🗓️ Tomorrow, 10:00 AM (Room 205)</Text>
          </View>
        </View>

        <View style={styles.prepBox}>
          <Text style={styles.prepText}>💡 Preparation: Bring your latest Dengue & CBC lab reports.</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Navigation", "Opening Google Maps to City Hospital...")}>
            <Text style={styles.actionBtnText}>📍 Navigate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ChatWithDoctor')}>
            <Text style={styles.actionBtnText}>💬 Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.border }]} onPress={() => Alert.alert("Reschedule", "Select new appointment slot...")}>
            <Text style={[styles.actionBtnText, { color: COLORS.textPrimary }]}>✏️ Reschedule</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Past Appointments</Text>
      <View style={styles.pastCard}>
        <Text style={styles.pastDoc}>Dr. Priya Sharma - Initial Consultation</Text>
        <Text style={styles.pastDate}>10-Sep-2026, 04:30 PM</Text>
        <Text style={styles.pastNotes}>Diagnosis: Suspected Dengue fever. Advised CBC blood test.</Text>
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
  sectionHeader: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm
  },
  appointmentCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 3
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: {
    fontSize: 28
  },
  docName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary
  },
  docSpec: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary
  },
  appTime: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
    marginTop: 4
  },
  prepBox: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    marginBottom: SPACING.sm
  },
  prepText: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: SPACING.buttonRadius,
    alignItems: 'center',
    marginHorizontal: 3
  },
  actionBtnText: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    color: '#FFF'
  },
  pastCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 1
  },
  pastDoc: {
    ...TYPOGRAPHY.bodyBold
  },
  pastDate: {
    ...TYPOGRAPHY.caption,
    marginBottom: 4
  },
  pastNotes: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary
  }
});
