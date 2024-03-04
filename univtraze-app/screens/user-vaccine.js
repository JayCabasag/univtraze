import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Platform,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import StepperIcon3 from '../assets/step-3-credentials.png'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import { useAuth } from '../services/store/auth/AuthContext'
import UserInfoWithSkipFooter from '../components/UserInfoWithSkipFooter'
import { useUser } from '../services/store/user/UserContext'
import { genericGetRequest } from '../services/api/genericGetRequest'
import VaccinationRecordCard from '../components/VaccinationRecordCard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import VaccinationRecordModal from '../components/VaccinationAddRecordModal'
import VaccinationEditRecordModal from '../components/VaccinationEditRecordModal'
import { withSafeAreaView } from '../hoc/withSafeAreaView'
import { StatusBar } from 'expo-status-bar'

const UserVaccine = ({ navigation }) => {
  const { state: auth } = useAuth()
  const { state: userState } = useUser()

  const userId = userState.user.id
  const userToken = auth.userToken

  const [vaccinationRecords, setVaccinationRecords] = useState([])
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [showVaccinationAddRecordModal, setShowVaccinationAddRecordModal] = useState(false)
  const [showVaccinationEditRecordModal, setShowVaccinationEditRecordModal] = useState(false)
  const [vaccinationRecordForEditing, setVaccinationRecordForEditing] = useState(null)
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = useCallback(() => {
    const loadVaccinationRecords = async () => {
      if (!userId || !userToken) return
      try {
        setRefreshing(true)
        const res = await genericGetRequest(`vaccination-records?userd_id=${userId}`, userToken)
        setVaccinationRecords(res.results)
      } catch (error) {
        console.log(error)
      } finally {
        setRefreshing(false)
      }
    }
    loadVaccinationRecords()
  }, [userId, userToken])

  useEffect(() => {
    onRefresh()
  }, [onRefresh])

  const handleAddNew = () => {
    setShowVaccinationAddRecordModal(true)
  }

  const skipVaccinationtion = async () => {
    navigation.navigate('index')
  }

  const onPressEditRecord = (record) => {
    setVaccinationRecordForEditing(record)
    setShowVaccinationEditRecordModal(true)
  }

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
      <VaccinationRecordModal
        onRefresh={onRefresh}
        key={`${showVaccinationAddRecordModal}-vr-modal`} // To not remember the state
        onRequestClose={() => setShowVaccinationAddRecordModal(false)}
        open={showVaccinationAddRecordModal}
      />
      {vaccinationRecordForEditing && (
        <VaccinationEditRecordModal
          onRefresh={onRefresh}
          vaccinationRecord={vaccinationRecordForEditing}
          key={`${showVaccinationEditRecordModal}-vr-edit-modal`} // To not remember the state
          onRequestClose={() => setShowVaccinationEditRecordModal(false)}
          open={showVaccinationEditRecordModal}
        />
      )}
      <View style={styles.header}>
        <Image
          source={StepperIcon3}
          resizeMode='contain'
          style={{ width: '100%', marginTop: 30 }}
        />
      </View>
      <ScrollView
        style={styles.bodyContainer}
        contentContainerStyle={styles.scrollViewContent}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.addNewBtnContainer}>
          <TouchableOpacity
            disabled={showLoadingModal}
            style={styles.addNewBtn}
            onPress={handleAddNew}
          >
            <Ionicons name='add' size={24} color={COLORS.WHITE} />
            <Text style={styles.addNewBtnText}>Add new</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>Vaccination Records</Text>
        {vaccinationRecords.length <= 0 && <Text style={styles.noRecordsText}>No Records</Text>}
        {vaccinationRecords.map((vaccinationRecord) => {
          return (
            <VaccinationRecordCard
              onRefresh={onRefresh}
              onPressEdit={() => onPressEditRecord(vaccinationRecord)}
              vaccinationRecord={vaccinationRecord}
              key={vaccinationRecord.vaccination_record_id}
            />
          )
        })}
      </ScrollView>
      <UserInfoWithSkipFooter onSkip={skipVaccinationtion} onNext={skipVaccinationtion} />
    </KeyboardAvoidingView>
  )
}

export default withSafeAreaView(UserVaccine)

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    backgroundColor: '#E1F5E4',
    flex: 1
  },
  mainContainer: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 40,
    backgroundColor: '#E1F5E4'
  },
  dateInput: {
    margin: 5,
    width: '70%',
    height: 50,
    borderColor: COLORS.PRIMARY,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 1,
    fontSize: 16,
    color: '#4d7861',
    backgroundColor: '#ffff'
  },
  header: {
    width: '100%',
    height: Platform.OS == 'ios' ? 170 : 150,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  bodyContainer: {
    flex: 1
  },
  addNewBtnContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end'
  },
  addNewBtn: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 5,
    shadowColor: COLORS.PLACEHOLDER_BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 5
  },
  addNewBtnText: {
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  headerText: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: 22
  },
  noRecordsText: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    width: '100%',
    textAlign: 'center'
  },
  scrollViewContent: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    gap: 12
  },
  label: {
    width: '100%',
    marginVertical: 15,
    fontWeight: 'bold',
    fontSize: 16
  },
  pickerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 10
  },
  input: {
    margin: 5,
    width: '100%',
    height: 50,
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 1,
    paddingLeft: 10,
    fontSize: 16,
    color: '#4d7861',
    backgroundColor: '#ffff'
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 10,
    paddingVertical: 15,
    width: 122,
    height: 'auto'
  },
  buttonText: {
    color: '#FFF',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  datePickerStyle: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: COLORS.PRIMARY,
    justifyContent: 'center'
  },
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
  buttonOpen: {
    backgroundColor: '#F194FF'
  },
  buttonClose: {
    backgroundColor: '#2196F3'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  }
})
