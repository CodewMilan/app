import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';
import theme from '../theme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithOtp, signInWithPassword } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLoginWithPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signInWithPassword(email, password);
      if (error) {
        Alert.alert('Error', error.message);
      }
      // On success, auth state change will navigate to main app
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signInWithOtp(email);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        navigation.navigate('OTPVerification', { email });
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (usePassword) {
      handleLoginWithPassword();
    } else {
      handleSendOtp();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Feather name="zap" size={64} color={theme.primary} />
          </View>
          <Text style={styles.title}>ProLaunch Hub</Text>
          <Text style={styles.subtitle}>
            Your gateway to professional success
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login</Text>
          <Text style={styles.formSubtitle}>
            {usePassword
              ? 'Sign in with your email and password'
              : "We'll send you a one-time code via email"}
          </Text>

          <View style={styles.inputContainer}>
            <Feather
              name="mail"
              size={20}
              color={theme.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={theme.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
          </View>

          {usePassword && (
            <View style={styles.inputContainer}>
              <Feather
                name="lock"
                size={20}
                color={theme.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={theme.textMuted}
                />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.textOnPrimary} />
            ) : (
              <Text style={styles.buttonText}>
                {usePassword ? 'Login' : 'Send OTP'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchModeButton}
            onPress={() => setUsePassword(!usePassword)}
            disabled={loading}
          >
            <Text style={styles.switchModeText}>
              {usePassword
                ? "Use email code instead"
                : 'I have a password'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
          >
            <Text style={styles.signUpButtonText}>
              Don't have an account? <Text style={styles.signUpLink}>Register now</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: theme.fontFamilyBold,
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fontFamily,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: theme.card,
    borderRadius: theme.radiusLg,
    padding: 24,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontFamily: theme.fontFamilyBold,
    color: theme.text,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    fontFamily: theme.fontFamily,
    color: theme.textSecondary,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radius,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.inputBg,
  },
  inputIcon: {
    marginRight: 12,
  },
  eyeIcon: {
    padding: 5,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: theme.fontFamily,
    color: theme.text,
  },
  button: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: theme.radius,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.textOnPrimary,
    fontSize: 16,
    fontFamily: theme.fontFamilySemiBold,
  },
  switchModeButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  switchModeText: {
    fontSize: 14,
    color: theme.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: theme.textMuted,
    fontSize: 14,
  },
  signUpButton: {
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  signUpLink: {
    color: theme.primary,
    fontFamily: theme.fontFamilySemiBold,
  },
});

export default LoginScreen;



