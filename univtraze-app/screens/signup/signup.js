import { KeyboardAvoidingView, StyleSheet, TextInput, View, TouchableOpacity, Text, Modal, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ConfettiCannon from 'react-native-confetti-cannon'
import jwtDecode from 'jwt-decode'
import { COLORS, FONT_FAMILY } from '../../utils/app_constants'
import Header from '../../components/Header'
import LoadingModal from '../../components/LoadingModal'
import { emailRegEx } from '../../utils/regex'

const SignUpScreen = ({ navigation }) => {
  const [email, onChangeEmail] = useState('')
  const [password, onChangePassword] = useState('')
  const [confirmPassword, onChangeConfirmPassword] = useState('')
  const [provider, setProvider] = useState('email/password')
  const scrollViewContainerRef = useRef()

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value)
  }

  const validateUserInput = async () => {
    scrollViewContainerRef.current.scrollToEnd({ animated: true })
    if (email === '') {
      setError(true)
      setErrorMessage('Please input your email address')
    } else {
      if (emailRegEx.test(email)) {
        if (password === '') {
          setError(true)
          setErrorMessage('Please input password')
        } else if (password.length < 7) {
          setError(true)
          setErrorMessage('Password field Minimum of 8 characters')
        } else if (password !== confirmPassword) {
          setError(true)
          setErrorMessage('Confirm password did not match!')
        } else {
          setShowLoadingModal(true)

          const data = {
            provider: provider,
            email: email,
            password: password
          }

          setLoadingMessage('Please wait while creating your acccount...')

          await axios
            .post('https://univtraze.herokuapp.com/api/user/signup', data)
            .then((response) => {
              const success = response.data.success
              if (success === 0) {
                setLoadingMessage('Please wait...')
                setShowLoadingModal(false)
                setError(true)
                setErrorMessage(response.data.message)
              } else {
                setLoadingMessage('Please wait...')
                setShowLoadingModal(false)
                setError(false)
                setModalVisible(true)
              }
            })
            .catch((error) => {
              setError(true)
              setErrorMessage('Failed creating account, please check your connection...')
            })

          setLoadingMessage('Please wait...')
          setShowLoadingModal(false)
        }
      } else {
        setError(true)
        setErrorMessage('Invalid email address')
      }
    }
  }

  const [isModalVisible, setModalVisible] = useState(false)

  const [shoot, setShoot] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShoot(true)
    }, 1000)
  }, [])

  const handleLoginUser = async (email, password) => {
    setModalVisible(false)
    setShowLoadingModal(true)
    setLoadingMessage('Logging in, please wait!...')

    const data = {
      email: email,
      password: password
    }
    await axios.post('https://univtraze.herokuapp.com/api/user/login', data).then((response) => {
      const success = response.data.success

      if (success === 0) {
        setError(true)
        setErrorMessage(response.data.data)
        setLoadingMessage('Login failed')
        setShowLoadingModal(false)
      } else {
        setError(false)
        save('x-token', response.data.token)
        setLoadingMessage('Login successful')
        setShowLoadingModal(false)
        evaluateToken(response.data.token)
      }
    })
  }

  const evaluateToken = async (currentToken) => {
    var decodedToken = jwtDecode(currentToken)

    if (decodedToken.result.type === null || decodedToken.result.type === '') {
      return navigation.navigate('SignUpUserType')
    }

    navigation.navigate('Dashboard')
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='height'>
      <Header navigation={navigation} />
      <LoadingModal onRequestClose={() => setShowLoadingModal(false)} open={showLoadingModal} loadingMessage={loadingMessage} />
      <Text style={styles.loginText}>Sign up</Text>
      <ScrollView
        ref={scrollViewContainerRef}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewContainer}
      >
        <Text style={styles.label}>Email</Text>
        <TextInput placeholder='Email Address' defaultValue={email} onChangeText={onChangeEmail} style={styles.input} />
        <Text style={styles.label}>Password</Text>
        <TextInput placeholder='Password' defaultValue={password} onChangeText={onChangePassword} style={styles.input} secureTextEntry />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          placeholder='Confirm Password'
          defaultValue={confirmPassword}
          onChangeText={onChangeConfirmPassword}
          style={styles.input}
          secureTextEntry
        />
        {error && <Text style={styles.errorMessage}>*{errorMessage}</Text>}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => validateUserInput()} style={styles.signUpBtn}>
          <Text style={styles.buttonText}>Next</Text>
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
          <Text style={{ fontFamily: FONT_FAMILY.POPPINS_MEDIUM, fontSize: 28, fontWeight: '700', color: '#29CC42' }}>
            {' '}
            Sign Up {'\n'}Successful
          </Text>
          <Text
            style={{ fontFamily: FONT_FAMILY.POPPINS_MEDIUM, fontSize: 14, fontWeight: '400', color: COLORS.TEXT_BLACK, lineHeight: 19.5 }}
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
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#ffff',
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    borderColor: COLORS.PRIMARY,
    borderWidth: 1
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
  errorMessage: {
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
