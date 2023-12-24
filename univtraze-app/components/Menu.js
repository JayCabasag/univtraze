import { StyleSheet, Text, View, Pressable, Image, Modal, TouchableOpacity } from 'react-native'
import { BottomSheet } from 'react-native-btr'
import React, { useState, useEffect } from 'react'
import QRCode from 'react-native-qrcode-svg'
import base64 from 'base-64'
import * as SecureStore from 'expo-secure-store'
import { useToast } from 'react-native-toast-notifications'
import { COLORS } from '../utils/app_constants'

const Menu = ({ visible, toggleBottomNavigationView, props: { userId, fullname, type, profileUrl }, navigation, active }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [dataToConvertToQr, setdataToConvertToQr] = useState('Invalid')

  const toast = useToast()

  const viewQrCode = (currentUserId, currentUserType) => {
    var rawData = { id: currentUserId, type: currentUserType, name: fullname }
    setdataToConvertToQr(base64.encode(JSON.stringify(rawData)))

    setModalVisible(true)
  }

  async function clear(key, value) {
    await SecureStore.deleteItemAsync(key, value)
  }

  const logout = async () => {
    await clear('x-token')
    toast.show('Logged out successfully...', {
      type: 'normal',
      placement: 'bottom',
      duration: 2000,
      offset: 30,
      animationType: 'slide-in'
    })
    navigation.navigate('signin')
  }

  return (
    <BottomSheet visible={visible} onBackButtonPress={toggleBottomNavigationView} onBackdropPress={toggleBottomNavigationView}>
      {/*Bottom Sheet inner View*/}
      <View style={styles.bottomNavigationView}>
        <View style={{ width: '100%', height: '100%' }}>
          <View style={styles.profileContainer}>
            <View
              style={{
                shadowColor: 'black',
                marginStart: 40,
                justifyContent: 'center'
              }}
            >
              <Image
                source={{ uri: profileUrl }}
                resizeMode='cover'
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 100,
                  borderColor: '#EEEEEE',
                  borderWidth: 2,
                  shadowColor: 'black'
                }}
              />
            </View>
            <View style={{ width: '75%', padding: 10 }}>
              <Text numberOfLines={1} style={{ fontSize: 22, fontWeight: 'bold' }}>
                {fullname}
              </Text>

              <TouchableOpacity
                style={{
                  width: 120,
                  height: 'auto',
                  borderWidth: 2,
                  borderColor: COLORS.PRIMARY,
                  borderRadius: 50,
                  padding: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 5
                }}
                onPress={() => viewQrCode(userId, type)}
              >
                <Text style={{ color: COLORS.PRIMARY, fontWeight: 'bold' }}> View QR Code</Text>
              </TouchableOpacity>
            </View>
            <Modal
              animationType='fade'
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible)
              }}
            >
              {/* POP-UP MODAL VIEW */}
              <Pressable style={styles.centeredViews} onPress={() => setModalVisible(!modalVisible)}>
                <View style={styles.modalView}>
                  <Text
                    style={{
                      fontSize: 28,
                      color: COLORS.PRIMARY,
                      fontWeight: 'bold'
                    }}
                  >
                    UnivTraze
                  </Text>

                  {/* QR Container */}
                  <View
                    style={{
                      width: 210,
                      height: 210,
                      borderWidth: 2,
                      borderColor: COLORS.PRIMARY,
                      borderRadius: 20,
                      marginTop: 5,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <QRCode value={dataToConvertToQr} size={160} />
                  </View>

                  {/* QR Code */}
                  <Text style={{ color: 'rgba(54, 77, 57, 0.6)', textTransform: 'uppercase' }}>univtraze-{userId}</Text>
                  {/* User Name */}

                  <Text style={{ fontSize: 28, marginTop: 10 }}>{fullname}</Text>

                  {/* User Type */}

                  <Text
                    style={{
                      fontSize: 16,
                      color: 'rgba(54, 77, 57, 0.6)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {type}
                  </Text>

                  {/* Download QR */}
                  {/* <Pressable
													style={[styles.buttons]}
													// onPress={() => setModalVisible(!modalVisible)}
												>
													<Text
														style={{
															color: "white",
															fontSize: 16,
															fontWeight: "700",
														}}
													>
														Download QR
													</Text>
												</Pressable> */}
                </View>
              </Pressable>
            </Modal>
          </View>

          <View style={styles.menuListContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Dashboard')
              }}
              style={{
                width: '100%',
                height: 54,
                backgroundColor: COLORS.PRIMARY,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Image
                source={require('../assets/menuhome_icon.png')}
                resizeMode='contain'
                style={{
                  width: 15,
                  height: 15,
                  marginStart: 20,
                  marginEnd: 20
                }}
              />
              <Text style={{ color: 'white' }}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                toggleBottomNavigationView()

                navigation.navigate('SignUpVaccination', { type: type })
              }}
              style={{
                width: '100%',
                height: 54,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Image
                source={require('../assets/updateinfo_icon.png')}
                resizeMode='contain'
                style={{
                  width: 15,
                  height: 15,
                  marginStart: 20,
                  marginEnd: 20
                }}
              />
              <Text>Update Vaccine information</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggleBottomNavigationView()
                navigation.navigate('TemperatureHistory', { id: userId, type: type })
              }}
              style={{
                width: '100%',
                height: 54,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Image
                source={require('../assets/temp_history.png')}
                resizeMode='contain'
                style={{
                  width: 17,
                  height: 20,
                  marginStart: 20,
                  marginEnd: 20
                }}
              />
              <Text>Temperature History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggleBottomNavigationView()
                navigation.navigate('AccountSettings', { id: userId, type: type })
              }}
              style={{
                width: '100%',
                height: 54,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Image
                source={require('../assets/accountsetting_icon.png')}
                resizeMode='contain'
                style={{
                  width: 15,
                  height: 15,
                  marginStart: 20,
                  marginEnd: 20
                }}
              />
              <Text>Account settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggleBottomNavigationView()
                navigation.navigate('RoomVisited', { id: userId, type: type })
              }}
              style={{
                width: '100%',
                height: 54,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Image
                source={require('../assets/room_enter.png')}
                resizeMode='contain'
                style={{
                  width: 17,
                  height: 20,
                  marginStart: 20,
                  marginEnd: 20
                }}
              />
              <Text>Room Visited</Text>
            </TouchableOpacity>

            <View
              style={{
                width: '100%',
                height: 54,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <TouchableOpacity onPress={() => logout()} style={{ flexDirection: 'row', width: '100%' }}>
                <Image
                  source={require('../assets/logout_icon.png')}
                  resizeMode='contain'
                  style={{
                    width: 15,
                    height: 15,
                    marginStart: 20,
                    marginEnd: 20
                  }}
                />
                <Text>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </BottomSheet>
  )
}

export default Menu

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1F5E4',
    height: '100%'
  },
  topContainer: {
    zIndex: 1,
    width: '100%',
    height: '15%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40
  },
  profileContainer: {
    width: '100%',
    height: '25%',
    justifyContent: 'center',
    padding: 15,
    flexDirection: 'row',
    marginTop: 10
  },
  menuListContainer: {
    width: '80%',
    height: '65%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignSelf: 'center'
  },
  menuLogo: {
    height: '50%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  notifLogo: {
    height: '50%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '90%',
    height: '90%'
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  centeredViews: {
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
    height: 420,
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
  // body style
  bodyContainer: {
    width: 'auto',
    height: '100%',
    marginBottom: 50,
    marginHorizontal: 48
  },
  formContainer: {
    width: 'auto',
    height: '90%'
  },
  input: {
    height: 40,
    borderRadius: 10,
    borderColor: '#28CD4199',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderColor: COLORS.PRIMARY,
    borderWidth: 1
  },
  inputss: {
    height: 120,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#28CD4199',
    backgroundColor: '#FFFFFF',
    padding: 10,
    justifyContent: 'flex-start',
    textAlignVertical: 'top'
  }
})
