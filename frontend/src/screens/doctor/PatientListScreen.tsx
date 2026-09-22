import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const PatientListScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>👥 Patient Directory</Text>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search patient by name or phone..."
        />
      </View>

      <Text style={styles.sectionHeader}>Active Patients</Text>

      <TouchableOpacity 
        style={styles.patientCard}
        onPress={() => navigation.navigate('PatientProfileDoctor')}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Rajesh Kumar (34M)</Text>
          <Text style={styles.meta}>Last visit: 14-Sep-2026 | Dengue Positive</Text>
          <Text style={styles.tagAlert}>⚠️ Platelets: 80,000 /uL (Low)</Text>
        </View>
        <Text style={styles.arrow}>➔</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.patientCard}
        onPress={() => navigation.navigate('PatientProfileDoctor')}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👩</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Anita Sharma (45F)</Text>
          <Text style={styles.meta}>Last visit: 10-Sep-2026 | Hypertension</Text>
          <Text style={styles.tagNormal}>🟢 Blood Pressure: 130/85</Text>
        </View>
        <Text style={styles.arrow}>➔</Text>
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
    marginBottom: SPACING.sm
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.buttonRadius,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14
  },
  sectionHeader: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 2
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: {
    fontSize: 24
  },
  name: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 16
  },
  meta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary
  },
  tagAlert: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: '700',
    marginTop: 2
  },
  tagNormal: {
    ...TYPOGRAPHY.caption,
    color: COLORS.secondary,
    fontWeight: '700',
    marginTop: 2
  },
  arrow: {
    fontSize: 18,
    color: COLORS.primary
  }
});
