import { KeyboardAvoidingView, StyleSheet, TextInput, View, TouchableOpacity, Text, Image } from 'react-native'
import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Dimensions } from 'react-native'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import LoadingModal from '../components/LoadingModal'
import Header from '../components/Header'

const ForgotPasswordScreen = ({ navigation }) => {
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
    <KeyboardAvoidingView style={styles.container} behavior='height'>
      <LoadingModal onRequestClose={() => setShowLoadingModal(false)} open={showLoadingModal} loadingMessage={loadingMessage} />
      <Header navigation={navigation} />
      <View style={styles.inputContainer}>
        <Text style={styles.headerText}>Forgot password</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput placeholder='Email Address' defaultValue={email} onChangeText={(text) => setEmail(text)} style={styles.input} />

        {showCodeInput && (
          <Fragment>
            <Text style={styles.label}>Code</Text>
            <TextInput
              placeholder='Recovery code'
              defaultValue={codeInput}
              onChangeText={(text) => setCodeInput(text)}
              style={styles.input}
            />
          </Fragment>
        )}

        {error ? (
          <Text style={styles.errorMessage}>*{errorMessage}</Text>
        ) : success ? (
          <Text style={styles.successMessage}>Recovery password sent to your email</Text>
        ) : null}

        <TouchableOpacity onPress={() => validateUserInput()} style={styles.confirmEmailBtn}>
          {<Text style={styles.buttonText}>{showCodeInput ? 'Resend code' : 'Send to email'}</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        {showCodeInput ? (
          <TouchableOpacity onPress={() => verifyViaEmailRecovery()} style={styles.button}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  )
}

export default ForgotPasswordScreen

const windowWidth = Dimensions.get('screen').width

const styles = StyleSheet.create({
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
    flex: 1,
    backgroundColor: '#E1F5E4',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  label: {
    color: '#4d7861',
    width: '100%',
    marginTop: 10,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    backgroundColor: '#ffff'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: 10
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
    fontSize: 16,
    textTransform: 'capitalize',
    textAlign: 'center',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
  },
  headerText: {
    width: '100%',
    fontWeight: 'bold',
    textAlign: 'left',
    color: COLORS.TEXT_BLACK,
    fontSize: 30,
    textTransform: 'uppercase',
    paddingVertical: 20,
    fontFamily:FONT_FAMILY.POPPINS_BOLD
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
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    paddingVertical: 7.5
  },
  errorMessage: {
    textAlign: 'left',
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
  },
  confirmEmailBtn: {
    marginBottom: 10,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginTop: 15,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  }
})
