import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const ReportResultsScreen = ({ navigation }: any) => {
  const [lang, setLang] = useState<'en' | 'hi' | 'ta' | 'te'>('en');
  const [showFullTable, setShowFullTable] = useState(false);

  return (
    <ScrollView style={styles.container}>
      {/* Complete Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>✅ Analysis Complete!</Text>
      </View>

      {/* Language Selector */}
      <View style={styles.langRow}>
        <Text style={styles.langLabel}>Language:</Text>
        <TouchableOpacity 
          style={[styles.langChip, lang === 'en' && styles.langChipActive]}
          onPress={() => setLang('en')}
        >
          <Text style={[styles.langChipText, lang === 'en' && styles.langChipTextActive]}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.langChip, lang === 'hi' && styles.langChipActive]}
          onPress={() => setLang('hi')}
        >
          <Text style={[styles.langChipText, lang === 'hi' && styles.langChipTextActive]}>हिंदी</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.langChip, lang === 'ta' && styles.langChipActive]}
          onPress={() => setLang('ta')}
        >
          <Text style={[styles.langChipText, lang === 'ta' && styles.langChipTextActive]}>தமிழ்</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.langChip, lang === 'te' && styles.langChipActive]}
          onPress={() => setLang('te')}
        >
          <Text style={[styles.langChipText, lang === 'te' && styles.langChipTextActive]}>తెలుగు</Text>
        </TouchableOpacity>
      </View>

      {/* Main Summary Card */}
      <View style={styles.card}>
        <Text style={styles.reportTitle}>
          {lang === 'hi' ? '📊 आपकी रक्त जांच रिपोर्ट (Dengue)' : '📊 Blood Test & Dengue Profile'}
        </Text>
        <Text style={styles.patientInfo}>Patient: Rajesh Kumar | 34 yrs | Date: 14-Sep-2026</Text>

        {/* IMPORTANT FINDINGS SECTION */}
        <View style={styles.sectionBoxRed}>
          <Text style={styles.sectionHeaderRed}>🔴 IMPORTANT FINDINGS:</Text>
          
          <View style={styles.findingItem}>
            <Text style={styles.findingTitle}>• Dengue Test: POSITIVE ✓</Text>
            <Text style={styles.findingDesc}>→ You have active DENGUE FEVER infection.</Text>
          </View>

          <View style={styles.findingItem}>
            <Text style={styles.findingTitle}>• Platelet Count: 80,000 (LOW) ⚠️</Text>
            <Text style={styles.findingDesc}>→ Normal Range: 150,000 - 450,000 /uL</Text>
            <Text style={styles.findingDesc}>→ Risk: Bleeding risk increases if count drops further.</Text>
          </View>
        </View>

        {/* WHAT TO DO SECTION */}
        <View style={styles.sectionBoxGreen}>
          <Text style={styles.sectionHeaderGreen}>✅ WHAT TO DO (ACTION CHECKLIST):</Text>
          <Text style={styles.checkItem}>☑️ Drink 3-4 Liters of fluids daily (ORSL, coconut water).</Text>
          <Text style={styles.checkItem}>☑️ Take complete bed rest and avoid strenuous physical activity.</Text>
          <Text style={styles.checkItem}>☑️ Monitor platelet count with repeat blood test in 24 hours.</Text>
          <Text style={styles.checkItem}>☑️ Avoid Ibuprofen/Aspirin. Only take Paracetamol if prescribed.</Text>
        </View>

        {/* WARNING SIGNS SECTION */}
        <View style={styles.sectionBoxOrange}>
          <Text style={styles.sectionHeaderOrange}>⚠️ WARNING SIGNS (Seek Emergency Care If):</Text>
          <Text style={styles.warnItem}>• Severe abdominal pain or continuous vomiting</Text>
          <Text style={styles.warnItem}>• Bleeding from gums, nose, or red spots on skin</Text>
          <Text style={styles.warnItem}>• Extreme weakness or difficulty breathing</Text>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: COLORS.error }]}
            onPress={() => navigation.navigate('EmergencyInfo')}
          >
            <Text style={styles.actionBtnText}>📞 Emergency</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: COLORS.primary }]}
            onPress={() => Alert.alert("Save PDF", "Report PDF saved to device downloads.")}
          >
            <Text style={styles.actionBtnText}>💾 Save PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: COLORS.secondary }]}
            onPress={() => navigation.navigate('MedicinesList')}
          >
            <Text style={styles.actionBtnText}>🔔 Reminders</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expandable Full Test Values Table */}
      <TouchableOpacity 
        style={styles.expandHeader}
        onPress={() => setShowFullTable(!showFullTable)}
      >
        <Text style={styles.expandTitle}>
          {showFullTable ? '▼ Hide Full Test Table' : '▶ View Full Lab Test Values Table'}
        </Text>
      </TouchableOpacity>

      {showFullTable && (
        <View style={styles.tableCard}>
          <View style={styles.tableRowHeader}>
            <Text style={[styles.tableCellHeader, { flex: 2 }]}>Test Parameter</Text>
            <Text style={[styles.tableCellHeader, { flex: 1 }]}>Value</Text>
            <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>Ref. Range</Text>
            <Text style={[styles.tableCellHeader, { flex: 1 }]}>Flag</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Dengue NS1 Antigen</Text>
            <Text style={[styles.tableCell, { flex: 1, fontWeight: '700' }]}>POSITIVE</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>Negative</Text>
            <Text style={[styles.tableCell, { flex: 1, color: COLORS.error, fontWeight: '700' }]}>CRITICAL</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Platelet Count</Text>
            <Text style={[styles.tableCell, { flex: 1, fontWeight: '700' }]}>80,000</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>1.5L - 4.5L</Text>
            <Text style={[styles.tableCell, { flex: 1, color: COLORS.error, fontWeight: '700' }]}>LOW</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Total WBC</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>3,800</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>4k - 11k</Text>
            <Text style={[styles.tableCell, { flex: 1, color: COLORS.accent }]}>LOW</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Hemoglobin</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>14.2 g/dL</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>13.0 - 17.0</Text>
            <Text style={[styles.tableCell, { flex: 1, color: COLORS.secondary }]}>NORMAL</Text>
          </View>
        </View>
      )}

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
  headerRow: {
    marginBottom: SPACING.xs
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    fontSize: 22
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  langLabel: {
    ...TYPOGRAPHY.small,
    fontWeight: '600',
    marginRight: 6
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6
  },
  langChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  langChipText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary
  },
  langChipTextActive: {
    color: '#FFF',
    fontWeight: '700'
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    elevation: 3,
    marginBottom: SPACING.md
  },
  reportTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: 2
  },
  patientInfo: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.md
  },
  sectionBoxRed: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md
  },
  sectionHeaderRed: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.error,
    marginBottom: 6
  },
  findingItem: {
    marginBottom: 6
  },
  findingTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    fontSize: 15
  },
  findingDesc: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginLeft: 8
  },
  sectionBoxGreen: {
    backgroundColor: '#ECFDF5',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md
  },
  sectionHeaderGreen: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.secondary,
    marginBottom: 6
  },
  checkItem: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  sectionBoxOrange: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md
  },
  sectionHeaderOrange: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.accent,
    marginBottom: 6
  },
  warnItem: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SPACING.buttonRadius,
    alignItems: 'center',
    marginHorizontal: 3
  },
  actionBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF',
    fontSize: 13
  },
  expandHeader: {
    backgroundColor: COLORS.cardBackground,
    padding: SPACING.md,
    borderRadius: SPACING.cardRadius,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  expandTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary
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
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider
  },
  tableCell: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary
  }
});
