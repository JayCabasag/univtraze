import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logoDark from '../assets/logo-full.png';
import axios from 'axios';
import validator from 'validator'


const ForgotPassword = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setsuccessMessage] = useState();

  const [isLoading, setIsLoading] = useState(false);


  const handleSendViaEmail = async () => {
    setSuccess(false)
    if(validator.isEmpty(email)){
      setError(true)
      setErrorMessage('Please enter your email address.')
      return 
    }
    if(!validator.isEmail(email)){
      setError(true)
      setErrorMessage('Email is invalid')
      return
    }
       
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    setError(false)
    setIsLoading(true)
    await axios.post('https://univtraze.herokuapp.com/api/admin/resetAdminPassword', {email}, {
          headers: headers
        }).then(resp => {
          
          if(resp.data.success === false){
            setIsLoading(false)
            setSuccess(false)
            setsuccessMessage('')
            setError(true)
            setErrorMessage(resp.data.message)
            return
          }
          
            setError(false)
            setIsLoading(false)
            setSuccess(true)
            setsuccessMessage('Link sent to your email')
        
    });

  }

  return (
    <div className='login-component'>
      <div className='login-card__container'>
        {isLoading ? <p className='loader'>Sending to your email...</p> : null}
        {error ? <p className='loader--error'>{errorMessage}</p> : null}

        {success ? <p className='loader'>{successMessage}</p> : null}

        <img src={logoDark} alt='' className='logo-dark' />
        <h3 className='login-card_title'>Forgot password</h3>
        <div className='login-card_form'></div>
        <div className='input-container'>
          <p className='form-label'>Email</p>
          <input
            type='email'
            placeholder='Email'
            className='form-input'
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className='btn-primary'
          onClick={() => {
            handleSendViaEmail()
          }}
        >
          SEND VIA EMAIL
        </button>

        <p className='forgot-password' onClick={() => {navigate('/login')}}>Return to Login</p>
      </div>
    </div>
  );
}

export default ForgotPassword
