import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Screen } from '../components';
import { login, LoginResponse } from '../services';

interface LoginScreenProps {
  onLoginSuccess: (auth: LoginResponse) => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = username.trim().length > 0 && password.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const auth = await login({ username: username.trim(), password });
      onLoginSuccess(auth);
    } catch (err) {
      console.error('Login failed:', err);
      setError('We could not sign you in just now. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.card}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>EIE</Text>
          </View>
          <Text style={styles.title}>Your time back starts here</Text>
          <Text style={styles.subtitle}>
            Sign in to manage your vehicle service requests without the DMV runaround.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="#9ca3af"
              returnKeyType="next"
              style={styles.input}
              textContentType="username"
              value={username}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              editable={!isSubmitting}
              onChangeText={setPassword}
              onSubmitEditing={handleSubmit}
              placeholder="Enter password"
              placeholderTextColor="#9ca3af"
              returnKeyType="go"
              secureTextEntry
              style={styles.input}
              textContentType="password"
              value={password}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={!canSubmit || isSubmitting}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.button,
              (!canSubmit || isSubmitting) && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    gap: 18,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  brandMark: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#1d4ed8',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  brandMarkText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  title: {
    color: '#111827',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 16,
    lineHeight: 24,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
    borderRadius: 14,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  error: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    color: '#b91c1c',
    fontSize: 14,
    padding: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1d4ed8',
    borderRadius: 14,
    minHeight: 52,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
