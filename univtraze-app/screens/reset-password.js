import {
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  Modal,
  ActivityIndicator
} from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Dimensions } from 'react-native'
import { COLORS } from '../utils/app_constants'

const ResetPasswordScreen = ({
  navigation,
  route: {
    params: { email, recovery_password }
  }
}) => {
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')

  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const handleResetPassword = async () => {
    if (newPassword === '') {
      setError(true)
      setErrorMessage('Please input new password')
      setSuccess(false)
      return
    }
    if (newPassword.length <= 7) {
      setError(true)
      setErrorMessage('Password should have atleast 8 characters')
      setSuccess(false)
      return
    }
    if (confirmNewPassword === '') {
      setError(true)
      setErrorMessage('Please re-type new password')
      setSuccess(false)
      return
    }
    if (newPassword !== confirmNewPassword) {
      setError(true)
      setErrorMessage("Password don't matched")
      setSuccess(false)
      return
    }
    setShowLoadingModal(true)
    setShowLoadingModal('Resetting your password.')
    try {
      const data = {
        email: email,
        recovery_password: recovery_password,
        new_password: confirmNewPassword
      }

      await axios.post(`https://univtraze.herokuapp.com/api/user/updateUserPasswordFromRecovery`, data).then((response) => {
        const success = response.data.success

        if (success === false) {
          setError(true)
          setErrorMessage(response.data.message)
          setSuccess(false)
          setShowLoadingModal(false)
          setShowLoadingModal(false)
          setShowLoadingModal('')
          return
        }

        setError(false)
        setErrorMessage('')
        setSuccess(true)
        setShowLoadingModal(false)
        setShowLoadingModal(false)
        setShowLoadingModal('')
        alert('Password updated successfully.')
      })
    } catch (error) {
      console.log(error)
      setError(true)
      setSuccess(false)
      setShowLoadingModal(false)
      setShowLoadingModal('')
      setErrorMessage('Network connection error, please try again.')
    }
  }

  return (
    <SafeAreaView style={{ height: windowHeight, backgroundColor: '#E1F5E4' }}>
      <StatusBar animated={true} backgroundColor='#E1F5E4' barStyle='dark-content' />
      <KeyboardAvoidingView style={styles.container} behavior='height'>
        <Modal
          animationType='slide'
          transparent={true}
          visible={showLoadingModal}
          onRequestClose={() => {
            setShowLoadingModal(!showLoadingModal)
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size={'large'} />
              <Text style={styles.modalText}>{loadingMessage}</Text>
            </View>
          </View>
        </Modal>
        <View style={styles.inputContainer}>
          <Text style={styles.loginText}>Reset password</Text>
          <Text style={styles.label}>New password</Text>
          <TextInput
            placeholder='New password'
            defaultValue={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            style={styles.input}
            secureTextEntry
          />
          <Text style={styles.label}>Confirm new password</Text>
          <TextInput
            placeholder='Re-type password'
            defaultValue={confirmNewPassword}
            onChangeText={(text) => setConfirmNewPassword(text)}
            style={styles.input}
            secureTextEntry
          />

          {error ? (
            <Text style={styles.errorMessage}>*{errorMessage}</Text>
          ) : success ? (
            <Text style={styles.successMessage}>Password updated successfully</Text>
          ) : null}

          <TouchableOpacity onPress={() => handleResetPassword()} style={styles.button}>
            <Text style={styles.buttonText}>Reset password</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <Text
              style={styles.returnHomeText}
              onPress={() => {
                navigation.navigate('signin')
              }}
            >
              Return to login
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ResetPasswordScreen

const windowWidth = Dimensions.get('screen').width
const windowHeight = Dimensions.get('screen').height

const styles = StyleSheet.create({
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
  sendToEmailText: {
    textAlign: 'left',
    color: '#4d7861',
    marginBottom: 5,
    textAlign: 'left',
    width: 340,
    marginLeft: 41,
    marginRight: 41
  },

  returnHomeText: {
    textAlign: 'center',
    lineHeight: 25,
    marginTop: 15,
    width: windowWidth,
    textDecorationLine: 'underline',
    color: '#4d7861',
    marginBottom: 10,
    alignSelf: 'center'
  },
  buttonContainer: {
    backgroundColor: 'transparent'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
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
    textAlign: 'center',
    color: '#4d7861'
  },
  image: {
    justifyContent: 'center',
    width: '100%',
    height: 200,
    resizeMode: 'center'
  },

  imageContainer: {
    width: '100%',
    height: 'auto'
  },

  container: {
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    color: '#4d7861',
    marginLeft: 41
  },

  input: {
    margin: 5,
    height: 50,
    width: 340,
    borderColor: '#7a42f4',
    paddingHorizontal: 15,
    borderWidth: 0.1,
    borderRadius: 2,
    marginLeft: 41,
    marginRight: 41,
    paddingVertical: 1,
    fontSize: 16,
    color: '#4d7861',
    backgroundColor: '#ffff'
  },
  inputContainer: {
    backgroundColor: 'transparent'
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    width: 380,
    borderRadius: 10,
    width: 340,
    marginLeft: 41,
    marginRight: 41,
    marginTop: 5,
    paddingVertical: 18
  },
  buttonText: {
    color: '#FFF',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  loginText: {
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#364D39',
    fontSize: 30,
    lineHeight: 30,
    textTransform: 'uppercase',
    marginLeft: 41,
    paddingVertical: 30
  },
  forgotPassword: {
    textAlign: 'right',
    marginRight: 41,
    textDecorationLine: 'underline',
    color: '#4d7861',
    paddingVertical: 7.5
  },
  orText: {
    color: '#4d7861',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 7.5
  },
  socialMediaContainer: {
    flexDirection: 'row',
    width: windowWidth,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  googleImage: {
    width: 50,
    height: 50,
    marginRight: 7
  },

  facebookImage: {
    width: 36,
    height: 36,
    marginTop: 4,
    marginLeft: 7
  },
  successMessage: {
    textAlign: 'left',
    marginLeft: 41,
    color: COLORS.PRIMARY,
    paddingVertical: 7.5
  },
  errorMessage: {
    textAlign: 'left',
    marginLeft: 41,
    color: 'red',
    paddingVertical: 7.5
  },
  buttonContinue: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    paddingVertical: 18,
    marginVertical: 15,
    width: 308,
    height: 60
  }
})
