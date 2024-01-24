import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from 'react-native'
import { RadioButton } from 'react-native-paper'
import React, { Fragment, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { AntDesign } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons'
import BackIcon from '../assets/back-icon.png'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import { useUser } from '../services/store/user/UserContext'
import { useAuth } from '../services/store/auth/AuthContext'
import useFormErrors from '../hooks/useFormErrors'
import { uploadImageAsync } from '../utils/helpers'
import LoadingModal from '../components/LoadingModal'

const ReportDiseaseScreen = ({ navigation }) => {
  // Notifications Variables
  const { state: user } = useUser()
  const { state: auth } = useAuth()

  // Error
  const { formErrors, resetFormErrors, setFormErrors } = useFormErrors([
    'diseaseName',
    'documentProofPhoto'
  ])

  //end Notifications Variables
  const [isChecked, setIsChecked] = useState('')
  const [token, setToken] = useState('')

  //Variables for data
  const [proofDoc, setProofDoc] = useState(null)
  const [selectedDisease, setSelectedDisease] = useState('')
  const [otherDiseaseName, setOtherDiseaseName] = useState('')
  const [docProofImage, setDocProofImage] = useState(null)
  const [isUploadingDocProfImage, setIsUploadingDocProfImage] = useState(false)

  //Variables for loading
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')

  const pickDocumentForProof = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      quality: 1
    })

    if (!result.canceled) {
      try {
        setIsUploadingDocProfImage(true)
        const uploadUrl = await uploadImageAsync(result.assets[0].uri)
        setDocProofImage(uploadUrl)
      } catch (e) {
        console.log(e)
        alert('Upload failed, sorry :(')
      } finally {
        setIsUploadingDocProfImage(false)
      }
    }
  }

  const handleSubmitReportDisease = async () => {
    // if (isChecked === '') {
    //   return alert('Please select a disease to report')
    // }
    // if (proofDoc === null) {
    //   return alert('Please select ad a supporting document')
    // }
    // if (isChecked === 'Others') {
    //   if (otherDiseaseName === '') {
    //     return alert('Please input disease name')
    //   }
    //   setSelectedDisease(otherDiseaseName)
    //   return handleUploadData(token, base64ProofDoc, otherDiseaseName)
    // }
    // handleUploadData(token, base64ProofDoc, selectedDisease)
  }

  const handleUploadData = async (token, base64ProofDoc, selectedDisease) => {
    // var proofDocUrl = ''
    // setShowLoadingModal(true)
    // setLoadingMessage('Please wait while uploading your document.')
    // await axios
    //   .post('https://univtraze.herokuapp.com/api/files/uploadUserBase64Image', {
    //     image: base64ProofDoc
    //   })
    //   .then(function (response) {
    //     proofDocUrl = response.data.results.url
    //     setLoadingMessage('Uploading profile document completed...')
    //   })
    //   .catch(function (error) {
    //     alert('Error occured while uploading your profile photo')
    //   })
    // setShowLoadingModal(false)
    // // console.log(proofDocUrl)
    // submitDataToDatabase(token, id, type, selectedDisease, proofDocUrl)
  }

  const submitDataToDatabase = async (token, id, type, disease_name, proofDocUrl) => {
    // setShowLoadingModal(true)
    // setLoadingMessage('Please wait while finalizing your report.')
    // const config = {
    //   headers: { Authorization: `Bearer ${token}` }
    // }
    // const data = {
    //   user_id: id,
    //   type: type,
    //   disease_name: disease_name,
    //   document_proof_image: proofDocUrl
    // }
    // await axios
    //   .post(
    //     `https://univtraze.herokuapp.com/api/covid_cases/addCommunicableDiseaseCase`,
    //     data,
    //     config
    //   )
    //   .then((response) => {
    //     const success = response.data.success
    //     if (success === 0) {
    //       return alert('Please try again later : ' + response.data.message)
    //     }
    //     setShowLoadingModal(false)
    //     setLoadingMessage('Submitted Successfully.')
    //     alert('Reported disease successfully')
    //     navigation.goBack()
    //   })
  }

  const onSubmit = () => {
    console.log('Submit')
  }

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
      <ScrollView contentContainerStyle={styles.scrollViewContentStyle} style={styles.scrollView}>
        <LoadingModal
          onRequestClose={() => setShowLoadingModal(false)}
          open={showLoadingModal}
          loadingMessage={loadingMessage}
        />
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={navigation.goBack}>
            <Image source={BackIcon} style={{ marginLeft: -15, width: 60, height: 60 }} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.reportCovidText}>Report a communicable disease case</Text>
        </View>

        <View style={{ paddingVertical: 5 }}>
          <Text style={styles.bodyText}>Are you a communicable disease victim?</Text>
          <Text style={styles.bodyText}>Let us know by reporting a case below</Text>
        </View>

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginVertical: 10,
            paddingVertical: 5
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 5
            }}
          >
            <RadioButton
              value='Covid-19'
              color={COLORS.PRIMARY}
              status={isChecked === 'Covid-19' ? 'checked' : 'unchecked'}
              onPress={() => {
                setIsChecked('Covid-19')
                setSelectedDisease('Covid-19')
              }}
            />
            <Text style={styles.radioLabel}>Covid-19</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 5
            }}
          >
            <RadioButton
              color={COLORS.PRIMARY}
              value='Monkey Pox'
              status={isChecked === 'Monkey Pox' ? 'checked' : 'unchecked'}
              onPress={() => {
                setIsChecked('Monkey Pox')
                setSelectedDisease('Monkey Pox')
              }}
            />
            <Text style={styles.radioLabel}>Monkey Pox</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 5
            }}
          >
            <RadioButton
              color={COLORS.PRIMARY}
              value='Tuberculosis'
              status={isChecked === 'Tuberculosis' ? 'checked' : 'unchecked'}
              onPress={() => {
                setIsChecked('Tuberculosis')
                setSelectedDisease('Tuberculosis')
              }}
            />
            <Text style={styles.radioLabel}>Tuberculosis</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 5
            }}
          >
            <RadioButton
              color={COLORS.PRIMARY}
              value='Others'
              status={isChecked === 'Others' ? 'checked' : 'unchecked'}
              onPress={() => setIsChecked('Others')}
            />
            <Text style={styles.radioLabel}>Others : </Text>
          </View>

          {isChecked === 'Others' && (
            <View
              style={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                paddingVertical: 5
              }}
            >
              <View style={{ width: '95%', justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                  defaultValue={otherDiseaseName}
                  style={styles.caseNumberInput}
                  placeholder='Disease name'
                  onChangeText={(text) => {
                    setOtherDiseaseName(text)
                  }}
                />
              </View>
            </View>
          )}
          <Text style={styles.sectionHeaderText}>Document proof </Text>
          <View
            style={[
              styles.uploadIdContainer,
              formErrors.docProofImage?.hasError && { borderColor: COLORS.RED }
            ]}
          >
            {isUploadingDocProfImage && (
              <View style={styles.uploadIdBtn}>
                <ActivityIndicator size='large' color={COLORS.PRIMARY} />
              </View>
            )}
            {!isUploadingDocProfImage && docProofImage == null ? (
              <TouchableOpacity style={styles.uploadIdBtn} onPress={pickDocumentForProof}>
                <FontAwesome5 name='id-card' size={34} color={COLORS.PRIMARY} />
              </TouchableOpacity>
            ) : (
              <Fragment>
                <AntDesign
                  name='closecircle'
                  size={24}
                  color={COLORS.PRIMARY}
                  style={styles.removePhotoBtn}
                  onPress={() => setDocProofImage(null)}
                />
                <Image
                  source={{ uri: docProofImage }}
                  resizeMode='contain'
                  style={{ width: '100%', height: '100%' }}
                />
              </Fragment>
            )}
          </View>
          {formErrors.docProofImage?.hasError && (
            <Text style={styles.errorText}>{formErrors.docProofImage.message}</Text>
          )}
        </View>
      </ScrollView>
      <View style={styles.actionBtnContainer}>
        <TouchableOpacity onPress={onSubmit} style={styles.submitBtn}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
export default ReportDiseaseScreen

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#E1F5E4'
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#E1F5E4'
  },
  scrollViewContentStyle: {
    paddingHorizontal: 30,
    paddingBottom: 20
  },
  topContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? StatusBar.currentHeight + 40 : 40
  },
  backIcon: {
    height: 60,
    width: 60,
    marginLeft: -15,
    justifyContent: 'center'
  },
  notifLogo: {
    height: '50%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
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
    width: 350,
    height: 474,
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
    height: 60,
    borderRadius: 20,
    elevation: 2,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY
  },
  topTextContainer: {
    width: '100%',
    height: 'auto',
    paddingStart: 43,
    justifyContent: 'center'
  },
  reportCovidText: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  scrllBtnsContainer: {
    width: '100%',
    height: '20%',
    flexDirection: 'row'
  },
  btnScnQr: {
    width: 150,
    height: '100%',
    marginStart: 20,
    marginEnd: 15
  },
  btnRepCovidTest: {
    width: 150,
    height: '100%',

    marginStart: 20,
    marginEnd: 15
  },
  confirmCasesCard: {
    width: 164,
    height: 86,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: 'black',
    elevation: 20,
    padding: 10
  },
  bodyText: {
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },
  radioLabel: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  sectionHeaderText: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: 18,
    paddingVertical: 15
  },
  caseNumberInput: {
    margin: 5,
    height: 50,
    width: '100%',
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 1,
    fontSize: 16,
    color: '#4d7861',
    backgroundColor: '#ffff',
    paddingLeft: 10
  },
  uploadButtonContainer: {
    alignSelf: 'flex-end'
  },
  uploadProofButton: {
    backgroundColor: '#C4C4C4',
    width: 150,
    borderRadius: 5,
    marginRight: 10
  },

  imageContainer: {
    width: '95%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    borderColor: COLORS.PRIMARY
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    paddingVertical: 15,
    shadowColor: 'black',
    elevation: 5
  },
  cancelButton: {
    marginTop: 5,
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    paddingVertical: 15,
    shadowColor: 'black',
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY
  },
  buttonText: {
    color: '#FFF',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  buttonCancelText: {
    color: COLORS.PRIMARY,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
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
  },
  removePhotoBtn: {
    top: -5,
    position: 'absolute',
    right: -5,
    zIndex: 99
  },
  actionBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    width: '100%'
  },
  submitBtn: {
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
  submitButtonText: {
    color: '#FFF',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase'
  }
})
