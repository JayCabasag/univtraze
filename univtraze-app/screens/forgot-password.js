import { KeyboardAvoidingView, Image, StyleSheet, TextInput, View, TouchableOpacity, Text, StatusBar, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import ConfettiCannon from 'react-native-confetti-cannon'
import ModalSuccess from 'react-native-modal'
import * as SecureStore from 'expo-secure-store'
import jwtDecode from 'jwt-decode'
import { Dimensions } from 'react-native'

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [codeInput, setCodeInput] = useState('')

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value)
  }

  const validateUserInput = async () => {
    if (email === '') {
      setError(true)
      setErrorMessage('Please input your email address')
      setShowCodeInput(false)
    } else {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (re.test(email)) {
        setError(false)
        setErrorMessage('')
        setShowCodeInput(true)
        setShowLoadingModal(true)
        try {
          const data = {
            email: email
          }

          await axios.post(`https://univtraze.herokuapp.com/api/user/sendRecoveryPasswordViaEmail`, data).then((response) => {
            const success = response.data.success

            if (success === false) {
              setError(true)
              setErrorMessage(response.data.message)
              setSuccess(false)
              setShowLoadingModal(false)
              return
            }

            setError(false)
            setErrorMessage('')
            setSuccess(true)
            setShowCodeInput(true)
            setShowLoadingModal(false)
          })
        } catch (error) {
          setError(true)
          setSuccess(false)
          setErrorMessage('Network connection error, please try again.')
          setShowLoadingModal(false)
        }
      } else {
        setSuccess(false)
        setError(true)
        setErrorMessage('Invalid email address')
        setShowCodeInput(false)
        setShowLoadingModal(false)
      }
    }
  }

  const [shoot, setShoot] = useState(false)

  useEffect(() => {
    //Time out to fire the cannon
    setTimeout(() => {
      setShoot(true)
    }, 1000)
  }, [])

  const verifyViaEmailRecovery = async () => {
    if (codeInput === '') {
      setSuccess(false)
      setError(true)
      setErrorMessage('Please input recovery password')
      setShowLoadingModal(false)
      return
    }

    try {
      const data = {
        email: email,
        recovery_password: codeInput
      }

      await axios.post(`https://univtraze.herokuapp.com/api/user/checkRecoveryPasswordAndEmailMatched`, data).then((response) => {
        const success = response.data.success

        if (success === false) {
          setError(true)
          setErrorMessage(response.data.message)
          setSuccess(false)
          setShowLoadingModal(false)
          return
        }

        setError(false)
        setErrorMessage('')
        setSuccess(true)
        setShowCodeInput(true)
        setShowLoadingModal(false)
        navigation.navigate('ResetPassword', { email, recovery_password: codeInput })
      })
    } catch (error) {
      setError(true)
      setSuccess(false)
      setErrorMessage('Network connection error, please try again.')
      setShowLoadingModal(false)
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
              <Image source={require('../assets/loading_icon.gif')} resizeMode='contain' style={{ width: 100, height: 100 }} />
              <Text style={styles.modalText}>{loadingMessage}</Text>
            </View>
          </View>
        </Modal>
        <View style={styles.inputContainer}>
          <Text style={styles.loginText}>Forgot password</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput placeholder='Email Address' defaultValue={email} onChangeText={(text) => setEmail(text)} style={styles.input} />

          {showCodeInput ? (
            <>
              <Text style={styles.label}>Code</Text>
              <TextInput
                placeholder='Recovery code'
                defaultValue={codeInput}
                onChangeText={(text) => setCodeInput(text)}
                style={styles.input}
              />
            </>
          ) : null}

          {error ? (
            <Text style={styles.errorMessage}>*{errorMessage}</Text>
          ) : success ? (
            <Text style={styles.successMessage}>Recovery password sent to your email</Text>
          ) : null}

          <TouchableOpacity onPress={() => validateUserInput()} style={styles.button}>
            {showCodeInput ? <Text style={styles.buttonText}>Resend to Email</Text> : <Text style={styles.buttonText}>Send to Email</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          {showCodeInput ? (
            <TouchableOpacity onPress={() => verifyViaEmailRecovery()} style={styles.button}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          ) : null}

          <Text
            style={styles.returnHomeText}
            onPress={() => {
              navigation.goBack()
            }}
          >
            Return to login
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ForgotPassword

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
    backgroundColor: '#28CD41',
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
    color: '#28CD41',
    paddingVertical: 7.5
  },
  errorMessage: {
    textAlign: 'left',
    marginLeft: 41,
    color: 'red',
    paddingVertical: 7.5
  },
  buttonContinue: {
    backgroundColor: '#28CD41',
    padding: 10,
    borderRadius: 10,
    paddingVertical: 18,
    marginVertical: 15,
    width: 308,
    height: 60
  }
})
