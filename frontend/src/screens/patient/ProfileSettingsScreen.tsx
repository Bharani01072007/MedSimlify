import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const ProfileSettingsScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.userName}>Rajesh Kumar</Text>
        <Text style={styles.userEmail}>rajesh@email.com | +91-9876543210</Text>
        <Text style={styles.userBadge}>Patient Account</Text>
      </View>

      {/* Settings Options List */}
      <View style={styles.sectionCard}>
        <TouchableOpacity 
          style={styles.menuRow}
          onPress={() => navigation.navigate('FamilyMembers')}
        >
          <Text style={styles.menuIcon}>👨‍👩‍👧‍👦</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuTitle}>Family Members</Text>
            <Text style={styles.menuSub}>3 family profiles linked</Text>
          </View>
          <Text style={styles.menuArrow}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} onPress={() => Alert.alert("Language", "Selected UI Language: English (Changeable to Hindi/Tamil/Telugu)")}>
          <Text style={styles.menuIcon}>🌐</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuTitle}>App Language</Text>
            <Text style={styles.menuSub}>English, हिंदी, தமிழ், తెలుగు</Text>
          </View>
          <Text style={styles.menuArrow}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('EmergencyInfo')}>
          <Text style={styles.menuIcon}>⚠️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuTitle}>Emergency ICE Settings</Text>
            <Text style={styles.menuSub}>Manage emergency contacts & blood group</Text>
          </View>
          <Text style={styles.menuArrow}>➔</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.switchRoleBtn}
        onPress={() => navigation.navigate('DoctorMain')}
      >
        <Text style={styles.switchRoleText}>👨‍⚕️ Switch to Doctor App View</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutBtn}
        onPress={() => navigation.navigate('LoginSignup')}
      >
        <Text style={styles.logoutBtnText}>Log Out</Text>
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
  profileCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    elevation: 2
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs
  },
  avatarText: {
    fontSize: 40
  },
  userName: {
    ...TYPOGRAPHY.h2,
    marginBottom: 2
  },
  userEmail: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginBottom: 6
  },
  userBadge: {
    ...TYPOGRAPHY.caption,
    backgroundColor: '#EFF6FF',
    color: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: '700'
  },
  sectionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 12
  },
  menuTitle: {
    ...TYPOGRAPHY.bodyBold
  },
  menuSub: {
    ...TYPOGRAPHY.caption
  },
  menuArrow: {
    fontSize: 18,
    color: COLORS.textSecondary
  },
  switchRoleBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  switchRoleText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary
  },
  logoutBtn: {
    backgroundColor: COLORS.error,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: SPACING.lg
  },
  logoutBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF'
  }
});
