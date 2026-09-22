import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const PatientProfileDoctorViewScreen = ({ navigation }: any) => {
  const [tab, setTab] = useState<'Reports' | 'Prescriptions' | 'Notes'>('Reports');

  return (
    <ScrollView style={styles.container}>
      {/* Patient Header */}
      <View style={styles.headerCard}>
        <Text style={styles.patientName}>Rajesh Kumar</Text>
        <Text style={styles.patientMeta}>34Y / Male | Blood Group: B+</Text>
        <Text style={styles.patientContact}>📞 +91-9876543210 | Emergency: Priya (Wife)</Text>

        <View style={styles.ctaRow}>
          <TouchableOpacity 
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('CreatePrescription')}
          >
            <Text style={styles.ctaText}>📝 Issue Prescription</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.ctaBtn, { backgroundColor: COLORS.secondary }]}
            onPress={() => navigation.navigate('ChatWithDoctor')}
          >
            <Text style={styles.ctaText}>💬 Chat Patient</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {['Reports', 'Prescriptions', 'Notes'].map((t) => (
          <TouchableOpacity 
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t as any)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {tab === 'Reports' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Lab Uploads</Text>
          
          <View style={styles.reportRow}>
            <Text style={styles.reportTitle}>CBC with Dengue Profile (14-Sep)</Text>
            <Text style={styles.reportAlert}>Platelets: 80,000 /uL (Low)</Text>
          </View>

          <View style={styles.reportRow}>
            <Text style={styles.reportTitle}>Baseline CBC (13-Sep)</Text>
            <Text style={styles.reportNormal}>Platelets: 120,000 /uL (Normal)</Text>
          </View>
        </View>
      )}

      {tab === 'Prescriptions' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Prescriptions</Text>
          <Text style={styles.rxItem}>• Paracetamol 650mg TDS (5 Days)</Text>
          <Text style={styles.rxItem}>• ORSL Hydration Solution 200ml QDS</Text>
        </View>
      )}

      {tab === 'Notes' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clinical Progress Notes</Text>
          <Text style={styles.notesText}>
            14-Sep: Patient reporting persistent fever 101.2 F. Platelets dropped to 80,000. Advised strict hydration and repeat CBC test tomorrow.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md
  },
  headerCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 3
  },
  patientName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: 2
  },
  patientMeta: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginBottom: 2
  },
  patientContact: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  ctaBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 3
  },
  ctaText: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    color: '#FFF'
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.buttonRadius,
    padding: 4,
    marginBottom: SPACING.md
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary
  },
  tabText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textSecondary
  },
  tabTextActive: {
    color: '#FFF'
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm
  },
  reportRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider
  },
  reportTitle: {
    ...TYPOGRAPHY.bodyBold
  },
  reportAlert: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: '700'
  },
  reportNormal: {
    ...TYPOGRAPHY.caption,
    color: COLORS.secondary
  },
  rxItem: {
    ...TYPOGRAPHY.body,
    marginBottom: 6
  },
  notesText: {
    ...TYPOGRAPHY.small,
    lineHeight: 20
  }
});
