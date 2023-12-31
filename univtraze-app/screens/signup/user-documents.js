import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Image
} from 'react-native'
import React, { Fragment, useReducer, useRef, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import { Ionicons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import StepperIcon2 from '../../assets/step-2-credentials.png'
import { COLORS, FONT_FAMILY } from '../../utils/app_constants'
import LoadingModal from '../../components/LoadingModal'
import UserInformationFooter from '../../components/UserInformationFooter'
import GeneratedAvatar from '../../components/GeneratedAvatar'
import { AntDesign } from '@expo/vector-icons'
import useFormErrors from '../../hooks/useFormErrors'
import { useAuth } from '../../services/store/auth/AuthContext'
import { useUser } from '../../services/store/user/UserContext'

const UserDocumentsScreen = ({ navigation, route }) => {
  const { state: auth } = useAuth()
  const { state: user } = useUser()
  const scrollViewRef = useRef()
  const { setFormErrors, resetFormErrors, formErrors } = useFormErrors([
    'frontIdPhoto',
    'backIdPhoto'
  ])
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [base64ProfilePhoto, setBase64ProfilePhoto] = useState('')

  const [frontIdPhoto, setFrontIdPhoto] = useState(null)
  const [base64FrontIdPhoto, setBase64FrontIdPhoto] = useState('')

  const [backIdPhoto, setBackIdPhoto] = useState(null)
  const [base64BackIdPhoto, setBase64BackIdPhoto] = useState('')

  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')

  const initials =
    (route.params.firstName ?? '').charAt(0) + (route.params.lastName ?? '').charAt(0)

  //Getting current user token
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState(null)

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    })

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri)
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
      setFrontIdPhoto(result.assets[0].uri)
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
      setBackIdPhoto(result.assets[0].uri)
    }
  }

  const onNext = () => {
    resetFormErrors()
    if (frontIdPhoto == null) {
      scrollViewRef.current.scrollToEnd({ animated: true })
      return setFormErrors('frontIdPhoto', 'Back ID photo is required')
    }
    if (backIdPhoto == null) {
      scrollViewRef.current.scrollToEnd({ animated: true })
      return setFormErrors('backIdPhoto', 'Front ID photo is required')
    }
    console.log('NExt')
  }

  console.log(formErrors)

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
          {profilePhoto == null ? (
            <GeneratedAvatar initials={initials} />
          ) : (
            <Image source={{ uri: profilePhoto }} resizeMode='cover' style={styles.profilePhoto} />
          )}
          <TouchableOpacity style={styles.editProfileButton} onPress={pickProfileImage}>
            <Ionicons name='md-cloud-upload-outline' size={18} color={COLORS.WHITE} />
            <Text style={styles.uploadPhotoText}> Change Profile </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.idDocsContainer}>
          <Text style={styles.sectionHeaderText}>Identification Documents</Text>

          <Text style={styles.labelText}>Front ID Photo</Text>
          <View
            style={[
              styles.uploadIdContainer,
              formErrors.frontIdPhoto?.hasError && { borderColor: COLORS.RED }
            ]}
          >
            {frontIdPhoto == null ? (
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
            {backIdPhoto == null ? (
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

export default UserDocumentsScreen

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    backgroundColor: '#E1F5E4',
    flex: 1
  },
  header: {
    width: '100%',
    height: 130,
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
    borderColor: COLORS.WHITE
  },
  editProfileButton: {
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
    shadowRadius: 4
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
