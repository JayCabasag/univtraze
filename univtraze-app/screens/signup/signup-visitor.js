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
import React, { useState, useRef, useMemo } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { StackActions } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import moment from 'moment'
import StepperIcon1 from '../../assets/reg_identifier.png'
import BackIcon from '../../assets/back-icon.png'
import { COLORS, FONT_FAMILY, GENDER } from '../../utils/app_constants'
import { PhAddress } from '../../services/address/ph-address'
import { Picker } from '@react-native-picker/picker'

const SignUpVisitorScreen = ({ navigation }) => {
  const scrollViewContainerRef = useRef()
  const [type, setType] = useState('visitor')
  const [firstName, onChangeFirstName] = useState('')
  const [middleName, onChangeMiddleName] = useState('')
  const [lastName, onChangeLastName] = useState('')

  const [address, onChangeAddress] = useState('')
  const [addressRegion, setAddressRegion] = useState(null)
  const [addressProvince, setAddressProvince] = useState(null)
  const [addressCity, setAddressCity] = useState(null)
  const [addressBrgy, setAddressBrgy] = useState(null)
  const [addressStreet, setAddressStreet] = useState(null)

  const [suffix, onChangeSuffix] = useState('')
  const [gender, onChangeGender] = useState('Rather not say')
  const [dateOfBirth, setDateOfBirth] = useState(new Date())

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

  const regions = useMemo(() => {
    return PhAddress.getRegions()
  }, [])

  const provinces = useMemo(() => {
    return PhAddress.getProvincesByRegion(addressRegion)
  }, [addressRegion])

  const cities = useMemo(() => {
    return PhAddress.getCitiesByProvince(addressProvince)
  }, [addressProvince])

  const barangays = useMemo(() => {
    return PhAddress.getBarangaysByCity(addressCity)
  }, [addressCity])

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
      <View style={styles.header}>
        <Image
          source={StepperIcon1}
          resizeMode='contain'
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={scrollViewContainerRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.sectionHeaderText}>Personal Information</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            placeholder='First name'
            defaultValue={''}
            onChangeText={onChangeFirstName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Middle name </Text>
          <TextInput
            placeholder='Middle name'
            defaultValue={''}
            onChangeText={onChangeMiddleName}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            placeholder='Last name'
            defaultValue={''}
            onChangeText={onChangeLastName}
            style={styles.input}
          />
        </View>

        <View style={styles.suffixContainer}>
          <View style={{ width: '100%', flexDirection: 'row' }}>
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
              <View style={styles.genderPickerWrapper}>
                <Picker
                  style={styles.genderPickerStyle}
                  selectedValue={gender}
                  onValueChange={(itemValue, itemIndex) => onChangeGender(itemValue)}
                >
                  {Object.values(GENDER).map((gender) => {
                    return (
                      <Picker.Item
                        style={styles.genderPickerItemStyle}
                        key={gender}
                        label={gender}
                        value={gender}
                      />
                    )
                  })}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.dobContainer}>
          <Text style={styles.label}>Date of birth</Text>
          <View style={styles.dobInputWrapper}>
            <TextInput
              placeholder='Date of birth'
              defaultValue={moment(dateOfBirth).format('yyyy-MM-DD')}
              style={styles.dobInput}
              editable={false}
            />
            <AntDesign
              name='calendar'
              size={24}
              color={COLORS.PRIMARY}
              style={{ marginRight: 5, paddingHorizontal: 15 }}
              onPress={() => setShowDatePicker(true)}
            />
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode={'date'}
              accentColor={COLORS.PRIMARY}
              is24Hour={true}
              onChange={(event, date) => {
                setShowDatePicker(false)
                setDateOfBirth(new Date(date))
              }}
            />
          )}
        </View>

        <Text style={styles.sectionHeaderText}>Current Address</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Region</Text>
          <View style={styles.addressPicketWrapper}>
            <Picker
              style={styles.addressPickerStyle}
              selectedValue={addressRegion}
              onValueChange={(itemValue, itemIndex) => setAddressRegion(itemValue)}
            >
              <Picker.Item label='Please select region...' value={null} />
              {regions.map((region) => {
                return (
                  <Picker.Item
                    key={region.id}
                    label={region.region_name}
                    value={region.region_code}
                  />
                )
              })}
            </Picker>
          </View>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Province</Text>
          <View style={styles.addressPicketWrapper}>
            <Picker
              style={styles.addressPickerStyle}
              selectedValue={addressProvince}
              onValueChange={(itemValue, itemIndex) => setAddressProvince(itemValue)}
              enabled={addressRegion != null}
            >
              {provinces.map((province) => {
                return (
                  <Picker.Item
                    key={province.province_code}
                    label={province.province_name}
                    value={province.province_code}
                  />
                )
              })}
            </Picker>
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>City</Text>
          <View style={styles.addressPicketWrapper}>
            <Picker
              style={styles.addressPickerStyle}
              selectedValue={addressCity}
              onValueChange={(itemValue, itemIndex) => setAddressCity(itemValue)}
              enabled={addressProvince != null}
            >
              {cities.map((city) => {
                return (
                  <Picker.Item
                    key={city.city_code}
                    label={city.city_name}
                    value={city.city_code}
                  />
                )
              })}
            </Picker>
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Barangay</Text>
          <View style={styles.addressPicketWrapper}>
            <Picker
              style={styles.addressPickerStyle}
              selectedValue={addressBrgy}
              onValueChange={(itemValue, itemIndex) => setAddressBrgy(itemValue)}
              enabled={addressCity != null}
            >
              {barangays.map((brgy) => {
                return (
                  <Picker.Item
                    key={brgy.brgy_code}
                    label={brgy.brgy_name}
                    value={brgy.brgy_code}
                  />
                )
              })}
            </Picker>
          </View>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>House/Lot/Apt. # St.</Text>
          <TextInput
            placeholder='House/Lot/Apt. # St.'
            value={addressStreet}
            onChangeText={setAddressStreet}
            style={styles.input}
            editable={addressBrgy != null}
          />
        </View>

        {error ? (
          <Text style={styles.errorMessage}>*{errorMessage}</Text>
        ) : (
          <Text style={styles.errorMessage}></Text>
        )}
      </ScrollView>
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backbutton}>
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
  keyboardAvoidingView: {
    backgroundColor: '#E1F5E4',
    flex: 1
  },
  header: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50
  },
  scrollViewContent: {
    paddingHorizontal: 30
  },
  sectionHeaderText: {
    fontSize: 24,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  body: {
    width: '100%',
    height: '100%',
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.TEXT_BLACK,
    marginTop: 10
  },
  genderPickerWrapper: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginTop: 5,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  genderPickerStyle: {
    width: '100%',
    backgroundColor: COLORS.WHITE,
    borderWidth: 1
  },
  genderPickerItemStyle: {
    textTransform: 'uppercase',
    fontFamily: FONT_FAMILY.POPPINS_LIGHT
  },
  dobContainer: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 30
  },
  addressPicketWrapper: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5
  },
  addressPickerStyle: {
    width: '100%',
    backgroundColor: COLORS.WHITE,
    borderWidth: 1
  },
  errorMessage: {
    marginTop: 10,
    alignSelf: 'center',
    width: '100%',
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
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 15
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
  suffixContainer: {
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    zIndex: 2
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
  dobInputWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: COLORS.PRIMARY
  },
  dobInput: {
    flex: 1,
    height: 50,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: 15,
    borderRadius: 5,
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
    width: '100%',
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
    paddingBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30
  }
})
