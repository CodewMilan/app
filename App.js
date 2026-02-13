import 'react-native-gesture-handler';
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import Feather from '@expo/vector-icons/Feather';
import { useFonts } from '@expo-google-fonts/inter/useFonts';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import theme from './theme';

// Import Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Auth screens
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen';

// Import Main screens (no Startups)
import FeedScreen from './screens/FeedScreen';
import ProjectsScreen from './screens/ProjectsScreen';
import HackathonsScreen from './screens/HackathonsScreen';
import CollegeScreen from './screens/CollegeScreen';
import ProfileScreen from './screens/ProfileScreen';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Smooth loading screen with subtle pulse (using RN Animated to avoid Worklets/native mismatch)
function LoadingScreen() {
  const opacity = React.useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={{ opacity }}>
        <Feather name="activity" size={48} color={theme.primary} />
      </Animated.View>
    </View>
  );
}

// Main App Navigator (Tabs) – icons only, no labels, Feather icons
function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = 24;
          let name;
          switch (route.name) {
            case 'Feed': name = 'home'; break;
            case 'Projects': name = 'folder'; break;
            case 'Hackathons': name = 'award'; break;
            case 'College': name = 'book-open'; break;
            case 'Profile': name = 'user'; break;
            default: name = 'circle';
          }
          return <Feather name={name} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontFamily: theme.fontFamilySemiBold,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Hackathons" component={HackathonsScreen} />
      <Tab.Screen name="College" component={CollegeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Auth Navigator with smooth transitions
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { session, loading } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayoutRootView}>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: theme.primary,
            background: theme.background,
            card: theme.surface,
            text: theme.text,
            border: theme.border,
            notification: theme.primary,
          },
        }}
      >
        <StatusBar style="light" />
        {session ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
});
