import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'

export default function UserVisitorInformation() {
  const [visitorId, setVisitorId] = useState('')
  return (
    <View style={styles.container}>
      {/* <View style={styles.inputWrapper}>
        <Text style={styles.label}>Visitor Id</Text>
        <TextInput
          placeholder='Visitor Id'
          value={visitorId}
          onChangeText={setVisitorId}
          style={[styles.input]}
        />
        {formErrors.lastName?.hasError && (
            <Text style={styles.errorText}>{formErrors.lastName.message}</Text>
          )}
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  errorMessage: {
    marginTop: 10,
    alignSelf: 'center',
    width: '100%',
    textAlign: 'left',
    color: 'red'
  },
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 15
  },
  label: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.TEXT_BLACK,
    marginTop: 10
  },
  errorText: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.RED,
    marginTop: 5
  },
  input: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
    height: 50,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
    paddingVertical: 1,
    fontSize: 14,
    color: '#4d7861',
    backgroundColor: '#ffff',
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },
  inputError: {
    borderColor: COLORS.RED
  }
})
