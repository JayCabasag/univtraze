import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native'
import React, { useState, Fragment } from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import Header from '../components/Header'
import GeneratedAvatar from '../components/GeneratedAvatar'
import * as ImagePicker from 'expo-image-picker'
import { uploadImageAsync } from '../utils/helpers'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useUser } from '../services/store/user/UserContext'
import { convertNameToInitials } from '../utils/formatters'
import useFormErrors from '../hooks/useFormErrors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { phoneNumberRegex } from '../utils/regex'
import { genericUpdateRequest } from '../services/api/genericUpdateRequest'
import { useAuth } from '../services/store/auth/AuthContext'
import LoadingModal from '../components/LoadingModal'
import { withSafeAreaView } from '../hoc/withSafeAreaView'

function UpdatePersonalInformationScreen({ navigation }) {
  const { state: user } = useUser()
  const { state: auth } = useAuth()

  const token = auth.userToken
  const initials = convertNameToInitials(user.details.firstname, user.details.lastname)

  const [isLoading, setIsLoading] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(user?.details?.profile_url ?? null)
  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(user?.details?.mobile_number)
  const { resetFormErrors, formErrors, setFormErrors } = useFormErrors(['phoneNumber'])

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

  const saveAndExit = async () => {
    resetFormErrors()
    if (phoneNumber == null || phoneNumber == '') {
      return setFormErrors('phoneNumber', 'Phone number is required')
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
      return setFormErrors('phoneNumber', 'Phone number is invalid')
    }

    try {
      setIsLoading(true)
      const payload = {
        profile_url: profilePhoto,
        mobile_number: phoneNumber
      }
      await genericUpdateRequest('users/profile-information', payload, token)
      Alert.alert('Success', 'User information updated successfully', [
        {
          text: 'Ok',
          onPress: navigation.goBack
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
            <Text style={styles.sectionHeaderText}>Profile photo</Text>
            {profilePhoto == null ? (
              <GeneratedAvatar initials={initials} />
            ) : (
              <Image
                source={{ uri: profilePhoto }}
                resizeMode='cover'
                style={styles.profilePhoto}
              />
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

          <Text style={styles.sectionHeaderText}>Contact Information</Text>
          <View style={styles.phoneNumberContainer}>
            <View style={styles.phoneNumberWrapper}>
              <Text style={styles.label}>Phone number</Text>
              <TextInput
                placeholder='Phone number'
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={[styles.input, formErrors.phoneNumber?.hasError && styles.inputError]}
              />
              {formErrors.phoneNumber?.hasError && (
                <Text style={styles.errorText}>{formErrors.phoneNumber.message}</Text>
              )}
            </View>
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

export default withSafeAreaView(UpdatePersonalInformationScreen)

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
  profileContainer: {
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
  editProfileButton: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 40,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
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
  sectionHeaderText: {
    fontSize: 24,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    width: '100%'
  },
  label: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.TEXT_BLACK,
    marginTop: 10
  }
})
