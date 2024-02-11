import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useToast } from 'react-native-toast-notifications'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import { useUser } from '../services/store/user/UserContext'
import { useAuth } from '../services/store/auth/AuthContext'
import useFormErrors from '../hooks/useFormErrors'
import { genericPostRequest } from '../services/api/genericPostRequest'
import TopNavigation from '../components/TopNavigation'

const AccountSettingsScreen = ({ navigation }) => {
  const toast = useToast()
  const { state: user, clearUser } = useUser()
  const { state: auth, signOut } = useAuth()
  const token = auth.userToken
  const userId = user.user.id

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')

  const { setFormErrors, formErrors, resetFormErrors } = useFormErrors(['password'])

  const confirmDeleteAccount = async () => {
    resetFormErrors()
    if (password == '' || password == null) {
      return setFormErrors('password', 'Password is required')
    }

    try {
      setIsLoading(true)
      const payload = {
        password
      }
      const res = await genericPostRequest(`users/${userId}/deactivate`, payload, token)
      Alert.alert('Success', res.message, [
        {
          text: 'OK',
          onPress: () => {
            signOut()
            clearUser()
          }
        }
      ])
    } catch (error) {
      console.log(error)
      Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
        { text: 'OK', onPress: () => console.log('OK') }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
      <Modal
        animationType='fade'
        transparent={true}
        visible={showPasswordModal}
        statusBarTranslucent
        onRequestClose={() => {
          setShowPasswordModal(!showPasswordModal)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeaderText}>Once deleted, the account is irrecoverable.</Text>
            <Text style={styles.passwordLabelText}>To continue, please confirm with password</Text>
            <TextInput
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[styles.input, formErrors.password?.hasError && styles.inputError]}
            />
            {formErrors.password?.hasError && (
              <Text style={styles.errorText}>{formErrors.password?.message}</Text>
            )}
            <View style={styles.menuItemContainer}>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmDeleteAccount}>
                <Text style={styles.deactivateButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowPasswordModal(false)
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TopNavigation navigation={navigation} />
      <View style={styles.mainContainer}>
        <Text style={styles.headerText}>Account settings</Text>
        <TouchableOpacity
          style={styles.settingsOption}
          onPress={() => {
            navigation.navigate('UpdatePersonalInfo')
          }}
        >
          <Text style={styles.menuItemText}>Update Personal Information</Text>
          <AntDesign name='right' size={18} color='black' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsOption}
          onPress={() => {
            navigation.navigate('UpdatePassword')
          }}
        >
          <Text style={styles.menuItemText}>Update Password</Text>
          <AntDesign name='right' size={18} color='black' />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deactivateButton}
          onPress={() => {
            setShowPasswordModal(true)
          }}
        >
          <Text style={styles.deactivateButtonText}>Deactivate Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
export default AccountSettingsScreen

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY
  },
  scrollViewContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: 30
  },
  backIconImage: {
    marginLeft: -15,
    width: 60,
    height: 60
  },
  headerText: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: 24,
    marginBottom: 20
  },
  mainContainer: {
    width: '100%'
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
  modalHeaderText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20
  },
  passwordLabelText: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: 14,
    textAlign: 'left',
    width: '100%'
  },

  buttons: {
    width: '100%',
    height: 60,
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
  inputError: {
    borderColor: COLORS.RED
  },
  errorText: {
    color: COLORS.RED,
    fontFamily: FONT_FAMILY.POPPINS_LIGHT,
    fontSize: 14,
    width: '100%',
    textAlign: 'left'
  },
  menuItemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15
  },
  deactivateButton: {
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
    fontSize: 15,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  confirmButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'red',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15,
    flex: 1
  },
  cancelButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15,
    flex: 1
  },
  cancelButtonText: {
    color: COLORS.BLACK,
    fontSize: 15,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  settingsOption: {
    width: '100%',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  }
})
