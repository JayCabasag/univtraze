import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView
} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ConfettiCannon from 'react-native-confetti-cannon'
import jwtDecode from 'jwt-decode'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import Header from '../components/Header'
import LoadingModal from '../components/LoadingModal'
import { emailRegEx } from '../utils/regex'
import useFormErrors from '../hooks/useFormErrors'

const SignUpScreen = ({ navigation }) => {
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
    if (!emailRegEx.test(email)){
      return setFormErrors('email', 'Invalid email')
    }
    if (password.length < 7){
      return setFormErrors('password', 'Password too short')
    }
    if (confirmPassword.length < 7){
      return setFormErrors('confirmPassword', 'Confirm Password too short')
    }
    if (password != confirmPassword) {
      return setFormErrors('confirmPassword', "Confirm password did not match")
    }
    processSignUp()
  }

  const processSignUp = () => {}

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
      <Modal visible={isModalVisible}>
        <View
          style={{
            width: 348,
            height: 227,
            backgroundColor: 'white',
            alignSelf: 'center',
            alignItems: 'center',
            paddingVertical: 20,
            borderRadius: 15
          }}
        >
          <Text
            style={{
              fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
              fontSize: 28,
              fontWeight: '700',
              color: '#29CC42'
            }}
          >
            {' '}
            Sign Up {'\n'}Successful
          </Text>
          <Text
            style={{
              fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
              fontSize: 14,
              fontWeight: '400',
              color: COLORS.TEXT_BLACK,
              lineHeight: 19.5
            }}
          >
            {' '}
            Awesome, you will now being {'\n'} redirected to user profiling area
          </Text>

          <TouchableOpacity
            style={styles.buttonContinue}
            onPress={() => {
              handleLoginUser(email, confirmPassword)
            }}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
        {shoot ? <ConfettiCannon count={200} origin={{ x: 0, y: 0 }} fadeOut='true' /> : null}
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
    color: 'red',
    paddingVertical: 7.5
  },
  buttonContinue: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    paddingVertical: 15,
    marginVertical: 15,
    width: 308,
    height: 60
  }
})
