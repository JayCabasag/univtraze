import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONT_FAMILY, VACCINES } from '../utils/app_constants'
import CustomPicker from './ui/CustomPicker'
import CustomCalendar from './ui/CustomCalendar'

export default function VaccinationRecordModal(props) {
  const [selectedVaccine, setSelectedVaccine] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [vaccinationDate, setVaccinationDate] = useState(new Date())

  const vaccineOptions = Object.values(VACCINES).map((data, index) => ({
    id: index,
    value: data,
    label: data.toUpperCase()
  }))


  console.log({
    selectedVaccine,
    showDatePicker,
    vaccinationDate
  })

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
          <Text style={styles.vaccineInfoText}>Vaccine Information</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Vaccine name</Text>
            <CustomPicker
              prompt='Vaccine name'
              selectedValue={selectedVaccine}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedVaccine(itemValue)
              }}
              options={vaccineOptions}
              hasError={false}
            />
            <Text style={styles.label}>Vaccine Date</Text>
            <CustomCalendar
              value={vaccinationDate}
              showDatePicker={showDatePicker}
              placeholder={'Date of birth'}
              onChange={(_event, date) => {
                // This is required to cancel close when selecting date in spinner
                if (!(Platform.OS == 'ios')) {
                  setShowDatePicker(false)
                }
                setVaccinationDate(date)
              }}
              setShowDatePicker={(value) => {
                setShowDatePicker(value)
              }}
              hasError={false}
            />
          </View>
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: COLORS.RED }]}
              onPress={props.onRequestClose}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalView: {
    width: '100%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  vaccineInfoText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 16
  },
  inputContainer: {
    width: '100%',
    display: 'flex',
    gap: 2,
    marginVertical: 12
  },
  label: {
    width: '100%',
    textAlign: 'left',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    color: COLORS.TEXT_BLACK,
    marginTop: 12
  },
  modalText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.PRIMARY,
    marginTop: 15
  },
  actionBtnContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: COLORS.PLACEHOLDER_BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 5
  },
  btnText: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  }
})
