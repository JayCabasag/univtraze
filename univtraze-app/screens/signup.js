import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import Header from '../components/Header'
import LoadingModal from '../components/LoadingModal'
import { emailRegEx } from '../utils/regex'
import useFormErrors from '../hooks/useFormErrors'
import { PROVIDER } from '../utils/helpers'
import { genericPostRequest } from '../services/api/genericPostRequest'
import { useAuth } from '../services/store/auth/AuthContext'
import { useUser } from '../services/store/user/UserContext'

const SignUpScreen = ({ navigation }) => {
  const { signIn } = useAuth()
  const { setUser } = useUser()
  const [email, onChangeEmail] = useState('')
  const [password, onChangePassword] = useState('')
  const [confirmPassword, onChangeConfirmPassword] = useState('')
  const scrollViewContainerRef = useRef()

  const { setFormErrors, resetFormErrors, formErrors } = useFormErrors([
    'email',
    'password',
    'confirmPassword'
  ])

  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')
  const [isLogginIn, setIsLogginIn] = useState(false)

  const validateUserInput = async () => {
    scrollViewContainerRef.current.scrollToEnd({ animated: true })
  }

  const [isModalVisible, setModalVisible] = useState(false)
  const [shoot, setShoot] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShoot(true)
    }, 1000)
  }, [])

  const onSignUp = () => {
    resetFormErrors()
    if (email == null || email == '') {
      return setFormErrors('email', 'Email is required')
    }
    if (!emailRegEx.test(email)) {
      return setFormErrors('email', 'Invalid email')
    }
    if (password == '' || password == null) {
      return setFormErrors('password', 'Password is required')
    }
    if (password.length < 7) {
      return setFormErrors('password', 'Password too short')
    }
    if (confirmPassword == '' || confirmPassword == null) {
      return setFormErrors('confirmPassword', 'Confirm Password is required')
    }
    if (confirmPassword.length < 7) {
      return setFormErrors('confirmPassword', 'Confirm Password too short')
    }
    if (password != confirmPassword) {
      return setFormErrors('confirmPassword', 'Confirm password did not match')
    }
    processSignUp()
  }

  const processSignUp = async () => {
    try {
      setLoadingMessage('Please wait...')
      setShowLoadingModal(true)
      const payload = {
        email,
        password,
        provider: PROVIDER.EMAIL_PASSWORD,
        confirm_password: confirmPassword
      }
      const res = await genericPostRequest('users/signup', payload)
      setModalVisible(true)
    } catch (error) {
      Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
        { text: 'OK', onPress: () => console.log('OK') }
      ])
    } finally {
      setShowLoadingModal(false)
    }
  }

  const onLogin = async () => {
    try {
      setIsLogginIn(true)
      const payload = {
        email,
        password
      }
      const res = await genericPostRequest('users/signin', payload)
      signIn({ token: res?.token ?? '' })
      setUser({ user: res?.user ?? '' })
    } catch (error) {
      Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
        { text: 'OK', onPress: () => console.log('OK') }
      ])
    } finally {
      setIsLogginIn(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='height'>
      <Header navigation={navigation} />
      <LoadingModal
        onRequestClose={() => setShowLoadingModal(false)}
        open={showLoadingModal}
        loadingMessage={loadingMessage}
      />
      <Text style={styles.loginText}>Sign up</Text>
      <ScrollView
        ref={scrollViewContainerRef}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewContainer}
      >
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={onChangeEmail}
          style={[styles.input, formErrors.email?.hasError && styles.inputError]}
        />
        {formErrors.email?.hasError && (
          <Text style={styles.errorText}>{formErrors.email.message}</Text>
        )}
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder='Password'
          value={password}
          onChangeText={onChangePassword}
          style={[styles.input, formErrors.password?.hasError && styles.inputError]}
          secureTextEntry
        />
        {formErrors.password?.hasError && (
          <Text style={styles.errorText}>{formErrors.password.message}</Text>
        )}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          placeholder='Confirm password'
          value={confirmPassword}
          onChangeText={onChangeConfirmPassword}
          style={[styles.input, formErrors.confirmPassword?.hasError && styles.inputError]}
          secureTextEntry
        />
        {formErrors.confirmPassword?.hasError && (
          <Text style={styles.errorText}>{formErrors.confirmPassword.message}</Text>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onSignUp} style={styles.signUpBtn}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('signin')}>
          <Text style={styles.goToLoginText}>Login to an existing account</Text>
        </TouchableOpacity>
      </View>
      <Modal transparent statusBarTranslucent visible={isModalVisible}>
        <View style={styles.congratsModalOverlay}>
          <View style={styles.congratsModal}>
            <Text style={styles.congratsHeaderText}>Sign up successful!</Text>
            <Text style={styles.successModalSubtext}>
              Awesome, press continue {'\n'} to proceed to next step
            </Text>
            <TouchableOpacity style={styles.buttonContinue} onPress={onLogin} disabled={isLogginIn}>
              {isLogginIn ? (
                <ActivityIndicator color={COLORS.WHITE} size='large' />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

export default SignUpScreen

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
    flex: 1,
    display: 'flex',
    backgroundColor: '#E1F5E4',
    paddingHorizontal: 30
  },
  label: {
    color: '#4d7861',
    marginTop: 10,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
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
  scrollViewContainer: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    marginBottom: 5
  },
  termsAndContditionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 5,
    paddingTop: 2,
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 5
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%'
  },
  signUpBtn: {
    marginBottom: 10,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    width: '100%',
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
    fontSize: 16,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  goToLoginText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    color: '#4d7861',
    width: '100%',
    textAlign: 'center'
  },
  loginText: {
    fontWeight: 'bold',
    textAlign: 'left',
    color: COLORS.TEXT_BLACK,
    fontSize: 30,
    fontFamily: FONT_FAMILY.POPPINS_BOLD,
    textTransform: 'uppercase',
    marginTop: 20
  },
  errorText: {
    textAlign: 'left',
    color: 'red'
  },
  successModalSubtext: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.TEXT_BLACK,
    lineHeight: 19.5,
    textAlign: 'center',
    paddingVertical: 15
  },
  buttonContinue: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    paddingVertical: 15,
    marginVertical: 15,
    width: '100%',
    height: 55,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  congratsModalOverlay: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'rgba(250, 250, 250, .7)'
  },
  congratsModal: {
    width: '100%',
    height: 227,
    backgroundColor: COLORS.WHITE,
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 15,
    paddingHorizontal: 15
  },
  congratsHeaderText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 28,
    fontWeight: '700',
    color: '#29CC42',
    textAlign: 'center'
  }
})
