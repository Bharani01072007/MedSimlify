import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const AnalysisLoadingScreen = ({ navigation }: any) => {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    "📷 Pre-processing image & enhancing contrast...",
    "🔍 Running OCR text extraction...",
    "🏷️ Classifying document type (Lab / CBC Report)...",
    "🩺 Extracting Clinical Entities & Reference Ranges...",
    "💡 Simplifying complex medical terms into plain English...",
    "🌐 Generating Regional Multilingual Summaries..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev: number) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          navigation.replace('ReportResults');
          return prev;
        }
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.iconAnimation}>🤖 ✨</Text>
      <Text style={styles.title}>AI Medical Pipeline</Text>
      <Text style={styles.subtitle}>Analyzing report data & generating patient summary</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.percentText}>{progressPercent}%</Text>
      </View>

      {/* Step Status Text */}
      <View style={styles.statusBox}>
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 10 }} />
        <Text style={styles.statusText}>{steps[stepIndex]}</Text>
      </View>

      <Text style={styles.timeEstimate}>⚡ Processing takes ~30-60 seconds</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md
  },
  iconAnimation: {
    fontSize: 54,
    marginBottom: SPACING.xs
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: 4
  },
  subtitle: {
    ...TYPOGRAPHY.small,
    textAlign: 'center',
    marginBottom: SPACING.lg
  },
  progressContainer: {
    width: '90%',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary
  },
  percentText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    width: '90%',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md
  },
  statusText: {
    ...TYPOGRAPHY.bodyBold,
    flex: 1,
    fontSize: 14
  },
  timeEstimate: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary
  }
});
