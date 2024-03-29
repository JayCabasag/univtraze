import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator
} from 'react-native'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import StepperIcon2 from '../assets/step-2-credentials.png'
import { COLORS, FONT_FAMILY, STUDENT_YEARS, USER_TYPE } from '../utils/app_constants'
import LoadingModal from '../components/LoadingModal'
import UserInformationFooter from '../components/UserInfoFooter'
import GeneratedAvatar from '../components/GeneratedAvatar'
import { AntDesign } from '@expo/vector-icons'
import useFormErrors from '../hooks/useFormErrors'
import { useAuth } from '../services/store/auth/AuthContext'
import { genericPostRequest } from '../services/api/genericPostRequest'
import UserStudentInformation from '../components/UserStudentInformation'
import UserEmployeeInformation from '../components/UserEmployeeInformation'
import UserVisitorInformation from '../components/UserVisitorInformation'
import { getApps, initializeApp } from 'firebase/app'
import { firebaseConfig } from '../configs/firebaseConfig'
import { convertStringDateToISOString, isEmpty, uploadImageAsync } from '../utils/helpers'
import { useUser } from '../services/store/user/UserContext'
import { genericUpdateRequest } from '../services/api/genericUpdateRequest'
import { convertNameToInitials } from '../utils/formatters'
import { withSafeAreaView } from '../hoc/withSafeAreaView'
import { StatusBar } from 'expo-status-bar'

if (!getApps().length) {
  initializeApp(firebaseConfig)
}

const UserDocumentsScreen = ({ navigation, route }) => {
  const { state: auth } = useAuth()
  const { state: userState, updateUser } = useUser()

  const userType = route.params?.userType

  const scrollViewRef = useRef()

  useEffect(() => {
    if (!userType) {
      return navigation.navigate('select-user-type')
    }
  }, [userType])

  // For Student Only
  const [studentId, setStudentId] = useState('')
  const [studentCourse, setStudentCourse] = useState('')
  const [studentYear, setStudentYear] = useState(null)
  const [studentSection, setStudentSection] = useState('')

  // For Employee Only
  const [employeeId, setEmployeeId] = useState('')
  const [employeeDepartment, setEmployeeDepartment] = useState('')
  const [employeePosition, setEmployeePosition] = useState('')

  // For Visitor Only
  // start here...

  // This for all users
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] = useState(false)
  const [frontIdPhoto, setFrontIdPhoto] = useState(null)
  const [isUploadingFrontIdPhoto, setIsUploadingFrontIdPhoto] = useState(false)
  const [backIdPhoto, setBackIdPhoto] = useState(null)
  const [isUploadingBackIdPhoto, setIsUploadingBackIdPhoto] = useState(false)

  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')
  const { setFormErrors, resetFormErrors, formErrors } = useFormErrors([
    'studentId',
    'studentYear',
    'studentSection',
    'studentCourse',
    'employeeId',
    'employeeDepartment',
    'employeePosition',
    'frontIdPhoto',
    'backIdPhoto'
  ])

  const initials = convertNameToInitials(route.params.firstName, route.params.lastName)

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    })

    if (!result.canceled) {
      try {
        setIsUploadingProfilePhoto(true)
        const uploadUrl = await uploadImageAsync(result.assets[0].uri)
        setProfilePhoto(uploadUrl)
      } catch (e) {
        console.log(e)
        alert('Upload failed, sorry :(')
        setProfilePhoto(null)
      } finally {
        setIsUploadingProfilePhoto(false)
      }
    }
  }

  const pickFrontIdImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 4],
      quality: 1
    })

    if (!result.canceled) {
      try {
        setIsUploadingFrontIdPhoto(true)
        const uploadUrl = await uploadImageAsync(result.assets[0].uri)
        setFrontIdPhoto(uploadUrl)
      } catch (e) {
        console.log(e)
        alert('Upload failed, sorry :(')
      } finally {
        setIsUploadingFrontIdPhoto(false)
      }
    }
  }

  const pickBackIdImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 4],
      quality: 1
    })

    if (!result.canceled) {
      try {
        setIsUploadingBackIdPhoto(true)
        const uploadUrl = await uploadImageAsync(result.assets[0].uri)
        setBackIdPhoto(uploadUrl)
      } catch (e) {
        console.log(e)
        alert('Upload failed, sorry :(')
      } finally {
        setIsUploadingBackIdPhoto(false)
      }
    }
  }

  const validateStudentInfo = () => {
    if (isEmpty(studentId)) {
      return setFormErrors('studentId', 'Student year is required')
    }
    if (isEmpty(studentCourse)) {
      return setFormErrors('studentCourse', 'Student course is required')
    }
    if (isEmpty(studentYear)) {
      return setFormErrors('studentYear', 'Student year is required')
    }
    if (isEmpty(studentSection)) {
      return setFormErrors('studentSection', 'Student section is required')
    }
    validateIdInputs()
  }

  const validateEmployeeInfo = () => {
    if (isEmpty(employeeId)) {
      return setFormErrors('employeeId', 'Employee Id is required')
    }
    if (isEmpty(employeeDepartment)) {
      return setFormErrors('employeeDepartment', 'Employee Department is required')
    }
    if (isEmpty(employeePosition)) {
      return setFormErrors('employeePosition', 'Employee position is required')
    }
    validateIdInputs()
  }

  const validateVisitorInfo = () => {
    // Add Visitor validator
    // Start here...
    validateIdInputs()
  }

  const validateIdInputs = async () => {
    if (isEmpty(frontIdPhoto)) {
      return setFormErrors('frontIdPhoto', 'Front ID photo is required')
    }
    if (isEmpty(backIdPhoto)) {
      // scrollViewRef.current.scrollToEnd({ animated: true })
      return setFormErrors('backIdPhoto', 'Back ID photo is required')
    }
    processUpdateUserDetails()
  }

  const processUpdateUserDetails = async () => {
    let isAddDetailsSuccess = false
    try {
      setShowLoadingModal(true)
      const studentUserDetailsPayload = {
        type: USER_TYPE.STUDENT,
        firstname: route.params.firstName,
        lastname: route.params.lastName,
        middlename: route.params.middleName,
        suffix: route.params.suffix,
        gender: route.params.gender,
        address: route.params.address,
        course: studentCourse,
        year_section: `${studentYear} - ${studentSection}`,
        birthday: convertStringDateToISOString(route.params.dob),
        student_id: studentId,
        mobile_number: route.params.phoneNumber,
        email: userState.user.email,
        profile_url: profilePhoto,
        back_id_photo: backIdPhoto,
        front_id_photo: frontIdPhoto,
        user_id: userState.user.id
      }
      const employeeUserDetailsPayload = {
        type: USER_TYPE.EMPLOYEE,
        firstname: route.params.firstName,
        lastname: route.params.lastName,
        middlename: route.params.middleName,
        suffix: route.params.suffix,
        gender: route.params.gender,
        address: route.params.address,
        mobile_number: route.params.phoneNumber,
        email: userState.user.email,
        department: employeeDepartment,
        position: employeePosition,
        birthday: convertStringDateToISOString(route.params.dob),
        employee_id: employeeId,
        profile_url: profilePhoto,
        back_id_photo: backIdPhoto,
        front_id_photo: frontIdPhoto,
        user_id: userState.user.id
      }
      const visitorUserDetailsPayload = {
        type: USER_TYPE.VISITOR,
        firstname: route.params.firstName,
        lastname: route.params.lastName,
        middlename: route.params.middleName,
        suffix: route.params.suffix,
        gender: route.params.gender,
        address: route.params.address,
        mobile_number: route.params.phoneNumber,
        email: userState.user.email,
        birthday: convertStringDateToISOString(route.params.dob),
        profile_url: profilePhoto,
        back_id_photo: backIdPhoto,
        front_id_photo: frontIdPhoto,
        user_id: userState.user.id
      }

      let url = null
      let payload = null
      switch (userType) {
        case USER_TYPE.STUDENT:
          payload = studentUserDetailsPayload
          url = 'users/student-details'
          break
        case USER_TYPE.EMPLOYEE:
          payload = employeeUserDetailsPayload
          url = 'users/employee-details'
          break
        case USER_TYPE.VISITOR:
          payload = visitorUserDetailsPayload
          url = 'users/visitor-details'
          break
        default:
          break
      }
      await genericPostRequest(url, payload, auth.userToken)
      isAddDetailsSuccess = true
    } catch (error) {
      console.log(error)
      isAddDetailsSuccess = false
    } finally {
      setShowLoadingModal(false)
    }
    // Update user Type / Role
    if (isAddDetailsSuccess) {
      try {
        setShowLoadingModal(true)
        const payload = { type: userType }
        const res = await genericUpdateRequest('users/user-type', payload, auth.userToken)
        updateUser({ user: res.results })
        navigation.navigate('user-vaccine')
      } catch (error) {
        console.log(error)
      } finally {
        setShowLoadingModal(false)
      }
    }
  }

  const onNext = async () => {
    resetFormErrors()

    switch (userType) {
      case USER_TYPE.STUDENT:
        return validateStudentInfo()
      case USER_TYPE.EMPLOYEE:
        return validateEmployeeInfo()
      case USER_TYPE.VISITOR:
        return validateVisitorInfo()
      default:
        alert('Invalid user type')
    }
  }

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
      <LoadingModal
        onRequestClose={() => setShowLoadingModal(false)}
        open={showLoadingModal}
        loadingMessage={loadingMessage}
      />
      <View style={styles.header}>
        <Image
          source={StepperIcon2}
          resizeMode='contain'
          style={{ width: '100%', marginTop: 30 }}
        />
      </View>
      <ScrollView
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContainer}>
          <Text style={styles.sectionHeaderText}>Profile photo</Text>
          {isEmpty(profilePhoto) ? (
            <GeneratedAvatar initials={initials} />
          ) : (
            <Image source={{ uri: profilePhoto }} resizeMode='cover' style={styles.profilePhoto} />
          )}
          <TouchableOpacity
            disabled={isUploadingProfilePhoto}
            style={styles.editProfileButton}
            onPress={pickProfileImage}
          >
            {isUploadingProfilePhoto ? (
              <Fragment>
                <ActivityIndicator color={COLORS.WHITE} size='small' />
                <Text style={styles.uploadPhotoText}> Uploading photo.. </Text>
              </Fragment>
            ) : (
              <Fragment>
                <Ionicons name='md-cloud-upload-outline' size={18} color={COLORS.WHITE} />
                <Text style={styles.uploadPhotoText}> Change Profile </Text>
              </Fragment>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.idDocsContainer}>
          <Text style={styles.sectionHeaderText}>Identification Documents</Text>
          {/* This is for Student User only */}
          {userType == USER_TYPE.STUDENT && (
            <UserStudentInformation
              studentId={studentId}
              setStudentId={setStudentId}
              studentCourse={studentCourse}
              setStudentCourse={setStudentCourse}
              studentYear={studentYear}
              setStudentYear={setStudentYear}
              studentSection={studentSection}
              setStudentSection={setStudentSection}
              formErrors={formErrors}
            />
          )}
          {/* This is for Employee Only */}
          {userType == USER_TYPE.EMPLOYEE && (
            <UserEmployeeInformation
              employeeId={employeeId}
              setEmployeeId={setEmployeeId}
              employeeDepartment={employeeDepartment}
              setEmployeeDepartment={setEmployeeDepartment}
              employeePosition={employeePosition}
              setEmployeePosition={setEmployeePosition}
              formErrors={formErrors}
            />
          )}
          {/* This is for Visitor Only */}
          {userType == USER_TYPE.VISITOR && <UserVisitorInformation formErrors={formErrors} />}

          <Text style={styles.labelText}>Front ID Photo</Text>
          <View
            style={[
              styles.uploadIdContainer,
              formErrors.frontIdPhoto?.hasError && { borderColor: COLORS.RED }
            ]}
          >
            {isUploadingFrontIdPhoto && (
              <View style={styles.uploadIdBtn}>
                <ActivityIndicator size='large' color={COLORS.PRIMARY} />
              </View>
            )}
            {!isUploadingFrontIdPhoto && isEmpty(frontIdPhoto) ? (
              <TouchableOpacity style={styles.uploadIdBtn} onPress={pickFrontIdImage}>
                <FontAwesome5 name='id-card' size={34} color={COLORS.PRIMARY} />
              </TouchableOpacity>
            ) : (
              <Fragment>
                <AntDesign
                  name='closecircle'
                  size={24}
                  color={COLORS.PRIMARY}
                  style={styles.removePhotoBtn}
                  onPress={() => setFrontIdPhoto(null)}
                />
                <Image
                  source={{ uri: frontIdPhoto }}
                  resizeMode='contain'
                  style={{ width: '100%', height: '100%' }}
                />
              </Fragment>
            )}
          </View>
          {formErrors.frontIdPhoto?.hasError && (
            <Text style={styles.errorText}>{formErrors.frontIdPhoto.message}</Text>
          )}

          <Text style={styles.labelText}>Back ID Photo</Text>
          <View
            style={[
              styles.uploadIdContainer,
              formErrors.backIdPhoto?.hasError && { borderColor: COLORS.RED }
            ]}
          >
            {isUploadingBackIdPhoto && (
              <View style={styles.uploadIdBtn}>
                <ActivityIndicator size='large' color={COLORS.PRIMARY} />
              </View>
            )}
            {!isUploadingBackIdPhoto && isEmpty(backIdPhoto) ? (
              <TouchableOpacity style={styles.uploadIdBtn} onPress={pickBackIdImage}>
                <FontAwesome5 name='id-card' size={34} color={COLORS.PRIMARY} />
              </TouchableOpacity>
            ) : (
              <Fragment>
                <AntDesign
                  name='closecircle'
                  size={24}
                  color={COLORS.PRIMARY}
                  style={styles.removePhotoBtn}
                  onPress={() => setBackIdPhoto(null)}
                />
                <Image
                  source={{ uri: backIdPhoto }}
                  resizeMode='contain'
                  style={{ width: '100%', height: '100%' }}
                />
              </Fragment>
            )}
          </View>
          {formErrors.backIdPhoto?.hasError && (
            <Text style={styles.errorText}>{formErrors.backIdPhoto.message}</Text>
          )}
        </View>
      </ScrollView>
      <UserInformationFooter onGoBack={navigation.goBack} onNext={onNext} />
    </KeyboardAvoidingView>
  )
}

export default withSafeAreaView(UserDocumentsScreen)

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    backgroundColor: '#E1F5E4',
    flex: 1
  },
  header: {
    width: '100%',
    height: Platform.OS == 'ios' ? 170 : 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  sectionHeaderText: {
    fontSize: 24,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    textAlign: 'left',
    width: '100%'
  },
  errorMessage: {
    marginTop: 10,
    alignSelf: 'center',
    width: '100%',
    textAlign: 'left',
    color: 'red'
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

  idPhotoContainer: {
    marginTop: 10,
    width: '100%',
    height: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  profileContainer: {
    paddingHorizontal: 40,
    marginVertical: 15,
    display: 'flex',
    gap: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
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
  backbutton: {
    paddingTop: 10
  },
  input: {
    margin: 5,
    width: '80%',
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
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    paddingVertical: 15,
    width: 122,
    height: 60
  },
  buttonText: {
    color: '#FFF',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  centeredView: {
    backgroundColor: 'rgba(250, 250, 250, .7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
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
    textAlign: 'center'
  },
  fullNameText: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: 16,
    marginBottom: 5
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    shadowColor: 'black',
    borderWidth: 5,
    borderColor: COLORS.WHITE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE
  },
  editProfileButton: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 40,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    paddingHorizontal: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadPhotoText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    color: COLORS.WHITE,
    marginLeft: 10
  },
  idDocsContainer: {
    paddingHorizontal: 40,
    marginBottom: 5,
    paddingBottom: 30
  },
  labelText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    paddingVertical: 5,
    marginTop: 15
  },
  removePhotoBtn: {
    top: -5,
    position: 'absolute',
    right: -5,
    zIndex: 99
  },
  uploadIdContainer: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: 220,
    borderWidth: 2,
    padding: 5,
    borderStyle: 'dashed',
    borderRadius: 10,
    borderColor: COLORS.GRAY,
    position: 'relative',
    backgroundColor: COLORS.LIGHT_GRAY,
    padding: 10
  },
  uploadIdBtn: {
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative'
  }
})
