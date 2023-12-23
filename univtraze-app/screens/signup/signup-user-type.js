import { StyleSheet, Text, View, Button, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native'
import { RadioButton } from 'react-native-paper'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import jwt_decode from 'jwt-decode'

const windowWidth = Dimensions.get('screen').width
const windowHeight = Dimensions.get('screen').height

const image = {
  uri: 'https://firebasestorage.googleapis.com/v0/b/tcuhub-cf9e1.appspot.com/o/images%2Famico.png?alt=media&token=45feb25c-00e8-43f6-8189-2c83cb0175a3'
}

const SignUpUserTypeScreen = ({ navigation: { navigate } }) => {
  const [isChecked, setIsChecked] = useState('Student')

  const [token, setToken] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userType, setUserType] = useState('')
  const [userId, setUserId] = useState(0)

  const SubmitUserType = async () => {
    if (isChecked === 'Student') {
      return navigate('SignUpUserCredentialsStudent', { type: 'Student' })
    }

    if (isChecked === 'Employee') {
      return navigate('SignUpUserCredentialsEmployee', { type: 'Employee' })
    }

    navigate('SignUpUserCredentialsVisitor', { type: 'Visitor' })
  }

  return (
    <View style={styles.mainView}>
      {/* <Text>SignUpUserTypess</Text> */}

      <View style={styles.topContainer}>
        <Image source={image} resizeMode='contain' style={styles.SignUpUserTypeLogo} />
      </View>
      <Text style={styles.botContainTxt1}>Welcome to {'\n'}UnivTraze</Text>
      <Text style={styles.botContainSubtxt}>Before we continue, we are happy {'\n'}to know you more</Text>
      <Text style={styles.radioTtl}>Please select below</Text>
      <View style={styles.radioButtonOption}>
        <RadioButton value='Student' status={isChecked === 'Student' ? 'checked' : 'unchecked'} onPress={() => setIsChecked('Student')} />
        <Text style={styles.radioLabel}>Student</Text>
      </View>
      <View style={styles.radioButtonOption}>
        <RadioButton
          value='Employee'
          status={isChecked === 'Employee' ? 'checked' : 'unchecked'}
          onPress={() => setIsChecked('Employee')}
        />
        <Text style={styles.radioLabel}>Employee</Text>
      </View>

      <View style={styles.radioButtonOption}>
        <RadioButton value='Visitor' status={isChecked === 'Visitor' ? 'checked' : 'unchecked'} onPress={() => setIsChecked('Visitor')} />
        <Text style={styles.radioLabel}>Visitor</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          SubmitUserType()
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SignUpUserTypeScreen

const styles = StyleSheet.create({
  mainView: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: '#E1F5E4',
    alignItems: 'center'
  },
  topContainer: {
    marginTop: 10,
    width: '100%',
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  SignUpUserTypeLogo: {
    width: 200,
    height: 200,
    marginTop: 0
  },
  botContainer: {
    width: '100%',
    height: '65%'
  },
  botContainTxt1: {
    marginStart: 40,
    width: windowWidth,
    fontSize: 28,
    fontWeight: 'bold'
  },
  botContainSubtxt: {
    marginStart: 40,
    marginTop: 10,
    fontSize: 16,
    lineHeight: 25,
    width: windowWidth
  },
  radioBox: {
    width: '100%',
    height: '100%'
  },
  radioTtl: {
    fontSize: 18,
    marginStart: 40,
    width: windowWidth,
    marginTop: 10,
    fontWeight: '700'
  },
  radioLabel: {
    fontSize: 16
  },
  radioButtonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 40,
    width: windowWidth
  },
  button: {
    backgroundColor: '#28CD41',
    padding: 10,
    width: '80%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
    paddingVertical: 18
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffff'
  }
})
