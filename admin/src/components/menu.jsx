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
            <Link to="/" className="links" onClick={logoutApp}>Log out</Link>
        </ul>
    </div>
  )
}

export default menu