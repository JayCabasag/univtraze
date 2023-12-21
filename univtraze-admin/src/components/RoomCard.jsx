import React from 'react';

function RoomCard({
  id,
  roomNumber,
  roomName,
  buildingName,
  createdAt,
  updatedAt,
}) {
  return (
    <div className="room-card">
      <div className="room-card__container">
        <h3 className="room-card__building-name">Building name</h3>
        <p className="room-card__room-number">Room 308</p>
        <p className="room-card__room-name">Room name</p>
      </div>
      <button className="btn-primary btn-primary--rooms">View QR code</button>
    </div>
  );
}

export default RoomCard;
