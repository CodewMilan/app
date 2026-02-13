import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StartupsScreen = () => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <Ionicons name="business-outline" size={80} color="#ccc" />
    </View>
    <Text style={styles.title}>Coming soon</Text>
    <Text style={styles.subtitle}>Startup listings and opportunities will be available here.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconWrap: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default StartupsScreen;
