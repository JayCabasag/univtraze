import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'

export default function LoadingModal(props) {
  return (
    <Modal
      animationType={props.animationType ?? 'fade'}
      transparent={props.transparent ?? true}
      visible={props.open}
      statusBarTranslucent
      onRequestClose={props.onRequestClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size={'large'} color={COLORS.PRIMARY} />
          <Text style={styles.modalText}>{props.loadingMessage}</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: 'rgba(250, 250, 250, .7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  modalText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.PRIMARY,
    marginTop: 15
  }
})
