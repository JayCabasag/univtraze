import React from 'react'
import { useNavigate } from 'react-router'

function Button({label ,destination}) {

    const navigate = useNavigate();

  return (
    <button className="btn-primary" onClick={() => {navigate(destination)}}>{label}</button>
  )
}

export default Button