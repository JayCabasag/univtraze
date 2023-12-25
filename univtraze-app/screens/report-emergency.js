import jwtDecode from 'jwt-decode'
import axios from 'axios'
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import BackIcon from '../assets/back-icon.png'
import { COLORS } from '../utils/app_constants'

const menu_jpg = {
  uri: 'https://firebasestorage.googleapis.com/v0/b/fir-phoneauth-74be7.appspot.com/o/menu.png?alt=media&token=e20ee94a-4632-467a-841c-c66659a2a3df'
}

const UselessTextInput = (props) => {
  return (
    <TextInput
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable
    />
  )
}

const ReportEmergencyScreen = ({ navigation }) => {
  const [textArea, onChangeTextArea] = React.useState('')
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState([])
  const [items, setItems] = useState([
    { label: 'Fever', value: 'Fever' },
    { label: 'Cough or Colds', value: 'Cough or Colds' },
    { label: 'Sore throat', value: 'Sore throat' },
    { label: 'Loss of smell or taste', value: 'Loss of smell or taste' },
    { label: 'Body pains or fatigues', value: 'Body pains or fatigues' },
    { label: 'Diarrhea', value: 'Diarrhea' },
    { label: 'Breathing difficulties', value: 'Breathing difficulties' }
  ])

  const [visible, setVisible] = useState(true)
  const [notifVisible, setNotifVisible] = useState(false)

  const [token, setToken] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)

  //Loading modal Variables
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingModalMessage, setLoadingModalMessage] = useState('Please wait...')
  // variables for user inputs

  const [patientName, setPatientName] = useState('')
  const [medicalCondition, setMedicalCondition] = useState([])
  const [description, setDescription] = useState('')
  const [roomNumber, setRoomNumber] = useState(0)

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  //End of user input variables

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible)
  }

  const toggleNotifNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setNotifVisible(!notifVisible)
  }

  const submitEmergencyReport = async () => {
    const currentPatientName = patientName
    const currentMedicalCondition = value
    const currentConditionDescription = textArea
    const currentRoomNumber = roomNumber

    setLoading(true)

    if (currentPatientName === '') {
      setLoading(false)
      setError(true)
      setErrorMessage('Please provide the patient name')

      setTimeout(() => {
        setError(false)
        setErrorMessage('')
        setSuccess(false)
        setLoading(false)
      }, 3000)

      return
    }

    if (currentMedicalCondition.length === 0) {
      setLoading(false)
      setError(true)
      setErrorMessage('Please select medical condition')

      setTimeout(() => {
        setError(false)
        setErrorMessage('')
        setSuccess(false)
        setLoading(false)
      }, 3000)

      return
    }

    if (currentConditionDescription === '') {
      setLoading(false)
      setError(true)
      setErrorMessage('Please patients condition description')

      setTimeout(() => {
        setError(false)
        setErrorMessage('')
        setSuccess(false)
        setLoading(false)
      }, 3000)

      return
    }

    if (currentConditionDescription.length > 250) {
      setLoading(false)
      setError(true)
      setErrorMessage('Description should not exceeds more than 250 characters')

      setTimeout(() => {
        setError(false)
        setErrorMessage('')
        setSuccess(false)
        setLoading(false)
      }, 3000)

      return
    }

    if (roomNumber <= 0) {
      setLoading(false)
      setError(true)
      setErrorMessage('Please provide a valid room number')

      setTimeout(() => {
        setError(false)
        setErrorMessage('')
        setSuccess(false)
        setLoading(false)
      }, 3000)

      return
    }

    setShowLoadingModal(true)
    setLoadingModalMessage('Please wait ...')

    var data = {
      reported_by: currentUserId,
      patient_name: currentPatientName,
      medical_condition: currentMedicalCondition,
      description: currentConditionDescription,
      room_number: currentRoomNumber
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }

    setLoading(true)

    await axios
      .post('https://univtraze.herokuapp.com/api/covid_cases/addEmergencyReport', data, {
        headers: headers
      })
      .then((response) => {
        if (response.data.success === 0 && response.data.message === 'Invalid token') {
          navigation.navigate('signin')
          return
        }

        if (response.data.success === 0) {
          setLoadingModalMessage('Please wait...')
          setShowLoadingModal(false)
          setSuccess(false)
          setError(true)
          setErrorMessage('Failed reporting emergency. Please try again')
          return
        }

        setLoadingModalMessage('Please wait...')
        setShowLoadingModal(false)

        setLoading(false)
        setSuccess(true)
        setError(false)
        setErrorMessage('')
        alert('Emergency report sent successfully.')
        navigation.navigate('Dashboard')
      })

      .catch((error) => {
        console.log('Error ' + error)
        setLoading(false)
      })

    setError(false)
    setErrorMessage('')
    setLoading(false)

    setTimeout(() => {
      setError(false)
      setErrorMessage('')
      setSuccess(false)
      setLoading(false)
    }, 3000)

    setLoadingModalMessage('Please wait...')
    setShowLoadingModal(false)
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Modal
          animationType='fade'
          transparent={true}
          visible={showLoadingModal}
          onRequestClose={() => {
            setShowLoadingModal(!showLoadingModal)
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size={'large'} />
              <Text style={styles.modalText}>{loadingModalMessage}</Text>
            </View>
          </View>
        </Modal>

        {/* Notification View */}
        <View style={styles.topContainer}>
          <View style={styles.backIcon}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.goBack()
              }}
            >
              <ImageBackground
                src={BackIcon}
                resizeMode='contain'
                style={styles.image}
              ></ImageBackground>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {/*End  Notification View */}
        {/* Body Container */}
        <Text
          style={{
            height: 'auto',
            fontSize: 28,
            color: COLORS.TEXT_BLACK,
            fontWeight: '700',
            marginHorizontal: 40,
            padding: 10
          }}
        >
          Emergency {'\n'}Report
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.bodyContainer}>
            <View style={styles.formContainer}>
              <Text>Patient Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={(e) => {
                  setPatientName(e)
                }}
                value={patientName}
                placeholder='e.g John Doe'
              />

              <Text style={{ marginTop: 20 }}>Medical condition</Text>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
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
                style={{ borderColor: '#28CD4199' }}
              />

              <Text style={{ marginTop: 20 }}>Description</Text>

              <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={(textArea) => onChangeTextArea(textArea)}
                value={textArea}
                style={styles.inputss}
                placeholder='Condition description...'
              />

              <Text style={{ marginTop: 20 }}>Room Number </Text>
              <TextInput
                style={styles.input}
                onChangeText={(e) => {
                  setRoomNumber(e)
                }}
                value={roomNumber}
                placeholder='e.g 401'
              />
              {success ? (
                <Text
                  style={{
                    paddingVertical: 10,
                    color: '#28CD4199'
                  }}
                >
                  Reported Successfully
                </Text>
              ) : null}

              {loading ? (
                <Text
                  style={{
                    paddingVertical: 10,
                    color: '#28CD4199'
                  }}
                >
                  Please wait..
                </Text>
              ) : null}

              {error ? (
                <Text
                  style={{
                    paddingVertical: 10,
                    color: 'red'
                  }}
                >
                  {errorMessage}
                </Text>
              ) : null}

              <TouchableOpacity
                style={{
                  width: 'auto',
                  height: 60,
                  backgroundColor: COLORS.PRIMARY,
                  borderRadius: 10,
                  marginTop: 10,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={() => {
                  submitEmergencyReport()
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>SUBMIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {/*End of Body Container */}
      </View>
    </SafeAreaView>
  )
}
export default ReportEmergencyScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1F5E4',
    height: '100%'
  },
  topContainer: {
    zIndex: 1,
    width: '100%',
    height: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40
  },

  backIcon: {
    height: 75,
    width: 75,
    marginTop: 20,
    marginLeft: -15,
    justifyContent: 'center'
  },
  menuLogo: {
    height: '50%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
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
    marginBottom: 50,
    marginHorizontal: 48
  },
  formContainer: {
    width: 'auto',
    height: '90%'
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#28CD4199',
    backgroundColor: '#FFFFFF',
    padding: 10
  },
  inputss: {
    height: 120,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#28CD4199',
    backgroundColor: '#FFFFFF',
    padding: 10,
    justifyContent: 'flex-start',
    textAlignVertical: 'top'
  }
})
