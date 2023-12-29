import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import BackIcon from '../assets/back-icon.png'
import { COLORS } from '../utils/app_constants'

export default function UserInformationFooter(props) {
  return (
    <View style={styles.actionBtnContainer}>
        <TouchableOpacity onPress={props.onGoBack} style={styles.backbutton}>
        <Image source={BackIcon} style={{marginLeft: -15 , width: 60, height: 60 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={props.onNext} style={styles.nextButton}>
        <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    actionBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30
      },
      backbutton: {
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center'
      },
      nextButton: {
        marginBottom: 10,
        backgroundColor: COLORS.PRIMARY,
        padding: 10,
        borderRadius: 10,
        width: '100%',
        maxWidth: 140,
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
})