import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal
} from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT_FAMILY } from '../../utils/app_constants'
import { AntDesign } from '@expo/vector-icons'

const SelectItem = (props) => {
  return (
    <TouchableOpacity style={[styles.itemStyle]} onPress={() => props.onSelectItem(props.label)}>
      <Text style={[styles.itemLabelStyle, props.itemLabelStyle]}>{props.label}</Text>
    </TouchableOpacity>
  )
}

const Select = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleSelectItem = (label) => {
    props.onSelectItem(label)
    setIsOpen(!isOpen)
  }

  return (
    <View style={[styles.select, props.style]}>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={[styles.carretDownButtonStyle, props.carretDownButtonStyle]}
      >
        <View style={[styles.labelContainerStyle, props.labelContainerStyle]}>
          <Text
            numberOfLines={1}
            ellipsizeMode='tail'
            style={[styles.labelStyle, props.labelStyle]}
          >
            {props.value}
          </Text>
        </View>
        <AntDesign name='caretdown' size={11} color={COLORS.TEXT_BLACK} />
      </TouchableOpacity>
      <Modal
        animationType='fade'
        transparent
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.overlay}>
            <View style={[styles.dropdownContainerStyle, props.dropdownContainerStyle]}>
              {React.Children.map(props.children, (child) =>
                React.cloneElement(child, { onSelectItem: handleSelectItem })
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export { Select, SelectItem }

const styles = StyleSheet.create({
  select: {
    position: 'relative',
    width: '100%',
    backgroundColor: COLORS.WHITE,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  carretDown: {
    height: 9,
    width: 15
  },
  labelContainerStyle: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  labelStyle: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    fontSize: 14,
    color: COLORS.PLACEHOLDER_BLACK,
    paddingLeft: 15
  },
  carretDownButtonStyle: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    flexDirection: 'row',
    paddingRight: 15
  },
  itemStyle: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    zIndex: 2
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  dropdownContainerStyle: {
    height: 'auto',
    width: '100%',
    borderRadius: 2,
    top: 50,
    elevation: 5,
    backgroundColor: COLORS.WHITE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22
  },
  itemLabelStyle: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  }
})
