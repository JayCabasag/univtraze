import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Base64 } from 'js-base64';
import axios from 'axios';

function AddRoom() {
  const navigate = useNavigate();

  const admin = () => {
    navigate('/admin');
  };

  const [roomNumber, setRoomNumber] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [showGeneratedQr, setShowGeneratedQr] = useState(false);
  const [qrDataValue, setQrDataValue] = useState(null);

  const [decodedBuildingData, setDecodedBuildingData] = useState([]);

  // Error Handlers here

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [generationError, setGenerationError] = useState('');
  const [generationErrorMessage, setGenerationErrorMessage] = useState('');
  const [generationLoading, setGenerationLoading] = useState(false);

  const [generationSuccess, setGenerationSuccess] = useState(false);

  const generateQr = () => {
    if (roomNumber === '' || buildingName === '' || roomName === '') {
      setError(true);
      setGenerationError(false);
      setErrorMessage('Some fields were empty');
      return;
    }

    const data = {
      roomNumber,
      buildingName,
      roomName,
    };

    const decodedBase64 = Base64.encode(JSON.stringify(data));
    setQrDataValue(decodedBase64);

    var arrayData = JSON.parse(Base64.decode(decodedBase64));
    setDecodedBuildingData(arrayData);

    setShowGeneratedQr(true);
    setError(false);
    setErrorMessage('');
    setGenerationSuccess(false);
    setGenerationError(false);
    setGenerationErrorMessage('');
  };

  const addRoom = () => {
    setGenerationLoading(true);
    setGenerationError(false);
    setErrorMessage('');
    setGenerationSuccess(false);

    const token = localStorage.getItem('token');

    var data = {
      room_number: Number(roomNumber),
      building_name: buildingName,
      room_name: roomName,
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    axios
      .post('https://univtraze.herokuapp.com/api/rooms/addRoom', data, {
        headers: headers,
      })
      .then(response => {
        if (response.data.success === 0) {
          setGenerationError(true);
          setGenerationErrorMessage(response.data.message);
          setGenerationSuccess(false);
          setGenerationLoading(false);
          return;
        }

        setGenerationError(false);
        setGenerationLoading(false);
        setError(false);
        setGenerationSuccess(true);
        setErrorMessage('');
      })

      .catch(error => {
        console.log('Error ' + error);
      });
  };

  return (
    <div className="container">
      <div className="add-room">
        <div className="add-room__form">
          <h3 className="add-room__title">Add room</h3>
          <div className="add-room__input-container">
            <p className="add-room__label">Room number</p>
            <input
              type="text"
              className="add-room__input"
              onChange={e => {
                setRoomNumber(e.target.value * 1);
              }}
            />
          </div>
          <div className="add-room__input-container">
            <p className="add-room__label">Building name</p>
            <input
              type="text"
              className="add-room__input"
              onChange={e => {
                setBuildingName(e.target.value);
              }}
            />
          </div>
          <div className="add-room__input-container">
            <p className="add-room__label">Room name</p>
            <input
              type="text"
              className="add-room__input"
              onChange={e => {
                setRoomName(e.target.value);
              }}
            />
          </div>
          '{error ? <p style={{ color: 'red' }}>{errorMessage}</p> : null}
          <button
            className="btn-primary"
            onClick={() => {
              generateQr();
            }}
          >
            Generate QR
          </button>
        </div>
        <div className="add-room__qr-container">
          {generationError ? (
            <h2 className="add-room__error">{generationErrorMessage}</h2>
          ) : null}

          {generationLoading ? (
            <h2 className="add-room__loading">Loading</h2>
          ) : null}

          {generationSuccess ? (
            <h2 className="add-room__loading">Room added succesfully</h2>
          ) : null}

          <div className="add-room__qr-info">
            <div className="add-room__qr">
              {showGeneratedQr ? (
                <QRCodeSVG className="add-room__qr-code" value={qrDataValue} />
              ) : null}
            </div>
            <div className="add-room__qr-details">
              <div className="add-room__text">
                <p className="add-room__room-number">
                  {decodedBuildingData.roomNumber}
                </p>
                <h3 className="add-room__building-name">
                  {decodedBuildingData.buildingName}
                </h3>
                <h3 className="add-room__room-name">
                  {decodedBuildingData.roomName}
                </h3>
              </div>
              <button className="btn-primary" onClick={() => addRoom()}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddRoom;
