import {
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Modal,
  Dimensions,
  ActivityIndicator
} from 'react-native'
import React, { useState } from 'react'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import LoginImage from '../assets/login_image.png'
import { emailRegEx } from '../utils/regex'
import LoadingModal from '../components/LoadingModal'

const windowWidth = Dimensions.get('screen').width

const SignInScreen = ({ navigation }) => {
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')

  //Variables for loading

  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value)
  }

  const loginNow = async () => {
    setShowLoadingModal(true)
    setLoadingMessage('Validating your credentials...please wait')
    if (emailInput === '') {
      setError(true)
      setErrorMessage('Please input your email address')
    } else {
      if (emailRegEx.test(emailInput)) {
        if (passwordInput === '') {
          setError(true)
          setErrorMessage('Please input password')
        } else if (passwordInput.length < 7) {
          setError(true)
          setErrorMessage('Password field Minimum of 8 characters')
        } else {
          const data = {
            email: emailInput,
            password: passwordInput
          }
          await axios.post('https://univtraze.herokuapp.com/api/user/login', data).then((response) => {
            const success = response.data.success

            if (success === 0) {
              setError(true)
              setErrorMessage(response.data.data)
            } else {
              setLoadingMessage('Loggin in...')
              setError(false)
              save('x-token', response.data.token)
              setEmailInput('')
              setPasswordInput('')

              evaluateToken(response.data.token)
            }
          })
        }
      } else {
        setError(true)
        setErrorMessage('Invalid email address')
      }
    }
    setShowLoadingModal(false)
    setLoadingMessage('Please wait')
  }

  const evaluateToken = (currentToken) => {
    var decodedToken = jwtDecode(currentToken)

    if (decodedToken.result.type === null || decodedToken.result.type === '') {
      return navigation.navigate('SignUpUserType')
    }

    navigation.navigate('Dashboard')
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#E1F5E4' }}>
      <LoadingModal onRequestClose={() => setShowLoadingModal(false)} open={showLoadingModal} loadingMessage={loadingMessage} />
      <KeyboardAvoidingView style={styles.container} behavior='height'>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={LoginImage} />
        </View>

        <Text style={styles.loginText}>Log in</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder='Email Address'
            defaultValue={emailInput}
            onChangeText={(text) => {
              setEmailInput(text)
            }}
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder='Password'
            defaultValue={passwordInput}
            onChangeText={(text) => {
              setPasswordInput(text)
            }}
            style={styles.input}
            secureTextEntry
          />

          {error ? <Text style={styles.errorMessage}>*{errorMessage}</Text> : <Text style={styles.errorMessage}></Text>}

          <Text
            style={styles.forgotPassword}
            onPress={() => {
              navigation.navigate('forgot-password')
            }}
          >
            Forgot Password?
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => loginNow()} style={styles.signInBtn}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignInScreen

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    width: 200,
    height: 200,
    resizeMode: 'center',
    marginTop: 30
  },

  imageContainer: {
    width: windowWidth,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },

  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 30,
    display: 'flex'
  },
  label: {
    color: '#4d7861',
    marginTop: 15,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },

  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    backgroundColor: '#ffff',
    borderColor: COLORS.PRIMARY,
    borderWidth: 1
  },
  signInBtn: {
    marginBottom: 10,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    width: 340,
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
    textTransform: 'capitalize',
    textAlign: 'center',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  loginText: {
    fontFamily: FONT_FAMILY.POPPINS_BOLD,
    textAlign: 'left',
    color: COLORS.TEXT_BLACK,
    fontSize: 30,
    width: '100%',
    textTransform: 'uppercase',
    paddingHorizontal: 30
  },
  errorMessage: {
    textAlign: 'left',
    color: 'red',
    paddingVertical: 7.5
  },
  forgotPassword: {
    textAlign: 'right',
    textDecorationLine: 'underline',
    color: '#4d7861',
    marginBottom: 10,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
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
    width: '100%',
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
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30
  }
})
