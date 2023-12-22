import {
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Alert,
  StatusBar,
  Modal,
  Dimensions
} from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../AuthContext/AuthContext'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { SafeAreaView } from 'react-native-safe-area-context'

const windowWidth = Dimensions.get('screen').width
const windowHeight = Dimensions.get('screen').height

const Login = ({ navigation }) => {
  const image = {
    uri: 'https://firebasestorage.googleapis.com/v0/b/tcuhub-cf9e1.appspot.com/o/images%2Flogin_image.png?alt=media&token=ebb53e48-2bc0-485d-8456-fe8a31683061'
  }
  const googleLogo = {
    uri: 'https://firebasestorage.googleapis.com/v0/b/tcuhub-cf9e1.appspot.com/o/images%2Fgoogle-icon3.png?alt=media&token=61a34454-dda9-4b6d-8dc6-198bb59ccbfb'
  }
  const facebookLogo = {
    uri: 'https://firebasestorage.googleapis.com/v0/b/tcuhub-cf9e1.appspot.com/o/images%2Ffacebook-icons.png?alt=media&token=0ec86a8b-f095-40dd-b4e9-4b31b2846068'
  }

  const val = useContext(AuthContext)

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
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (re.test(emailInput)) {
        if (passwordInput === '') {
          setError(true)
          setErrorMessage('Please input password')
        } else if (passwordInput.length < 7) {
          setError(true)
          setErrorMessage('Password field Minimum of 8 characters')
        } else {
          //Data checking with api

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
      <Modal
        animationType='fade'
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

      <StatusBar animated={true} backgroundColor='#E1F5E4' barStyle='dark-content' />
      <KeyboardAvoidingView style={styles.container} behavior='height'>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={image} />
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
              navigation.navigate('ForgotPassword')
            }}
          >
            Forgot Password?
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* onPress={() =>navigation.navigate("Dashboard")} */}
          <TouchableOpacity onPress={() => loginNow()} style={styles.button}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.orText}>or</Text>

			<View style={styles.socialMediaContainer}>
				<TouchableOpacity onPress={() => {}}>
					<Image style={styles.googleImage} source={googleLogo} />
				</TouchableOpacity>

				<TouchableOpacity onPress={() => {}}>
					<Image style={styles.facebookImage} source={facebookLogo} />
				</TouchableOpacity>
			</View> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Login

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
    marginTop: 10
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
    width: windowWidth,
    textTransform: 'uppercase',
    marginLeft: 41
  },
  errorMessage: {
    textAlign: 'left',
    marginLeft: 41,
    color: 'red',
    paddingVertical: 7.5
  },
  forgotPassword: {
    textAlign: 'right',
    marginRight: 41,
    textDecorationLine: 'underline',
    color: '#4d7861',
    marginBottom: 10
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
  }
})
