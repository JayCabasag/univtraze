import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '../screens/splash'
import WelcomeScreen from '../screens/welcome'
import SignInScreen from '../screens/signin'
import SignUpStudentScreen from '../screens/signup/signup-student'
import SignUpScreen from '../screens/signup/signup'
import SignUpEmployeeScreen from '../screens/signup/signup-employee'
import SignUpVisitorScreen from '../screens/signup/signup-visitor'
import SignUpUserTypeScreen from '../screens/signup/signup-user-type'
import SignUpVaccinationScreen from '../screens/signup/signup-vaccination'
import SignUpDocsScreen from '../screens/signup/signup-docs'
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

const MainStack = createNativeStackNavigator()

export default function MainNavigation({ onLayoutView }) {
  const { state: authState, isAppAuthReady } = useAuth()
  const { state: userState, isAppUserReady } = useUser()

  return (
    <NavigationContainer onReady={onLayoutView}>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAppAuthReady && <MainStack.Screen name='loading' component={SplashScreen} />}
        {authState.userToken == null ? (
          <MainStack.Group>
            <MainStack.Screen name='welcome' component={WelcomeScreen} />
            <MainStack.Screen name='signin' component={SignInScreen} />
            <MainStack.Screen name='signup' component={SignUpScreen} />
            <MainStack.Screen name='forgot-password' component={ForgotPasswordScreen} />
          </MainStack.Group>
        ) : (
          <MainStack.Group>
            {!isAppUserReady && <MainStack.Screen name='loading' component={SplashScreen} />}
            {userState.user?.type == null ? (
              <MainStack.Group>
                <MainStack.Screen name='signup-user-type' component={SignUpUserTypeScreen} />
                <MainStack.Screen name='signup-student' component={SignUpStudentScreen} />
                <MainStack.Screen name='signup-employee' component={SignUpEmployeeScreen} />
                <MainStack.Screen name='signup-visitor' component={SignUpVisitorScreen} />
                <MainStack.Screen name='signup-vaccination' component={SignUpVaccinationScreen} />
                <MainStack.Screen name='signup-docs' component={SignUpDocsScreen} />
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
          </MainStack.Group>
        )}
        <MainStack.Screen name='terms-and-conditions' component={TermsAndConditionsScreen} />
      </MainStack.Navigator>
    </NavigationContainer>
  )
}
