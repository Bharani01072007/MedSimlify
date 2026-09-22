import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Patient Screens
import { SplashScreen } from '../screens/patient/SplashScreen';
import { LoginSignupScreen } from '../screens/patient/LoginSignupScreen';
import { HomeScreen } from '../screens/patient/HomeScreen';
import { UploadReportScreen } from '../screens/patient/UploadReportScreen';
import { AnalysisLoadingScreen } from '../screens/patient/AnalysisLoadingScreen';
import { ReportResultsScreen } from '../screens/patient/ReportResultsScreen';
import { ReportHistoryScreen } from '../screens/patient/ReportHistoryScreen';
import { ReportComparisonScreen } from '../screens/patient/ReportComparisonScreen';
import { MedicinesListScreen } from '../screens/patient/MedicinesListScreen';
import { AddMedicineScreen } from '../screens/patient/AddMedicineScreen';
import { SymptomTrackerScreen } from '../screens/patient/SymptomTrackerScreen';
import { SymptomTrendsScreen } from '../screens/patient/SymptomTrendsScreen';
import { AppointmentsScreen } from '../screens/patient/AppointmentsScreen';
import { ChatWithDoctorScreen } from '../screens/patient/ChatWithDoctorScreen';
import { AIHealthAssistantScreen } from '../screens/patient/AIHealthAssistantScreen';
import { EmergencyInfoScreen } from '../screens/patient/EmergencyInfoScreen';
import { ProfileSettingsScreen } from '../screens/patient/ProfileSettingsScreen';
import { FamilyMembersScreen } from '../screens/patient/FamilyMembersScreen';

// Doctor Screens
import { DoctorDashboardScreen } from '../screens/doctor/DoctorDashboardScreen';
import { PatientListScreen } from '../screens/doctor/PatientListScreen';
import { PatientProfileDoctorViewScreen } from '../screens/doctor/PatientProfileDoctorViewScreen';
import { CreatePrescriptionScreen } from '../screens/doctor/CreatePrescriptionScreen';
import { ClinicManagementDashboardScreen } from '../screens/doctor/ClinicManagementDashboardScreen';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PatientTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: { paddingBottom: 6, paddingTop: 6, height: 60 }
    }}
  >
    <Tab.Screen 
      name="HomeTab" 
      component={HomeScreen} 
      options={{ tabBarLabel: 'Home', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }}
    />
    <Tab.Screen 
      name="ReportsTab" 
      component={ReportHistoryScreen} 
      options={{ tabBarLabel: 'Reports', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text> }}
    />
    <Tab.Screen 
      name="MedicinesTab" 
      component={MedicinesListScreen} 
      options={{ tabBarLabel: 'Medicines', tabBarIcon: () => <Text style={{ fontSize: 20 }}>💊</Text> }}
    />
    <Tab.Screen 
      name="ProfileTab" 
      component={ProfileSettingsScreen} 
      options={{ tabBarLabel: 'Profile', tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text> }}
    />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      {/* Auth */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="LoginSignup" component={LoginSignupScreen} />

      {/* Patient App Main */}
      <Stack.Screen name="PatientMain" component={PatientTabNavigator} />
      <Stack.Screen name="UploadReport" component={UploadReportScreen} />
      <Stack.Screen name="AnalysisLoading" component={AnalysisLoadingScreen} />
      <Stack.Screen name="ReportResults" component={ReportResultsScreen} />
      <Stack.Screen name="ReportHistory" component={ReportHistoryScreen} />
      <Stack.Screen name="ReportComparison" component={ReportComparisonScreen} />
      <Stack.Screen name="MedicinesList" component={MedicinesListScreen} />
      <Stack.Screen name="AddMedicine" component={AddMedicineScreen} />
      <Stack.Screen name="SymptomTracker" component={SymptomTrackerScreen} />
      <Stack.Screen name="SymptomTrends" component={SymptomTrendsScreen} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
      <Stack.Screen name="ChatWithDoctor" component={ChatWithDoctorScreen} />
      <Stack.Screen name="AIHealthAssistant" component={AIHealthAssistantScreen} />
      <Stack.Screen name="EmergencyInfo" component={EmergencyInfoScreen} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      <Stack.Screen name="FamilyMembers" component={FamilyMembersScreen} />

      {/* Doctor App */}
      <Stack.Screen name="DoctorMain" component={DoctorDashboardScreen} />
      <Stack.Screen name="PatientList" component={PatientListScreen} />
      <Stack.Screen name="PatientProfileDoctor" component={PatientProfileDoctorViewScreen} />
      <Stack.Screen name="CreatePrescription" component={CreatePrescriptionScreen} />
      <Stack.Screen name="ClinicAnalytics" component={ClinicManagementDashboardScreen} />
    </Stack.Navigator>
  );
};
