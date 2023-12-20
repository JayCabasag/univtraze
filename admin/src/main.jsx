import React from 'react';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Login from './routes/login.jsx';
import ForgotPassword from './routes/forgot-password.jsx';
import ResetPasswordFromEmail from './routes/reset-password.jsx';
import Dashboard from './routes/dashboard.jsx';
import Root from './routes/root.jsx';
import Users from './routes/users.jsx';
import Userdata from './routes/user-data.jsx';
import Notifications from './routes/notifications.jsx';
import Covidreports from './routes/covid-reports.jsx';
import Covidfulldetails from './routes/covid-full-details.jsx';
import Emergencyreports from './routes/emergency-reports.jsx';
import Attendance from './routes/attendance.jsx';
import AddRoom from './routes/add-room.jsx';
import AddClinicAdmin from './routes/add-clinic-admin.jsx';
import AccountSettings from './routes/accout-settings.jsx';
import ViewRoom from './routes/view-room.jsx';
import AttendanceRoom from './routes/attendance-room.jsx';
import CovidOverview from './routes/covid-overview.jsx';

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
    element: <Dashboard />,
    children: [
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
        path: 'communicable-disease',
        element: <Covidreports />,
      },
      {
        path: 'covidfulldetails',
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
        path: 'view-room',
        element: <ViewRoom />,
      },
      {
        path: 'attendance-room/:roomId&:roomNumber&:buildingName',
        element: <AttendanceRoom />,
      },
      {
        path: 'communicable-disease-overview/:userId/:caseId/:userType',
        element: <CovidOverview />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
);
