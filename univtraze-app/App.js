import { useCallback } from 'react'
import MainNavigation from './navigations/MainNavigation'
import { AuthContextProvider } from './services/store/auth/AuthContext'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { UserContextProvider } from './services/store/user/UserContext'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-ExtraLight': require('./assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf')
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <AuthContextProvider>
      <UserContextProvider>
        <MainNavigation onLayoutView={onLayoutRootView} />
      </UserContextProvider>
    </AuthContextProvider>
  )
}
