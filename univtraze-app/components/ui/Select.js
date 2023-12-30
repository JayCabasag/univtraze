import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT_FAMILY } from '../../utils/app_constants'
import CarretDown from '../../assets/carret-down.png'

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
    props.onToggleDropdown()
  }

  return (
    <View style={[styles.select, props.style]}>
      <View style={[styles.labelContainerStyle, props.labelContainerStyle]}>
        <Text style={[styles.labelStyle, props.labelStyle]}>{props.value}</Text>
      </View>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={[styles.carretDownButtonStyle, props.carretDownButtonStyle]}
      >
        <Image source={CarretDown} style={[styles.carretDown, styles.icon]} />
      </TouchableOpacity>
      {isOpen && (
        <View style={[styles.dropdownContainerStyle, props.dropdownContainerStyle]}>
          {React.Children.map(props.children, (child) =>
            React.cloneElement(child, { onSelectItem: handleSelectItem })
          )}
        </View>
      )}
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  itemStyle: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    zIndex: 2
  },
  dropdownContainerStyle: {
    flex: 1,
    position: 'absolute',
    height: 'auto',
    width: '100%',
    borderRadius: 10,
    top: 50,
    elevation: 5,
    backgroundColor: COLORS.WHITE
  },
  itemLabelStyle: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  }
})
