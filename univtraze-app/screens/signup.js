import { KeyboardAvoidingView, Image, StyleSheet, TextInput, View, TouchableOpacity, Text, StatusBar, Modal } from 'react-native'
import Checkbox from 'expo-checkbox'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'
import ConfettiCannon from 'react-native-confetti-cannon'
import ModalSuccess from 'react-native-modal'
import * as SecureStore from 'expo-secure-store'
import jwtDecode from 'jwt-decode'
import { Dimensions } from 'react-native'

const SignUp = ({ navigation }) => {
  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [provider, setProvider] = useState('email/password')

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [agreeWithTermsAndCondition, setAgreeWithTermsAndCondition] = useState(false)

  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value)
  }

  const validateUserInput = async () => {
    if (!agreeWithTermsAndCondition) {
      setError(true)
      setErrorMessage('Please agree with our app terms and conditions')
      return
    }
    if (email === '') {
      setError(true)
      setErrorMessage('Please input your email address')
    } else {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (re.test(email)) {
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
          //Data checking with api

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
    //Time out to fire the cannon
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

  const viewTermsAndConditions = async () => {
    navigation.navigate('TermsAndCondition')
  }
  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: '#E1F5E4' }}>
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
          <Text style={styles.loginText}>Sign Up</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput placeholder='Email Address' defaultValue={email} onChangeText={(text) => setEmail(text)} style={styles.input} />
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder='Password'
            defaultValue={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            placeholder='Confirm Password'
            defaultValue={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            style={styles.input}
            secureTextEntry
          />

          {error ? <Text style={styles.errorMessage}>*{errorMessage}</Text> : <Text style={styles.errorMessage}></Text>}
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', paddingBottom: 5, paddingTop: 2 }}>
          <Checkbox
            value={agreeWithTermsAndCondition}
            onValueChange={() => {
              setAgreeWithTermsAndCondition(!agreeWithTermsAndCondition)
            }}
            style={{ marginRight: 5 }}
          />
          <Text
            style={{ color: '#4d7861' }}
            onPress={() => {
              viewTermsAndConditions()
            }}
          >
            Agree with our Terms and conditions
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => validateUserInput()} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* <Text style={styles.orText}>or</Text>
				
				<View style={styles.socialMediaContainer}>
					<TouchableOpacity onPress={() => {}}>
						<Image style={styles.googleImage} source={googleLogo} />
					</TouchableOpacity>

					<TouchableOpacity onPress={() => {}}>
						<Image style={styles.facebookImage} source={facebookLogo} />
					</TouchableOpacity>
				</View> */}

          <ModalSuccess isVisible={isModalVisible}>
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
              <Text style={{ fontSize: 28, fontWeight: '700', color: '#29CC42' }}> Sign Up {'\n'}Successful</Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#364D39', lineHeight: 19.5 }}>
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
          </ModalSuccess>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignUp

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
    flex: 1,
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
