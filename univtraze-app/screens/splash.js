import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import SplashImage from '../assets/splash.png'

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image src={SplashImage} style={styles.splash} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  splash: {
    flex: 1
  }
})
