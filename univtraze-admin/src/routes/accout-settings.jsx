import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';
import { useEffect } from 'react';

export default function AccountSettingsPage() {
  const navigate = useNavigate();

  const [currentEmail, setCurrentEmail] = useState('');
  const [currentAdminId, setCurrentAdminId] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Error handler states
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clinic admin credentials previewer variables
  const [showPreviewer, setShowPreviewer] = useState(false);

  const handleChangeAdminCredentials = async () => {
    if (validator.isEmpty(username)) {
      setSuccess(false);
      setSuccessMessage('');
      setError(true);
      setErrorMessage('Please input a username/email');
      return;
    }

    if (validator.isEmpty(password)) {
      setSuccess(false);
      setSuccessMessage('');
      setError(true);
      setErrorMessage('Please input old password');
      return;
    }
    if (validator.isEmpty(confirmPassword)) {
      setSuccess(false);
      setSuccessMessage('');
      setError(true);
      setErrorMessage('Please input new password ');
      return;
    }

    if (password.length <= 7) {
      setSuccess(false);
      setSuccessMessage('');
      setError(true);
      setErrorMessage('Password should contain more than 8 characters');
      return;
    }
    if (confirmPassword.length <= 7) {
      setSuccess(false);
      setSuccessMessage('');
      setError(true);
      setErrorMessage('New password should contain more than 8 characters');
      return;
    }

    if (confirmPassword !== confirmNewPassword) {
      setSuccess(false);
      setSuccessMessage('');
      setError(true);
      setErrorMessage('New password did not match');
      return;
    }

    const token = localStorage.getItem('token');

    var data = {
      id: currentAdminId,
      email: currentEmail,
      old_password: password,
      new_password: confirmNewPassword,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    setSuccess(false);
    setError(false);
    setIsLoading(true);

    await axios
      .post(
        'https://univtraze.herokuapp.com/api/admin/updateAdminCredentials',
        data,
        {
          headers: headers,
        },
      )
      .then(response => {
        if (response.data.success === false) {
          setIsLoading(false);
          setSuccess(false);
          setSuccessMessage('');
          setError(true);
          setErrorMessage(response.data.message);
          return;
        }

        setIsLoading(false);
        setSuccess(true);
        setSuccessMessage('Password updated successfully');
        setError(false);
        setErrorMessage('');
        return;
      })

      .catch(error => {
        setIsLoading(false);
        setSuccess(false);
        setSuccessMessage('');
        setError(true);
        setErrorMessage(error);
        return;
      });
  };

  return (
    <div className="container">
      <div className="add-room">
        <div className="add-room__form">
          <h3 className="add-room__title">Account Settings</h3>
          <div className="add-room__input-container">
            <p>Current email: {currentEmail}</p>
            <p className="add-room__label">Username/Email</p>
            <input
              type="text"
              className="add-room__input"
              placeholder="Email/Username"
              defaultValue={currentEmail}
              disabled={true}
              onChange={e => {
                setUsername(e.target.value);
              }}
            />
          </div>

          <div className="add-room__input-container">
            <p className="add-room__label">Old Password</p>
            <input
              type="password"
              className="add-room__input"
              placeholder="Old Password"
              onChange={e => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="add-room__input-container">
            <p className="add-room__label">New Password</p>
            <input
              type="password"
              className="add-room__input"
              placeholder="New password"
              onChange={e => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
          <div className="add-room__input-container">
            <p className="add-room__label">Confirm Password</p>
            <input
              type="password"
              className="add-room__input"
              placeholder="Confirm new password"
              onChange={e => {
                setConfirmNewPassword(e.target.value);
              }}
            />
          </div>
          {error ? <p style={{ color: 'red' }}>{errorMessage}</p> : null}

          {success ? (
            <p style={{ color: '#28cd41' }}>{successMessage}</p>
          ) : null}

          {isLoading ? (
            <p style={{ color: '#28cd41' }}>Please wait...</p>
          ) : null}

          <button
            className="btn-primary"
            onClick={() => {
              handleChangeAdminCredentials();
            }}
          >
            Update account information
          </button>
        </div>
        <div className="add-room__qr-container">
          {success ? (
            <>
              <img src={require('../assets/verified_icon.gif')} width="200" />
              <p style={{ fontWeight: 'bold', fontSize: '20px' }}>
                Password updated successfully
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
