import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  Button,
  Dimensions,
  Modal,
  ActivityIndicator
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { AntDesign } from '@expo/vector-icons'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import StepperIcon3 from '../../assets/reg3_identifier.png'
import { COLORS } from '../../utils/app_constants'

const windowWidth = Dimensions.get('screen').width
const windowHeight = Dimensions.get('screen').height

const SignUpVaccinationScreen = ({ navigation, route }) => {
  const [token, setToken] = useState(null)

  const [firstDoseDate, setFirstDoseDate] = useState(new Date())
  const [showFirstDoseDatePicker, setShowFirstDoseDatePicker] = useState(false)
  const [firstDoseName, setFirstDoseName] = useState('None')
  const [openFirstDoseOptions, setOpenFirstDoseOptions] = useState(false)

  const [secondDoseDate, setSecondDoseDate] = useState(new Date())
  const [secondDoseName, setSecondDoseName] = useState('None')
  const [showSecondDoseDatePicker, setShowSecondDoseDatePicker] = useState(false)
  const [openSecondDoseOptions, setOpenSecondDoseOptions] = useState(false)

  const [boosterDoseDate, setBoosterDoseDate] = useState(new Date())
  const [boosterDoseName, setBoosterDoseName] = useState('None')
  const [showBoosterDoseDatePicker, setShowBoosterDoseDatePicker] = useState(false)
  const [openBoosterDoseOptions, setOpenBoosterDoseOptions] = useState(false)

  // Error handlers

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showLoadingModal, setShowLoadingModal] = useState(false)

  const [userId, setUserId] = useState(null)

  const handleUpdateVaccineData = async () => {
    try {
      const data = {
        user_id: userId,
        firstdose_vaxname: firstDoseName,
        firstdose_date: moment(firstDoseDate).format('YYYY-MM-DD'),
        seconddose_vaxname: secondDoseName,
        seconddose_date: moment(secondDoseDate).format('YYYY-MM-DD'),
        booster_vaxname: boosterDoseName,
        booster_date: moment(boosterDoseDate).format('YYYY-MM-DD')
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      setShowLoadingModal(true)
      await axios.post(`https://univtraze.herokuapp.com/api/vaccine_info/addVaccineData`, data, config).then((response) => {
        const success = response.data.success
        setShowLoadingModal(false)
        if (success === 0) {
          return alert('An error occured while updating your vaccine record')
        }

        if (success === 1) {
          navigation.navigate('Dashboard', { type: route.params.type })
          return alert('Successfully updated vaccine information.')
        }

        alert('An error occured while updating your vaccine record')
      })
    } catch (error) {
      alert('An error occured!. Please try again')
      setShowLoadingModal(false)
    }
  }

  const skipVaccinationtion = async () => {
    navigation.navigate('Dashboard', { type: route.params.type })
  }

  return (
    <SafeAreaView style={{ height: windowHeight }}>
      <View style={styles.mainContainer}>
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
              <Text style={styles.modalText}>Please wait...</Text>
            </View>
          </View>
        </Modal>

        <View style={styles.header}>
          <Image src={StepperIcon3} resizeMode='contain' style={{ width: '80%', height: '80%' }} />
        </View>

        <ScrollView style={styles.bodyContainer}>
          <View
            style={{
              width: '100%',
              flex: 1,
              alignItems: 'center'
            }}
          >
            <Text style={styles.label}>1st Dose</Text>

            <View style={styles.pickerContainer}>
              <Picker
                style={{ width: '100%', height: 45, color: '#4d7861' }}
                selectedValue={firstDoseName}
                onValueChange={(value) => setFirstDoseName(value)}
                mode='dialog'
              >
                <Picker.Item label='None' value='None' />
                <Picker.Item label='Moderna' value='Moderna' />
                <Picker.Item label='Pfizer-BioNTech' value='Pfizer-BioNTech' />
                <Picker.Item label='Oxford/AstraZeneca' value='Oxford/AstraZeneca' />
                <Picker.Item label='Others' value='Others' />
              </Picker>
            </View>
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={{ marginLeft: 5 }}>Date : </Text>
              <TextInput
                placeholder='Date of birth'
                defaultValue={moment(firstDoseDate).format('yyyy-MM-DD')}
                style={styles.dateInput}
                editable={false}
              />
              <AntDesign
                name='calendar'
                size={37}
                color={COLORS.PRIMARY}
                style={{ marginRight: 5 }}
                onPress={() => setShowFirstDoseDatePicker(true)}
              />
            </View>
            {showFirstDoseDatePicker === true ? (
              <DateTimePicker
                value={firstDoseDate}
                mode={'date'}
                is24Hour={true}
                onChange={(event, date) => {
                  setShowFirstDoseDatePicker(false)
                  if (date === undefined) {
                    setFirstDoseDate(new Date())
                    return
                  }
                  setFirstDoseDate(new Date(date))
                }}
              />
            ) : null}
          </View>

          <View
            style={{
              width: '100%',
              flex: 1,
              alignItems: 'center'
            }}
          >
            <Text style={styles.label}>2nd Dose</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={{ width: '100%', height: 45, color: '#4d7861' }}
                selectedValue={secondDoseName}
                onValueChange={(value) => setSecondDoseName(value)}
                mode='dialog'
              >
                <Picker.Item label='None' value='None' />
                <Picker.Item label='Moderna' value='Moderna' />
                <Picker.Item label='Pfizer-BioNTech' value='Pfizer-BioNTech' />
                <Picker.Item label='Oxford/AstraZeneca' value='Oxford/AstraZeneca' />
                <Picker.Item label='Others' value='Others' />
              </Picker>
            </View>

            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={{ marginLeft: 5 }}>Date : </Text>
              <TextInput
                placeholder='Date of birth'
                defaultValue={moment(secondDoseDate).format('yyyy-MM-DD')}
                style={styles.dateInput}
                editable={false}
              />
              <AntDesign
                name='calendar'
                size={37}
                color={COLORS.PRIMARY}
                style={{ marginRight: 5 }}
                onPress={() => setShowSecondDoseDatePicker(true)}
              />
            </View>
            {showSecondDoseDatePicker === true ? (
              <DateTimePicker
                value={secondDoseDate}
                mode={'date'}
                is24Hour={true}
                onChange={(event, date) => {
                  setShowSecondDoseDatePicker(false)
                  if (date === undefined) {
                    setSecondDoseDate(new Date())
                    return
                  }
                  setSecondDoseDate(new Date(date))
                }}
              />
            ) : null}
          </View>

          <View
            style={{
              width: '100%',
              flex: 1,
              alignItems: 'center'
            }}
          >
            <Text style={styles.label}>Booster Dose</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={{ width: '100%', height: 45, color: '#4d7861' }}
                selectedValue={boosterDoseName}
                onValueChange={(value) => setBoosterDoseName(value)}
                mode='dialog'
              >
                <Picker.Item label='None' value='None' />
                <Picker.Item label='Moderna' value='Moderna' />
                <Picker.Item label='Pfizer-BioNTech' value='Pfizer-BioNTech' />
                <Picker.Item label='Oxford/AstraZeneca' value='Oxford/AstraZeneca' />
                <Picker.Item label='Others' value='Others' />
              </Picker>
            </View>

            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={{ marginLeft: 5 }}>Date : </Text>
              <TextInput
                placeholder='Date of birth'
                defaultValue={moment().format('yyyy-MM-DD')}
                style={styles.dateInput}
                editable={false}
              />
              <AntDesign
                name='calendar'
                size={37}
                color={COLORS.PRIMARY}
                style={{ marginRight: 5 }}
                onPress={() => setShowBoosterDoseDatePicker(true)}
              />
            </View>
            {showBoosterDoseDatePicker === true ? (
              <DateTimePicker
                value={boosterDoseDate}
                mode={'date'}
                is24Hour={true}
                onChange={(event, date) => {
                  setShowBoosterDoseDatePicker(false)
                  if (date === undefined) {
                    setBoosterDoseDate(new Date())
                    return
                  }
                  setBoosterDoseDate(new Date(date))
                }}
              />
            ) : null}
          </View>
          <View
            style={{
              width: '100%',
              flex: 1,
              alignItems: 'center'
            }}
          >
            <TouchableOpacity></TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 25,
              paddingBottom: 35,
              marginTop: 15
            }}
          >
            <TouchableOpacity
              onPress={() => {
                skipVaccinationtion()
              }}
              style={styles.backbutton}
            >
              <Text style={{ fontWeight: 'bold' }}>Later</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleUpdateVaccineData()
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default SignUpVaccinationScreen

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    paddingHorizontal: 40,
    backgroundColor: '#E1F5E4'
  },
  dateInput: {
    margin: 5,
    width: '70%',
    height: 50,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 1,
    fontSize: 16,
    color: '#4d7861',
    backgroundColor: '#ffff'
  },
  header: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  bodyContainer: {
    height: 'auto'
  },
  label: {
    width: '100%',
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: 'bold',
    fontSize: 16
  },
  pickerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 10
  },
  input: {
    margin: 5,
    width: '100%',
    height: 50,
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: '#4d7861',
    backgroundColor: '#ffff'
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    paddingVertical: 15,
    width: 122,
    height: 'auto'
  },
  buttonText: {
    color: '#FFF',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  datePickerStyle: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: COLORS.PRIMARY,
    justifyContent: 'center'
  },
  centeredView: {
    backgroundColor: 'rgba(250, 250, 250, .7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  buttonOpen: {
    backgroundColor: '#F194FF'
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  }
})
