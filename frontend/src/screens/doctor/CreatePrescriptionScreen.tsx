import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const CreatePrescriptionScreen = ({ navigation }: any) => {
  const [medName, setMedName] = useState('Paracetamol 650mg');
  const [dosage, setDosage] = useState('1 tablet TDS (3 times daily)');
  const [advice, setAdvice] = useState('Complete bed rest, 3-4L fluid hydration, repeat CBC test tomorrow.');
  const [showAiWarning, setShowAiWarning] = useState(false);

  const handleMedNameChange = (text: string) => {
    setMedName(text);
    if (text.toLowerCase().includes('aspirin') || text.toLowerCase().includes('ibuprofen')) {
      setShowAiWarning(true);
    } else {
      setShowAiWarning(false);
    }
  };

  const handleSendPrescription = () => {
    Alert.alert("Prescription Issued! 📄", "Digital prescription sent directly to patient's MedSimplify app.");
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>📝 Create Digital Prescription</Text>

      {/* Patient Meta */}
      <View style={styles.patientMetaBox}>
        <Text style={styles.patientName}>Patient: Rajesh Kumar (34M)</Text>
        <Text style={styles.patientDiag}>Diagnosis: Dengue Fever | Platelets: 80,000 /uL</Text>
      </View>

      {/* AI Drug Interaction Warning Banner */}
      {showAiWarning && (
        <View style={styles.aiWarningBox}>
          <Text style={styles.aiWarningTitle}>⚠️ AI CONTRAINDICATION WARNING</Text>
          <Text style={styles.aiWarningText}>
            NSAIDs (Aspirin/Ibuprofen) impair platelet aggregation and significantly increase bleeding risk in Dengue fever. Use Paracetamol for fever management instead.
          </Text>
        </View>
      )}

      {/* Prescription Form */}
      <View style={styles.card}>
        <Text style={styles.label}>Add Medicine Name</Text>
        <TextInput 
          style={styles.input}
          value={medName}
          onChangeText={handleMedNameChange}
          placeholder="e.g. Paracetamol 650mg, ORSL"
        />

        <Text style={styles.label}>Dosage & Frequency</Text>
        <TextInput 
          style={styles.input}
          value={dosage}
          onChangeText={setDosage}
          placeholder="e.g. 1 Tablet TDS after meals"
        />

        <Text style={styles.label}>Clinical Advice & Instructions</Text>
        <TextInput 
          style={[styles.input, { height: 80 }]}
          value={advice}
          onChangeText={setAdvice}
          multiline
          placeholder="General advice for patient..."
        />

        <Text style={styles.label}>Follow-up Date</Text>
        <TextInput 
          style={styles.input}
          value="Tomorrow, 15-Sep-2026 at 10:00 AM"
          editable={false}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={handleSendPrescription}>
          <Text style={styles.sendBtnText}>📲 Send Prescription to Patient App</Text>
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
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.md
  },
  patientMetaBox: {
    backgroundColor: '#EFF6FF',
    padding: SPACING.md,
    borderRadius: SPACING.cardRadius,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  patientName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary
  },
  patientDiag: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary
  },
  aiWarningBox: {
    backgroundColor: '#FEF2F2',
    padding: SPACING.md,
    borderRadius: SPACING.cardRadius,
    borderWidth: 2,
    borderColor: COLORS.error,
    marginBottom: SPACING.md
  },
  aiWarningTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.error,
    marginBottom: 4
  },
  aiWarningText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    elevation: 2,
    marginBottom: SPACING.lg
  },
  label: {
    ...TYPOGRAPHY.small,
    fontWeight: '600',
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.buttonRadius,
    padding: 12,
    fontSize: 15,
    marginBottom: SPACING.md
  },
  sendBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: SPACING.xs
  },
  sendBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF',
    fontSize: 16
  }
});
