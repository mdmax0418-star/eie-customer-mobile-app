import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components';

export function LoginScreen() {
  return (
    <Screen style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>EIE Customer Portal</Text>
        <Text style={styles.subtitle}>Login screen placeholder</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  card: {
    gap: 12,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 16,
  },
});
