import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  View,
  Platform
} from 'react-native'
import uuid from 'react-native-uuid'
import React, { useState, useRef, useMemo } from 'react'
import moment from 'moment'
import StepperIcon1 from '../assets/step-1-credentials.png'
import { COLORS, FONT_FAMILY, GENDER } from '../utils/app_constants'
import { PhAddress } from '../services/address/ph-address'
import { PhoneNumbers } from '../services/phone-numbers/phone-numbers'
import useFormErrors from '../hooks/useFormErrors'
import { nameRegex, optionalNameRegex, phoneNumberRegex } from '../utils/regex'
import UserInformationFooter from '../components/UserInfoFooter'
import CustomPicker from '../components/ui/CustomPicker'
import CustomCalendar from '../components/ui/CustomCalendar'
import { withSafeAreaView } from '../hoc/withSafeAreaView'
import { isEmpty } from '../utils/helpers'

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
    if (isEmpty(userType)) {
      return navigation.pop()
    }

    if (isEmpty(firstName)) {
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

    if (isEmpty(lastName)) {
      scrollToPublicProfile()
      return setFormErrors('lastName', 'Last name is required')
    }
    if (!nameRegex.test(lastName)) {
      scrollToPublicProfile()
      return setFormErrors('lastName', 'Last name is not valid')
    }

    if (isEmpty(gender)) {
      scrollToPublicProfile()
      return setFormErrors('gender', 'Gender is required')
    }

    if (isEmpty(dateOfBirth)) {
      scrollToPublicProfile()
      return setFormErrors('dob', 'Date of birth is required')
    }

    const totalYears = moment().diff(moment(dateOfBirth), 'Years')

    if (totalYears < 12) {
      scrollToPublicProfile()
      return setFormErrors('dob', "User below 12 yrs old can't use the app")
    }

    if (isEmpty(countryDialCode)) {
      return setFormErrors('countryDialCode', 'Country dial code is required')
    }

    if (isEmpty(phoneNumber)) {
      return setFormErrors('phoneNumber', 'Phone number is required')
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
      return setFormErrors('phoneNumber', 'Phone number is invalid')
    }

    if (isEmpty(addressRegion )) {
      scrollToCurrentAddress()
      return setFormErrors('region', 'Region address is required')
    }

    if (isEmpty(addressProvince)) {
      scrollToCurrentAddress()
      return setFormErrors('province', 'Province address is required')
    }

    if (isEmpty(addressCity)) {
      scrollToCurrentAddress()
      return setFormErrors('city', 'City address is required')
    }

    if (isEmpty(addressBrgy)) {
      scrollToCurrentAddress()
      return setFormErrors('brgy', 'Barangay address is required')
    }

    if (isEmpty(addressStreet)) {
      scrollToCurrentAddress()
      return setFormErrors('street', 'Street address is required')
    }

    const brgy = barangays.find((brgy) => brgy.value == addressBrgy)
    const city = cities.find((city) => city.value == addressCity)
    const province = provinces.find((province) => province.value == addressProvince)
    const region = regions.find((region) => region.value == addressRegion)

    navigation.navigate('user-documents', {
      userType,
      firstName,
      middleName,
      lastName,
      suffix,
      gender,
      dob: moment(dateOfBirth).format('MM-DD-yyyy'),
      phoneNumber: `${countryDialCode}${phoneNumber}`,
      address: `${addressStreet}, ${brgy?.label ?? ''}, ${city.label ?? ''}, ${
        province?.label ?? ''
      }, ${region?.label ?? ''}`
    })
  }

  const genders = Object.values(GENDER).map((gender) => ({
    id: gender,
    label: gender,
    value: gender
  }))
  const countryDialCodes = useMemo(() => {
    const countryCodes = PhoneNumbers.getPhoneNumberPrefixes()
    return countryCodes.map((countryCode) => ({
      id: countryCode.code,
      label: `${countryCode.flag} (${countryCode.dial_code}) ${countryCode.name}`,
      value: countryCode.dial_code
    }))
  }, [])

  const regions = useMemo(() => {
    const phRegions = PhAddress.getRegions()
    const withNullPhRegions = [
      {
        id: uuid.v4(),
        region_name: 'Select region...',
        region_code: null
      },
      ...phRegions
    ]
    return withNullPhRegions.map((phRegion) => ({
      id: phRegion.id,
      label: phRegion.region_name,
      value: phRegion.region_code
    }))
  }, [])

  const provinces = useMemo(() => {
    const phProvinces = PhAddress.getProvincesByRegion(addressRegion)
    const withNullProvinces = [
      {
        id: uuid.v4(),
        province_name: 'Select province...',
        province_code: null
      },
      ...phProvinces
    ]
    return withNullProvinces.map((phProvince) => ({
      id: phProvince.province_code,
      label: phProvince.province_name,
      value: phProvince.province_code
    }))
  }, [addressRegion])

  const cities = useMemo(() => {
    const provinceCities = PhAddress.getCitiesByProvince(addressProvince)

    const withNullCities = [
      {
        city_code: uuid.v4(),
        city_name: 'Select cities...',
        city_code: null
      },
      ...provinceCities
    ]

    return withNullCities.map((provinceCity) => ({
      id: provinceCity.city_code,
      label: provinceCity.city_name,
      value: provinceCity.city_code
    }))
  }, [addressProvince])

  const barangays = useMemo(() => {
    const cityBrgs = PhAddress.getBarangaysByCity(addressCity)
    const withNullBrgys = [
      {
        brgy_code: uuid.v4(),
        brgy_name: 'Select barangay...',
        brgy_code: null
      },
      ...cityBrgs
    ]

    return withNullBrgys.map((cityBrgy) => ({
      id: cityBrgy.brgy_code,
      label: cityBrgy.brgy_name,
      value: cityBrgy.brgy_code
    }))
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
              <CustomPicker
                prompt='Gender'
                containerStyle={styles.genderContainerStyle}
                selectedValue={gender}
                onValueChange={(itemValue, itemIndex) => {
                  onChangeGender(itemValue)
                }}
                options={genders}
              />
            </View>
          </View>
        </View>

        <View style={styles.dobContainer}>
          <Text style={styles.label}>Date of birth</Text>
          <CustomCalendar
            value={dateOfBirth}
            showDatePicker={showDatePicker}
            placeholder={'Date of birth'}
            onChange={(_event, date) => {
              // This is required to cancel close when selecting date in spinner
              if (!(Platform.OS == 'ios')) {
                setShowDatePicker(false)
              }
              setDateOfBirth(date)
            }}
            setShowDatePicker={(value) => {
              setShowDatePicker(value)
            }}
            hasError={formErrors.dob?.hasError}
          />
          {formErrors.dob?.hasError && (
            <Text style={styles.errorText}>{formErrors.dob.message}</Text>
          )}
        </View>

        <Text ref={contactInformationRef} style={styles.sectionHeaderText}>
          Contact Information
        </Text>
        <View style={styles.phoneNumberContainer}>
          <View style={styles.countryCodeWrapper}>
            <Text style={styles.label}>Country Dial Code</Text>
            <CustomPicker
              prompt='Country code'
              selectedValue={countryDialCode}
              onValueChange={(itemValue, itemIndex) => {
                setCountryDialCode(itemValue)
              }}
              hasError={formErrors.countryDialCode?.hasError ?? false}
              options={countryDialCodes}
            />
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
          <CustomPicker
            prompt='Regions'
            selectedValue={addressRegion}
            onValueChange={(itemValue, itemIndex) => {
              setAddressRegion(itemValue)
            }}
            options={regions}
            hasError={formErrors.region?.hasError ?? false}
          />
          {formErrors.region?.hasError && (
            <Text style={styles.errorText}>{formErrors.region.message}</Text>
          )}
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Province</Text>
          <CustomPicker
            prompt='Province'
            selectedValue={addressProvince}
            onValueChange={(itemValue, itemIndex) => {
              setAddressProvince(itemValue)
            }}
            options={provinces}
            hasError={formErrors.province?.hasError ?? false}
          />
          {formErrors.province?.hasError && (
            <Text style={styles.errorText}>{formErrors.province.message}</Text>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>City</Text>
          <CustomPicker
            prompt='City'
            selectedValue={addressCity}
            onValueChange={(itemValue, itemIndex) => {
              setAddressCity(itemValue)
            }}
            hasError={formErrors.city?.hasError ?? false}
            options={cities}
          />
          {formErrors.city?.hasError && (
            <Text style={styles.errorText}>{formErrors.city.message}</Text>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Barangay</Text>
          <CustomPicker
            prompt='Barangay'
            selectedValue={addressBrgy}
            onValueChange={(itemValue, itemIndex) => {
              setAddressBrgy(itemValue)
            }}
            hasError={formErrors.brgy?.hasError ?? false}
            options={barangays}
          />
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
export default withSafeAreaView(UserInformationScreen)

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    backgroundColor: '#E1F5E4',
    flex: 1
  },
  header: {
    width: '100%',
    height: Platform.OS == 'ios' ? 170 : 150,
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
  genderContainerStyle: { height: 50 },
  dobContainer: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 30
  },
  phoneNumberContainer: {
    marginBottom: 30
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
