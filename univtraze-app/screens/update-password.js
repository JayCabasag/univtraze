import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import Header from '../components/Header'
import { useUser } from '../services/store/user/UserContext'
import useFormErrors from '../hooks/useFormErrors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../services/store/auth/AuthContext'
import LoadingModal from '../components/LoadingModal'
import { genericPostRequest } from '../services/api/genericPostRequest'
import { genericUpdateRequest } from '../services/api/genericUpdateRequest'

export default function UpdatePasswordScreen({ navigation }) {
  const { state: user } = useUser()
  const { signOut, state: auth } = useAuth()
  const { clearUser, state } = useUser()

  const token = auth.userToken

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { resetFormErrors, formErrors, setFormErrors } = useFormErrors([
    'oldPassword',
    'newPassword',
    'confirmPassword'
  ])

  const saveAndExit = async () => {
    resetFormErrors()
    if (oldPassword == '' || oldPassword == null) {
      return setFormErrors('oldPassword', 'Old password is required')
    }
    if (newPassword == '' || newPassword == null) {
      return setFormErrors('newPassword', 'New password is required')
    }
    if (newPassword.length < 7) {
      return setFormErrors('newPassword', 'New password too short')
    }
    if (confirmPassword == '' || confirmPassword == null) {
      return setFormErrors('confirmPassword', 'Confirm password is required is required')
    }
    if (newPassword != confirmPassword) {
      return setFormErrors('confirmPassword', "Confirm password don't match")
    }

    try {
      setIsLoading(true)
      const payload = {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      }
      const res = await genericUpdateRequest('users/change-password', payload, token)
      Alert.alert('Success', 'Password update successfully. Please relogin to continue', [
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
    <SafeAreaView style={styles.safeAreaViewStyles}>
      <LoadingModal
        onRequestClose={() => setIsLoading(false)}
        open={isLoading}
        loadingMessage='Please wait...'
      />
      <Header navigation={navigation} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <Text style={styles.sectionHeaderText}>Update password</Text>
            <Text style={styles.label}>Old Password</Text>
            <TextInput
              placeholder='Old Password'
              value={oldPassword}
              onChangeText={setOldPassword}
              style={[styles.input, formErrors.oldPassword?.hasError && styles.inputError]}
              secureTextEntry
            />
            {formErrors.oldPassword?.hasError && (
              <Text style={styles.errorText}>{formErrors.oldPassword.message}</Text>
            )}
            <Text style={styles.label}>New Password</Text>
            <TextInput
              placeholder='New password'
              value={newPassword}
              onChangeText={setNewPassword}
              style={[styles.input, formErrors.newPassword?.hasError && styles.inputError]}
              secureTextEntry
            />
            {formErrors.newPassword?.hasError && (
              <Text style={styles.errorText}>{formErrors.newPassword.message}</Text>
            )}
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              placeholder='Confirm password'
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[styles.input, formErrors.confirmPassword?.hasError && styles.inputError]}
              secureTextEntry
            />
            {formErrors.confirmPassword?.hasError && (
              <Text style={styles.errorText}>{formErrors.confirmPassword.message}</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveAndExit}>
          <Text style={styles.buttonText}>Save and Exit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaViewStyles: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: COLORS.SECONDARY
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    width: '100%',
    height: 'auto',
    display: 'flex'
  },
  container: {},
  label: {
    width: '80%',
    textAlign: 'left'
  },
  errorText: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.RED,
    marginTop: 5
  },
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 15
  },
  label: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.TEXT_BLACK,
    marginTop: 10
  },
  errorText: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.RED,
    marginTop: 5
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
  footer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 0,
    backgroundColor: COLORS.SECONDARY,
    paddingVertical: 10
  },
  saveButton: {
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
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  sectionHeaderText: {
    fontSize: 24,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    width: '100%'
  }
})
