import Breadcrumbs from '../components/Breadcrumbs';
import Header from '../components/Header';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const location = useLocation();

  const isAdminRoute = location.pathname === '/admin';

  return (
    <div className="dashboard">
      <Header />
      {!isAdminRoute && (
        <Breadcrumbs
          event={handleGoBack}
          identifier="Dashboard / "
          current={location.pathname}
        />
      )}
      <Outlet />
    </div>
  );
}
