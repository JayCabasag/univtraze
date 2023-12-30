import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  View
} from 'react-native'
import React, { useState, useRef, useMemo } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { AntDesign } from '@expo/vector-icons'
import moment from 'moment'
import StepperIcon1 from '../../assets/step-1-credentials.png'
import { COLORS, FONT_FAMILY, GENDER } from '../../utils/app_constants'
import { PhAddress } from '../../services/address/ph-address'
import { Picker } from '@react-native-picker/picker'
import { PhoneNumbers } from '../../services/phone-numbers/phone-numbers'
import useFormErrors from '../../hooks/useFormErrors'
import { nameRegex, optionalNameRegex, phoneNumberRegex } from '../../utils/regex'
import UserInformationFooter from '../../components/UserInformationFooter'

const UserInformationScreen = ({ navigation, route: { params: userType } }) => {
  const scrollViewContainerRef = useRef()
  const publicProfileRef = useRef()
  const contactInformationRef = useRef()
  const currentAddressRef = useRef()

  //User information
  const [firstName, onChangeFirstName] = useState('')
  const [middleName, onChangeMiddleName] = useState('')
  const [lastName, onChangeLastName] = useState('')
  const [suffix, onChangeSuffix] = useState('')
  const [gender, onChangeGender] = useState('Rather not say')
  const [dateOfBirth, setDateOfBirth] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  //Contact information
  const [countryDialCode, setCountryDialCode] = useState('+63')
  const [phoneNumber, onChangePhoneNumber] = useState('')

  //Address information
  const [addressRegion, setAddressRegion] = useState(null)
  const [addressProvince, setAddressProvince] = useState(null)
  const [addressCity, setAddressCity] = useState(null)
  const [addressBrgy, setAddressBrgy] = useState(null)
  const [addressStreet, setAddressStreet] = useState(null)

  // Error handlers
  const { formErrors, setFormErrors, resetFormErrors } = useFormErrors([
    'firstName',
    'middleName',
    'lastName',
    'suffix',
    'gender',
    'dob',
    'countryDialCode',
    'phoneNumber',
    'region',
    'province',
    'city',
    'brgy',
    'street'
  ])

  const scrollToPublicProfile = () => {
    scrollViewContainerRef.current.scrollTo({ y: 0, animated: true })
  }

  const scrollToContactInfo = () => {
    contactInformationRef.current.measure((x, y, width, height, pageX, pageY) => {
      scrollViewContainerRef.current.scrollTo({ y: pageY, animated: true })
    })
  }

  const scrollToCurrentAddress = () => {
    scrollViewContainerRef.current.scrollTo({ y: 1000, animated: true })
  }

  const onNext = async () => {
    resetFormErrors()
    if (userType === null || userType === '') {
      return navigation.pop()
    }

    if (firstName === null || firstName === '') {
      scrollToPublicProfile()
      return setFormErrors('firstName', 'First name is required')
    }

    if (!nameRegex.test(firstName)) {
      scrollToPublicProfile()
      return setFormErrors('firstName', 'First name is not valid')
    }

    if (!optionalNameRegex.test(middleName)) {
      scrollToPublicProfile()
      return setFormErrors('middleName', 'Middle name is not valid')
    }

    if (lastName === null || lastName === '') {
      scrollToPublicProfile()
      return setFormErrors('lastName', 'Last name is required')
    }
    if (!nameRegex.test(lastName)) {
      scrollToPublicProfile()
      return setFormErrors('lastName', 'Last name is not valid')
    }

    if (gender === null || gender === '') {
      scrollToPublicProfile()
      return setFormErrors('gender', 'Gender is required')
    }

    if (dateOfBirth === null || dateOfBirth === '') {
      scrollToPublicProfile()
      return setFormErrors('dob', 'Date of birth is required')
    }

    const totalYears = moment().diff(moment(dateOfBirth), 'Years')

    if (totalYears < 12) {
      scrollToPublicProfile()
      return setFormErrors('dob', "User below 12 yrs old can't use the app")
    }

    if (countryDialCode == null || countryDialCode == '') {
      scrollToContactInfo()
      return setFormErrors('countryDialCode', 'Country dial code is required')
    }

    if (phoneNumber == null || phoneNumber == '') {
      scrollToContactInfo()
      return setFormErrors('phoneNumber', 'Phone number is required')
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
      scrollToContactInfo()
      return setFormErrors('phoneNumber', 'Phone number is invalid')
    }

    if (addressRegion == null || addressRegion == '') {
      scrollToCurrentAddress()
      return setFormErrors('region', 'Region address is required')
    }

    if (addressProvince == null || addressProvince == '') {
      scrollToCurrentAddress()
      return setFormErrors('province', 'Province address is required')
    }

    if (addressCity == null || addressCity == '') {
      scrollToCurrentAddress()
      return setFormErrors('city', 'City address is required')
    }

    if (addressBrgy == null || addressBrgy == '') {
      scrollToCurrentAddress()
      return setFormErrors('brgy', 'Barangay address is required')
    }

    if (addressStreet == null || addressStreet == '') {
      scrollToCurrentAddress()
      return setFormErrors('street', 'Street address is required')
    }

    navigation.navigate('user-documents')
  }

  const countryDialCodes = useMemo(() => {
    return PhoneNumbers.getPhoneNumberPrefixes()
  }, [])

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
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior='height'>
      <View style={styles.header}>
        <Image
          source={StepperIcon1}
          resizeMode='contain'
          style={{ width: '100%', marginTop: 30 }}
        />
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ref={scrollViewContainerRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text ref={publicProfileRef} style={styles.sectionHeaderText}>
          Public profile
        </Text>
        <View style={[styles.inputWrapper]}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            placeholder='e.g John'
            value={firstName}
            onChangeText={onChangeFirstName}
            style={[styles.input, formErrors.firstName?.hasError && styles.inputError]}
          />
          {formErrors.firstName?.hasError && (
            <Text style={styles.errorText}>{formErrors.firstName.message}</Text>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Middle name (optional)</Text>
          <TextInput
            placeholder='Middle name'
            value={middleName}
            onChangeText={onChangeMiddleName}
            style={[styles.input, formErrors.middleName?.hasError && styles.inputError]}
          />
          {formErrors.middleName?.hasError && (
            <Text style={styles.errorText}>{formErrors.middleName.message}</Text>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Last name</Text>
          <TextInput
            placeholder='Last name'
            value={lastName}
            onChangeText={onChangeLastName}
            style={[styles.input, formErrors.lastName?.hasError && styles.inputError]}
          />
          {formErrors.lastName?.hasError && (
            <Text style={styles.errorText}>{formErrors.lastName.message}</Text>
          )}
        </View>

        <View style={styles.suffixContainer}>
          <View style={{ width: '100%', flexDirection: 'row' }}>
            <View style={{ width: '50%' }}>
              <Text style={styles.label}>Suffix </Text>
              <TextInput
                placeholder='Suffix'
                value={suffix}
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
          <View style={[styles.dobInputWrapper, formErrors.dob?.hasError && styles.inputError]}>
            <TextInput
              placeholder='Date of birth'
              value={moment(dateOfBirth).format('yyyy-MM-DD')}
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
          {formErrors.dob?.hasError && (
            <Text style={styles.errorText}>{formErrors.dob.message}</Text>
          )}

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

        <Text ref={contactInformationRef} style={styles.sectionHeaderText}>
          Contact Information
        </Text>
        <View style={styles.phoneNumberContainer}>
          <View style={styles.countryCodeWrapper}>
            <Text style={styles.label}>Country Dial Code</Text>
            <View
              style={[
                styles.countryDialCodePickerWrapper,
                formErrors.countryDialCode?.hasError && styles.inputError
              ]}
            >
              <Picker
                style={styles.countryDialCodePickerStyle}
                selectedValue={countryDialCode}
                onValueChange={(itemValue, itemIndex) => setCountryDialCode(itemValue)}
              >
                {countryDialCodes.map((country) => {
                  return (
                    <Picker.Item
                      style={styles.genderPickerItemStyle}
                      key={country.code}
                      label={`${country.flag} (${country.dial_code}) ${country.name}`}
                      value={country.dial_code}
                    />
                  )
                })}
              </Picker>
            </View>
            {formErrors.countryDialCode?.hasError && (
              <Text style={styles.errorText}>{formErrors.countryDialCode.message}</Text>
            )}
          </View>
          <View style={styles.phoneNumberWrapper}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              placeholder='Phone number'
              value={phoneNumber}
              onChangeText={onChangePhoneNumber}
              style={[styles.input, formErrors.phoneNumber?.hasError && styles.inputError]}
            />
            {formErrors.phoneNumber?.hasError && (
              <Text style={styles.errorText}>{formErrors.phoneNumber.message}</Text>
            )}
          </View>
        </View>

        <Text ref={currentAddressRef} style={styles.sectionHeaderText}>
          Current Address
        </Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Region</Text>
          <View
            style={[styles.addressPicketWrapper, formErrors.region?.hasError && styles.inputError]}
          >
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
          {formErrors.region?.hasError && (
            <Text style={styles.errorText}>{formErrors.region.message}</Text>
          )}
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Province</Text>
          <View
            style={[
              styles.addressPicketWrapper,
              formErrors.province?.hasError && styles.inputError
            ]}
          >
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
          {formErrors.province?.hasError && (
            <Text style={styles.errorText}>{formErrors.province.message}</Text>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>City</Text>
          <View
            style={[styles.addressPicketWrapper, formErrors.city?.hasError && styles.inputError]}
          >
            <Picker
              style={styles.addressPickerStyle}
              selectedValue={addressCity}
              onValueChange={(itemValue, itemIndex) => setAddressCity(itemValue)}
              enabled={addressProvince != null}
            >
              {cities.map((city) => {
                return (
                  <Picker.Item key={city.city_code} label={city.city_name} value={city.city_code} />
                )
              })}
            </Picker>
          </View>
          {formErrors.province?.hasError && (
            <Text style={styles.errorText}>{formErrors.province.message}</Text>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Barangay</Text>
          <View
            style={[styles.addressPicketWrapper, formErrors.brgy?.hasError && styles.inputError]}
          >
            <Picker
              style={styles.addressPickerStyle}
              selectedValue={addressBrgy}
              onValueChange={(itemValue, itemIndex) => setAddressBrgy(itemValue)}
              enabled={addressCity != null}
            >
              {barangays.map((brgy) => {
                return (
                  <Picker.Item key={brgy.brgy_code} label={brgy.brgy_name} value={brgy.brgy_code} />
                )
              })}
            </Picker>
          </View>
          {formErrors.brgy?.hasError && (
            <Text style={styles.errorText}>{formErrors.brgy.message}</Text>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>House/Lot/Apt. # St.</Text>
          <TextInput
            placeholder='House/Lot/Apt. # St.'
            value={addressStreet}
            onChangeText={setAddressStreet}
            style={[styles.input, formErrors.street?.hasError && styles.inputError]}
            editable={addressBrgy != null}
          />
          {formErrors.street?.hasError && (
            <Text style={styles.errorText}>{formErrors.street.message}</Text>
          )}
        </View>
      </ScrollView>
      <UserInformationFooter onGoBack={navigation.goBack} onNext={onNext} />
    </KeyboardAvoidingView>
  )
}
export default UserInformationScreen

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    backgroundColor: '#E1F5E4',
    flex: 1
  },
  header: {
    width: '100%',
    height: 130,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  scrollViewContent: {
    paddingHorizontal: 30,
    paddingVertical: 20
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
  errorText: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.RED,
    marginTop: 5
  },
  genderPickerWrapper: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginTop: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  genderPickerStyle: {
    width: '100%',
    backgroundColor: COLORS.WHITE,
    color: '#4d7861'
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
  phoneNumberContainer: {
    marginBottom: 30
  },
  countryDialCodePickerWrapper: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginTop: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  countryDialCodePickerStyle: {
    width: '100%',
    backgroundColor: COLORS.WHITE,
    color: '#4d7861'
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
    color: '#4d7861'
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
    height: 54,
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
  datePickerStyle: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: COLORS.PRIMARY,
    justifyContent: 'center'
  }
})
