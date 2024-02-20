import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native'
import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { Dimensions } from 'react-native'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import LoadingModal from '../components/LoadingModal'
import Header from '../components/Header'
import { emailRegEx } from '../utils/regex'
import { SafeAreaView } from 'react-native-safe-area-context'

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
      if (emailRegEx.test(email)) {
        setError(false)
        setErrorMessage('')
        setShowCodeInput(true)
        setShowLoadingModal(true)
        try {
          const data = {
            email: email
          }

          await axios
            .post(`https://univtraze.herokuapp.com/api/user/sendRecoveryPasswordViaEmail`, data)
            .then((response) => {
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

      await axios
        .post(`https://univtraze.herokuapp.com/api/user/checkRecoveryPasswordAndEmailMatched`, data)
        .then((response) => {
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
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView style={styles.container} behavior='height'>
        <LoadingModal
          onRequestClose={() => setShowLoadingModal(false)}
          open={showLoadingModal}
          loadingMessage={loadingMessage}
        />
        <Header navigation={navigation} />
        <View style={styles.inputContainer}>
          <Text style={styles.headerText}>Forgot password</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder='Email Address'
            defaultValue={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />

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
            {
              <Text style={styles.buttonText}>
                {showCodeInput ? 'Resend code' : 'Send to email'}
              </Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          {showCodeInput ? (
            <TouchableOpacity onPress={() => verifyViaEmailRecovery()} style={styles.verifyBtn}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ForgotPasswordScreen

const windowWidth = Dimensions.get('screen').width

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY
  },
  buttonContainer: {
    width: '100%'
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
    backgroundColor: '#ffff',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: 10
  },
  verifyBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    width: '100%',
    marginTop: 5,
    paddingVertical: 15
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  headerText: {
    width: '100%',
    fontWeight: 'bold',
    textAlign: 'left',
    color: COLORS.TEXT_BLACK,
    fontSize: 30,
    textTransform: 'uppercase',
    paddingVertical: 20,
    fontFamily: FONT_FAMILY.POPPINS_BOLD
  },
  successMessage: {
    textAlign: 'left',
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    paddingVertical: 7.5
  },
  errorMessage: {
    textAlign: 'left',
    color: 'red',
    paddingVertical: 7.5
  },
  confirmEmailBtn: {
    marginBottom: 10,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    width: '100%',
    marginTop: 15,
    paddingVertical: 15,
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
