import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'
const Menu = forwardRef(function Menu(props, ref) {
  return (
      <div ref={ref} className="menu-container">
        <ul className="menus">
            <Link to="/admin/add-room" onClick={props.handleCloseMenu} className="links">Add room</Link>
            <Link to="/admin/add-clinic-admin" onClick={props.handleCloseMenu} className="links">Add clinic admin</Link>
            <Link to="/admin/rooms"  onClick={props.handleCloseMenu} className="links">View rooms</Link>
            <Link to="/admin/account-settings"  onClick={props.handleCloseMenu} className="links">Account Settings</Link>
            <Link to="/login"  onClick={props.handleCloseMenu} className="links log-out-link">Log out</Link>
        </ul>
      </div>
  )
})

export default Menu