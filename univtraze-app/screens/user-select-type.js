import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native'
import { RadioButton } from 'react-native-paper'
import React, { Fragment, useState } from 'react'
import { COLORS, FONT_FAMILY, USER_TYPE } from '../utils/app_constants'
import SelectTypeImage from '../assets/select-type-image.png'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useUser } from '../services/store/user/UserContext'
import { useAuth } from '../services/store/auth/AuthContext'

const UserSelectTypeScreen = ({ navigation }) => {
  const { signOut } = useAuth()
  const { clearUser } = useUser()

  const [userType, setUserType] = useState(USER_TYPE.STUDENT)
  const onNext = () => {
    navigation.navigate('user-information', userType)
  }

  const logout = () => {
    signOut()
    clearUser()
  }

  return (
    <KeyboardAvoidingView style={styles.mainView}>
      <View style={styles.customTopNav}>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Fragment>
            <Text style={styles.logoutText}>Logout</Text>
            <Ionicons name='log-out-outline' size={30} color={COLORS.BLACK} />
          </Fragment>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollViewContainer}
      >
        <View style={styles.topContainer}>
          <Image source={SelectTypeImage} style={styles.signUpUserTypeImage} />
        </View>
        <Text style={styles.botContainTxt1}>Welcome to {'\n'}UnivTraze</Text>
        <Text style={styles.botContainSubtxt}>
          Before we continue, we are happy {'\n'}to know you more
        </Text>
        <Text style={styles.radioTtl}>Please select below</Text>
        <View style={styles.radioButtonOption}>
          <RadioButton
            color={COLORS.PRIMARY}
            value='Student'
            status={userType == USER_TYPE.STUDENT ? 'checked' : 'unchecked'}
            onPress={() => setUserType(USER_TYPE.STUDENT)}
          />
          <Text style={styles.radioLabel}>Student</Text>
        </View>
        <View style={styles.radioButtonOption}>
          <RadioButton
            value='Employee'
            status={userType == USER_TYPE.EMPLOYEE ? 'checked' : 'unchecked'}
            onPress={() => setUserType(USER_TYPE.EMPLOYEE)}
            color={COLORS.PRIMARY}
          />
          <Text style={styles.radioLabel}>Employee</Text>
        </View>

        <View style={styles.radioButtonOption}>
          <RadioButton
            color={COLORS.PRIMARY}
            value='Visitor'
            status={userType == USER_TYPE.VISITOR ? 'checked' : 'unchecked'}
            onPress={() => setUserType(USER_TYPE.VISITOR)}
          />
          <Text style={styles.radioLabel}>Visitor</Text>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onNext} style={styles.signUpBtn}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default UserSelectTypeScreen

const styles = StyleSheet.create({
  customTopNav: {
    marginTop: StatusBar.currentHeight + (Platform.OS == 'ios' ? 60 : 10),
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row'
  },
  logoutBtn: {
    display: 'flex',
    gap: 5,
    alignItems: 'center',
    flexDirection: 'row'
  },
  logoutText: {
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  safeAreaView: {
    flex: 1
  },
  mainView: {
    flex: 1,
    backgroundColor: '#E1F5E4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  topContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signUpUserTypeImage: {
    marginTop: 80,
    width: 200,
    height: 200,
    alignSelf: 'center'
  },
  scrollViewContainer: {
    width: '100%'
  },
  scrollViewContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  botContainer: {
    width: '100%'
  },
  botContainTxt1: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    width: '100%',
    fontSize: 30,
    marginTop: 30
  },
  botContainSubtxt: {
    marginTop: 10,
    fontSize: 14,
    width: '100%',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  radioBox: {
    width: '100%',
    height: '100%'
  },
  radioTtl: {
    fontSize: 14,
    width: '100%',
    marginTop: 10,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  radioLabel: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  radioButtonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%'
  },
  signUpBtn: {
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
    fontSize: 16,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  }
})
