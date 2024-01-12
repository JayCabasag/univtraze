import React from 'react'
import Modal from 'react-native-modal'

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
      isVisible={visible}
      onBackButtonPress={onBackButtonPress}
      onBackdropPress={onBackdropPress}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      animationIn={'bounceInUp'}
      animationOut={'bounceOutDown'}
    >
      {children}
    </Modal>
  )
}

export default BottomSheet
