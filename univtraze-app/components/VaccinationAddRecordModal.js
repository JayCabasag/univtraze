import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT_FAMILY, VACCINES, VACCINES_DOSES } from '../utils/app_constants'
import CustomPicker from './ui/CustomPicker'
import CustomCalendar from './ui/CustomCalendar'
import { genericPostRequest } from '../services/api/genericPostRequest'
import { useUser } from '../services/store/user/UserContext'
import { useAuth } from '../services/store/auth/AuthContext'
import useFormErrors from '../hooks/useFormErrors'
import moment from 'moment'

const DISEASE_NAME = 'COVID-19'

export default function VaccinationRecordModal(props) {
  const { state: user } = useUser()
  const { state: auth } = useAuth()
  const { resetFormErrors, formErrors, setFormErrors } = useFormErrors([
    'vaccineDose',
    'vaccineName',
    'vaccinationDate'
  ])

  const userId = user.details.id
  const token = auth.userToken

  const [vaccineDose, setVaccineDose] = useState(null)
  const [vaccineName, setVaccineName] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [vaccinationDate, setVaccinationDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const vaccineOptions = Object.values(VACCINES).map((data, index) => ({
    id: index,
    value: data,
    label: data.toUpperCase()
  }))

  const vaccineDoseOptions = Object.values(VACCINES_DOSES).map((data, index) => ({
    id: index,
    value: data,
    label: data.toUpperCase()
  }))

  const handleSaveVaccination = async () => {
    resetFormErrors()
    if (vaccineDose == '' || vaccineDose == null) {
      return setFormErrors('vaccineDose', 'Vaccine dose is required')
    }
    if (vaccineName == '' || vaccineName == null) {
      return setFormErrors('vaccineName', 'Vaccine name is required')
    }
    if (vaccinationDate == '' || vaccineName == null) {
      return setFormErrors('vaccinationDate', 'Vaccination date is required')
    }
    try {
      setIsLoading(true)
      const payload = {
        user_id: userId,
        vaccine_disease: DISEASE_NAME,
        vaccine_name: vaccineName,
        dose_number: vaccineDose,
        date: moment(vaccinationDate).format('YYYY-MM-DD')
      }
      await genericPostRequest('vaccination-records', payload, token)

      Alert.alert('Success', 'Vaccination record added successfully', [
        {
          text: 'Ok',
          onPress: () => {
            props.onRequestClose()
            props.onRefresh()
          }
        }
      ])
    } catch (error) {
      Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
        { text: 'OK', onPress: () => console.log('OK') }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      animationType={props.animationType ?? 'fade'}
      transparent={props.transparent ?? true}
      visible={props.open}
      statusBarTranslucent
      onRequestClose={props.onRequestClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.vaccineInfoText}>Vaccine Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dose Number</Text>
            <CustomPicker
              prompt='Vaccine Dose'
              selectedValue={vaccineDose}
              onValueChange={(itemValue, itemIndex) => {
                setVaccineDose(itemValue)
              }}
              options={vaccineDoseOptions}
              hasError={formErrors.vaccineDose.hasError}
            />
            {formErrors.vaccineDose.hasError && (
              <Text style={styles.errorText}>{formErrors.vaccineDose.message}</Text>
            )}
            <Text style={styles.label}>Vaccine name</Text>
            <CustomPicker
              prompt='Vaccine name'
              selectedValue={vaccineName}
              onValueChange={(itemValue, itemIndex) => {
                setVaccineName(itemValue)
              }}
              options={vaccineOptions}
              hasError={formErrors.vaccineName.hasError}
            />
            {formErrors.vaccineName.hasError && (
              <Text style={styles.errorText}>{formErrors.vaccineName.message}</Text>
            )}
            {/* Place errore her */}
            <Text style={styles.label}>Vaccine Date</Text>
            <CustomCalendar
              value={vaccinationDate}
              showDatePicker={showDatePicker}
              placeholder={'Date of birth'}
              onChange={(_event, date) => {
                // This is required to cancel close when selecting date in spinner
                if (!(Platform.OS == 'ios')) {
                  setShowDatePicker(false)
                }
                setVaccinationDate(date)
              }}
              setShowDatePicker={(value) => {
                setShowDatePicker(value)
              }}
              hasError={formErrors.vaccinationDate.hasError}
            />
            {formErrors.vaccinationDate.hasError && (
              <Text style={styles.errorText}>{formErrors.vaccinationDate.message}</Text>
            )}
          </View>
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity
              disabled={isLoading}
              style={[styles.button, { backgroundColor: COLORS.RED }]}
              onPress={props.onRequestClose}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isLoading}
              style={[styles.button]}
              onPress={handleSaveVaccination}
            >
              {isLoading ? (
                <ActivityIndicator style={styles.loadingIconStyles} color={COLORS.WHITE} />
              ) : (
                <Text style={styles.btnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(250, 250, 250, .7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  modalView: {
    width: '100%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  vaccineInfoText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 16
  },
  inputContainer: {
    width: '100%',
    display: 'flex',
    gap: 2,
    marginVertical: 12
  },
  label: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.TEXT_BLACK,
    marginTop: 12
  },
  errorText: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.RED,
    marginTop: 5
  },
  textInput: {
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
  },
  modalText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.PRIMARY,
    marginTop: 15
  },
  actionBtnContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12
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
  loadingIconStyles: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]
  },
  btnText: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  }
})
