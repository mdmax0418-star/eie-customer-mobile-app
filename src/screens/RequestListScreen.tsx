import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Screen } from '../components';

export function RequestListScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Service Requests</Text>
      <Text style={styles.body}>Request list screen placeholder</Text>
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
