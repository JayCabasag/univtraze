import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'

export default function UserStudentInformation(props) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Student Id</Text>
        <TextInput
          placeholder='Student Id'
          value={props.studentId}
          onChangeText={props.setStudentId}
          style={[styles.input, props.formErrors?.studentId?.hasError && styles.inputError]}
        />
        {props?.formErrors?.studentId?.hasError && (
          <Text style={styles.errorText}>{formErrors.studentId.message}</Text>
        )}
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Year</Text>
        <TextInput
          placeholder='Year'
          value={props.studentYear}
          onChangeText={props.setStudentYear}
          style={[styles.input, props.formErrors?.studentYear?.hasError && styles.inputError]}
        />
        {props?.formErrors?.studentYear?.hasError && (
          <Text style={styles.errorText}>{formErrors.studentYear.message}</Text>
        )}
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Section</Text>
        <TextInput
          placeholder='Section'
          value={props.studentSection}
          onChangeText={props.setStudentSection}
          style={[styles.input, props.formErrors?.studentSection?.hasError && styles.inputError]}
        />
        {props?.formErrors?.studentSection?.hasError && (
          <Text style={styles.errorText}>{formErrors.studentSection.message}</Text>
        )}
      </View>
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
