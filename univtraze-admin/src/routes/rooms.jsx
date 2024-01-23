import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { Base64 } from 'js-base64';
import { genericGetRequest } from '../services/api/genericGetRequest';
import useDebounce from '../hooks/useDebounce';
import { useCallback } from 'react';

export default function Rooms() {
  const [isSearching, setIsSearching] = useState(false)
  const [allRooms, setAllRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false)
  const [currentBuildingName, setCurrentBuildingName] = useState('');
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [currentRoomNumber, setCurrentRoomNumber] = useState('');
  const [currentRoomName, setCurrentRoomName] = useState('');
  const [showQrCode, setshowQrCode] = useState(false);
  const [decodedCodeForQr, setDecodedCodeForQr] = useState('');
  const [noResultsFound, setNoResultsFound] = useState(false);

  const [searchTerm, setSearchTerm] = useState(0);
  useEffect(() => {
    getAllRooms();
  }, []);

  const getAllRooms = async () => {
    try {
      setIsLoadingRooms(true)
      const res = await genericGetRequest('rooms')
      setAllRooms(res?.results ?? [])
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingRooms(false)
    }
  };
  const debouncedSearchRoom = useDebounce(searchTerm, 1000)
  useEffect(() => {
    const searchRoom = async (roomNumber) => {
      setNoResultsFound(false);
      setSearchTerm(roomNumber);
      if (isNaN(roomNumber) || roomNumber == '') return
      try {
        setIsLoadingRooms(true)
        const res = await genericGetRequest(`rooms?search=${roomNumber}`)
        if (res["total_rooms"] <= 0){
          setNoResultsFound(true);
        }
        setAllRooms(res?.results ?? [])
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoadingRooms(false)
      }
    };
    searchRoom(debouncedSearchRoom)
  }, [debouncedSearchRoom])

  const viewQrCode = async (room) => {
    setCurrentBuildingName(room.building_name);
    setCurrentRoomNumber(room.room_number);
    setCurrentRoomName(room.room_name);
    setCurrentRoomId(room.id);
    decodeToBase64Qr(
        room.room_number,
        room.building_name,
        room.room_name,
        room.id,
    );
    setshowQrCode(true);
  };

  const decodeToBase64Qr = (roomNumber, buildingName, roomName, roomId) => {
    const data = {
      roomNumber,
      buildingName,
      roomName,
      roomId,
    };

    const initialDecodedB64 = Base64.encode(JSON.stringify(data));

    setDecodedCodeForQr(initialDecodedB64);
    setshowQrCode(true);
  };

  const downloadQrCode = () => {
    const canvas = document.getElementById('qr-gen');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    let downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${decodedCodeForQr}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="container">
      <div className="search-room">
        <h1 className="rooms">Rooms</h1>
        <div className="hi-search">
          <input
            type="text"
            className="search"
            placeholder="Search"
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rooms-container">
        <div className="rooms-container__building-container">
          {allRooms.map(room => {
            return (
              <div className="room-card" key={room.id}>
                <div className="room-card__container">
                  <h3 className="room-card__building-name">
                    {room.building_name}
                  </h3>
                  <p className="room-card__room-number">{room.room_number}</p>
                  <p className="room-card__room-name">{room.room_name}</p>
                </div>
                <button
                  className="btn-primary btn-primary--rooms"
                  onClick={() => viewQrCode(room)}
                >
                  View QR code
                </button>
              </div>
            );
          })}
          {noResultsFound && <p className="rooms-container__no-result">No results found</p>}
        </div>
        <div className="rooms-container__qr-container">
          <div className="rooms-container__qr-details">
            <div className="rooms-container__box">
              {showQrCode && (
                <QRCode
                  id="qr-gen"
                  className="view-room__qr-code"
                  value={decodedCodeForQr}
                  size={130}
                />
              )}
            </div>
            <p className="rooms-container__build-name">{currentBuildingName}</p>
            <p className="rooms-container__room-number">{currentRoomNumber}</p>
            <p className="rooms-container__room-name">{currentRoomName}</p>
            <button className="btn-rooms" onClick={downloadQrCode} >
              print QR code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
