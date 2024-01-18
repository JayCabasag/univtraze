import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from '../screens/welcome'
import SignInScreen from '../screens/signin'
import SignUpScreen from '../screens/signup'
import UserVaccine from '../screens/user-vaccine'
import ForgotPasswordScreen from '../screens/forgot-password'
import IndexScreen from '../screens'
import VisitedRoomsScreen from '../screens/visited-rooms'
import DailyAssessmentScreen from '../screens/daily-assessments'
import ReportEmergencyScreen from '../screens/report-emergency'
import ReportDiseaseScreen from '../screens/report-disease'
import QrScannerScreen from '../screens/qr-scanner'
import TemperatureHistoryScreen from '../screens/temperature-history'
import ResetPasswordScreen from '../screens/reset-password'
import AccountSettingsScreen from '../screens/account-settings'
import UpdatePasswordScreen from '../screens/update-password'
import UpdatePersonalInformationScreen from '../screens/update-information'
import TermsAndConditionsScreen from '../screens/terms-and-conditions'
import { useAuth } from '../services/store/auth/AuthContext'
import { useUser } from '../services/store/user/UserContext'
import UserInformationScreen from '../screens/user-information'
import UserSelectTypeScreen from '../screens/user-select-type'
import UserDocumentsScreen from '../screens/user-documents'
import { StatusBar } from 'expo-status-bar'

const MainStack = createNativeStackNavigator()

export default function MainNavigation({ onLayoutView }) {
  const { state: authState, isAppAuthReady } = useAuth()
  const { state: userState } = useUser()

  const isAuthenticated = authState.userToken != null

  if (!isAppAuthReady) {
    return null
  }

  return (
    <NavigationContainer onReady={onLayoutView}>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <MainStack.Group>
            {userState.user?.type == null ? (
              <MainStack.Group>
                <MainStack.Screen name='user-select-type' component={UserSelectTypeScreen} />
                <MainStack.Screen
                  name='user-information'
                  options={{ animation: 'none' }}
                  component={UserInformationScreen}
                />
                <MainStack.Screen
                  name='user-documents'
                  options={{ animation: 'none' }}
                  component={UserDocumentsScreen}
                />
              </MainStack.Group>
            ) : (
              <MainStack.Group>
                <MainStack.Screen name='index' component={IndexScreen} />
                <MainStack.Screen name='visited-rooms' component={VisitedRoomsScreen} />
                <MainStack.Screen name='daily-assessment' component={DailyAssessmentScreen} />
                <MainStack.Screen name='report-emergecy' component={ReportEmergencyScreen} />
                <MainStack.Screen name='report-disease' component={ReportDiseaseScreen} />
                <MainStack.Screen name='qr-scanner' component={QrScannerScreen} />
                <MainStack.Screen name='temperature-history' component={TemperatureHistoryScreen} />
                <MainStack.Screen name='reset-password' component={ResetPasswordScreen} />
                <MainStack.Screen name='account-settings' component={AccountSettingsScreen} />
                <MainStack.Screen name='update-password' component={UpdatePasswordScreen} />
                <MainStack.Screen
                  name='update-personal-information'
                  component={UpdatePersonalInformationScreen}
                />
              </MainStack.Group>
            )}
            <MainStack.Screen name='user-vaccine' component={UserVaccine} />
          </MainStack.Group>
        ) : (
          <MainStack.Group>
            <MainStack.Screen name='welcome' component={WelcomeScreen} />
            <MainStack.Screen name='signin' component={SignInScreen} />
            <MainStack.Screen name='signup' component={SignUpScreen} />
            <MainStack.Screen name='forgot-password' component={ForgotPasswordScreen} />
          </MainStack.Group>
        )}
        <MainStack.Screen name='terms-and-conditions' component={TermsAndConditionsScreen} />
      </MainStack.Navigator>
      <StatusBar style='auto' />
    </NavigationContainer>
  )
}
