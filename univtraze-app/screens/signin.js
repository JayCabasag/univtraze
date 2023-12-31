import {
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
  StatusBar
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import LoginImage from '../assets/login_image.png'
import { emailRegEx } from '../utils/regex'
import LoadingModal from '../components/LoadingModal'
import { genericPostRequest } from '../services/api/genericPostRequest'
import { useAuth } from '../services/store/auth/AuthContext'
import { useUser } from '../services/store/user/UserContext'

const SignInScreen = ({ navigation }) => {
  const { signIn } = useAuth()
  const { setUser } = useUser()
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [email, onChangeEmail] = useState('')
  const [password, onChnagePassword] = useState('')

  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')

  const validateEmail = () => {
    if (email === '') {
      setError(true)
      setErrorMessage('Please input your email address')
      return false
    } else if (!emailRegEx.test(email)) {
      setError(true)
      setErrorMessage('Invalid email address')
      return false
    }
    return true
  }

  const validatePassword = () => {
    if (password === '') {
      setError(true)
      setErrorMessage('Please input password')
      return false
    } else if (password.length < 7) {
      setError(true)
      setErrorMessage('Password should be a minimum of 8 characters')
      return false
    }
    return true
  }

  const onPressLogin = async () => {
    setError(false)
    setErrorMessage('')

    try {
      if (!validateEmail()) return
      if (!validatePassword()) return

      const payload = {
        email: email,
        password: password
      }

      setShowLoadingModal(true)
      setLoadingMessage('Checking your credentials...')

      const res = await genericPostRequest('users/signin', payload)
      signIn({ token: res?.token ?? '' })
      setUser({ user: res?.user ?? '' })
    } catch (error) {
      setError(true)
      const errorMessage = error?.response?.data?.message ?? 'Unexpected error occurred'
      setErrorMessage(errorMessage)
    } finally {
      setShowLoadingModal(false)
      setLoadingMessage('')
    }
  }

  return (
    <KeyboardAvoidingView behavior='height' style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={LoginImage} />
        </View>
        <Text style={styles.loginText}>Log in</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder='Email Address'
            defaultValue={email}
            onChangeText={onChangeEmail}
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder='Password'
            defaultValue={password}
            onChangeText={onChnagePassword}
            style={styles.input}
            secureTextEntry
          />

          {error ? (
            <Text style={styles.errorMessage}>*{errorMessage}</Text>
          ) : (
            <Text style={styles.errorMessage}></Text>
          )}

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
          <TouchableOpacity onPress={onPressLogin} style={styles.signInBtn}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <LoadingModal
        onRequestClose={() => setShowLoadingModal(false)}
        open={showLoadingModal}
        loadingMessage={loadingMessage}
      />
    </KeyboardAvoidingView>
  )
}

export default SignInScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E1F5E4'
  },
  scrollView: {
    flex: 1,
    width: '100%',
    marginTop: 20
  },
  scrollViewContent: {},
  image: {
    justifyContent: 'center',
    width: 200,
    height: 200,
    resizeMode: 'center'
  },

  imageContainer: {
    marginTop: 50,
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
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
    height: 'auto',
    paddingHorizontal: 30,
    paddingBottom: 10
  }
})
