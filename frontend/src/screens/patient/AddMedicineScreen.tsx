import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const AddMedicineScreen = ({ navigation }: any) => {
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [frequency, setFrequency] = useState('Three times daily');
  const [timing, setTiming] = useState('After food');

  const handleSave = () => {
    if (!medName) {
      Alert.alert("Required", "Please enter a medicine name.");
      return;
    }
    Alert.alert("Success! 💊", "Medicine reminder added successfully.");
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>➕ Add New Medicine</Text>
      
      {/* Option 1: Upload Prescription */}
      <View style={styles.ocrCard}>
        <Text style={styles.ocrTitle}>Option 1: Upload Prescription Photo</Text>
        <Text style={styles.ocrSubtitle}>MedSimplify AI will automatically extract medicine names & dosages</Text>
        <TouchableOpacity 
          style={styles.ocrBtn}
          onPress={() => Alert.alert("Prescription OCR", "Scanning prescription for medicines...")}
        >
          <Text style={styles.ocrBtnText}>📸 Scan Prescription Photo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.dividerOr}>- OR -</Text>

      {/* Option 2: Manual Form Entry */}
      <View style={styles.card}>
        <Text style={styles.formTitle}>Option 2: Manual Medicine Entry</Text>

        <Text style={styles.label}>Medicine Name</Text>
        <TextInput 
          style={styles.input}
          value={medName}
          onChangeText={setMedName}
          placeholder="e.g. Paracetamol, Pantoprazole, Amoxicillin"
        />

        <Text style={styles.label}>Dosage Amount</Text>
        <TextInput 
          style={styles.input}
          value={dosage}
          onChangeText={setDosage}
          placeholder="e.g. 1 Tablet, 500mg, 10ml"
        />

        <Text style={styles.label}>Frequency</Text>
        <TextInput 
          style={styles.input}
          value={frequency}
          onChangeText={setFrequency}
          placeholder="e.g. Once daily, Twice daily, Every 6 hours"
        />

        <Text style={styles.label}>Meal Timing</Text>
        <TextInput 
          style={styles.input}
          value={timing}
          onChangeText={setTiming}
          placeholder="e.g. After food, Before food, Empty stomach"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Medicine Reminder</Text>
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
  ocrCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: SPACING.md
  },
  ocrTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
    marginBottom: 4
  },
  ocrSubtitle: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.sm
  },
  ocrBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 12,
    alignItems: 'center'
  },
  ocrBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF'
  },
  dividerOr: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    elevation: 2,
    marginBottom: SPACING.lg
  },
  formTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md
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
    fontSize: 16,
    marginBottom: SPACING.md
  },
  saveBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: SPACING.xs
  },
  saveBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF',
    fontSize: 16
  }
});
