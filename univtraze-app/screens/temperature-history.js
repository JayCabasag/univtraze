import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native'
import React from 'react'
import { DataTable } from 'react-native-paper'
import moment from 'moment'
import { COLORS, FEVERISH, FONT_FAMILY } from '../utils/app_constants'
import { useAuth } from '../services/store/auth/AuthContext'
import { useUser } from '../services/store/user/UserContext'
import { genericGetRequest } from '../services/api/genericGetRequest'
import TopNavigation from '../components/TopNavigation'
import { withSafeAreaView } from '../hoc/withSafeAreaView'

const TemperatureHistoryScreen = ({ navigation }) => {
  const { state: auth } = useAuth()
  const { state: user } = useUser()
  const [temperatures, setTemperatures] = React.useState([])
  const userId = user.user.id
  const userToken = auth.userToken

  const [refreshing, setRefreshing] = React.useState(false)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    const getRoomVisited = async () => {
      try {
        const res = await genericGetRequest(`temperature-history?user_id=${userId}`, userToken)
        setTemperatures(res.results)
      } catch (error) {
        console.log('Hehhe', error)
      } finally {
        setRefreshing(false)
      }
    }
    getRoomVisited()
  }, [userId, userToken])

  let currentTemperature = 0;
  if (temperatures[0]){
    currentTemperature = temperatures[0].temperature ?? 0
  }

  return (
    <View style={styles.container}>
      <TopNavigation navigation={navigation} />
      <ScrollView
        onLayout={onRefresh}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        <View style={styles.tempContainer}>
          <Text style={styles.bodyText}>My temperature {'\n'}for today is</Text>
          <Text style={[styles.tempText, currentTemperature > FEVERISH && { color: COLORS.RED }]}>
            {temperatures?.[0] ? (temperatures[0].temperature * 1).toLocaleString() : '0.00'} &deg;C
          </Text>
        </View>

        <View style={styles.dataTableContainer}>
          <Text style={styles.tableHeaderText}>Temperature History</Text>
          <Text style={styles.temperatureInfoText}>
            The average normal body temperature is generally accepted as{' '}
            <Text style={styles.highlightedText}>98.6°F (37°C)</Text>. Some studies have shown that
            the <Text style={styles.highlightedText}>"normal"</Text> body temperature can have a
            wide range, from{' '}
            <Text style={styles.highlightedText}>97°F (36.1°C) to 99°F (37.2°C)</Text>.
          </Text>
          <DataTable style={styles.dataTableStyles}>
            <DataTable.Header style={styles.dataTableHeaderStyle}>
              <DataTable.Title>
                <Text style={styles.dataTableTitleText}>Temp</Text>
              </DataTable.Title>
              <DataTable.Title style={{ minWidth: 50 }}>
                <Text style={styles.dataTableTitleText}>Date & time</Text>
              </DataTable.Title>
            </DataTable.Header>
            {refreshing && <Text style={styles.emptyText}>Please wait...</Text>}
            {temperatures.length == 0 && !refreshing && <Text style={styles.emptyText}>Empty</Text>}
            {temperatures.length > 0 &&
              temperatures.map((temperatureHistory, index) => {
                const temperature = temperatureHistory.temperature
                return (
                  <DataTable.Row key={index}>
                    <DataTable.Cell
                      textStyle={[
                        styles.tableContentText,
                        temperature > FEVERISH && styles.tableContextFeverishText
                      ]}
                    >
                      {temperatureHistory.temperature}&deg;C
                    </DataTable.Cell>
                    <DataTable.Cell style={{ minWidth: 50 }} textStyle={styles.tableContentText}>
                      {moment
                        .utc(temperatureHistory.created_at)
                        .local()
                        .format('MMM-DD-YYYY HH:mm A')}
                    </DataTable.Cell>
                  </DataTable.Row>
                )
              })}
          </DataTable>
        </View>
      </ScrollView>
    </View>
  )
}
export default withSafeAreaView(TemperatureHistoryScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: COLORS.SECONDARY
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY
  },
  scrollViewContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SECONDARY,
    paddingBottom: 20
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
  dataTableHeaderStyle: {
    backgroundColor: COLORS.PRIMARY,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 5
  },
  dataTableTitleText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  tableContentText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    color: COLORS.BLACK
  },
  tableContextNormalText: {
    color: COLORS.PRIMARY
  },
  tableContextFeverishText: {
    color: COLORS.RED,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
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
    width: '100%'
  },
  bodyText: {
    fontFamily: FONT_FAMILY.POPPINS_REGULAR
  },
  dataTableContainer: {
    width: '100%'
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
  },
  temperatureInfoText: {
    paddingBottom: 10,
    fontFamily: FONT_FAMILY.POPPINS_EXTRA_LIGHT,
    fontSize: 12
  },
  highlightedText: {
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM,
    color: COLORS.PRIMARY
  }
})
