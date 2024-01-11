import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  Modal,
  TouchableWithoutFeedback
} from 'react-native'
import React, { Fragment, useRef, useState } from 'react'
import { COLORS, FONT_FAMILY } from '../../utils/app_constants'
import DateTimePicker from '@react-native-community/datetimepicker'
import { AntDesign } from '@expo/vector-icons'
import moment from 'moment'

export default function CustomCalendar(props) {
  return (
    <View
      style={[
        styles.inputWrapperStyle,
        props.inputWrapperStyle,
        props.hasError && styles.inputError
      ]}
    >
      {Platform.OS == 'ios' ? (
        <Fragment>
          <TextInput
            placeholder={props?.placeholder ?? ''}
            value={moment(props?.value ?? new Date()).format('MMM DD, yyyy')}
            style={[styles.inputStyle, props.inputStyle]}
            editable={false}
          />
          <AntDesign
            name='calendar'
            size={24}
            color={COLORS.PRIMARY}
            style={styles.calendarIconStyle}
            onPress={() => props.setShowDatePicker(true)}
          />
          {props.showDatePicker && (
            <Modal
              visible={props.showDatePicker}
              transparent
              onRequestClose={() => props.setShowDatePicker(false)}
              statusBarTranslucent
            >
              <View style={styles.centeredView}>
                <TouchableWithoutFeedback onPress={() => props.setShowDatePicker(false)}>
                  <View style={styles.modalOverylayStyle}></View>
                </TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <View style={[styles.promptContainerStyle, props.promptContainerStyle]}>
                    <Text style={[styles.iosPromptStyle]}>Calendar</Text>
                  </View>
                  <DateTimePicker
                    maximumDate={new Date()}
                    value={props?.value ?? new Date()}
                    mode={'date'}
                    display='spinner'
                    accentColor={COLORS.PRIMARY}
                    is24Hour={true}
                    onChange={(event, date) => {
                      props.onChange(event, date)
                    }}
                  />
                </View>
              </View>
            </Modal>
          )}
        </Fragment>
      ) : (
        <Fragment>
          <TextInput
            placeholder={props?.placeholder ?? ''}
            value={moment(props?.value ?? new Date()).format('MMM DD, yyyy')}
            style={[styles.inputStyle, props.inputStyle]}
            editable={false}
          />
          <AntDesign
            name='calendar'
            size={24}
            color={COLORS.PRIMARY}
            style={styles.calendarIconStyle}
            onPress={() => props.setShowDatePicker(true)}
          />
          {props.showDatePicker && (
            <DateTimePicker
              value={props?.value ?? new Date()}
              mode={'date'}
              maximumDate={new Date()}
              accentColor={COLORS.PRIMARY}
              is24Hour={true}
              onChange={(event, date) => {
                props.onChange(event, date)
              }}
            />
          )}
        </Fragment>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  inputWrapperStyle: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: 15
  },
  inputStyle: {
    flex: 1,
    height: 50,
    borderColor: COLORS.PRIMARY,
    borderRadius: 5,
    overflow: 'hidden',
    paddingVertical: 1,
    fontSize: 16,
    color: '#4d7861',
    backgroundColor: '#ffff'
  },
  inputError: {
    borderColor: COLORS.RED
  },
  iosDatePickerStyle: {
    backgroundColor: 'transparent'
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
    backgroundColor: COLORS.WHITE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    }
  }
})
