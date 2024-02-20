import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../utils/app_constants'

export const withSafeAreaView = (WrappedComponent) => {
  return class extends React.Component {
    componentDidMount() {
      // Add some functions here
    }
    render() {
      return (
        <SafeAreaView style={styles.container}>
          <WrappedComponent {...this.props} />
        </SafeAreaView>
      )
    }
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.SECONDARY
    }
})
