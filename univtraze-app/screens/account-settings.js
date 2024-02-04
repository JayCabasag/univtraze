import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useToast } from 'react-native-toast-notifications'
import BackIcon from '../assets/back-icon.png'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import { useUser } from '../services/store/user/UserContext'
import { useAuth } from '../services/store/auth/AuthContext'
import useFormErrors from '../hooks/useFormErrors'
import { genericDeleteRequest } from '../services/api/genericDeleteRequest'

const AccountSettingsScreen = ({ navigation }) => {
  const toast = useToast()
  const { state: user } = useUser()
  const { state: auth } = useAuth()
  const token = auth.userToken
  const userId = user.user.id

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')

  const { setFormErrors, formErrors, resetFormErrors } = useFormErrors(['password'])

  //Error handlers

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Error')

  const deleteAccountPermanently = async (currentToken, id) => {
    
    // const config = {
    //   headers: { Authorization: `Bearer ${currentToken}` }
    // }
    // const data = {
    //   id: id,
    //   password: password
    // }
    // setIsLoading(true)
    // setError(false)
    // try {
    //   await axios
    //     .post(`https://univtraze.herokuapp.com/api/user/deactivateAccount`, data, config)
    //     .then((response) => {
    //       const success = response.data.success
    //       if (success === 0) {
    //         setIsLoading(false)
    //         setError(true)
    //         setErrorMessage(response.data.message)
    //         return
    //       }
    //       if (success === 1) {
    //         setIsLoading(false)
    //         setError(false)
    //         navigation.navigate('signin')
    //         toast.show('Account deactivated...', {
    //           type: 'normal',
    //           placement: 'bottom',
    //           duration: 1000,
    //           offset: 30,
    //           animationType: 'slide-in'
    //         })
    //         return
    //       }
    //     })
    // } catch (error) {
    //   setIsLoading(false)
    //   setError(true)
    //   setErrorMessage('Network error')
    // }
  }

  const confirmDeleteAccount = async () => {
    resetFormErrors()
    if (password == '' || password == null) {
      return setFormErrors('password', 'Password is required')
    }
    
    try {
      setIsLoading(true)
      const res = await genericDeleteRequest(`/users/${userId}/deactivate`)
      Alert.alert('Success', error?.response?.data?.message, [
        { text: 'OK', onPress: () => console.log('OK') }
      ])
    } catch (error) {
      console.log(error)
      Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
        { text: 'OK', onPress: () => console.log('OK') }
      ])
    } finally {
      setIsLoading(false)
    }

  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
     <Modal
        animationType='fade'
        transparent={true}
        visible={showPasswordModal}
        statusBarTranslucent
        onRequestClose={() => {
          setShowPasswordModal(!showPasswordModal)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeaderText}>
              Once deleted, the account is irrecoverable.
            </Text>
            <Text style={styles.passwordLabelText}>To continue, please confirm with password</Text>
            <TextInput
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[styles.input, formErrors.password?.hasError && styles.inputError]}
            />
            {formErrors.password?.hasError && (
              <Text style={styles.errorText}>{formErrors.password?.message}</Text>
            )}
            <View
              style={styles.menuItemContainer}
            >
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmDeleteAccount}
              >
                <Text style={styles.deactivateButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowPasswordModal(false)
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.topContainer}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Image source={BackIcon} style={styles.backIconImage} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        <Text style={styles.headerText}>Account settings</Text>
        <TouchableOpacity
          style={styles.settingsOption}
          onPress={() => {
            navigation.navigate('UpdatePersonalInfo')
          }}
        >
          <Text style={styles.menuItemText}>Update Personal Information</Text>
          <AntDesign name='right' size={18} color='black' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsOption}
          onPress={() => {
            navigation.navigate('UpdatePassword',)
          }}
        >
          <Text style={styles.menuItemText}>Update Password</Text>
          <AntDesign name='right' size={18} color='black' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deactivateButton}
          onPress={() => {
            setShowPasswordModal(true)
          }}
        >
          <Text style={styles.deactivateButtonText}>Deactivate Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
export default AccountSettingsScreen

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY
  },
  scrollViewContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SECONDARY
  },
  backIconImage: { marginLeft: -15, width: 60, height: 60 },
  topContainer: {
    paddingHorizontal: 25,
    width: '100%',
    height: 100,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? StatusBar.currentHeight + 40 : 40
  },
  backIcon: {
    height: 60,
    width: 60,
    marginLeft: -15,
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  headerText: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: 24,
    marginBottom: 20
  },
  mainContainer: {
    paddingHorizontal: 30,
    width: '100%'
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
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    width: 340,
    height: 'auto',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeaderText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20
  },
  passwordLabelText: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: 14,
    textAlign: 'left',
    width: '100%'
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
  modalButton: {
    width: 80,
    height: 60,
    borderRadius: 20,
    elevation: 2,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1
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
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 1,
    fontSize: 16,
    color: '#4d7861',
    backgroundColor: '#ffff'
  },
  inputError: {
    borderColor: COLORS.RED
  },
  errorText: {
    color: COLORS.RED,
    fontFamily: FONT_FAMILY.POPPINS_LIGHT,
    fontSize: 14,
    width: '100%',
    textAlign: 'left'
  },
  menuItemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15
  },
  deactivateButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'red',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15
  },
  deactivateButtonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  confirmButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'red',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15,
    flex: 1,
  },
  cancelButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15,
    flex: 1,
  },
  cancelButtonText: {
    color: COLORS.BLACK,
    fontSize: 15,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  settingsOption: {
    width: '100%',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
  },
  menuItemText: { 
    fontSize: 14,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  }
})
