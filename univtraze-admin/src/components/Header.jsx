import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import logoDark from '../assets/logo-full.png';
import notification from '../assets/notification-bell.png';
import menuIcon from '../assets/menu.png';
import Menu from './Menu';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const menuRef = useRef();

  const dashboard = () => {
    navigate('/admin');
  };

  useEffect(() => {
    handleGetTotalActiveNotifications();
  }, []);

  const handleGetTotalActiveNotifications = async () => {
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    await axios
      .get(
        'https://univtraze.herokuapp.com/api/notifications/getTotalActiveAdminNotifications',
        {
          headers: headers,
        },
      )
      .then(resp => {
        setTotalNotifications(resp.data.total_active_notifications);
      });
  };

  const handleCloseMenu = () => {
    setIsActive(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        <img
          src={logoDark}
          onClick={dashboard}
          alt=""
          className="logo-dark--dashboard"
        />
        <div className="header__navigation">
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/admin/notifications')}
          >
            {totalNotifications === 0 ? null : (
              <div
                style={{
                  position: 'absolute',
                  backgroundColor: 'red',
                  width: '15px',
                  height: '15px',
                  textAlign: 'center',
                  color: 'white',
                  borderRadius: '50%',
                }}
              >
                {totalNotifications}
              </div>
            )}
            <img src={notification} alt="" className="notification-bell" />
          </div>
          <div className="menu">
            <img
              src={menuIcon}
              onClick={() =>
                isActive ? setIsActive(false) : setIsActive(true)
              }
              className="menu-icon"
            />
          </div>
        </div>
      </div>
      <div className="container container--menu">
        {isActive && <Menu ref={menuRef} handleCloseMenu={handleCloseMenu} />}
      </div>
    </header>
  );
};

export default Header;
