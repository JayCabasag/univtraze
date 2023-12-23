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
  ActivityIndicator
} from 'react-native'
import { RadioButton } from 'react-native-paper'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import BackIcon from '../assets/back-icon.png'
import { COLORS } from '../utils/app_constants'

const ReportDiseaseScreen = ({
  navigation,
  route: {
    params: { id, type }
  }
}) => {
  // Notifications Variables

  //end Notifications Variables
  const [isChecked, setIsChecked] = useState('')
  const [token, setToken] = useState('')

  //Variables for data
  const [proofDoc, setProofDoc] = useState(null)
  const [selectedDisease, setSelectedDisease] = useState('')
  const [otherDiseaseName, setOtherDiseaseName] = useState('')
  const [base64ProofDoc, setBase64ProofDoc] = useState('')

  //Variables for loading

  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Please wait...')

  //Error Handler variables
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const pickDocumentForProofDoc = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      quality: 1
    })

    if (!result.cancelled) {
      setProofDoc(result)
    }

    const convertedBase64Img = 'data:image/jpeg;base64,' + result.base64
    setBase64ProofDoc(convertedBase64Img)
  }

  const handleSubmitReportDisease = async () => {
    if (isChecked === '') {
      return alert('Please select a disease to report')
    }

    if (proofDoc === null) {
      return alert('Please select ad a supporting document')
    }

    if (isChecked === 'Others') {
      if (otherDiseaseName === '') {
        return alert('Please input disease name')
      }
      setSelectedDisease(otherDiseaseName)
      return handleUploadData(token, base64ProofDoc, otherDiseaseName)
    }

    handleUploadData(token, base64ProofDoc, selectedDisease)
  }

  const handleUploadData = async (token, base64ProofDoc, selectedDisease) => {
    var proofDocUrl = ''
    setShowLoadingModal(true)
    setLoadingMessage('Please wait while uploading your document.')
    await axios
      .post('https://univtraze.herokuapp.com/api/files/uploadUserBase64Image', {
        image: base64ProofDoc
      })
      .then(function (response) {
        proofDocUrl = response.data.results.url
        setLoadingMessage('Uploading profile document completed...')
      })
      .catch(function (error) {
        alert('Error occured while uploading your profile photo')
      })

    setShowLoadingModal(false)
    // console.log(proofDocUrl)
    submitDataToDatabase(token, id, type, selectedDisease, proofDocUrl)
  }

  const submitDataToDatabase = async (token, id, type, disease_name, proofDocUrl) => {
    setShowLoadingModal(true)
    setLoadingMessage('Please wait while finalizing your report.')

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const data = {
      user_id: id,
      type: type,
      disease_name: disease_name,
      document_proof_image: proofDocUrl
    }

    await axios.post(`https://univtraze.herokuapp.com/api/covid_cases/addCommunicableDiseaseCase`, data, config).then((response) => {
      const success = response.data.success

      if (success === 0) {
        return alert('Please try again later : ' + response.data.message)
      }
      setShowLoadingModal(false)
      setLoadingMessage('Submitted Successfully.')

      alert('Reported disease successfully')
      navigation.goBack()
    })
  }

  return (
    <SafeAreaView>
      <StatusBar animated={true} backgroundColor='#E1F5E4' />
      <View style={styles.container}>
        <Modal
          animationType='slide'
          transparent={true}
          visible={showLoadingModal}
          onRequestClose={() => {
            setShowLoadingModal(!showLoadingModal)
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size={'large'} />
              <Text style={styles.modalText}>{loadingMessage}</Text>
            </View>
          </View>
        </Modal>

        {/* Notification View */}
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

          {/*bottom navigation for user settings  */}

          {/*end of bottom navigation for user settings  */}

          {/* start of botton sheet for notification */}

          {/*end of botton sheet for notification */}
        </View>
        {/*End  Notification View */}
        <View style={styles.bodyContainer}>
          <View style={{ paddingVertical: 10 }}>
            <Text style={styles.reportCovidText}>Report a communicable disease case</Text>
          </View>

          <View style={{ paddingVertical: 5 }}>
            <Text style={styles.bodyText}>Are you a communicable disease victim?</Text>
            <Text style={styles.bodyText}>Let us know by reporting a case below</Text>
          </View>

          <ScrollView>
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
                  value='Others'
                  status={isChecked === 'Others' ? 'checked' : 'unchecked'}
                  onPress={() => setIsChecked('Others')}
                />
                <Text style={styles.radioLabel}>Others : </Text>
              </View>

              {isChecked === 'Others' ? (
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
              ) : null}
              <View
                style={{
                  marginTop: 'auto',
                  marginBottom: 10,
                  width: '100%',
                  height: 'auto',
                  alignSelf: 'center',
                  alignItems: 'flex-end',
                  flexDirection: 'column',
                  marginBottom: 0
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    pickDocumentForProofDoc()
                  }}
                  style={styles.uploadProofButton}
                >
                  <Text style={{ textAlign: 'center', padding: 5 }}>Upload proof here</Text>
                </TouchableOpacity>
              </View>

              {proofDoc === null ? null : (
                <View style={{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: proofDoc.uri }} resizeMode='contain' style={{ width: '95%', height: '100%' }} />
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          <View
            style={{
              marginTop: 'auto',
              marginBottom: 10,
              width: '100%',
              height: 'auto',
              alignSelf: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              marginBottom: 0
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleSubmitReportDisease()
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default ReportDiseaseScreen

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

  bodyContainer: {
    width: '100%',
    height: '80%',
    paddingBottom: 70
  },
  topTextContainer: {
    width: '100%',
    height: 'auto',
    paddingStart: 43,
    justifyContent: 'center'
  },
  reportCovidText: {
    fontSize: 28,
    fontWeight: 'bold'
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
    textAlign: 'left'
  },
  radioLabel: {},
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

    paddingVertical: 18,
    shadowColor: 'black',
    elevation: 5
  },
  cancelButton: {
    marginTop: 5,
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    paddingVertical: 18,
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
  }
})
