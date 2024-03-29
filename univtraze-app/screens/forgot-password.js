import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Alert
} from 'react-native'
import React, { useState, Fragment } from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import LoadingModal from '../components/LoadingModal'
import Header from '../components/Header'
import { emailRegEx } from '../utils/regex'
import { withSafeAreaView } from '../hoc/withSafeAreaView'
import useFormErrors from '../hooks/useFormErrors'
import { isEmpty } from '../utils/helpers'
import { genericPostRequest } from '../services/api/genericPostRequest'
import { StatusBar } from 'expo-status-bar'

const ForgotPasswordScreen = ({ navigation }) => {
  const { resetFormErrors, setFormErrors, formErrors } = useFormErrors(['email', 'recoveryCode'])

  const [email, setEmail] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [recoveryCode, setRecoveryCode] = useState('')
  const [showLoadingModal, setShowLoadingModal] = useState(false)

  const handleSubmit = async () => {
    resetFormErrors()
    if (isEmpty(email)) {
      return setFormErrors('email', 'Email is required')
    }
    if (!emailRegEx.test(email)) {
      return setFormErrors('email', 'Email is not valid')
    }

    try {
      setShowLoadingModal(true)
      await genericPostRequest('account-recovery/recovery-code', { email })
      Alert.alert('success', 'Recovery password has been sent to your email.')
      setShowCodeInput(true)
    } catch (error) {
      Alert.alert('Failed', error?.response?.data?.message ?? 'Unknown error', [
        { text: 'OK', onPress: () => console.log('OK') }
      ])
    } finally {
      setShowLoadingModal(false)
    }
  }

  const verifyRecoveryPassword = async () => {
    resetFormErrors()
    if (isEmpty(email)) {
      return setFormErrors('email', 'Email is required')
    }
    if (!emailRegEx.test(email)) {
      return setFormErrors('email', 'Email is not valid')
    }
    if (isEmpty(recoveryCode)) {
      return setFormErrors('recoveryCode', 'Recovery code is required')
    }

    try {
      setShowLoadingModal(true)
      const payload = {
        email,
        recovery_password: recoveryCode
      }
      await genericPostRequest('account-recovery/verify', payload)
      navigation.push('choose-new-password', { recoveryCode, email })
    } catch (error) {
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
        <Text style={styles.headerText}>Forgot password</Text>
        <Text style={styles.forgotPasswordDescription}>
          Enter your email below. We'll send a recovery password to reset it and regain access.
        </Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder='Email Address'
          defaultValue={email}
          onChangeText={(text) => setEmail(text)}
          style={[styles.input, formErrors.email.hasError && styles.errorInput]}
        />
        {formErrors?.email?.hasError && (
          <Text style={styles.errorText}>{formErrors.email.message}</Text>
        )}
        {showCodeInput && (
          <Fragment>
            <Text style={styles.label}>Code</Text>
            <TextInput
              placeholder='Recovery code'
              defaultValue={recoveryCode}
              onChangeText={setRecoveryCode}
              style={styles.input}
            />
          </Fragment>
        )}
        {showCodeInput && (
          <Text onPress={handleSubmit} style={styles.resendRecoveryCodeText}>
            Resend code
          </Text>
        )}
        {!showCodeInput && (
          <TouchableOpacity onPress={handleSubmit} style={styles.confirmEmailBtn}>
            <Text style={styles.buttonText}>Send to email</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {showCodeInput && (
          <TouchableOpacity onPress={verifyRecoveryPassword} style={styles.verifyBtn}>
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

export default withSafeAreaView(ForgotPasswordScreen)

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
  forgotPasswordDescription: {
    fontFamily: FONT_FAMILY.POPPINS_LIGHT,
    color: COLORS.TEXT_BLACK,
    fontSize: 14
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
