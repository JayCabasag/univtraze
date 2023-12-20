import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { Base64 } from 'js-base64';
import axios from 'axios';

function ViewRoom() {
  const [allRooms, setAllRooms] = useState([]);

  useEffect(() => {
    getAllRooms();
  }, []);

  const getAllRooms = async () => {
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    await axios
      .get('http://univtraze.herokuapp.com/api/rooms/allRooms', {
        headers: headers,
      })
      .then((response) => {
        var returnArr = [];
        returnArr.push(response.data.data);
        setAllRooms(returnArr[0]);

        if (returnArr[0].length === 0) {
          setNoResultsFound(true);
        } else {
          setNoResultsFound(false);
        }
      })

      .catch((error) => {
        console.log('Error ' + error);
      });
  };

  const navigate = useNavigate();

  const admin = () => {
    navigate('/admin');
  };

  const [currentBuildingName, setCurrentBuildingName] =
    useState('Sample sample');
  const [currentRoomId, setCurrentRoomId] = useState(null)
  const [currentRoomNumber, setCurrentRoomNumber] = useState('Sample sample');
  const [currentRoomName, setCurrentRoomName] = useState('Sample');
  const [showQrCode, setshowQrCode] = useState(false);
  const [decodedCodeForQr, setDecodedCodeForQr] = useState('');
  const [noResultsFound, setNoResultsFound] = useState(false);

  const [searchTerm, setSearchTerm] = useState(0);

  const viewQrCode = async (roomId) => {
    allRooms.map((room) => {
      if (room.room_id !== roomId) {
        return;
      }

      setCurrentBuildingName(room.building_name);
      setCurrentRoomNumber(room.room_number);
      setCurrentRoomName(room.room_name);
      setCurrentRoomId(room.room_id)
      decodeToBase64Qr(room.room_number, room.building_name, room.room_name, room.room_id);
    });

    setshowQrCode(true);
  };

  const decodeToBase64Qr = (roomNumber, buildingName, roomName, roomId) => {
    const data = {
      roomNumber,
      buildingName,
      roomName,
      roomId
    };

    const initialDecodedB64 = Base64.encode(JSON.stringify(data));

    setDecodedCodeForQr(initialDecodedB64);
    setshowQrCode(true);
  };

  const searchRoom = async (roomNumber) => {
    setNoResultsFound(false);
    const room_number = Number(roomNumber);
    setSearchTerm(room_number);
    if (room_number === 0) {
      setNoResultsFound(false);
      return getAllRooms();
    }

    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const data = {
      room_number: room_number,
    };

    await axios
      .post('https://univtraze.herokuapp.com/api/rooms/searchRoom', data, {
        headers: headers,
      })
      .then((response) => {
        var returnArr = [];
        returnArr.push(response.data.data);
        setAllRooms(returnArr[0]);

        if (returnArr[0].length === 0) {
          setNoResultsFound(true);
          return;
        }

        setNoResultsFound(false);
      })

      .catch((error) => {
        console.log('Error ' + error);
      });
  };

  const downloadQrCode = () => {
      const canvas = document.getElementById("qr-gen");
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${decodedCodeForQr}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
  }

  return (
    <>
      <Header />
      <div className='container'>
        <Breadcrumbs
          event={admin}
          identifier='Dashboard / '
          current='View room'
        />
        <div className='search-room'>
          <h1 className='rooms'>Rooms</h1>
          <div className='hi-search'>
            <input
              type='text'
              className='search'
              placeholder='Search'
              onChange={(e) => {
                searchRoom(e.target.value * 1);
              }}
            />

          </div>
        </div>
        <div className='rooms-container'>
          <div className='rooms-container__building-container'>
            {allRooms.map((room) => {
              return (
                <div className='room-card' key={room.id}>
                  <div className='room-card__container'>
                    <h3 className='room-card__building-name'>
                      {room.building_name}
                    </h3>
                    <p className='room-card__room-number'>{room.room_number}</p>
                    <p className='room-card__room-name'>{room.room_name}</p>
                  </div>
                  <button
                    className='btn-primary btn-primary--rooms'
                    onClick={() => viewQrCode(room.room_id)}
                  >
                    View QR code
                  </button>
                </div>
              );
            })}

            {noResultsFound ? (
              <p className='rooms-container__no-result'>No results found</p>
            ) : null}
          </div>
          <div className='rooms-container__qr-container'>
            <div className='rooms-container__qr-details'>
              <div className='rooms-container__box'>
                {showQrCode ? (
                  <QRCode
                    id='qr-gen'
                    className='view-room__qr-code'
                    value={decodedCodeForQr}
                    size={130}
                  />
                ) : null}
              </div>
              <p className='rooms-container__build-name'>
                {currentBuildingName}
              </p>
              <p className='rooms-container__room-number'>
                {currentRoomNumber}
              </p>
              <p className='rooms-container__room-name'>{currentRoomName}</p>
              <button className='btn-rooms' onClick={() => {downloadQrCode()}}>print QR code</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewRoom;
