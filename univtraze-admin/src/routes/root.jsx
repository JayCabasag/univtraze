import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Loading from './loading';

export default function Root() {
  const [isAppReady, setIsAppReady] = useState(false);

  const navigation = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setIsAppReady(true);
      navigation('/admin');
    }, 3000);
  }, []);

  if (!isAppReady) {
    return <Loading />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
