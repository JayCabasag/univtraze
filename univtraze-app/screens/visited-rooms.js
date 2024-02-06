import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl
} from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { DataTable } from 'react-native-paper'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import TopNavigation from '../components/TopNavigation'
import { useAuth } from '../services/store/auth/AuthContext'
import { useUser } from '../services/store/user/UserContext'
import { genericGetRequest } from '../services/api/genericGetRequest'

const VisitedRoomsScreen = ({ navigation }) => {
  const { state: auth } = useAuth()
  const { state: user } = useUser()
  const userId = user.user.id
  const userToken = auth.userToken

  const [visitedRooms, setVisitedRooms] = useState([])
  const [refreshing, setRefreshing] = React.useState(false)
    const onRefresh = React.useCallback(() => {
    const getRoomVisited = async () => {
      try {
        setRefreshing(true)
        const res = await genericGetRequest(`room-visited?user_id=${userId}`, userToken)
        console.log("Helloooo",res.results)
        setVisitedRooms(res.results)
      } catch (error) {
        console.log('Hehhe', error)
      } finally {
        setRefreshing(false)
      }
    }
    getRoomVisited()
  }, [userId, userToken])

  return (
    <View style={styles.container} onLayout={onRefresh}>
      <TopNavigation navigation={navigation}/>
         <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
         style={styles.tableContainer}>
         <View style={styles.roomDetailsContainer}>
          <Text style={styles.bodyText}>Latest visited room is</Text>
          <Text style={styles.roomDeteilsText}>
            {"Bldg 1,\nRoom 404"}
          </Text>
        </View>
         <Text style={styles.tableHeaderText}>History</Text>
         <DataTable
          style={styles.dataTableStyles}
        >
          <DataTable.Header style={styles.dataTableHeader}>
            <DataTable.Title>
              <Text style={styles.dataTableTitleText}>Bldg</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.dataTableTitleText}>Room no.</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.dataTableTitleText}>Date</Text>
            </DataTable.Title>
            <DataTable.Title>
              <Text style={styles.dataTableTitleText}>Time</Text>
            </DataTable.Title>
          </DataTable.Header>
          {visitedRooms.length <= 0 && (
            <Text style={styles.emptyText}>No rooms visited</Text>
          )}
          {visitedRooms.length > 0 && visitedRooms.map((room) => {
              return (
                <DataTable.Row key={room.id}>
                  <DataTable.Cell>{room.id}</DataTable.Cell>
                  <DataTable.Cell>{room.building_name}</DataTable.Cell>
                  <DataTable.Cell>{room.room_number}</DataTable.Cell>
                  <DataTable.Cell>{moment(room.createdAt).format('mm-DD-YYYY')}</DataTable.Cell>
                  <DataTable.Cell>{moment(room.createdAt).format('HH:mm A')}</DataTable.Cell>
                </DataTable.Row>
              )
            })}
        </DataTable>
      </ScrollView>
    </View>
  )
}

export default VisitedRoomsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: 30
  },
  tableHeaderText: {
    fontSize: 25,
    paddingBottom: 10,
    color: '#000000',
    fontWeight: '700',
    marginLeft: 0,
    marginRight: 'auto'
  },
  tableSubHeaderText: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    paddingVertical: 10
  },
  roomDetailsContainer: {
    width: '100%'
  },
  bodyText: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },
  dataTableContainer: {
    width: '100%'
  },
  roomDeteilsText: {
    fontSize: 35,
    marginTop: 10,
    lineHeight: 43,
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  dataTableStyles: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.PRIMARY
  },
  dataTableHeader: {
    backgroundColor: COLORS.PRIMARY,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 5
  },
  dataTableTitleText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 15
  }
})