
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotificationScreen({ route }) {
  const { message } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Received</Text>
      <Text style={styles.message}>{message || 'No message received.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: '#555',
  },
});