import Breadcrumbs from '../components/Breadcrumbs';
import Header from '../components/Header';
import { Outlet, useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="dashboard">
      <Header />
      <Breadcrumbs
        event={handleGoBack}
        identifier="Dashboard / "
        current="Users"
      />
      <Outlet />
    </div>
  );
}
