import React from 'react'


function Card({redir, label, data, design, icon, type}) {

  return (
    <div className={design} onClick={redir}>
        <div className="card-content">
            <div className="card-info">
                <div className="card-label">{label}</div>
                <div className="card-data">{data}</div>
            </div>
            <img src={icon} alt="" className='card-icon'></img>
        </div>

    </div>
  )
}

export default Card