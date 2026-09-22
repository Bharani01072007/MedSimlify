import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const SymptomTrackerScreen = ({ navigation }: any) => {
  const [mood, setMood] = useState('😊');
  const [temp, setTemp] = useState('99.1');
  const [painLevel, setPainLevel] = useState('Mild');
  const [energyLevel, setEnergyLevel] = useState('Normal');

  const symptoms = ['Fever', 'Body Pain', 'Headache', 'Nausea', 'Fatigue', 'Skin Rash'];
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Fever', 'Body Pain']);

  const toggleSymptom = (s: string) => {
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(selectedSymptoms.filter((item: string) => item !== s));
    } else {
      setSelectedSymptoms([...selectedSymptoms, s]);
    }
  };

  const handleSave = () => {
    Alert.alert("Symptoms Saved! 📝", "Your daily health entry has been recorded.");
    navigation.navigate('SymptomTrends');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>📝 Track Your Symptoms</Text>

      {/* Mood Selector */}
      <View style={styles.card}>
        <Text style={styles.labelTitle}>How are you feeling today?</Text>
        <View style={styles.emojiRow}>
          {['😊', '😐', '😞', '🤒'].map((e: string) => (
            <TouchableOpacity 
              key={e}
              style={[styles.emojiBox, mood === e && styles.emojiBoxActive]}
              onPress={() => setMood(e)}
            >
              <Text style={styles.emojiText}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Temperature Input */}
      <View style={styles.card}>
        <Text style={styles.labelTitle}>Body Temperature (°F)</Text>
        <TextInput 
          style={styles.tempInput}
          value={temp}
          onChangeText={setTemp}
          keyboardType="numeric"
          placeholder="e.g. 101.2"
        />
        {parseFloat(temp) > 100.4 && (
          <Text style={styles.tempAlert}>⚠️ Fever Alert: Temperature above 100.4°F</Text>
        )}
      </View>

      {/* Symptom Checkboxes */}
      <View style={styles.card}>
        <Text style={styles.labelTitle}>Select Symptoms Present Today</Text>
        <View style={styles.chipGrid}>
          {symptoms.map((s) => {
            const active = selectedSymptoms.includes(s);
            return (
              <TouchableOpacity 
                key={s}
                style={[styles.symptomChip, active && styles.symptomChipActive]}
                onPress={() => toggleSymptom(s)}
              >
                <Text style={[styles.symptomChipText, active && styles.symptomChipTextActive]}>
                  {active ? `☑ ${s}` : `☐ ${s}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Pain & Energy Scale */}
      <View style={styles.card}>
        <Text style={styles.labelTitle}>Pain Level: {painLevel}</Text>
        <View style={styles.scaleRow}>
          {['None', 'Mild', 'Moderate', 'Severe'].map((p) => (
            <TouchableOpacity 
              key={p}
              style={[styles.scaleBtn, painLevel === p && styles.scaleBtnActive]}
              onPress={() => setPainLevel(p)}
            >
              <Text style={[styles.scaleText, painLevel === p && styles.scaleTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Entry & View Trends</Text>
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
    marginBottom: SPACING.md
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2
  },
  labelTitle: {
    ...TYPOGRAPHY.bodyBold,
    marginBottom: SPACING.sm
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  emojiBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  emojiBoxActive: {
    backgroundColor: '#EFF6FF',
    borderColor: COLORS.primary
  },
  emojiText: {
    fontSize: 32
  },
  tempInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.buttonRadius,
    padding: 12,
    fontSize: 18,
    fontWeight: '700'
  },
  tempAlert: {
    ...TYPOGRAPHY.small,
    color: COLORS.error,
    fontWeight: '700',
    marginTop: 6
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  symptomChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8
  },
  symptomChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  symptomChipText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary
  },
  symptomChipTextActive: {
    color: '#FFF',
    fontWeight: '700'
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scaleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 2
  },
  scaleBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  scaleText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  scaleTextActive: {
    color: '#FFF'
  },
  saveBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: SPACING.lg
  },
  saveBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF',
    fontSize: 16
  }
});
