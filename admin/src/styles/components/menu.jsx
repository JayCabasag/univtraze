import React from 'react'
import { Link } from 'react-router-dom'
function menu() {
  const logoutApp = () => {
    localStorage.setItem("token", "")
  }

  return (
    <div className="menu-container">
        <ul className="menus">
            <Link to="/admin/add-room" className="links">Add room</Link>
            <Link to="/admin/add-clinic-admin" className="links">Add clinic admin</Link>
            <Link to="/admin/view-room" className="links">View rooms</Link>
            <Link to="/admin/account-settings" className="links">Account Settings</Link>
            <Link to="/" className="links" onClick={logoutApp}>Log out
            <div className="spinner-container">
              <LoadingSpin
              duration = "2s"
              width="15px"
              timingFunction = "ease-in-out"
              direction = "alternate"
              size="100px"
              primaryColor="#6bf27f"
              secondaryColor="#28cd41"
              numberOfRotationsInAnimation={2}
              />
            </div>
            </Link>

        </ul>
    </div>
  )
}

export default menu