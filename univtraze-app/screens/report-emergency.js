import axios from 'axios'
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'
import React, { useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import BackIcon from '../assets/back-icon.png'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import LoadingModal from '../components/LoadingModal'
import { useAuth } from '../services/store/auth/AuthContext'
import { useUser } from '../services/store/user/UserContext'
import useFormErrors from '../hooks/useFormErrors'
import { genericPostRequest } from '../services/api/genericPostRequest'

const ReportEmergencyScreen = ({ navigation }) => {
  const { state: auth } = useAuth()
  const { state: user } = useUser()

  const [description, onChangeDescription] = React.useState('')
  const [patientName, setPatientName] = useState('')
  const [roomNumber, setRoomNumber] = useState(null)
  const [open, setOpen] = useState(false)
  const [symptoms, setSymptoms] = useState([])
  const [items, setItems] = useState([
    { label: 'Fever', value: 'Fever' },
    { label: 'Cough or Colds', value: 'Cough or Colds' },
    { label: 'Sore throat', value: 'Sore throat' },
    { label: 'Loss of smell or taste', value: 'Loss of smell or taste' },
    { label: 'Body pains or fatigues', value: 'Body pains or fatigues' },
    { label: 'Diarrhea', value: 'Diarrhea' },
    { label: 'Breathing difficulties', value: 'Breathing difficulties' }
  ])

  const [currentUserId, setCurrentUserId] = useState(null)

  //Loading modal Variables
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingModalMessage, setLoadingModalMessage] = useState('Please wait...')
  //End of user input variables

  // const onSubmit = async () => {
  //   const currentPatientName = patientName
  //   const currentMedicalCondition = value
  //   const currentConditionDescription = textArea
  //   const currentRoomNumber = roomNumber

  //   setLoading(true)

  //   if (currentPatientName === '') {
  //     setLoading(false)
  //     setError(true)
  //     setErrorMessage('Please provide the patient name')

  //     setTimeout(() => {
  //       setError(false)
  //       setErrorMessage('')
  //       setSuccess(false)
  //       setLoading(false)
  //     }, 3000)

  //     return
  //   }

  //   if (currentMedicalCondition.length === 0) {
  //     setLoading(false)
  //     setError(true)
  //     setErrorMessage('Please select medical condition')

  //     setTimeout(() => {
  //       setError(false)
  //       setErrorMessage('')
  //       setSuccess(false)
  //       setLoading(false)
  //     }, 3000)

  //     return
  //   }

  //   if (currentConditionDescription === '') {
  //     setLoading(false)
  //     setError(true)
  //     setErrorMessage('Please patients condition description')

  //     setTimeout(() => {
  //       setError(false)
  //       setErrorMessage('')
  //       setSuccess(false)
  //       setLoading(false)
  //     }, 3000)

  //     return
  //   }

  //   if (currentConditionDescription.length > 250) {
  //     setLoading(false)
  //     setError(true)
  //     setErrorMessage('Description should not exceeds more than 250 characters')

  //     setTimeout(() => {
  //       setError(false)
  //       setErrorMessage('')
  //       setSuccess(false)
  //       setLoading(false)
  //     }, 3000)

  //     return
  //   }

  //   if (roomNumber <= 0) {
  //     setLoading(false)
  //     setError(true)
  //     setErrorMessage('Please provide a valid room number')

  //     setTimeout(() => {
  //       setError(false)
  //       setErrorMessage('')
  //       setSuccess(false)
  //       setLoading(false)
  //     }, 3000)

  //     return
  //   }

  //   setShowLoadingModal(true)
  //   setLoadingModalMessage('Please wait ...')

  //   var data = {
  //     reported_by: currentUserId,
  //     patient_name: currentPatientName,
  //     medical_condition: currentMedicalCondition,
  //     description: currentConditionDescription,
  //     room_number: currentRoomNumber
  //   }

  //   const headers = {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`
  //   }

  //   setLoading(true)

  //   await axios
  //     .post('https://univtraze.herokuapp.com/api/covid_cases/addEmergencyReport', data, {
  //       headers: headers
  //     })
  //     .then((response) => {
  //       if (response.data.success === 0 && response.data.message === 'Invalid token') {
  //         navigation.navigate('signin')
  //         return
  //       }

  //       if (response.data.success === 0) {
  //         setLoadingModalMessage('Please wait...')
  //         setShowLoadingModal(false)
  //         setSuccess(false)
  //         setError(true)
  //         setErrorMessage('Failed reporting emergency. Please try again')
  //         return
  //       }

  //       setLoadingModalMessage('Please wait...')
  //       setShowLoadingModal(false)

  //       setLoading(false)
  //       setSuccess(true)
  //       setError(false)
  //       setErrorMessage('')
  //       alert('Emergency report sent successfully.')
  //       navigation.navigate('Dashboard')
  //     })

  //     .catch((error) => {
  //       console.log('Error ' + error)
  //       setLoading(false)
  //     })

  //   setError(false)
  //   setErrorMessage('')
  //   setLoading(false)

  //   setTimeout(() => {
  //     setError(false)
  //     setErrorMessage('')
  //     setSuccess(false)
  //     setLoading(false)
  //   }, 3000)

  //   setLoadingModalMessage('Please wait...')
  //   setShowLoadingModal(false)
  // }

  const { resetFormErrors, formErrors, setFormErrors } = useFormErrors([
    'patientName',
    'symptoms',
    'description',
    'roomNumber'
  ])

  const onSubmit = async () => {
    resetFormErrors()
    if (patientName == '' || patientName == null) {
      return setFormErrors('patientName', 'Patient name is required')
    }
    if (symptoms.length < 1) {
      return setFormErrors('symptoms', 'Symptom is required')
    }
    if (description == '' || description == null) {
      return setFormErrors('description', 'Description is required')
    }
    if (roomNumber == null || roomNumber == '') {
      return setFormErrors('roomNumber', 'Room number is required')
    }

    try {
      setLoadingModalMessage(true)
      await genericPostRequest();
    } catch (error) {
      Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
        { text: 'OK', onPress: () => console.log('OK') }
      ])
    } finally {
      setLoadingModalMessage(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
      <ScrollView contentContainerStyle={styles.scrollViewContentStyle} style={styles.scrollView}>
        <LoadingModal
          onRequestClose={() => setShowLoadingModal(false)}
          open={showLoadingModal}
          loadingMessage={loadingModalMessage}
        />
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={navigation.goBack}>
            <Image source={BackIcon} style={{ marginLeft: -15, width: 60, height: 60 }} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>Report Emergency</Text>
        <View style={{ paddingVertical: 5 }}>
          <Text style={styles.bodyText}>
            Report an individual who has contracted a communicable disease.
          </Text>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.label}>Patient Name</Text>
          <TextInput
            style={[styles.input, formErrors.patientName?.hasError && styles.inputError]}
            onChangeText={setPatientName}
            value={patientName}
            placeholder='e.g John Doe'
          />
          {formErrors.patientName?.hasError && (
            <Text style={styles.errorText}>{formErrors?.patientName?.message}</Text>
          )}

          <Text style={styles.label}>Symptoms</Text>
          <DropDownPicker
            open={open}
            value={symptoms}
            items={items}
            setOpen={setOpen}
            setValue={setSymptoms}
            setItems={setItems}
            theme='LIGHT'
            multiple={true}
            mode='BADGE'
            listMode='SCROLLVIEW'
            badgeDotColors={[
              '#e76f51',
              '#00b4d8',
              '#e9c46a',
              '##25cf41',
              '#8ac926',
              '#2536cf',
              '#d11f99'
            ]}
            style={[{ borderColor: COLORS.PRIMARY },  formErrors.symptoms.hasError && styles.inputError]}
          />
          {formErrors.symptoms.hasError && (
            <Text style={styles.errorText}>{formErrors?.symptoms.message}</Text>
          )}

          <Text style={styles.label}>Description</Text>
          <TextInput
            multiline={true}
            numberOfLines={4}
            onChangeText={onChangeDescription}
            value={description}
            style={[styles.textAreaInput, formErrors.description?.hasError && styles.inputError]}
            placeholder='Condition description...'
          />
          {formErrors.description?.hasError && (
            <Text style={styles.errorText}>{formErrors?.description?.message}</Text>
          )}

          <Text style={styles.label}>Room Number </Text>
          <TextInput
            style={[styles.input, formErrors.roomNumber.hasError && styles.inputError]}
            onChangeText={setRoomNumber}
            value={roomNumber}
            placeholder='e.g 401'
          />
          {formErrors.roomNumber?.hasError && (
            <Text style={styles.errorText}>{formErrors?.roomNumber?.message}</Text>
          )}
        </View>
      </ScrollView>
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity onPress={onSubmit} style={styles.submitBtn}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
export default ReportEmergencyScreen

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#E1F5E4'
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#E1F5E4'
  },
  scrollViewContentStyle: {
    paddingHorizontal: 30,
    paddingBottom: 20
  },
  topContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? StatusBar.currentHeight + 40 : 40
  },
  backIcon: {
    height: 75,
    width: 75,
    marginTop: 20,
    marginLeft: -15,
    justifyContent: 'center'
  },
  headerText: {
    height: 'auto',
    fontSize: 28,
    color: COLORS.TEXT_BLACK,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  bodyText: {
    marginTop: 10,
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    width: '80%',
    paddingVertical: 40,
    height: 'auto',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  image: {
    width: '90%',
    height: '90%'
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  centeredViews: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttons: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    elevation: 2,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY
  },
  // body style
  bodyContainer: {
    width: 'auto',
    height: '100%',
    marginBottom: 20
  },
  label: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.TEXT_BLACK,
    marginTop: 10
  },
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 15
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
  errorText: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.RED,
    marginTop: 5
  },
  inputError: {
    borderColor: COLORS.RED
  },
  textAreaInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#28CD4199',
    backgroundColor: '#FFFFFF',
    padding: 10,
    justifyContent: 'flex-start',
    textAlignVertical: 'top'
  },
  actionBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    width: '100%'
  },
  submitBtn: {
    marginBottom: 10,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginTop: 5,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  submitButtonText: {
    color: '#FFF',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase'
  }
})
