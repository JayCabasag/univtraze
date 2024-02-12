import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Platform
} from 'react-native'
import React, { Fragment, useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import StepperIcon3 from '../assets/step-3-credentials.png'
import { COLORS, VACCINES } from '../utils/app_constants'
import LoadingModal from '../components/LoadingModal'
import useFormErrors from '../hooks/useFormErrors'
import CustomPicker from '../components/ui/CustomPicker'
import { useAuth } from '../services/store/auth/AuthContext'
import UserInfoWithSkipFooter from '../components/UserInfoWithSkipFooter'
import CustomCalendar from '../components/ui/CustomCalendar'
import { useUser } from '../services/store/user/UserContext'
import { genericGetRequest } from '../services/api/genericGetRequest'

const UserVaccine = ({ navigation, route }) => {
  const { state: auth } = useAuth()
  const { state: userState, updateUser } = useUser()

  const userId = userState.user.id;
  const userToken = auth.userToken;

  const [allVaccinationRecords, setAllVaccinationRecords] = useState([])

  const [firstDoseName, setFirstDoseName] = useState('none')
  const [firstDoseDate, setFirstDoseDate] = useState(new Date())
  const [showFirstDoseDatePicker, setShowFirstDoseDatePicker] = useState(false)

  const [secondDoseName, setSecondDoseName] = useState('none')
  const [secondDoseDate, setSecondDoseDate] = useState(new Date())
  const [showSecondDoseDatePicker, setShowSecondDoseDatePicker] = useState(false)

  const [boosterDoseName, setBoosterDoseName] = useState('none')
  const [boosterDoseDate, setBoosterDoseDate] = useState(new Date())
  const [showBoosterDoseDatePicker, setShowBoosterDoseDatePicker] = useState(false)

  const { formErrors } = useFormErrors([
    'firstDose',
    'firstDoseDate',
    'secondDose',
    'secondDoseDate',
    'boosterDose',
    'boosterDoseDate'
  ])

  const [showLoadingModal, setShowLoadingModal] = useState(false)

  useEffect(() => {
    if (!userId || !userToken) return;
    const getVaccinationRecords = async () => {
      try {
        setShowLoadingModal(true)
        const res = await genericGetRequest(`vaccination-records?userd_id=${userId}`, userToken)
        setAllVaccinationRecords(res.results)
      } catch (error) {
        console.log(error)
      } finally {
        setShowLoadingModal(false)
      }
    } 
    getVaccinationRecords()
  }, [userId, userToken])

  const handleUpdateUserVaccine = async () => {
    try {
      setShowLoadingModal(true)
      console.log("Updating")

    } catch (error) {
      Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
        { text: 'OK', onPress: () => console.log('OK') }
      ])
    } finally {
      setShowLoadingModal(false)
    }
  }

  const skipVaccinationtion = async () => {
    navigation.navigate('index')
  }

  const vaccineOptions = Object.values(VACCINES).map((data, index) => ({
    id: index,
    value: data,
    label: data.toUpperCase()
  }))

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
      <LoadingModal
        onRequestClose={() => setShowLoadingModal(false)}
        open={showLoadingModal}
        loadingMessage={'Please wait'}
      />
      <View style={styles.header}>
        <Image
          source={StepperIcon3}
          resizeMode='contain'
          style={{ width: '100%', marginTop: 30 }}
        />
      </View>

      <ScrollView style={styles.bodyContainer} contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.label}>1st Dose</Text>
        <CustomPicker
          prompt='1st Dose'
          containerStyle={{ marginBottom: 10 }}
          selectedValue={firstDoseName}
          onValueChange={(itemValue, itemIndex) => {
            setFirstDoseName(itemValue)
          }}
          hasError={formErrors.firstDoseName?.hasError ?? false}
          options={vaccineOptions}
        />
        {formErrors.firstDoseName?.hasError && (
          <Text style={styles.errorText}>{formErrors.firstDoseName.message}</Text>
        )}
        {firstDoseName != VACCINES.NONE && (
          <Fragment>
            <CustomCalendar
              value={firstDoseDate}
              showDatePicker={showFirstDoseDatePicker}
              placeholder={'Date of birth'}
              onChange={(_event, date) => {
                // This is required to cancel close when selecting date in spinner
                if (!(Platform.OS == 'ios')) {
                  setShowFirstDoseDatePicker(false)
                }
                setFirstDoseDate(date)
              }}
              setShowDatePicker={(value) => {
                setShowFirstDoseDatePicker(value)
              }}
              hasError={formErrors.firstDoseDate?.hasError}
            />
            {formErrors.firstDoseDate?.hasError && (
              <Text style={styles.errorText}>{formErrors.firstDoseDate.message}</Text>
            )}
          </Fragment>
        )}

        <Text style={styles.label}>2nd Dose</Text>
        <CustomPicker
          prompt='2st Dose'
          containerStyle={{ marginBottom: 10 }}
          selectedValue={secondDoseName}
          onValueChange={(itemValue, itemIndex) => {
            setSecondDoseName(itemValue)
          }}
          hasError={formErrors.secondDoseName?.hasError ?? false}
          options={vaccineOptions}
        />
        {formErrors.secondDoseName?.hasError && (
          <Text style={styles.errorText}>{formErrors.secondDoseName.message}</Text>
        )}
        {secondDoseName != VACCINES.NONE && (
          <Fragment>
            <CustomCalendar
              value={secondDoseDate}
              showDatePicker={showSecondDoseDatePicker}
              placeholder={'Date'}
              onChange={(_event, date) => {
                // This is required to cancel close when selecting date in spinner
                if (!(Platform.OS == 'ios')) {
                  setShowSecondDoseDatePicker(false)
                }
                setSecondDoseDate(date)
              }}
              setShowDatePicker={(value) => {
                setShowSecondDoseDatePicker(value)
              }}
              hasError={formErrors.secondDoseDate?.hasError}
            />
            {formErrors.secondDoseDate?.hasError && (
              <Text style={styles.errorText}>{formErrors.secondDoseDate.message}</Text>
            )}
          </Fragment>
        )}

        <Text style={styles.label}>3rd Dose</Text>
        <CustomPicker
          prompt='Booster Dose'
          containerStyle={{ marginBottom: 10 }}
          selectedValue={boosterDoseName}
          onValueChange={(itemValue, itemIndex) => {
            setBoosterDoseName(itemValue)
          }}
          hasError={formErrors.boosterDoseName?.hasError ?? false}
          options={vaccineOptions}
        />
        {formErrors.boosterDoseName?.hasError && (
          <Text style={styles.errorText}>{formErrors.boosterDoseName.message}</Text>
        )}
        {boosterDoseName != VACCINES.NONE && (
          <Fragment>
            <CustomCalendar
              value={boosterDoseDate}
              showDatePicker={showBoosterDoseDatePicker}
              placeholder={'Date'}
              onChange={(_event, date) => {
                // This is required to cancel close when selecting date in spinner
                if (!(Platform.OS == 'ios')) {
                  setShowBoosterDoseDatePicker(false)
                }
                setBoosterDoseDate(date)
              }}
              setShowDatePicker={(value) => {
                setShowBoosterDoseDatePicker(value)
              }}
              hasError={formErrors.boosterDoseDate?.hasError}
            />
            {formErrors.boosterDoseDate?.hasError && (
              <Text style={styles.errorText}>{formErrors.boosterDoseDate.message}</Text>
            )}
          </Fragment>
        )}
      </ScrollView>
      <UserInfoWithSkipFooter onSkip={skipVaccinationtion} onNext={handleUpdateUserVaccine} />
    </KeyboardAvoidingView>
  )
}

export default UserVaccine

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    backgroundColor: '#E1F5E4',
    flex: 1
  },
  mainContainer: {
    flex: 1,
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
    height: Platform.OS == 'ios' ? 170 : 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  bodyContainer: {
    flex: 1
  },
  scrollViewContent: {
    paddingHorizontal: 30,
    paddingVertical: 20
  },
  label: {
    width: '100%',
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
