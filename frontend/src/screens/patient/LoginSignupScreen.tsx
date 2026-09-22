import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';
import { useDispatch } from 'react-redux';
import { switchUserType } from '../../store';

export const LoginSignupScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('rajesh@email.com');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(switchUserType(role));
    if (role === 'doctor') {
      navigation.navigate('DoctorMain');
    } else {
      navigation.navigate('PatientMain');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to MedSimplify 👋</Text>
        <Text style={styles.subtitle}>Sign in to simplify reports and track your care</Text>

        <View style={styles.roleToggle}>
          <TouchableOpacity 
            style={[styles.roleBtn, role === 'patient' && styles.roleBtnActive]}
            onPress={() => setRole('patient')}
          >
            <Text style={[styles.roleText, role === 'patient' && styles.roleTextActive]}>Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleBtn, role === 'doctor' && styles.roleBtnActive]}
            onPress={() => setRole('doctor')}
          >
            <Text style={[styles.roleText, role === 'doctor' && styles.roleTextActive]}>Doctor</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Email Address</Text>
        <TextInput 
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter password"
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Sign In as {role === 'doctor' ? 'Doctor' : 'Patient'}</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.socialBtn}>
          <Text style={styles.socialBtnText}>🌐 Google Sign-In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialBtn}>
          <Text style={styles.socialBtnText}>📱 Phone OTP Login</Text>
        </TouchableOpacity>

        <View style={styles.footerLinks}>
          <TouchableOpacity><Text style={styles.linkText}>Don't have an account? Sign Up</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SPACING.md
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: 4
  },
  subtitle: {
    ...TYPOGRAPHY.small,
    marginBottom: SPACING.md
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 4,
    marginBottom: SPACING.md
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6
  },
  roleBtnActive: {
    backgroundColor: COLORS.primary
  },
  roleText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textSecondary
  },
  roleTextActive: {
    color: '#FFF'
  },
  label: {
    ...TYPOGRAPHY.small,
    color: COLORS.textPrimary,
    marginBottom: 6,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.buttonRadius,
    padding: 12,
    fontSize: 16,
    marginBottom: SPACING.sm
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: SPACING.xs
  },
  loginBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: '#FFF'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border
  },
  dividerText: {
    ...TYPOGRAPHY.caption,
    marginHorizontal: 8
  },
  socialBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SPACING.buttonRadius,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  socialBtnText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary
  },
  footerLinks: {
    alignItems: 'center',
    marginTop: SPACING.sm
  },
  linkText: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: '600'
  }
});
