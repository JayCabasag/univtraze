import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Alert
} from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import LoadingModal from '../components/LoadingModal'
import Header from '../components/Header'
import { withSafeAreaView } from '../hoc/withSafeAreaView'
import useFormErrors from '../hooks/useFormErrors'
import { isEmpty, isStrictEquals } from '../utils/helpers'
import { genericPostRequest } from '../services/api/genericPostRequest'
import { StatusBar } from 'expo-status-bar'

const ChooseNewPasswordScreen = ({ navigation, route }) => {
  const { resetFormErrors, setFormErrors, formErrors } = useFormErrors(['newPassword', "confirmPassword"])
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoadingModal, setShowLoadingModal] = useState(false)

  if (!route.params.recoveryCode) {
    return navigation.goBack();
  }

  if (!route.params.email) {
    return navigation.goBack();
  }

  const handleSubmit = async () => {
    resetFormErrors();
    if (isEmpty(newPassword)){
        return setFormErrors("newPassword", "New password is required");
    }
    if (isEmpty(confirmPassword)){
        return setFormErrors("confirmPassword", "Confirm password is required.")
    }
    if (!isStrictEquals(newPassword, confirmPassword)){
        return setFormErrors("confirmPassword", "Confirm passwor don't match.")
    }
    try {
        setShowLoadingModal(true)
        const payload = {
            "email": route.params.email,
            "recovery_password": route.params.recoveryCode,
            "new_password": confirmPassword
        }
        await genericPostRequest("account-recovery/change-password", payload)
        Alert.alert("Success", "Password changed succefully", [
            {text: "Ok", onPress: () => navigation.navigate("signin")}
        ])
    } catch (error) {
        console.log(error)
        Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
            { text: 'OK', onPress: () => console.log('OK') }
        ])
    } finally {
        setShowLoadingModal(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='height'>
      <LoadingModal
        onRequestClose={() => setShowLoadingModal(false)}
        open={showLoadingModal}
        loadingMessage={'Please wait...'}
      />
      <Header navigation={navigation} />
      <View style={styles.inputContainer}>
        <Text style={styles.headerText}>Choose new password</Text>
        <Text>
        Select a new password to update your account credentials.
        </Text>
        <Text style={styles.label}>New password</Text>
        <TextInput
          placeholder='New password'
          defaultValue={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={[styles.input, formErrors.newPassword.hasError && styles.errorInput]}
        />
        {formErrors?.newPassword?.hasError && (
          <Text style={styles.errorText}>{formErrors.newPassword.message}</Text>
        )}
        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          placeholder='Confirm password'
          defaultValue={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={[styles.input, formErrors.confirmPassword.hasError && styles.errorInput]}
        />
        {formErrors?.confirmPassword?.hasError && (
          <Text style={styles.errorText}>{formErrors.confirmPassword.message}</Text>
        )}
        <TouchableOpacity onPress={handleSubmit} style={styles.confirmEmailBtn}>
          <Text style={styles.buttonText}>Change password</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default withSafeAreaView(ChooseNewPasswordScreen)

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: '#E1F5E4',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  label: {
    color: '#4d7861',
    width: '100%',
    marginTop: 10,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    backgroundColor: '#ffff',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY
  },
  errorInput: {
    borderColor: COLORS.RED
  },
  errorText: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.RED,
    marginTop: 5
  },
  resendRecoveryCodeText: {
    textAlign: 'right',
    textDecorationLine: 'underline',
    color: '#4d7861',
    marginBottom: 10,
    marginTop: 10,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: 10
  },
  verifyBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    width: '100%',
    marginTop: 5,
    paddingVertical: 15
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  headerText: {
    width: '100%',
    fontWeight: 'bold',
    textAlign: 'left',
    color: COLORS.TEXT_BLACK,
    fontSize: 30,
    textTransform: 'uppercase',
    paddingVertical: 20,
    fontFamily: FONT_FAMILY.POPPINS_BOLD
  },
  successMessage: {
    textAlign: 'left',
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    paddingVertical: 7.5
  },
  errorMessage: {
    textAlign: 'left',
    color: 'red',
    paddingVertical: 7.5
  },
  confirmEmailBtn: {
    marginBottom: 10,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    width: '100%',
    marginTop: 15,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  }
})
