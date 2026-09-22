import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const FamilyMembersScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>👨‍👩‍👧‍👦 Family Profiles</Text>
      <Text style={styles.subtitle}>Manage health records and report summaries for your family</Text>

      {/* Member Card 1 */}
      <View style={styles.memberCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>👩</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.memberName}>Priya Kumar (Wife)</Text>
          <Text style={styles.memberMeta}>32F | Blood Group: O+</Text>
          <Text style={styles.memberBadge}>3 Reports Saved</Text>
        </View>
        <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('ReportHistory')}>
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
      </View>

      {/* Member Card 2 */}
      <View style={styles.memberCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>👦</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.memberName}>Rohan Kumar (Son)</Text>
          <Text style={styles.memberMeta}>8M | Blood Group: B+</Text>
          <Text style={styles.memberBadge}>1 Report Saved</Text>
        </View>
        <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('ReportHistory')}>
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.addMemberBtn}
        onPress={() => Alert.alert("Add Family Member", "Open form to enter name, relationship, age, and blood group.")}
      >
        <Text style={styles.addMemberText}>➕ Add Family Member</Text>
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
    marginBottom: 2
  },
  subtitle: {
    ...TYPOGRAPHY.small,
    marginBottom: SPACING.md
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    elevation: 2
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: {
    fontSize: 28
  },
  memberName: {
    ...TYPOGRAPHY.h3,
    fontSize: 16
  },
  memberMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary
  },
  memberBadge: {
    ...TYPOGRAPHY.caption,
    color: COLORS.secondary,
    fontWeight: '700',
    marginTop: 2
  },
  viewBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SPACING.buttonRadius
  },
  viewBtnText: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    color: '#FFF'
  },
  addMemberBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: SPACING.md
  },
  addMemberText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF',
    fontSize: 16
  }
});
