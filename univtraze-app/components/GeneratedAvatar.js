import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'

export default function GeneratedAvatar(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.initialsText}>{props.initials}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PRIMARY,
    height: 150,
    width: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 5,
    borderColor: COLORS.WHITE
  },
  initialsText: {
    fontSize: 40,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    color: COLORS.WHITE
  }
})
