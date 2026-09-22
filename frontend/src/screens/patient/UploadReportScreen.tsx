import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const UploadReportScreen = ({ navigation }: any) => {
  const [selectedType, setSelectedType] = useState('Lab Report');

  const reportTypes = ['Lab Report', 'Prescription', 'Discharge Summary', 'X-ray / Radiology', 'Other'];

  const handleStartAnalysis = () => {
    navigation.navigate('AnalysisLoading');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>📤 Upload Medical Report</Text>
      <Text style={styles.subtitle}>Select document type and upload a clear photo or PDF</Text>

      {/* Report Type Selector */}
      <Text style={styles.sectionTitle}>1. Select Report Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
        {reportTypes.map((type) => (
          <TouchableOpacity 
            key={type}
            style={[styles.typeChip, selectedType === type && styles.typeChipActive]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[styles.typeChipText, selectedType === type && styles.typeChipTextActive]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Upload Options Grid */}
      <Text style={styles.sectionTitle}>2. Choose Upload Source</Text>
      <View style={styles.uploadOptionsRow}>
        <TouchableOpacity style={styles.uploadCard} onPress={handleStartAnalysis}>
          <Text style={styles.uploadIcon}>📸</Text>
          <Text style={styles.uploadCardTitle}>Take Photo</Text>
          <Text style={styles.uploadCardSubtitle}>Use Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadCard} onPress={handleStartAnalysis}>
          <Text style={styles.uploadIcon}>📁</Text>
          <Text style={styles.uploadCardTitle}>Gallery</Text>
          <Text style={styles.uploadCardSubtitle}>Choose Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadCard} onPress={handleStartAnalysis}>
          <Text style={styles.uploadIcon}>📄</Text>
          <Text style={styles.uploadCardTitle}>Upload PDF</Text>
          <Text style={styles.uploadCardSubtitle}>Document File</Text>
        </TouchableOpacity>
      </View>

      {/* Framing & Quality Guidelines */}
      <View style={styles.guidelineCard}>
        <Text style={styles.guidelineTitle}>💡 Photo Guidelines for Accurate AI OCR</Text>
        <Text style={styles.guidelineItem}>• Ensure bright, even lighting without shadows</Text>
        <Text style={styles.guidelineItem}>• Keep the report flat and hold phone steady</Text>
        <Text style={styles.guidelineItem}>• Make sure all 4 corners of the report are visible</Text>
        <Text style={styles.guidelineItem}>• Ensure medical terms and test numbers are sharp</Text>
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleStartAnalysis}>
        <Text style={styles.nextBtnText}>Analyze Report with AI ✨</Text>
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
    marginBottom: 4
  },
  subtitle: {
    ...TYPOGRAPHY.small,
    marginBottom: SPACING.md
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: 10,
    marginTop: 6
  },
  typeScroll: {
    flexDirection: 'row',
    marginBottom: SPACING.md
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8
  },
  typeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  typeChipText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textSecondary
  },
  typeChipTextActive: {
    color: '#FFF'
  },
  uploadOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md
  },
  uploadCard: {
    width: '31%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.sm,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 6
  },
  uploadCardTitle: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 14,
    textAlign: 'center'
  },
  uploadCardSubtitle: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center'
  },
  guidelineCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#FCD34D',
    marginBottom: SPACING.md
  },
  guidelineTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: '#B45309',
    marginBottom: 8
  },
  guidelineItem: {
    ...TYPOGRAPHY.small,
    color: '#78350F',
    marginBottom: 4
  },
  nextBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: SPACING.lg
  },
  nextBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF',
    fontSize: 18
  }
});
