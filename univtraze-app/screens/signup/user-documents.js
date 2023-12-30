import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Modal,
  ActivityIndicator
} from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import BackIcon from '../../assets/back-icon.png'
import StepperIcon2 from '../../assets/reg2_identifier.png'
import { COLORS } from '../../utils/app_constants'
import LoadingModal from '../../components/LoadingModal'
import UserInformationFooter from '../../components/UserInformationFooter'

const UserDocumentsScreen = ({ navigation, route }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')

  const [profilePhoto, setProfilePhoto] = useState(null)
  const [base64ProfilePhoto, setBase64ProfilePhoto] = useState('')

  const [frontIdPhoto, setFrontIdPhoto] = useState(null)
  const [base64FrontIdPhoto, setBase64FrontIdPhoto] = useState('')

  const [backIdPhoto, setBackIdPhoto] = useState(null)
  const [base64BackIdPhoto, setBase64BackIdPhoto] = useState('')

  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')

  const [selectedProfilePhotoUrl, setSelectedProfilePhotoUrl] = useState('')
  const [selectedFrontIdUrl, setSelectedFrontIdUrl] = useState('')
  const [selectedBackIdUrl, setSelectedBackIdUrl] = useState('')

  //Getting current user token
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState(null)

  const pickDocumentForProfilePhoto = async () => {
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

  const pickFrontIdPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      quality: 1
    })

    if (!result.cancelled) {
      setFrontIdPhoto(result)
    }

    const convertedBase64Img = 'data:image/jpeg;base64,' + result.base64
    setBase64FrontIdPhoto(convertedBase64Img)
  }

  const pickBackIdPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      quality: 1
    })

    if (!result.cancelled) {
      setBackIdPhoto(result)
    }

    const convertedBase64Img = 'data:image/jpeg;base64,' + result.base64
    setBase64BackIdPhoto(convertedBase64Img)
  }

  // Function for uploading user details to the database including the uploading of documents uwu
  const handleSaveUserDetails = async () => {
    if (profilePhoto === null) {
      return alert('Please select your profile photo!')
    }

    if (frontIdPhoto === null) {
      return alert('You need to provide front image of your ID')
    }

    if (backIdPhoto === null) {
      return alert('You need to provide back image of your ID')
    }

    updateUserType(route.params.type)
  }
  const updateUserType = async () => {
    setShowLoadingModal(true)
    //THis will handle uploading of profile photo
    setLoadingMessage(`Updating user type as ${route.params.type}...`)

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const data = {
      id: userId,
      type: route.params.type
    }

    await axios
      .post(`https://univtraze.herokuapp.com/api/user/updateUserType`, data, config)
      .then((response) => {
        const success = response.data.success

        if (success === 0) {
          setShowLoadingModal(false)
          return alert('Please try again')
        }

        setShowLoadingModal(false)
        setLoadingMessage('Updated successfully...')

        handleImageUploads(base64ProfilePhoto, base64FrontIdPhoto, base64BackIdPhoto)
      })
  }

  const handleImageUploads = async (profilePhoto, frontIdPhoto, backIdPhoto) => {
    let imageProfile = ''
    let imageBackPhoto = ''
    let imageFrontPhoto = ''

    setShowLoadingModal(true)
    //THis will handle uploading of profile photo
    setLoadingMessage('Uploading profile photo...')
    await axios
      .post('https://univtraze.herokuapp.com/api/files/uploadUserBase64Image', {
        image: profilePhoto
      })
      .then(function (response) {
        setSelectedProfilePhotoUrl(response.data.results.url)
        imageProfile = response.data.results.url
        setLoadingMessage('Uploading profile photo completed...')
      })
      .catch(function (error) {
        alert('Error occured while uploading your profile photo')
      })

    setLoadingMessage('Uploading front ID photo...')
    //This will handle the uploading of front if photo
    await axios
      .post('https://univtraze.herokuapp.com/api/files/uploadUserBase64Image', {
        image: frontIdPhoto
      })
      .then(function (response) {
        setSelectedFrontIdUrl(response.data.results.url)
        imageFrontPhoto = response.data.results.url
        setLoadingMessage('Uploading front ID photo completed...')
      })
      .catch(function (error) {
        alert('Error occured while uploading your profile photo')
      })

    setLoadingMessage('Uploading back ID photo...')
    //This will handle the uploading of back id photo
    await axios
      .post('https://univtraze.herokuapp.com/api/files/uploadUserBase64Image', {
        image: backIdPhoto
      })
      .then(function (response) {
        setSelectedBackIdUrl(response.data.results.url)
        imageBackPhoto = response.data.results.url
        setLoadingMessage('Uploading back ID photo completed...')
      })
      .catch(function (error) {
        alert('Error occured while uploading your profile photo')
      })

    setLoadingMessage('Please wait...')
    setShowLoadingModal(false)

    if (route.params.type === 'Student') {
      return handleAddStudentDetails(
        userId,
        route.params.type,
        route.params.studentNumber,
        route.params.firstName,
        route.params.lastName,
        route.params.middleName,
        route.params.suffix,
        route.params.gender,
        route.params.address,
        route.params.dob,
        route.params.course,
        route.params.yearAndSection,
        phoneNumber,
        imageProfile,
        imageFrontPhoto,
        imageBackPhoto
      )
    }

    if (route.params.type === 'Employee') {
      return handleAddEmployeeDetails(
        userId,
        route.params.type,
        route.params.employeeNumber,
        route.params.firstName,
        route.params.lastName,
        route.params.middleName,
        route.params.suffix,
        route.params.gender,
        route.params.address,
        route.params.dob,
        route.params.department,
        route.params.position,
        phoneNumber,
        imageProfile,
        imageFrontPhoto,
        imageBackPhoto
      )
    }

    if (route.params.type === 'Visitor') {
      return handleAddEVisitorDetails(
        userId,
        route.params.type,
        route.params.firstName,
        route.params.lastName,
        route.params.middleName,
        route.params.suffix,
        route.params.gender,
        route.params.address,
        route.params.dob,
        phoneNumber,
        imageProfile,
        imageFrontPhoto,
        imageBackPhoto
      )
    }
  }

  const handleAddStudentDetails = async (
    uid,
    type,
    studentNumber,
    firstName,
    lastName,
    middleName,
    suffix,
    gender,
    address,
    dob,
    course,
    yearAndSection,
    phoneNumber,
    imageProfile,
    imageFrontPhoto,
    imageBackPhoto
  ) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const data = {
      user_id: uid,
      firstname: firstName,
      lastname: lastName,
      middlename: middleName,
      suffix: suffix,
      gender: gender,
      address: address,
      course: course,
      year_section: yearAndSection,
      birthday: dob,
      student_id: studentNumber,
      mobile_number: phoneNumber,
      email: email,
      profile_url: imageProfile,
      back_id_photo: imageBackPhoto,
      front_id_photo: imageFrontPhoto
    }

    await axios
      .post(`https://univtraze.herokuapp.com/api/user/addStudentDetails`, data, config)
      .then((response) => {
        const success = response.data.success

        if (success === 0) {
          return alert('Please try again now' + response.data.message)
        }
        navigation.navigate('SignUpVaccination', { type: type })
      })
  }

  const handleAddEmployeeDetails = async (
    uid,
    type,
    employeeNumber,
    firstName,
    lastName,
    middleName,
    suffix,
    gender,
    address,
    dob,
    department,
    position,
    phoneNumber,
    imageProfile,
    imageFrontPhoto,
    imageBackPhoto
  ) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const data = {
      user_id: uid,
      firstname: firstName,
      lastname: lastName,
      middlename: middleName,
      suffix: suffix,
      gender: gender,
      address: address,
      department: department,
      position: position,
      birthday: dob,
      employee_id: employeeNumber,
      mobile_number: phoneNumber,
      email: email,
      profile_url: imageProfile,
      back_id_photo: imageBackPhoto,
      front_id_photo: imageFrontPhoto
    }

    await axios
      .post(`https://univtraze.herokuapp.com/api/user/addEmployeeDetails`, data, config)
      .then((response) => {
        const success = response.data.success

        if (success === 0) {
          return alert('Please try again now' + response.data.message)
        }
        navigation.navigate('SignUpVaccination', { type: type })
      })
  }

  const handleAddEVisitorDetails = async (
    uid,
    type,
    firstName,
    lastName,
    middleName,
    suffix,
    gender,
    address,
    dob,
    phoneNumber,
    imageProfile,
    imageFrontPhoto,
    imageBackPhoto
  ) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const data = {
      user_id: uid,
      firstname: firstName,
      lastname: lastName,
      middlename: middleName,
      suffix: suffix,
      gender: gender,
      address: address,
      birthday: dob,
      mobile_number: phoneNumber,
      email: email,
      profile_url: imageProfile,
      back_id_photo: imageBackPhoto,
      front_id_photo: imageFrontPhoto
    }

    await axios
      .post(`https://univtraze.herokuapp.com/api/user/addVisitorDetails`, data, config)
      .then((response) => {
        const success = response.data.success

        if (success === 0) {
          return alert('Please try again now' + response.data.message)
        }

        navigation.navigate('SignUpVaccination', { type: type })
      })
  }

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal
        onRequestClose={() => setShowLoadingModal(false)}
        open={showLoadingModal}
        loadingMessage={loadingMessage}
      />
      <View style={styles.header}>
        <Image source={StepperIcon2} resizeMode='contain' style={{ width: '80%', height: '80%' }} />
      </View>
      <ScrollView
        style={{
          flexDirection: 'column'
        }}
      >
        <View
          style={{
            paddingHorizontal: 40,
            marginVertical: 15,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text style={{ marginVertical: 15, textAlign: 'left', width: '100%' }}>Profile</Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
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
                shadowColor: 'black'
              }}
            />
          </View>

          <TouchableOpacity style={styles.editProfileButton} onPress={pickDocumentForProfilePhoto}>
            <Ionicons name='md-cloud-upload-outline' size={18} color='black' />
            <Text> UPLOAD PHOTO </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 40,
            marginBottom: 5
          }}
        >
          <Text style={{ marginVertical: 15 }}>I.D photo</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity
              style={{
                width: 150,
                height: 44,
                backgroundColor: '#C7C7C7',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10
              }}
              onPress={pickFrontIdPhoto}
            >
              <Text> Upload ID Photo(Front) </Text>
            </TouchableOpacity>
            <Text style={{ width: 145 }}>{frontIdPhoto === null ? null : frontIdPhoto.name}</Text>
          </View>

          {/* Previewer Image front */}

          {frontIdPhoto === null ? null : (
            <View
              style={{
                marginTop: 10,
                width: '100%',
                height: 150,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Image
                source={{ uri: frontIdPhoto.uri }}
                resizeMode='cover'
                style={{
                  width: '100%',
                  height: 150,
                  shadowColor: 'black',
                  borderWidth: 1,
                  borderColor: COLORS.PRIMARY,
                  borderRadius: 5
                }}
              />
            </View>
          )}

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity
              style={{
                width: 150,
                height: 44,
                backgroundColor: '#C7C7C7',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10
              }}
              onPress={pickBackIdPhoto}
            >
              <Text>Upload ID Photo(Back)</Text>
            </TouchableOpacity>
            <Text style={{ width: 145 }}>{backIdPhoto === null ? null : backIdPhoto.name}</Text>
          </View>

          {/* Previewer Image Back */}

          {backIdPhoto === null ? null : (
            <View
              style={{
                marginTop: 10,
                width: '100%',
                height: 150,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Image
                source={{ uri: backIdPhoto.uri }}
                resizeMode='cover'
                style={{
                  width: '100%',
                  height: 150,
                  shadowColor: 'black',
                  borderWidth: 1,
                  borderColor: COLORS.PRIMARY,
                  borderRadius: 5
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <UserInformationFooter onGoBack={navigation.goBack} onNext={() => console.log('Next')} />
    </View>
  )
}

export default UserDocumentsScreen

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '20%',

    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },

  label: {
    width: '80%',
    textAlign: 'left'
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
  editProfileButton: {
    width: 'auto',
    height: 'auto',
    padding: 4,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row'
  }
})
