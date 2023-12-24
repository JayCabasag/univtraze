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
import { AntDesign } from '@expo/vector-icons'
import { useToast } from 'react-native-toast-notifications'
import * as ImagePicker from 'expo-image-picker'
import BackIcon from '../assets/back-icon.png'
import { COLORS } from '../utils/app_constants'

const UpdatePersonalInformationScreen = ({ navigation, route }) => {
  const toast = useToast()
  // console.log(route.params.token)

  const [token, setToken] = useState(route.params.token)
  const [userId, setUserId] = useState(route.params.id)
  const [userType, setUserType] = useState(route.params.type)

  const [userData, setUserData] = useState(null)

  const [mobileNumber, setMobileNumber] = useState('')

  const [studentCourse, setStudentCourse] = useState('')
  const [studentYearSection, setStudentYearSection] = useState('')

  const [employeeDepartment, setEmployeeDepartment] = useState('')
  const [employeePosition, setEmployeePosition] = useState('')

  // Error handler variables here

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  //Image handlers
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [base64ProfilePhoto, setBase64ProfilePhoto] = useState('')
  const [currenProfilePhotoUri, setCurrenProfilePhotoUri] = useState('')

  useEffect(() => {
    handleGetUserDetails()
  }, [])

  const handleGetUserDetails = async () => {
    setIsLoading(true)
    setError(false)
    setSuccess(false)
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const data = {
      id: userId
    }

    try {
      await axios.post(`https://univtraze.herokuapp.com/api/user/getUserDetailsById`, data, config).then((response) => {
        if (response.data.success === 0) {
          setError(true)
          setErrorMessage(response.data.message)
          setIsLoading(false)
          setSuccess(false)
          return
        }

        setError(false)
        setErrorMessage('')
        setIsLoading(false)
        setSuccess(false)

        setUserData(response.data.data)

        // This is where I assign all data from the database to the available fields.

        console.log(response.data)

        if (response.data.data.profile_url !== undefined) {
          setProfilePhoto({ uri: response.data.data.profile_url })
          setCurrenProfilePhotoUri(response.data.data.profile_url)
        }

        if (response.data.data.mobile_number !== undefined) {
          setMobileNumber(response.data.data.mobile_number)
        }

        if (response.data.data.year_section !== undefined) {
          setStudentYearSection(response.data.data.year_section)
        }

        if (response.data.data.course !== undefined) {
          setStudentCourse(response.data.data.course)
        }

        if (response.data.data.department !== undefined) {
          setEmployeeDepartment(response.data.data.department)
        }

        if (response.data.data.position !== undefined) {
          setEmployeePosition(response.data.data.position)
        }
      })
    } catch (error) {
      setError(true)
      setErrorMessage('Network connection error')
      setIsLoading(false)
      setSuccess(false)
    }
  }

  const handlePickProfilePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      quality: 1
    })

    if (!result.cancelled) {
      setProfilePhoto(result)
    }

    const convertedBase64Img = 'data:image/jpeg;base64,' + result.base64
    setBase64ProfilePhoto(convertedBase64Img)
  }

  const handleUpdateProfileData = async () => {
    if (profilePhoto.uri !== currenProfilePhotoUri) {
      handleUploadNewPhoto()
      return
    }

    updatePersonalInfo()
  }

  const handleUploadNewPhoto = async () => {
    setError(false)
    setSuccess(false)
    setIsLoading(true)
    await axios
      .post('https://univtraze.herokuapp.com/api/files/uploadUserBase64Image', {
        image: base64ProfilePhoto
      })
      .then(function (response) {
        setError(false)
        setSuccess(false)
        setIsLoading(false)
        setProfilePhoto({ uri: response.data.results.url })
        updatePersonalInfo()
      })
      .catch(function (error) {
        setError(false)
        setSuccess(false)
        setIsLoading(false)
        alert('Error occured while uploading your profile photo')
      })
  }

  const updatePersonalInfo = async () => {
    setIsLoading(true)
    setError(false)
    setSuccess(false)
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const data = {
      user_id: userId * 1,
      type: userType,
      profile_url: profilePhoto.uri,
      mobile_number: mobileNumber,
      department: employeeDepartment,
      position: employeePosition,
      course: studentCourse,
      year_section: studentYearSection
    }

    try {
      await axios.post(`https://univtraze.herokuapp.com/api/user/updatePersonalInfo`, data, config).then((response) => {
        if (response.data.success === 0) {
          setError(true)
          setErrorMessage(response.data.message)
          setIsLoading(false)
          setSuccess(false)
          return
        }

        setError(false)
        setErrorMessage('')
        setIsLoading(false)
        setSuccessMessage(response.data.message)
        setSuccess(true)
      })
    } catch (error) {
      setError(true)
      setErrorMessage('Network connection error')
      setIsLoading(false)
      setSuccess(false)
    }
  }

  return (
    <SafeAreaView>
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
          <Text style={styles.headerText}>Update Personal Information</Text>
          <ScrollView>
            <Text style={{ color: COLORS.PRIMARY }}>
              Only limited information can be updated in this section. Personal information e.g. Name, Address and Date of Birth cannot be
              updated here, please contact adminitrator for further assistance.
            </Text>

            <Image
              source={{
                uri:
                  profilePhoto === null
                    ? 'https://media.istockphoto.com/vectors/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-vector-id1130884625?k=20&m=1130884625&s=612x612&w=0&h=OITK5Otm_lRj7Cx8mBhm7NtLTEHvp6v3XnZFLZmuB9o='
                    : profilePhoto.uri
              }}
              resizeMode='cover'
              style={{
                width: 120,
                height: 120,
                borderRadius: 100,
                borderColor: COLORS.PRIMARY,
                borderWidth: 2,
                shadowColor: 'black',
                alignSelf: 'center'
              }}
            />
            <TouchableOpacity style={styles.editProfileButton} onPress={() => handlePickProfilePhoto()}>
              <AntDesign name='edit' size={24} color='black' />
              <Text> EDIT PROFILE </Text>
            </TouchableOpacity>

            <View>
              <Text>User Id.</Text>
              <TextInput placeholder='Id' style={styles.inputDisabled} value={userId + ''} editable={false} />
              <Text>User Type</Text>
              <TextInput placeholder='Type' style={styles.inputDisabled} value={userType} editable={false} />
              <Text>Mobile No.</Text>
              <TextInput
                placeholder='Type'
                style={styles.input}
                defaultValue={mobileNumber}
                onChangeText={(text) => setMobileNumber(text)}
              />
            </View>

            {/* This is for Student only */}
            {userType === 'Student' ? (
              <View>
                <Text>Course</Text>
                <TextInput
                  placeholder='Course'
                  style={styles.input}
                  defaultValue={studentCourse}
                  onChangeText={(text) => setStudentCourse(text)}
                />
                <Text>Year and Section</Text>
                <TextInput
                  placeholder='Year and Section'
                  style={styles.input}
                  defaultValue={studentYearSection}
                  onChangeText={(text) => setStudentYearSection(text)}
                />
              </View>
            ) : null}

            {/* This is for Employee only */}
            {userType === 'Employee' ? (
              <View>
                <Text>Department/Faculty</Text>
                <TextInput
                  placeholder='Department/Faculty'
                  style={styles.input}
                  defaultValue={employeeDepartment}
                  onChangeText={(text) => setEmployeeDepartment(text)}
                />
                <Text>Position</Text>
                <TextInput
                  placeholder='Position'
                  style={styles.input}
                  defaultValue={employeePosition}
                  onChangeText={(text) => setEmployeePosition(text)}
                />
              </View>
            ) : null}
          </ScrollView>

          {error ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
          {success ? <Text style={{ color: COLORS.PRIMARY }}>{successMessage}</Text> : null}
          {isLoading ? <Text style={{ color: COLORS.PRIMARY }}>Please wait ...</Text> : null}
          <TouchableOpacity style={styles.buttons} onPress={() => handleUpdateProfileData()}>
            <Text style={{ fontSize: 15, color: 'white' }}>Update info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default UpdatePersonalInformationScreen

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
  editProfileButton: {
    alignSelf: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
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
    height: '90%',
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
  inputDisabled: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
    height: 50,
    borderColor: 'gray',
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
    color: COLORS.TEXT_BLACK,
    fontSize: 25,
    lineHeight: 30,
    textTransform: 'uppercase',
    paddingVertical: 15
  }
})
