import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function VaccinationRecordCard(props) {
  return (
    <View style={styles.cardStyles}>
      <Text style={styles.label}>{props.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    cardStyles: {
        width: "100%"
    },
    label: {
        width: '100%',
        marginVertical: 15,
        fontWeight: 'bold',
        fontSize: 16
      },
})