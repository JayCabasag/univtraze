import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logoDark from '../assets/logo-full.png';
import axios from 'axios';
import { genericPostRequest } from '../services/api/genericPostRequest';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [isPwd, setIsPwd] = useState(true);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setsuccessMessage] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const redir = () => {
    navigate('/admin');
  };

  const login = async () => {
    setIsLoading(true);
    setError(false);
    setSuccess(false);

    try {
    const payload = {
      username: email,
      email: email,
      password: pwd,
    };
      const res = await genericPostRequest('admin/loginAdmin', payload)
      console.log(res)
    } catch (error) {
      console.log(error)
    }

    // await axios
    //   .post('http://univtraze.herokuapp.com/api/admin/loginAdmin', data)
    //   .then(res => {
    //     if (res.data.success === 1) {
    //       localStorage.setItem('token', res.data.token);

    //       setError(false);
    //       setErrorMessage('');
    //       setSuccess(true);
    //       setsuccessMessage('Login in Successfully');
    //       setIsLoading(false);
    //       redir();
    //     } else {
    //       setError(true);

    //       setErrorMessage('Log in failed');
    //       setSuccess(false);
    //       setsuccessMessage('');
    //       setIsLoading(false);
    //     }
    //   })
    //   .catch(err => {
    //     setError(true);
    //     setErrorMessage('Network error');
    //     setSuccess(false);
    //     setsuccessMessage('');
    //     setIsLoading(false);
    //   });

    // setIsLoading(false);
  };

  return (
    <div className="login-component">
      <div className="login-card__container">
        {isLoading && <p className="loader">Logging you in...</p>}
        {error && <p className="loader--error">{errorMessage}</p>}
        {success && <p className="loader--error">{successMessage}</p>}
        <img src={logoDark} alt="" className="logo-dark" />
        <h3 className="login-card_title">Login</h3>
        <div className="login-card_form"></div>
        <div className="input-container">
          <p className="form-label">Username</p>
          <input
            type="text"
            placeholder="Email or Username"
            className="form-input"
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="input-container">
          <p className="form-label">Password</p>
          <div className="password-container">
            <input
              name="pwd"
              placeholder="Password"
              type={isPwd ? 'password' : 'text'}
              value={pwd}
              className="form-input password-input"
              onChange={e => setPwd(e.target.value)}
            />

            <button
              className="show-password"
              onClick={() => setIsPwd(prevState => !prevState)}
            >
              {isPwd ? 'Show' : 'Hide'}
            </button>
          </div>
        </div>

        <button className="btn-primary" onClick={login}>
          LOG IN
        </button>

        <p
          className="forgot-password"
          onClick={() => {
            navigate('/forgot-password');
          }}
        >
          Forgot Password
        </p>
      </div>
    </div>
  );
}

export default Login;
