import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DataTable } from 'react-native-paper'
import moment from 'moment'
import BackIcon from '../assets/back-icon.png'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import { useAuth } from '../services/store/auth/AuthContext'
import { useUser } from '../services/store/user/UserContext'
import { genericGetRequest } from '../services/api/genericGetRequest'
import { useUserTemperatures } from '../services/store/user-temperature/UserTemperature'
import LoadingModal from '../components/LoadingModal'

const TemperatureHistoryScreen = ({ navigation }) => {
  const { state: auth } = useAuth()
  const { state: user } = useUser()
  const { temperatures } = useUserTemperatures()
  const [roomVisitedList, setRoomVisitedList] = useState([])
  const userId = user.user.id
  const userToken = auth.userToken

  const [refreshing, setRefreshing] = React.useState(false)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    const getRoomVisited = async () => {
      try {
        const res = await genericGetRequest(`room-visited?user_id=${userId}`, userToken)
        setRoomVisitedList(res.results)
      } catch (error) {
        console.log('Hehhe', error)
      } finally {
        setRefreshing(false)
      }
    }
    getRoomVisited()
  }, [userId, userToken])

  return (
    <ScrollView
      onLayout={onRefresh}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContainer}
    >
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Image source={BackIcon} style={{ marginLeft: -15, width: 60, height: 60 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.tempContainer}>
        <Text style={styles.bodyText}>My temperature {'\n'}for today is</Text>
        <Text style={styles.tempText}>
          {temperatures?.[0] ? (temperatures[0].temperature * 1).toLocaleString() : '0.00'} &deg;C
        </Text>
      </View>

      <View style={styles.dataTableContainer}>
        <Text style={styles.tableHeaderText}>History</Text>
        <DataTable style={styles.dataTableStyles}>
          <DataTable.Header
            style={{
              backgroundColor: COLORS.PRIMARY,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              elevation: 5
            }}
          >
            <DataTable.Title>
              <Text style={styles.dataTableTitleText}>Room Id</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.dataTableTitleText}>Temp</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.dataTableTitleText}>Date</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.dataTableTitleText}>Time</Text>
            </DataTable.Title>
          </DataTable.Header>
          {roomVisitedList.length == 0 && <Text style={styles.emptyText}>Empty</Text>}
          {roomVisitedList.length > 0 &&
            roomVisitedList.map((roomVisited) => {
              return (
                <DataTable.Row key={roomVisited.id}>
                  <DataTable.Cell>{roomVisited.room_id}</DataTable.Cell>
                  <DataTable.Cell>{roomVisited.temperature}</DataTable.Cell>
                  <DataTable.Cell>
                    {moment.utc(roomVisited.createdAt).local().format('ll')}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    {moment.utc(roomVisited.created_at).local().format('LT')}
                  </DataTable.Cell>
                </DataTable.Row>
              )
            })}
        </DataTable>
      </View>
    </ScrollView>
  )
}
export default TemperatureHistoryScreen

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY
  },
  scrollViewContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SECONDARY
  },
  topContainer: {
    paddingHorizontal: 25,
    width: '100%',
    height: 100,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? StatusBar.currentHeight + 40 : 40
  },
  backIcon: {
    height: 60,
    width: 60,
    marginLeft: -15,
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%'
  },

  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    width: 350,
    height: 'auto',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  buttons: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    elevation: 2,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY
  },
  modalButton: {
    width: 80,
    height: 60,
    borderRadius: 20,
    elevation: 2,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1
  },
  bodyContainer: {
    width: '100%',
    paddingBottom: 70
  },
  dataTableTitleText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  emptyText: {
    paddingVertical: 15,
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FONT_FAMILY.POPPINS_LIGHT
  },
  tempContainer: {
    width: '100%',
    paddingHorizontal: 30
  },
  bodyText: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },
  dataTableContainer: {
    width: '100%',
    paddingHorizontal: 30
  },
  tempText: {
    fontSize: 60,
    paddingBottom: 10,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  dataTableStyles: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.PRIMARY
  },
  tableHeaderText: {
    fontSize: 25,
    paddingBottom: 10,
    color: '#000000',
    fontWeight: '700',
    marginLeft: 0,
    marginRight: 'auto'
  }
})
