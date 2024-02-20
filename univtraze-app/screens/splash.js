import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import SplashImage from '../assets/splash.png'
import { withSafeAreaView } from '../hoc/withSafeAreaView'

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={SplashImage} style={styles.backgroundImage} />
    </View>
  )
}

export default withSafeAreaView(SplashScreen)

const styles = StyleSheet.create({
  ccontainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backgroundImage: {
    height: '100%',
    width: '100%'
  }
})
