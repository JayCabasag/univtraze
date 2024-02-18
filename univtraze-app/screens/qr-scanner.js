import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Button,
  Modal,
  Pressable,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import base64 from 'base-64'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import { useUser } from '../services/store/user/UserContext'
import { useUserTemperatures } from '../services/store/user-temperature/UserTemperature'
import { genericPostRequest } from '../services/api/genericPostRequest'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MovingForwardImage from './../assets/moving_forward.png'
import TopNavigation from '../components/TopNavigation'

export default function QrScannerScreen({ navigation, route }) {
  const { state: user } = useUser()
  const { temperatures } = useUserTemperatures()
  const userId = user?.user?.id

  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [text, setText] = useState('Not yet scanned')
  const [roomNumber, setRoomNumber] = useState(null)
  const [buildingName, setBuildingName] = useState('')
  const [roomId, setRoomId] = useState(null)
  const [temp, setTemp] = useState('')

  // THis is for modal
  const [modalVisible, setModalVisible] = useState(false)

  const askForCameraPermission = () => {
    ;(async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission()
  }, [])

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true)
    try {
      setText(base64.decode(data))
      setRoomNumber(JSON.parse(base64.decode(data)).roomNumber)
      setBuildingName(JSON.parse(base64.decode(data)).buildingName)
      setRoomId(JSON.parse(base64.decode(data)).roomId)

      setModalVisible(true)
    } catch (error) {
      alert('Invalid qr please try again.')
    }
  }

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text>Requesting for camera permission</Text>
        </View>
      </View>
    )
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>
    )
  }

  const scanAgain = () => {
    setModalVisible(false)
    setScanned(false)
  }

  const cancelScanning = () => {
    setModalVisible(!modalVisible)
    return navigation.goBack()
  }

  const confirmScanning = async (currentRoomId) => {
    setModalVisible(!modalVisible)
    try {
      const payload = {
        user_id: userId,
        room_id: currentRoomId,
        temperature: temp
      }
      const res = await genericPostRequest('room-visited', payload)
      console.log(res)
      alert('Scanned Succesfully')
      return navigation.goBack()
    } catch (error) {
      return alert('Please try again')
    }
  }

  return (
    <View style={styles.container}>
      <TopNavigation navigation={navigation} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.closeBtnContainer}>
                <TouchableOpacity onPress={scanAgain}>
                  <Ionicons name='close' size={32} />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', flexDirection: 'column' }}>
                <Image
                  source={MovingForwardImage}
                  resizeMode='cover'
                  style={styles.modalViewImage}
                />
              </View>

              <Text style={styles.modalText}>
                Confirm visiting room {roomNumber} of {buildingName}?
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Pressable style={styles.cancelButton} onPress={cancelScanning}>
                  <Text style={styles.textStyleCancel}>Cancel</Text>
                </Pressable>

                <Pressable style={styles.confirmButton} onPress={() => confirmScanning(roomId)}>
                  <Text style={styles.textStyle}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.barCodeContainer}>
          <View style={scanned ? styles.barcodeboxScanned : styles.barcodeboxScanning}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ height: 400, width: 400 }}
            />
          </View>

          <View
            style={{
              width: '75%'
            }}
          >
            <Text style={{ fontSize: 15, paddingTop: 10 }}>Body temperature:</Text>
            <Text
              style={styles.temperatureText}
            >
               {temperatures?.[0] ? (temperatures[0].temperature * 1).toLocaleString() : '0.00'} &deg;C
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: 30
  },
  subContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: "center"
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY
  },
  scrollViewContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SECONDARY
  },
  barCodeContainer: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
    alignItems: 'center',
    marginTop: '30%'
  },
  topContainer: {
    paddingHorizontal: 25,
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
  image: {
    width: '100%',
    height: '100%'
  },

  maintext: {
    fontSize: 16,
    margin: 20
  },
  barcodeboxScanning: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato',
    borderWidth: 5,
    borderColor: 'red'
  },

  barcodeboxScanned: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato',
    borderWidth: 5,
    borderColor: COLORS.PRIMARY
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeBtnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  cancelButton: {
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    elevation: 2,
    backgroundColor: '#f5f5f5',
    marginLeft: 0,
    marginRight: 'auto'
  },
  confirmButton: {
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    elevation: 2,
    backgroundColor: COLORS.PRIMARY,
    marginLeft: 'auto',
    marginRight: 0
  },

  textStyle: {
    color: 'white',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    textAlign: 'center'
  },
  textStyleCancel: {
    color: '#364339',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    textAlign: 'center'
  },
  modalViewImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: '#EEEEEE',
    shadowColor: 'black'
  },
  modalText: {
    fontSize: 22,
    marginBottom: 45,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    color: COLORS.PRIMARY
  },
  temperatureText: {
    fontSize: 35,
    paddingBottom: 10,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    textAlign: 'center',
    color: '#4d7861'
  }
})
