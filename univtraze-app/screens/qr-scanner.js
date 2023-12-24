import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Button, Modal, Pressable, Image, StatusBar, TouchableWithoutFeedback, ImageBackground } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import base64 from 'base-64'
import axios from 'axios'
import moment from 'moment'
import BackIcon from '../assets/back-icon.png'
import { COLORS } from '../utils/app_constants'

export default function QrScannerScreen({ navigation, route }) {
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
    handleGetUserTemperature()
  }, [])

  const handleGetUserTemperature = async () => {
    const currentUserId = route.params.id
    const token = route.params.token

    let initialDateToday = new Date()
    let finalDateToday = moment(initialDateToday).format('YYYY-MM-DD')

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const data = {
      user_id: currentUserId,
      dateToday: finalDateToday
    }

    await axios.post(`https://univtraze.herokuapp.com/api/rooms/userTodaysTemperature`, data, config).then((response) => {
      const success = response.data.success

      if (success === 0 && response.data.data === 'Not set') {
        return setTemp('Not set')
      }

      if (success === 0) {
        return setTemp('Not set')
      }

      if (success === 1) {
        //setTemp(response.data.data.temperature)
        if (response.data.data === undefined) {
          return setTemp('Not set')
        }

        if (
          response.data.data.temperature === undefined ||
          response.data.data.temperature === null ||
          response.data.data.temperature === ''
        ) {
          return setTemp('Not set')
        }

        setTemp(response.data.data.temperature)
      }
    })
  }

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
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
        <Text>Requesting for camera permission</Text>
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

  const cancelScanning = () => {
    setModalVisible(!modalVisible)
    return navigation.goBack()
  }

  const confirmScanning = async (currentRoomId) => {
    setModalVisible(!modalVisible)
    const currentUserType = route.params.type
    const currentUserId = route.params.id
    const token = route.params.token

    //Axios data starts here to add the room visited
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    const data = {
      user_id: currentUserId,
      room_id: currentRoomId,
      temp: temp
    }

    await axios.post(`https://univtraze.herokuapp.com/api/rooms/addVisitedRoom`, data, config).then((response) => {
      const success = response.data.success

      if (success === 0) {
        return alert('Please try again')
      }
      alert('Scanned Succesfully')
      return navigation.goBack()
    })

    //Axios data here to add a notification
  }

  return (
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

        {/*bottom navigation for user settings  */}

        {/*end of bottom navigation for user settings  */}

        {/* start of botton sheet for notification */}

        {/*end of botton sheet for notification */}
      </View>

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
            <Pressable
              onPress={() => {
                setModalVisible(false), setScanned(false)
              }}
            >
              <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
                <Image
                  source={{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/univtrazeapp.appspot.com/o/icons8-close-30.png?alt=media&token=a98c28bd-4319-479e-a085-cfc119f4974f'
                  }}
                  resizeMode='cover'
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 100,
                    borderColor: '#EEEEEE',
                    shadowColor: 'black'
                  }}
                />
              </View>
            </Pressable>
            <View style={{ alignItems: 'center', flexDirection: 'column' }}>
              <Image
                source={{
                  uri: 'https://media.istockphoto.com/vectors/door-icon-logo-isolated-on-white-background-vector-id1186732582?k=20&m=1186732582&s=612x612&w=0&h=gyg9mDl4WxlJ-vsiwFS_GoNktffrpWO8dk9DAmNK3ds='
                }}
                resizeMode='cover'
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 100,
                  borderColor: '#EEEEEE',
                  shadowColor: 'black'
                }}
              />
            </View>

            <Text style={styles.modalText}>
              Confirm visiting room {roomNumber} of {buildingName}?
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Pressable style={styles.cancelButton} onPress={() => cancelScanning()}>
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
          <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={{ height: 400, width: 400 }} />
        </View>

        <View
          style={{
            width: '75%'
          }}
        >
          <Text style={{ fontSize: 15, paddingTop: 10 }}>Body temperature:</Text>
          <Text style={{ fontSize: 35, paddingBottom: 10, textAlign: 'center', color: '#4d7861' }}>
            {temp === '' || temp === 'Not set' ? 'Not set' : temp + '°C'}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1F5E4',
    paddingHorizontal: 40,
    height: '100%'
  },

  barCodeContainer: {
    flex: 1,
    backgroundColor: '#E1F5E4',
    alignItems: 'center',
    marginTop: '30%'
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
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
    textAlign: 'center'
  },
  textStyleCancel: {
    color: '#364339',
    textAlign: 'center'
  },

  modalText: {
    fontSize: 22,
    marginBottom: 45,
    textAlign: 'center'
  }
})
