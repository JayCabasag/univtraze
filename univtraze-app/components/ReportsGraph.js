import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native'
import React from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import { LineChart } from 'react-native-chart-kit'

export default function ReportsGraph({ loading = true, data = []}) {
  const diseaseNames = data.map((disease) => disease.disease_name)
  const totalCases = data.map((disease) => disease.total_cases)

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={COLORS.PRIMARY}></ActivityIndicator>
      </View>
    )
  }

  if (data.length <= 0 ) {
    return (
      <View style={styles.container}>
        <Text>No Records found</Text>
      </View>
    )
  }

  return (
    <View>
      <LineChart
        data={{
          labels: diseaseNames.slice(0, 5),
          datasets: [
            {
              data: totalCases.slice(0, 5)
            }
          ]
        }}
        width={Dimensions.get('window').width - 50} // from react-native
        height={240}
        decorator={() => {
          return (
            <View style={styles.graphLabel}>
              <Text style={styles.graphLabelText}>Overall Reported Cases</Text>
            </View>
          )
        }}
        horizontalLabelRotation={-40}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: COLORS.SECONDARY,
          backgroundGradientFrom: COLORS.PRIMARY,
          backgroundGradientTo: COLORS.DARK_GREEN,
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: COLORS.WHITE
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30
  },
  graphLabel: {
    left: -160,
    top: 15
  },
  graphLabelText: { color: COLORS.WHITE, transform: [{ rotate: '-90deg' }] }
})
