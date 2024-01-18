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
  StatusBar,
  Alert
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
import useFormErrors from '../hooks/useFormErrors'

const SignInScreen = ({ navigation }) => {
  const { signIn } = useAuth()
  const { setUser } = useUser()
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [email, onChangeEmail] = useState('')
  const [password, onChangePassword] = useState('')

  const { setFormErrors, resetFormErrors, formErrors } = useFormErrors(['email', 'password'])

  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')

  const onPressLogin = async () => {
    resetFormErrors()
    if (email == '' || email == null) {
      return setFormErrors('email', 'Email is required')
    }
    if (!emailRegEx.test(email)) {
      return setFormErrors('email', 'Email is not valid.')
    }
    if (password == null || password == '') {
      return setFormErrors('password', 'Password is not valid.')
    }

    try {
      setShowLoadingModal(true)
      setLoadingMessage('Checking your credentials...')

      const payload = {
        email: email,
        password: password
      }
      const res = await genericPostRequest('users/signin', payload)
      signIn({ token: res?.token ?? '' })
      setUser({ user: res?.user ?? '' })
    } catch (error) {
      Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
        { text: 'OK', onPress: () => console.log('OK') }
      ])
    } finally {
      setShowLoadingModal(false)
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
  errorText: {
    textAlign: 'left',
    color: 'red'
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
