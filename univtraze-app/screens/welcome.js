import { StyleSheet, Text, Image, View, ImageBackground, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import WelcomeImgBackground from '../assets/welcome-bg.png'

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={WelcomeImgBackground} resizeMode='cover' style={styles.univTrazeLogo}>
        <View style={styles.welcomeHeaderContainer}>
          <Image style={styles.image} source={require('../assets/logo-full.png')} />
          <Text style={styles.headerSubText}>University content tracing app {'\n'}makes tracing easier</Text>
        </View>

        <View
          style={{
            marginTop: 'auto',
            marginBottom: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate('signin')} style={styles.loginBtn}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('signup')} style={styles.createAnAccountButton}>
            <Text style={styles.createAnAccountText}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcomeHeaderContainer: {
    paddingTop: 10,
    marginTop: 100,
    paddingHorizontal: 30,
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  headerSubText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    color: COLORS.WHITE,
    fontSize: 12,
    marginLeft: 10
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 60,
    width: 230
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0'
  },
  univTrazeLogo: {
    width: '100%',
    height: '100%'
  },
  loginBtn: {
    marginBottom: 10,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    width: 340,
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
    fontSize: 14,
    textTransform: 'capitalize',
    textAlign: 'center',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  loginText: {
    fontWeight: 'bold',
    textAlign: 'left',
    color: COLORS.TEXT_BLACK,
    fontSize: 30,
    lineHeight: 30,
    textTransform: 'uppercase',
    marginLeft: 41,
    paddingVertical: 30
  },
  createAnAccountButton: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    width: 340,
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
  createAnAccountText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    textTransform: 'capitalize',
    textAlign: 'center',
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  }
})
