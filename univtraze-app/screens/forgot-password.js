import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import React, { useState,Fragment } from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import LoadingModal from '../components/LoadingModal'
import Header from '../components/Header'
import { emailRegEx } from '../utils/regex'
import { withSafeAreaView } from '../hoc/withSafeAreaView'
import useFormErrors from '../hooks/useFormErrors'

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [recoveryCode, setRecoveryCode] = useState('')

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const [showLoadingModal, setShowLoadingModal] = useState(false)

  const { resetFormErrors, setFormErrors, formErrors } = useFormErrors(["email"])

  const handleSubmit = () => {
    if (isEmpty(email)){
      return setFormErrors("email", "Email is reuired");
    }
    if (!emailRegEx.test(email)){
      return setFormErrors("email", "Email is not valid");
    }
      console.log("handle submit")
  }

  return (
      <KeyboardAvoidingView style={styles.container} behavior='height'>
        <LoadingModal
          onRequestClose={() => setShowLoadingModal(false)}
          open={showLoadingModal}
          loadingMessage={"Please wait..."}
        />
        <Header navigation={navigation} />
        <View style={styles.inputContainer}>
          <Text style={styles.headerText}>Forgot password</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder='Email Address'
            defaultValue={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />

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

          {error ? (
            <Text style={styles.errorMessage}>*{errorMessage}</Text>
          ) : success ? (
            <Text style={styles.successMessage}>Recovery password sent to your email</Text>
          ) : null}

          <TouchableOpacity onPress={handleSubmit} style={styles.confirmEmailBtn}>
            {
              <Text style={styles.buttonText}>
                {showCodeInput ? 'Resend code' : 'Send to email'}
              </Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          {showCodeInput && (
            <TouchableOpacity onPress={() => verifyViaEmailRecovery()} style={styles.verifyBtn}>
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
