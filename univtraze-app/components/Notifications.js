import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import { BottomSheet } from 'react-native-btr'
import moment from 'moment'
import { COLORS } from '../utils/app_constants'

const Notifications = ({ notifVisible, toggleNotifNavigationView, props: { userId, token, notificationLists } }) => {
  return (
    <BottomSheet visible={notifVisible} onBackButtonPress={toggleNotifNavigationView} onBackdropPress={toggleNotifNavigationView}>
      {/*Bottom Sheet inner View*/}
      <View style={styles.bottomNavigationView}>
        <View style={{ width: '100%', height: '100%' }}>
          <View style={styles.notificationTextContainer}>
            <Text style={{ fontSize: 28 }}>Notifications </Text>
          </View>

          {/* <View
									style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-end',width: '80%', alignSelf: 'center'}}
								>
									<AntDesign name="leftcircleo" size={24} color={offset === 0 ? "gray" : "black"} style={{marginRight: 10}} onPress={() => {handleGoBackPage()}}/>
									<AntDesign name="rightcircleo" size={24} color="black" onPress={() => {handleNextPage()}}/>
								</View> */}

          <ScrollView
            style={{
              width: '80%',
              height: '65%',
              alignSelf: 'center',
              marginBottom: 10,
              marginTop: 5
            }}
          >
            {/* Daily self assessment   notification */}

            {notificationLists && notificationLists
              ? notificationLists.map((notification) => {
                  return (
                    <View
                      style={{
                        width: '100%',
                        height: 54,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 5,
                        alignContent: 'center'
                      }}
                      key={notification.id}
                    >
                      <Image
                        source={require('../assets/dailyAssess_icon.png')}
                        resizeMode='contain'
                        style={{
                          width: 32,
                          height: 32
                        }}
                      />
                      <View style={{ paddingLeft: 15 }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: 'black',
                            fontSize: 16,
                            fontWeight: '700',
                            width: 245
                          }}
                        >
                          {notification.notification_title}
                        </Text>
                        <Text
                          style={{
                            color: COLORS.TEXT_BLACK,
                            fontSize: 14,
                            fontWeight: '900'
                          }}
                        >
                          {moment(notification.createdAt).fromNow()}
                        </Text>
                      </View>
                    </View>
                  )
                })
              : null}

            {/* Profile updated notification */}

            {/*Active cases  notification */}
          </ScrollView>
        </View>
      </View>
    </BottomSheet>
  )
}

export default Notifications

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
  notificationTextContainer: {
    width: '100%',
    height: 75,
    padding: 15,
    marginTop: 10,
    paddingLeft: 40
  },
  image: {
    width: '90%',
    height: '90%'
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: '60%',
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
    borderWidth: 1,
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
