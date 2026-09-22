import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const EmergencyInfoScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>⚠️ Emergency Information</Text>

      {/* Prominent ICE Card */}
      <View style={styles.iceCard}>
        <View style={styles.iceHeader}>
          <Text style={styles.iceTitle}>In Case of Emergency (ICE Card)</Text>
          <Text style={styles.bloodBadge}>B+</Text>
        </View>

        <Text style={styles.iceName}>Patient: Rajesh Kumar (34M)</Text>
        <Text style={styles.iceDetail}>Allergies: None known</Text>
        <Text style={styles.iceDetail}>Condition: Dengue Recovery (Platelets: 80,000)</Text>
        <Text style={styles.iceDetail}>Emergency Contact: Priya Kumar (Wife)</Text>
        <Text style={styles.icePhone}>📞 +91-9876543210</Text>
      </View>

      {/* 1-Tap Emergency Calling */}
      <Text style={styles.sectionHeader}>Instant Emergency Services</Text>
      <TouchableOpacity 
        style={styles.callCardRed}
        onPress={() => Alert.alert("Emergency Calling", "Dialing 108 Ambulance Services...")}
      >
        <Text style={styles.callIcon}>🚑</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.callTitle}>Call 108 Ambulance Services</Text>
          <Text style={styles.callSub}>Toll-free emergency Medical Response</Text>
        </View>
        <Text style={styles.callBtnText}>CALL NOW</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.callCardBlue}
        onPress={() => Alert.alert("Emergency Calling", "Dialing 112 National Emergency...")}
      >
        <Text style={styles.callIcon}>🚨</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.callTitle}>Call 112 National Emergency</Text>
          <Text style={styles.callSub}>All-in-one Emergency Helpline</Text>
        </View>
        <Text style={styles.callBtnText}>CALL NOW</Text>
      </TouchableOpacity>

      {/* Emergency Warning Signs Guide */}
      <Text style={styles.sectionHeader}>Red Flag Emergency Symptoms</Text>
      <View style={styles.warnCard}>
        <Text style={styles.warnTitle}>🔴 Dengue Warning Signs</Text>
        <Text style={styles.warnText}>• Severe persistent abdominal pain</Text>
        <Text style={styles.warnText}>• Bleeding gums or nosebleeds</Text>
        <Text style={styles.warnText}>• Blood in vomitus or stool</Text>
      </View>

      <TouchableOpacity style={styles.mapBtn} onPress={() => Alert.alert("Map Integration", "Locating nearest hospital emergency room...")}>
        <Text style={styles.mapBtnText}>🏥 Find Nearest Emergency Hospital</Text>
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
    color: COLORS.error,
    marginBottom: SPACING.md
  },
  iceCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.error,
    marginBottom: SPACING.md
  },
  iceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs
  },
  iceTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.error,
    fontSize: 14
  },
  bloodBadge: {
    ...TYPOGRAPHY.h2,
    backgroundColor: COLORS.error,
    color: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  iceName: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  iceDetail: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary,
    marginBottom: 2
  },
  icePhone: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.error,
    marginTop: 6,
    fontSize: 18
  },
  sectionHeader: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm
  },
  callCardRed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: 10
  },
  callCardBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md
  },
  callIcon: {
    fontSize: 32,
    marginRight: 12
  },
  callTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF',
    fontSize: 16
  },
  callSub: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.8)'
  },
  callBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  warnCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2
  },
  warnTitle: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.error,
    marginBottom: 6
  },
  warnText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  mapBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: SPACING.lg
  },
  mapBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF',
    fontSize: 16
  }
});
