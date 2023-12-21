import Header from '../components/Header'
import { Outlet } from 'react-router-dom';

export default function AdminPage() {
  return (
    <div className="dashboard">
        <Header/>
        <Outlet />
    </div>
  )
}