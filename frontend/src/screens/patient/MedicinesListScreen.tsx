import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const MedicinesListScreen = ({ navigation }: any) => {
  const [tab, setTab] = useState<'Active' | 'Completed' | 'All'>('Active');
  const [takenStatus, setTakenStatus] = useState<Record<number, boolean>>({ 1: false, 2: true });

  const handleLogTaken = (id: number) => {
    setTakenStatus((prev: Record<number, boolean>) => ({ ...prev, [id]: !prev[id] }));
    Alert.alert("Dose Recorded! ✅", "Medicine dose logged successfully in your adherence history.");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>💊 My Medicines</Text>
      
      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'Active' && styles.tabBtnActive]}
          onPress={() => setTab('Active')}
        >
          <Text style={[styles.tabText, tab === 'Active' && styles.tabTextActive]}>Active (2)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'Completed' && styles.tabBtnActive]}
          onPress={() => setTab('Completed')}
        >
          <Text style={[styles.tabText, tab === 'Completed' && styles.tabTextActive]}>Completed</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabBtn, tab === 'All' && styles.tabBtnActive]}
          onPress={() => setTab('All')}
        >
          <Text style={[styles.tabText, tab === 'All' && styles.tabTextActive]}>All</Text>
        </TouchableOpacity>
      </View>

      {/* Medicine Card 1 */}
      <View style={styles.medCard}>
        <View style={styles.medCardHeader}>
          <View>
            <Text style={styles.medName}>Paracetamol 650mg</Text>
            <Text style={styles.medDosage}>1 tablet every 6 hours (After food)</Text>
          </View>
          <TouchableOpacity 
            style={[styles.takeBtn, takenStatus[1] && styles.takeBtnDone]}
            onPress={() => handleLogTaken(1)}
          >
            <Text style={styles.takeBtnText}>{takenStatus[1] ? 'Taken ✅' : 'Log Taken'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.medCardFooter}>
          <Text style={styles.medProgress}>Progress: Day 3 of 5</Text>
          <Text style={styles.nextDose}>⏰ Next: Today, 2:00 PM</Text>
        </View>
      </View>

      {/* Medicine Card 2 */}
      <View style={styles.medCard}>
        <View style={styles.medCardHeader}>
          <View>
            <Text style={styles.medName}>ORSL Hydration Solution</Text>
            <Text style={styles.medDosage}>200 ml every 4 hours (Between meals)</Text>
          </View>
          <TouchableOpacity 
            style={[styles.takeBtn, takenStatus[2] && styles.takeBtnDone]}
            onPress={() => handleLogTaken(2)}
          >
            <Text style={styles.takeBtnText}>{takenStatus[2] ? 'Taken ✅' : 'Log Taken'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.medCardFooter}>
          <Text style={styles.medProgress}>Progress: Day 3 of 5</Text>
          <Text style={styles.nextDose}>⏰ Next: Today, 4:00 PM</Text>
        </View>
      </View>

      {/* Add Medicine Floating CTA */}
      <TouchableOpacity 
        style={styles.addMedBtn}
        onPress={() => navigation.navigate('AddMedicine')}
      >
        <Text style={styles.addMedBtnText}>➕ Add New Medicine</Text>
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
  medCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2
  },
  medCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.sm
  },
  medName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary
  },
  medDosage: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary
  },
  takeBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16
  },
  takeBtnDone: {
    backgroundColor: COLORS.secondary
  },
  takeBtnText: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    color: '#FFF'
  },
  medCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  medProgress: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600'
  },
  nextDose: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: '700'
  },
  addMedBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: SPACING.sm
  },
  addMedBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF',
    fontSize: 16
  }
});
