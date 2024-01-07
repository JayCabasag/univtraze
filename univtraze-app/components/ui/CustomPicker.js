import { View, Text, StyleSheet, Platform, TouchableWithoutFeedback, Modal } from 'react-native'
import React, { Fragment, useMemo, useRef, useState } from 'react'
import { COLORS, FONT_FAMILY } from '../../utils/app_constants'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Picker } from '@react-native-picker/picker'

export default function CustomPicker(props) {
  const pickerRef = useRef()
  const [iosPickerShow, setIosPickerShow] = useState(false)

  const ioSelectedValueLabel = useMemo(() => {
    const selectedValue = (props?.options ?? []).find(
      (option) => option.value == props.selectedValue
    )
    return selectedValue?.label ?? ''
  }, [props.selectedValue])

  return (
    <View
      style={[
        styles.containerStyle,
        props.containerStyle,
        props?.hasError && styles.errorPickerStyle
      ]}
    >
      {Platform.OS == 'ios' ? (
        <Fragment>
          <TouchableWithoutFeedback onPress={() => setIosPickerShow(!iosPickerShow)}>
            <View style={[styles.inputContainerStyle, props.inputContainerStyle]}>
              <Text numberOfLines={1} style={[styles.labelStyle]}>
                {ioSelectedValueLabel ?? ''}
              </Text>
              <Ionicons size={props.iconSize ?? 16} name='caret-down' />
            </View>
          </TouchableWithoutFeedback>
          <Modal
            visible={iosPickerShow}
            transparent
            onRequestClose={() => setIosPickerShow(false)}
            statusBarTranslucent
          >
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback onPress={() => setIosPickerShow(false)}>
                <View style={styles.modalOverylayStyle}></View>
              </TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View style={[styles.promptContainerStyle, props.promptContainerStyle]}>
                  <Text style={[styles.iosPromptStyle]}>{props?.prompt ?? ''}</Text>
                </View>
                <Picker
                  ref={pickerRef}
                  style={[styles.iosPickerStyle, props.iosPickerStyle]}
                  selectedValue={props.selectedValue}
                  onValueChange={(itemValue, itemIndex) =>
                    props.onValueChange(itemValue, itemIndex)
                  }
                >
                  {props.options.map((option, index) => {
                    return (
                      <Picker.Item
                        style={[styles.pickerItemStyle, props.pickerItemStyle]}
                        key={index}
                        label={option?.label ?? ''}
                        value={option.value}
                      />
                    )
                  })}
                </Picker>
              </View>
            </View>
          </Modal>
        </Fragment>
      ) : (
        <Picker
          prompt={props?.prompt ?? ''}
          ref={pickerRef}
          style={[styles.androidPickerStyle, props.androidPickerStyle]}
          selectedValue={props.selectedValue}
          onValueChange={(itemValue, itemIndex) => props.onValueChange(itemValue, itemIndex)}
        >
          {props.options.map((option, index) => {
            return (
              <Picker.Item
                style={[styles.pickerItemStyle, props.pickerItemStyle]}
                key={index}
                label={option?.label ?? ''}
                value={option.value}
              />
            )
          })}
        </Picker>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    height: 55,
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    marginTop: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE
  },
  inputContainerStyle: {
    backgroundColor: COLORS.WHITE,
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  errorPickerStyle: {
    borderColor: COLORS.RED
  },
  labelStyle: {
    flex: 1,
    fontSize: 14,
    color: '#4d7861',
    backgroundColor: '#ffff',
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },
  androidPickerStyle: {
    width: '100%',
    backgroundColor: COLORS.WHITE,
    color: '#4d7861'
  },
  iosPickerStyle: {
    width: '100%',
    backgroundColor: COLORS.WHITE,
    color: '#4d7861',
    paddingBottom: 20
  },
  promptContainerStyle: {
    backgroundColor: COLORS.WHITE,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15
  },
  iosPromptStyle: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 16
  },
  modalOverylayStyle: {
    flex: 1
  },
  centeredView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  modalView: {
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  pickerItemStyle: {
    width: '100%',
    backgroundColor: COLORS.WHITE,
    color: '#4d7861'
  }
})
