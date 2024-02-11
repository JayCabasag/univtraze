import CirclesIcon from '../assets/circles.png'
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'

const DiseaseReportCard = ({ total = 0, label }) => {
  return (
    <TouchableWithoutFeedback style={styles.cardContainer}>
      <View style={styles.card}>
        <Image source={CirclesIcon} style={styles.circleStyles} />
        <View style={styles.mainLabelStyles}>
          <Text style={styles.confirmedText}>{label}</Text>
          <Text style={styles.totalTextLabel}>{total}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default DiseaseReportCard

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.PLACEHOLDER_BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 20
  },
  circleStyles: {
    display: 'flex',
    height: 50,
    width: 60,
    marginLeft: 'auto',
    marginRight: 0
  },
  mainLabelStyles: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    fontFamily: FONT_FAMILY.POPPINS_MEDIUM
  },
  card: {
    flex: 1,
    height: 75,
    backgroundColor: COLORS.WHITE,
    borderRadius: 15,
    overflow: 'hidden'
  },
  totalTextLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    paddingHorizontal: 15,
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD
  },
  confirmedText: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  confirmCasesCard: {
    flex: 1,
    height: 86,
    display: 'flex',
    gap: 10,
    borderRadius: 20,
    shadowColor: 'black',
    paddingLeft: 20,
    paddingTop: 10
  }
})
