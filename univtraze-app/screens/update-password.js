import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import { useToast } from 'react-native-toast-notifications'
import BackIcon from '../assets/back-icon.png'
import { COLORS } from '../utils/app_constants'

const UpdatePasswordScreen = ({ navigation, route }) => {
  const toast = useToast()
  // console.log(route.params.token)

  const [token, setToken] = useState(route.params.token)
  const [userId, setUserId] = useState(route.params.id)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  // Error handler variables here

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdatePassword = async () => {
    setIsLoading(false)
    setError(false)
    setSuccess(false)

    if (oldPassword === '') {
      setError(true)
      setErrorMessage('Please enter old password.')
      return
    }
    if (newPassword === '') {
      setError(true)
      setErrorMessage('Please enter new password.')
      return
    }
    if (confirmNewPassword === '') {
      setError(true)
      setErrorMessage('Please enter confirm password.')
      return
    }

    if (newPassword.length <= 7) {
      setError(true)
      setErrorMessage('Password should contain at least 8 characters')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError(true)
      setErrorMessage('New password and confirm password does not match.')
      return
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const data = {
      user_id: userId,
      old_password: oldPassword,
      new_password: confirmNewPassword
    }

    setIsLoading(true)
    try {
      await axios.post(`https://univtraze.herokuapp.com/api/user/changePassword`, data, config).then((response) => {
        const success = response.data.success

        if (success === 0) {
          setError(true)
          setErrorMessage(response.data.message)
          setSuccess(false)
          setIsLoading(false)
          return
        }

        setError(false)
        setErrorMessage('')
        setSuccess(true)
        setIsLoading(false)

        setOldPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
      })
    } catch (error) {
      setError(false)
      setErrorMessage('Network connection error.')
      setSuccess(false)
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView>
      <StatusBar animated={true} backgroundColor='#E1F5E4' />
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.backIcon}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.goBack()
              }}
            >
              <ImageBackground src={BackIcon} resizeMode='contain' style={styles.image}></ImageBackground>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/*End  Notification View */}
        <View style={styles.bodyContainer}>
          <Text style={styles.headerText}>Update Password</Text>

          <TextInput
            placeholder='Old password'
            value={oldPassword}
            style={styles.input}
            secureTextEntry
            onChangeText={(text) => setOldPassword(text)}
          />
          <TextInput
            placeholder='New password'
            value={newPassword}
            style={styles.input}
            secureTextEntry
            onChangeText={(text) => setNewPassword(text)}
          />
          <TextInput
            placeholder='Re-type password'
            value={confirmNewPassword}
            style={styles.input}
            secureTextEntry
            onChangeText={(text) => setConfirmNewPassword(text)}
          />
          {error ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
          {success ? <Text style={{ color: COLORS.PRIMARY }}>Password updated successfully</Text> : null}
          {isLoading ? <Text style={{ color: COLORS.PRIMARY }}>Please wait ...</Text> : null}

          <TouchableOpacity style={styles.buttons} onPress={() => handleUpdatePassword()}>
            <Text style={{ fontSize: 15, color: 'white' }}>Update password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default UpdatePasswordScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1F5E4',
    paddingHorizontal: 40,
    height: '100%'
  },

  topContainer: {
    zIndex: 1,
    width: '100%',
    height: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 0
  },
  backIcon: {
    height: 60,
    width: 60,
    marginLeft: -15,
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%'
  },

  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    width: 340,
    height: 'auto',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  buttons: {
    width: '100%',
    height: 48,
    borderRadius: 20,
    elevation: 2,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY
  },
  modalButton: {
    width: 80,
    height: 60,
    borderRadius: 20,
    elevation: 2,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1
  },

  bodyContainer: {
    width: '100%',
    height: '80%',
    paddingBottom: 70
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
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 1,
    fontSize: 16,
    color: '#4d7861',
    backgroundColor: '#ffff'
  },
  deactivateButton: {
    height: 35,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'red',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15
  },
  deactivateButtonText: {
    color: 'white',
    fontSize: 15
  },
  cancelButton: {
    height: 35,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 15
  },
  settingsOption: {
    width: '100%',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
  },
  headerText: {
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#364D39',
    fontSize: 25,
    lineHeight: 30,
    textTransform: 'uppercase',
    paddingVertical: 15
  }
})
