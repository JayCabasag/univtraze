import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUpCredentialsDocuments" component={SignUpCredentialsDocuments} />
          <Stack.Screen name="RoomVisited" component={RoomVisited} />
          <Stack.Screen name="DailyAsessment" component={DailyAsessment} />
          <Stack.Screen name="ReportEmergency" component={ReportEmergency} />
          <Stack.Screen name="ReportCovidCase" component={ReportCovidCase} />
          <Stack.Screen name="QrScanner" component={QrScanner} />
          <Stack.Screen name="SignUpUserCredentialsStudent" component={SignUpUserCredentialsStudent} />
          <Stack.Screen name="SignUpUserCredentialsEmployee" component={SignUpUserCredentialsEmployee} />
          <Stack.Screen name="SignUpUserCredentialsVisitor" component={SignUpUserCredentialsVisitor} />
          <Stack.Screen name="SignUpUserType" component={SignUpUserType} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignUpVaccination" component={SignUpVaccination} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="TemperatureHistory" component={TemperatureHistory} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword } />
          <Stack.Screen name="ResetPassword" component={ResetPassword } />
          <Stack.Screen name="TermsAndCondition" component={TermsAndConditions } />
          <Stack.Screen name="AccountSettings" component={AccountSettings} />
          <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
          <Stack.Screen name="UpdatePersonalInfo" component={UpdatePersonalInfo} />
    </Stack.Navigator>
    <StatusBar style="auto" />
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
