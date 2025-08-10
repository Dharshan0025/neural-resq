import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SOSScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Emergency SOS Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SOSScreen; // Must be default export