import MainNavigation from './navigations/MainNavigation'
import { AuthContextProvider } from './services/store/auth/AuthContext'

export default function App() {
  return (
    <AuthContextProvider>
      <MainNavigation />
    </AuthContextProvider>
  )
}
