import React from 'react';
import backIcon from '../assets/back-icon.png';

function Breadcrumbs({ event, identifier, current }) {
  return (
    <div className="breadcrumbs-container">
      <div className="breadcrumbs">
        <img
          src={backIcon}
          alt="back icon"
          onClick={event}
          className="breadcrumbs__back"
        />
        <p className="breadcrumbs__identifier">
          {identifier}
          <span className="breadcrumbs__active">
            {current.replace('/', ' ').split('/').join(' / ')}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Breadcrumbs;
