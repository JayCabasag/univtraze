import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

export default function LoadingModal(props) {
  return (
    <Modal
      animationType={props.animationType ?? 'slide'}
      transparent={props.transparent ?? true}
      visible={props.open}
      statusBarTranslucent
      onRequestClose={props.onRequestClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size={'large'} />
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
    marginBottom: 15,
    textAlign: 'center',
    color: '#4d7861',
    marginTop: 15
  }
})
