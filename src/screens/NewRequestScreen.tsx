import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Screen } from '../components';

export function NewRequestScreen() {
  return (
    <Screen>
      <Text style={styles.title}>New Request</Text>
      <Text style={styles.body}>New request screen placeholder</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
  },
  body: {
    color: '#4b5563',
    fontSize: 16,
    marginTop: 12,
  },
});
