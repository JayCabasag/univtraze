import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import React, { useId, useState } from 'react'
import QRCode from 'react-native-qrcode-svg'
import base64 from 'base-64'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import Ionicons from 'react-native-vector-icons/Ionicons'
import GeneratedAvatar from './GeneratedAvatar'
import BottomSheet from './ui/BottomSheet'
import { useAuth } from '../services/store/auth/AuthContext'
import { useUser } from '../services/store/user/UserContext'

const Menu = ({
  visible,
  toggleBottomNavigationView,
  props: { userId, fullname, type, profileUrl },
  navigation,
  active
}) => {
  const { signOut } = useAuth()
  const { clearUser, state } = useUser()
  const [modalVisible, setModalVisible] = useState(false)
  const [dataToConvertToQr, setdataToConvertToQr] = useState('Invalid')

  const viewQrCode = () => {
    const userId = state?.user?.id ?? '';
    const userType = state?.user?.type ?? '';
    var rawData = { id: userId, type: userType }
    setdataToConvertToQr(base64.encode(JSON.stringify(rawData)))
    setModalVisible(true)
  }

  const logout = () => {
    signOut()
    clearUser()
  }

  return (
    <BottomSheet
      visible={visible}
      statusBarTranslucent
      onBackButtonPress={toggleBottomNavigationView}
      onBackdropPress={toggleBottomNavigationView}
    >
      {/*Bottom Sheet inner View*/}
      <View style={styles.bottomNavigationView}>
        <View style={{ flex: 1 }}>
          <View style={styles.profileContainer}>
            <View
              style={{
                shadowColor: 'black',
                justifyContent: 'center'
              }}
            >
              <GeneratedAvatar
                initials={'JC'}
                textStyle={{ fontSize: 30 }}
                containerStyle={{ height: 80, width: 80 }}
              />
            </View>
            <View style={{ width: '75%', padding: 10, display: 'flex', justifyContent: 'center' }}>
              <Text numberOfLines={1} style={styles.fullNameText}>
                {'Jay Cabasag'}
              </Text>
              <TouchableOpacity style={styles.viewQrBtn} onPress={viewQrCode}>
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
              statusBarTranslucent
            >
              <Pressable
                style={styles.centeredViews}
                onPress={() => setModalVisible(!modalVisible)}
              >
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
                  <Text style={{ color: 'rgba(54, 77, 57, 0.6)', textTransform: 'uppercase' }}>
                    univtraze-{state?.user?.id ?? ''}
                  </Text>
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

          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={styles.menuItemScrollView}
            contentContainerStyle={styles.menuItemContentView}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard')}
              style={[styles.menuItemBtn, styles.menuItemBtnPrimary]}
            >
              <Ionicons name='grid-outline' size={25} color={COLORS.WHITE} />
              <Text style={styles.menuItemLabel}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                toggleBottomNavigationView()
                navigation.navigate('SignUpVaccination', { type: type })
              }}
              style={[styles.menuItemBtn]}
            >
              <Ionicons name='shield-outline' size={25} color={COLORS.BLACK} />
              <Text style={[styles.menuItemLabel, styles.menuItemLabelBlack]}>
                Update vaccine information
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggleBottomNavigationView()
                navigation.navigate('TemperatureHistory', { id: userId, type: type })
              }}
              style={[styles.menuItemBtn]}
            >
              <Ionicons name='thermometer-outline' size={25} color={COLORS.BLACK} />
              <Text style={[styles.menuItemLabel, styles.menuItemLabelBlack]}>
                Temperature History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggleBottomNavigationView()
                navigation.navigate('AccountSettings', { id: userId, type: type })
              }}
              style={[styles.menuItemBtn]}
            >
              <Ionicons name='settings-outline' size={25} color={COLORS.BLACK} />
              <Text style={[styles.menuItemLabel, styles.menuItemLabelBlack]}>
                Account Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                toggleBottomNavigationView()
                navigation.navigate('RoomVisited', { id: userId, type: type })
              }}
              style={[styles.menuItemBtn]}
            >
              <Ionicons name='walk-outline' size={25} color={COLORS.BLACK} />
              <Text style={[styles.menuItemLabel, styles.menuItemLabelBlack]}>Room Visited</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => logout()} style={[styles.menuItemBtn]}>
              <Ionicons name='exit-outline' size={25} color={COLORS.RED} />
              <Text style={[styles.menuItemLabel, styles.menuItemLabelRed]}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
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
    justifyContent: 'center',
    padding: 15,
    paddingVertical: 30,
    flexDirection: 'row',
    marginTop: 10
  },
  fullNameText: {
    fontSize: 22,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  viewQrBtn: {
    width: 120,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderRadius: 50,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5
  },
  menuItemScrollView: {
    flex: 1
  },
  menuItemContentView: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    display: 'flex',
    gap: 10
  },
  menuItemBtn: {
    width: '100%',
    height: 54,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    display: 'flex',
    gap: 15
  },
  menuItemBtnPrimary: {
    backgroundColor: COLORS.PRIMARY
  },
  menuItemLabel: {
    color: 'white',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  menuItemLabelBlack: {
    color: COLORS.BLACK
  },
  menuItemLabelRed: {
    color: COLORS.RED
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
    height: '100%',
    backgroundColor: '#fff',
    width: '100%',
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
