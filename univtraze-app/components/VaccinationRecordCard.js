import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { genericDeleteRequest } from '../services/api/genericDeleteRequest'
import { useAuth } from '../services/store/auth/AuthContext'

export default function VaccinationRecordCard({ vaccinationRecord, onRefresh }) {
  const { state: auth } = useAuth()
  const token = auth.userToken

  const vaccinationDate = (new Date(vaccinationRecord.date) ?? new Date()).toDateString()

  const [isLoading, setIsLoading] = useState(false)

  const deleteVaccinationRecord = async () => {
    Alert.alert('Warning', 'Do you want to continue removing your vaccination record?', [
      { text: 'Cancel', onPress: () => console.log('canceled') },
      {
        text: 'Continue',
        onPress: async () => {
          try {
            setIsLoading(true)
            const res = await genericDeleteRequest(
              `vaccination-records/${vaccinationRecord.vaccination_record_id}`,
              token
            )
            onRefresh();
          } catch (error) {
            Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
              { text: 'OK', onPress: () => console.log('OK') }
            ])
          } finally {
            setIsLoading(false)
          }
        }
      }
    ])
  }
  
  return (
    <View style={styles.cardStyles}>
      <View style={[styles.vaccineInfoContainer, isLoading && styles.loadingStyle]}>
        <View style={styles.cardHeaderContainer}>
          <Ionicons name='shield-outline' size={30} color={COLORS.PRIMARY} />
          <View style={styles.cardHeader}>
            <Text style={styles.label}>{vaccinationRecord.vaccine_disease}</Text>
            <Text style={styles.doseText}>DOSE {vaccinationRecord.dose_number}</Text>
          </View>
        </View>
        <Text style={styles.vaccineNameStyles}>{vaccinationRecord.vaccine_name}</Text>
        <Text style={styles.vaccineDateStyles}>{vaccinationDate}</Text>
      </View>
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deleteVaccinationRecord}
          style={[styles.button, { backgroundColor: COLORS.RED }]}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardStyles: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F7FFF8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 5,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 5
  },
  vaccineInfoContainer: {
    flex: 1
  },
  loadingStyle: {
    opacity: .4
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
    flexDirection: 'column',
    flex: 1,
    maxWidth: 100,
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
