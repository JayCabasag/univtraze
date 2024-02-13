import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { Fragment, useState } from 'react'
import CustomPicker from './ui/CustomPicker'
import { COLORS, FONT_FAMILY, VACCINES } from '../utils/app_constants'
import CustomCalendar from './ui/CustomCalendar'

export default function VaccinationRecordCard({ vaccinationRecord }) {
  const vaccineOptions = Object.values(VACCINES).map((data, index) => ({
    id: index,
    value: data,
    label: data.toUpperCase()
  }))

  const [isEditable, setIsEditable] = useState(false)
  const [vaccineName, setVaccineName] = useState(
    (vaccinationRecord.vaccine_name ?? '').toLowerCase()
  )
  const [showDoseDatePicker, setShowDoseDatePicker] = useState(false)
  const [doseDate, setDoseDate] = useState(new Date(vaccinationRecord.date) ?? new Date())

  return (
    <View style={styles.cardStyles}>
      <Text style={styles.label}>
        {vaccinationRecord.vaccine_disease} - DOSE {vaccinationRecord.dose_number}
      </Text>
      <Text>{vaccineName}</Text>
      <Text>{doseDate.toISOString()}</Text>
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.RED }]}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardStyles: {
    width: '100%'
  },
  label: {
    width: '100%',
    marginVertical: 15,
    fontWeight: 'bold',
    fontSize: 16
  },
  actionBtnContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    paddingVertical: 6,
    gap: 6
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  errorPickerStyle: {
    borderColor: COLORS.RED
  }
})
