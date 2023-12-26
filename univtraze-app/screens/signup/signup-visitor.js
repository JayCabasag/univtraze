import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Image
} from 'react-native'
import React, { useState, useRef } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { StackActions } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import moment from 'moment'
import StepperIcon1 from '../../assets/reg_identifier.png'
import BackIcon from '../../assets/back-icon.png'
import { COLORS, FONT_FAMILY } from '../../utils/app_constants'
import { Select, SelectItem } from '../../components/ui/Select'

const SignUpVisitorScreen = ({ navigation }) => {
  const scrollViewContainerRef = useRef()
  const [type, setType] = useState('visitor')
  const [firstName, onChangeFirstName] = useState('')
  const [middleName, onChangeMiddleName] = useState('')
  const [lastName, onChangeLastName] = useState('')
  const [address, onChangeAddress] = useState('')
  const [suffix, onChangeSuffix] = useState('')
  const [gender, onChangeGender] = useState('Rather not say')
  const [dateOfBirth, setDateOfBirth] = useState(new Date())

  const [showDropdown, setShowDropdown] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Error handlers

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const nextStep = async () => {
    scrollViewContainerRef.current.scrollToEnd({ animated: true })
    if (type === null || type === '') {
      return navigation.dispatch(StackActions.popToTop())
    }
    if (firstName === null || firstName === '') {
      setError(true)
      setErrorMessage('Please enter your firstname')
      return
    }
    if (lastName === null || lastName === '') {
      setError(true)
      setErrorMessage('Please enter your  lastname')
      return
    }
    if (gender === null || gender === '') {
      setError(true)
      setErrorMessage('Please enter your gender')
    }
    if (address === null || address === '') {
      setError(true)
      setErrorMessage('Please enter your address')
      return
    }
    if (dateOfBirth === null || dateOfBirth === '') {
      setError(true)
      setErrorMessage('Please enter your date of birth')
      return
    }

    const totalYears = moment().diff(moment(dateOfBirth), 'Years')

    if (totalYears < 12) {
      setError(true)
      setErrorMessage("User below 12 yrs old can't use the app")
      return
    }

    setError(false)
    setErrorMessage('')

    const dob = moment(dateOfBirth).format('yyyy-MM-DD')

    navigation.navigate('SignUpCredentialsDocuments', {
      type,
      firstName,
      lastName,
      middleName,
      suffix,
      gender,
      address,
      dob
    })
  }

  return (
      <KeyboardAvoidingView style={{ backgroundColor: '#E1F5E4', height: '100%' }}>
        <View style={styles.header}>
          <Image
            source={StepperIcon1}
            resizeMode='contain'
            style={{ width: '80%', height: '80%' }}
          />
        </View>

        <ScrollView ref={scrollViewContainerRef} style={styles.inputContainer}>
          <View style={{ width: '100%', alignItems: 'center', borderRadius: 15 }}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              placeholder='First name'
              defaultValue={''}
              onChangeText={onChangeFirstName}
              style={styles.input}
            />
          </View>

          <View style={{ width: '100%', alignItems: 'center', borderRadius: 15 }}>
            <Text style={styles.label}>Middle name </Text>
            <TextInput
              placeholder='Middle name'
              defaultValue={''}
              onChangeText={onChangeMiddleName}
              style={styles.input}
            />
          </View>

          <View style={{ width: '100%', alignItems: 'center', borderRadius: 15 }}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              placeholder='Last name'
              defaultValue={''}
              onChangeText={onChangeLastName}
              style={styles.input}
            />
          </View>

          <View style={{ width: '100%', borderRadius: 15, alignItems: 'center', zIndex: 2 }}>
            <View style={{ width: '80%', flexDirection: 'row' }}>
              <View style={{ width: '50%' }}>
                <Text style={styles.label}>Suffix </Text>
                <TextInput
                  placeholder='Suffix'
                  defaultValue={''}
                  onChangeText={onChangeSuffix}
                  style={styles.suffixInput}
                />
              </View>

              <View style={{ width: '50%' }}>
                <Text style={styles.label}>Gender </Text>
                <Select
                  open={showDropdown}
                  onToggleDropdown={() => setShowDropdown(!showDropdown)}
                  value={gender}
                  style={{ marginTop: 5 }}
                  onSelectItem={onChangeGender}
                >
                  <SelectItem label='Rather not say' />
                  <SelectItem label='Male' />
                  <SelectItem label='Female' />
                </Select>
              </View>
            </View>
          </View>

          <View style={{ width: '100%', alignItems: 'center', borderRadius: 15 }}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              placeholder='Address'
              defaultValue={''}
              onChangeText={onChangeAddress}
              style={styles.input}
            />
          </View>

          <View style={{ width: '100%', alignItems: 'center', borderRadius: 15 }}>
            <Text style={styles.label}>Date of birth</Text>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row'
              }}
            >
              <TextInput
                placeholder='Date of birth'
                defaultValue={moment(dateOfBirth).format('yyyy-MM-DD')}
                style={styles.dobInput}
                editable={false}
              />
              <AntDesign
                name='calendar'
                size={37}
                color={COLORS.PRIMARY}
                style={{ marginRight: 5 }}
                onPress={() => setShowDatePicker(true)}
              />
            </View>
          </View>

          {showDatePicker === true ? (
            <DateTimePicker
              value={dateOfBirth}
              mode={'date'}
              is24Hour={true}
              onChange={(event, date) => {
                setShowDatePicker(false)
                setDateOfBirth(new Date(date))
              }}
            />
          ) : null}

          {error ? (
            <Text style={styles.errorMessage}>*{errorMessage}</Text>
          ) : (
            <Text style={styles.errorMessage}></Text>
          )}
        </ScrollView>
        <View style={styles.actionBtnContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbutton}>
            <Image source={BackIcon} style={{ width: 60, height: 60 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  )
}
export default SignUpVisitorScreen

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  body: {
    width: '100%',
    height: '100%',
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    width: '80%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.TEXT_BLACK
  },
  errorMessage: {
    alignSelf: 'center',
    width: '80%',
    textAlign: 'left',
    color: 'red'
  },

  backbutton: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffff'
  },
  input: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
    width: '80%',
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
  suffixInput: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
    width: '95%',
    height: 50,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
    paddingVertical: 1,
    fontSize: 16,
    color: '#4d7861',
    backgroundColor: '#ffff'
  },
  genderInput: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
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

  courseInput: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
    width: '95%',
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
  yearAndSectionInput: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
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
  dobInput: {
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
  nextButton: {
    marginBottom: 10,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    maxWidth: 140,
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
  buttonText: {
    color: '#FFF',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  datePickerStyle: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: COLORS.PRIMARY,
    justifyContent: 'center'
  },
  actionBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30
  }
})
