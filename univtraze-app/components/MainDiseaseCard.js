import { View, Text, StyleSheet, Image, Platform } from 'react-native'
import React from 'react'
import { COLORS, FONT_FAMILY } from '../utils/app_constants'
import VirusIcon from '../assets/virus.png'
import ProgressBar from './ProgressBar'

export default function MainDiseaseCard({ top = false, data }) {
  const name = data?.disease_name ?? ''
  const diseaseLabel = data?.disease_category ?? 'Communicable'
  const totalRecovered = data?.resolved_cases ?? 0
  const totalActive = data?.active_cases ?? 0
  const recoveredPercentage = (totalRecovered / totalActive) * 100
  return (
    <View style={[styles.cardContainerStyles, top && styles.cardContainerActiveStyles]}>
      <View style={styles.cardStyles}>
        <View style={styles.virusContainetStyles}>
          <Image source={VirusIcon} style={styles.virusStyles} />
          <Image source={VirusIcon} style={styles.virus1Styles} />
          <Image source={VirusIcon} style={styles.virus2Styles} />
        </View>
        <Text style={styles.cardHeaderTextStyle}>{name}</Text>
        <Text style={styles.recoveredPercentageText}>{recoveredPercentage}% Recovered</Text>
        <ProgressBar
          value={recoveredPercentage}
          progressBarContainerStyles={styles.progressBarContainerStyles}
        />
        <View style={styles.victimDetailsContainer}>
          <View style={styles.textDetailsContainer}>
            <Text style={styles.headerTextDetailsStyles}>{totalRecovered}</Text>
            <Text style={styles.subHeaderTextDetailsStyles}>Recovered</Text>
          </View>
          <View style={styles.textDetailsContainer}>
            <Text style={styles.headerTextDetailsRedStyles}>{totalActive}</Text>
            <Text style={styles.subHeaderTextDetailsRedStyles}>Active cases</Text>
          </View>
        </View>
        {/* <View style={styles.subDetailsStyles}>
          <View style={styles.diseaseIndicator}></View>
          <Text style={styles.diseaseLabelStyle}>{diseaseLabel}</Text>
        </View> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  virusContainetStyles: {
    position: 'absolute',
    left: 'auto',
    right: -7,
    top: -10
  },
  virusStyles: {
    height: 60,
    width: 60
  },
  virus1Styles: {
    height: 15,
    width: 15
  },
  virus2Styles: {
    height: 30,
    width: 30,
    top: -20,
    right: -40
  },
  progressBarContainerStyles: {
    marginTop: 10
  },
  cardContainerStyles: {
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    elevation: 5,
    shadowColor: COLORS.PLACEHOLDER_BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 5
  },
  cardContainerActiveStyles: {
    backgroundColor: COLORS.PRIMARY
  },
  cardStyles: {
    width: '100%',
    height: 'auto',
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    overflow: 'hidden'
  },
  cardHeaderTextStyle: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    fontSize: 18,
    paddingHorizontal: 15,
    paddingTop: 15,
    color: COLORS.SHADED_BLACK,
    textTransform: 'capitalize'
  },
  recoveredPercentageText: {
    marginTop: 5,
    marginBottom: -10,
    fontSize: 12,
    fontFamily: FONT_FAMILY.POPPINS_REGULAR,
    paddingHorizontal: 15,
    color: COLORS.GRAY,
    width: '100%',
    textAlign: 'left'
  },
  victimDetailsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 15,
    marginTop: 10,
    marginBottom: 20
  },
  headerTextDetailsStyles: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    color: COLORS.PRIMARY,
    fontSize: 20,
    marginBottom: Platform.OS == 'ios' ? -2 : -6
  },
  subHeaderTextDetailsStyles: {
    color: COLORS.PRIMARY,
    alignSelf: 'flex-end',
    fontSize: 12,
    fontFamily: FONT_FAMILY.POPPINS_LIGHT
  },
  headerTextDetailsRedStyles: {
    fontFamily: FONT_FAMILY.POPPINS_SEMI_BOLD,
    color: COLORS.DARK_RED,
    fontSize: 20,
    alignSelf: 'flex-end',
    marginBottom: Platform.OS == 'ios' ? -2 : -6
  },
  subHeaderTextDetailsRedStyles: {
    color: COLORS.DARK_RED,
    alignSelf: 'flex-end',
    fontSize: 12,
    fontFamily: FONT_FAMILY.POPPINS_LIGHT
  },
  textDetailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  subDetailsStyles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 15,
    position: 'absolute',
    top: 'auto',
    bottom: 10
  },
  diseaseIndicator: {
    backgroundColor: COLORS.DARK_RED,
    height: 6,
    width: 15,
    borderRadius: 1000
  },
  diseaseLabelStyle: {
    fontFamily: FONT_FAMILY.POPPINS_LIGHT,
    fontSize: 12,
    color: COLORS.TEXT_BLACK
  }
})
