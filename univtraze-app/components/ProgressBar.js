import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS } from '../utils/app_constants'

export default function ProgressBar(props) {
  return (
    <View style={styles.progressBarContainerStyle}>
      <View style={[styles.barStyles, { width: `${props?.value ?? 0}%` }]}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  progressBarContainerStyle: {
    width: '60%',
    height: 6,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 20,
    marginHorizontal: 15,
    overflow: 'hidden'
  },
  barStyles: {
    height: 6,
    width: '50%',
    backgroundColor: COLORS.PRIMARY
  }
})
