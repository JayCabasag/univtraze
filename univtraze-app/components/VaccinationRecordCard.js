import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { Fragment, useState } from 'react'
import CustomPicker from './ui/CustomPicker'
import { COLORS, FONT_FAMILY, VACCINES } from '../utils/app_constants'
import CustomCalendar from './ui/CustomCalendar'
import Ionicons from 'react-native-vector-icons/Ionicons'

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
      <View style={styles.cardHeaderContainer}>
        <Ionicons name='shield-outline' size={30} color={COLORS.PRIMARY} />
        <View style={styles.cardHeader}>
          <Text style={styles.label}>
            {vaccinationRecord.vaccine_disease}
          </Text>
          <Text style={styles.doseText}>
            DOSE {vaccinationRecord.dose_number}
          </Text>
        </View>
      </View>
      <Text style={styles.vaccineNameStyles}>{vaccineName}</Text>
      <Text style={styles.vaccineDateStyles}>{doseDate.toDateString()}</Text>
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
    width: '100%',
    backgroundColor: '#F7FFF8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 5,
    shadowColor: COLORS.PLACEHOLDER_BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 5
  },
  cardHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12
  },
  label: {
    width: '100%',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: 18
  },
  doseText: {
    fontFamily: FONT_FAMILY.POPPINS_EXTRA_LIGHT,
    marginTop: -8
  },
  vaccineNameStyles: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    textTransform: 'capitalize',
    fontSize: 14
  },
  vaccineDateStyles: {
    fontFamily: FONT_FAMILY.POPPINS_LIGHT

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
    borderRadius: 8,
    minWidth: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: COLORS.PLACEHOLDER_BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 5
  },
  buttonText: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  errorPickerStyle: {
    borderColor: COLORS.RED
  }
})
