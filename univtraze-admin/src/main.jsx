import React from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import './styles/main.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Login from './routes/login.jsx';
import ForgotPassword from './routes/forgot-password.jsx';
import ResetPasswordFromEmail from './routes/reset-password.jsx';
import Root from './routes/root.jsx';
import Users from './routes/users.jsx';
import Userdata from './routes/user-data.jsx';
import Notifications from './routes/notifications.jsx';
import Covidfulldetails from './routes/covid-full-details.jsx';
import Emergencyreports from './routes/emergency-reports.jsx';
import Attendance from './routes/attendance.jsx';
import AddRoom from './routes/add-room.jsx';
import AddClinicAdmin from './routes/add-clinic-admin.jsx';
import AccountSettings from './routes/accout-settings.jsx';
import Rooms from './routes/rooms.jsx';
import AttendanceRoom from './routes/attendance-room.jsx';
import CovidOverview from './routes/covid-overview.jsx';
import Admin from './routes/admin.jsx';
import DashboardPage from './routes/dashboard.jsx';
import { UserContextProvider } from './services/store/user/UserContext.jsx';
import { AuthContextProvider } from './services/store/auth/AuthContext.jsx';
import DiseaseReports from './routes/covid-reports.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password-from-email/:recovery_email&:recovery_password',
    element: <ResetPasswordFromEmail />,
  },
  {
    path: '/admin',
    element: <Admin />,
    children: [
      {
        path: '',
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <Users />,
        children: [
          {
            path: 'userdata',
            element: <Userdata />,
          },
        ],
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'disease-reports',
        element: <DiseaseReports />,
      },
      {
        path: 'covid-full-details',
        element: <Covidfulldetails />,
      },
      {
        path: 'emergency-reports',
        element: <Emergencyreports />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
      {
        path: 'add-room',
        element: <AddRoom />,
      },
      {
        path: 'add-clinic-admin',
        element: <AddClinicAdmin />,
      },
      {
        path: 'account-settings',
        element: <AccountSettings />,
      },
      {
        path: 'rooms',
        element: <Rooms />,
      },
      {
        path: 'attendance-room/:roomId&:roomNumber&:buildingName',
        element: <AttendanceRoom />,
      },
      {
        path: 'disease-overview/:userId/:caseId/:userType',
        element: <CovidOverview />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </UserContextProvider>
);
