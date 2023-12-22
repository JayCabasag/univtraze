import { StyleSheet, Text, Image, View, ImageBackground, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeScreen = ({ navigation }) => {
  const image = {
    uri: 'https://firebasestorage.googleapis.com/v0/b/tcuhub-cf9e1.appspot.com/o/images%2Fbackground%20image.png?alt=media&token=707b9706-c43e-48ed-a859-07e786939a81'
  }
  const uniTrazeLogo = {
    uri: 'https://firebasestorage.googleapis.com/v0/b/tcuhub-cf9e1.appspot.com/o/images%2Flogo-light.png?alt=media&token=9417a00a-2c1d-4091-8923-59dab5e286b1'
  }

  return (
    <View style={styles.container}>
      <StatusBar animated={true} backgroundColor='#28CD41' />
      <ImageBackground source={image} resizeMode='cover' style={styles.univTrazeLogo}>
        <View style={{ width: '80%', height: 45, marginTop: '35%' }}>
          <Image style={styles.image} source={uniTrazeLogo} resizeMode='contain' />
        </View>

        <View style={{ paddingTop: 10, marginLeft: 30 }}>
          <Text style={{ color: '#ffff', fontSize: 16 }}>University content tracing app {'\n'} makes tracing easier</Text>
        </View>

        <View
          style={{
            marginTop: 'auto',
            marginBottom: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.createAnAccountButton}>
            <Text style={styles.createAnAccountText}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    flex: 1,
    justifyContent: 'center'
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
  button: {
    marginBottom: 10,
    backgroundColor: '#28CD41',
    padding: 10,
    borderRadius: 10,
    width: 340,
    marginTop: 5,
    paddingVertical: 18,
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
    textAlign: 'center'
  },
  loginText: {
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#364D39',
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
    paddingVertical: 18,
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
    color: '#28CD41',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  }
})
