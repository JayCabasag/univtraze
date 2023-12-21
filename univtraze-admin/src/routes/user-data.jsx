import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import picture from '../assets/picture.png';

export default function Userdata() {
  const navigate = useNavigate();

  const users = () => {
    navigate('/admin/users');
  };

  return (
    <div className="user-data">
      <div className="container">
        <div className="user-card">
          <button className="btn-delete">Delete User</button>
          <div className="profile">
            <img src={picture} className="pic"></img>
            <div className="pangalan-container">
              <p className="pangalan">Robert Figura</p>
              <p className="id">01-405</p>
            </div>
          </div>
          <div className="user-type">
            <p className="student-type">Student</p>
          </div>
          <div className="user-info">
            <div className="user-container">
              <p className="personal">Personal Information</p>
              <p className="gender">Male</p>
              <p className="address">
                Blk 125 Lot 32 Sunflower street,Central Bicutan, Taguig City
              </p>
              <p className="course">Bachelor Science In Computer Science</p>
              <p className="year">4th Year - E2018</p>
              <p className="birthday">October 03, 1998</p>
              <p className="email">figura.robert123@gmail.com</p>
              <p className="number">09989181489</p>
            </div>
            <div className="vaccine-container">
              <p className="vacc">Vaccine Information</p>
              <p className="vaccine">pfizer</p>
              <p className="first-dose">
                Blk 125 Lot 32 Sunflower street,Central Bicutan, Taguig City
              </p>
              <p className="second-dose">
                Bachelor Science In Computer Science
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
