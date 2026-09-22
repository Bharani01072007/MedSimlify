import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

export const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('LoginSignup');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoIcon}>🏥</Text>
        <Text style={styles.appName}>MedSimplify</Text>
        <Text style={styles.tagline}>Your Health, Simplified</Text>
      </View>
      <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
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
  logoContainer: {
    alignItems: 'center'
  },
  logoIcon: {
    fontSize: 64,
    marginBottom: SPACING.xs
  },
  appName: {
    ...TYPOGRAPHY.h1,
    fontSize: 32,
    color: COLORS.primary,
    marginBottom: 4
  },
  tagline: {
    ...TYPOGRAPHY.small,
    fontSize: 16,
    color: COLORS.textSecondary
  },
  loader: {
    position: 'absolute',
    bottom: 60
  }
});
