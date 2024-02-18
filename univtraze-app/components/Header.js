import { View, Text, StyleShee, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import BackIcon from '../assets/back-icon.png'

export default function Header({ navigation }) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={BackIcon} style={styles.backIcon} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 20,
    width: '100%'
  },
  backIcon: {
    width: 60,
    height: 60,
    marginLeft: -20
  }
})
