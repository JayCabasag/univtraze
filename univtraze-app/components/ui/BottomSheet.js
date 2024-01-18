import React from 'react'
import { StyleSheet, Modal, View, TouchableWithoutFeedback } from 'react-native'
// import Modal from 'react-native-modal'
import { COLORS } from '../../utils/app_constants'

const BottomSheet = ({
  children,
  visible = false,
  onBackButtonPress = () => {},
  onBackdropPress = () => {},
  statusBarTranslucent = true
}) => {
  return (
    <Modal
      statusBarTranslucent={statusBarTranslucent}
      visible={visible}
      onRequestClose={onBackButtonPress}
      animationType='fade'
      transparent
      style={styles.modalStyles}
    >
      <View style={styles.modalOverlayStyle}>
        <TouchableWithoutFeedback onPress={onBackButtonPress}>
          <View style={styles.backdropStyles} />
        </TouchableWithoutFeedback>
        <View style={styles.bottomSheetStyle}>{children}</View>
      </View>
    </Modal>
  )
}

export default BottomSheet

const styles = StyleSheet.create({
  modalStyles: {
    flex: 1
  },
  backdropStyles: {
    height: '30%',
    backgroundColor: 'transparent'
  },
  modalOverlayStyle: {
    flex: 1,
    display: 'flex',
    backgroundColor: 'rgba(250, 250, 250, .7)',
    borderColor: COLORS.BLACK
  },
  bottomSheetStyle: {
    height: '70%',
    width: '100%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30
  }
})
