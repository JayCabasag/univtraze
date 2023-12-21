import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logoDark from '../assets/logo-full.png';
import axios from 'axios';
import validator from 'validator';

const ResetPasswordFromEmail = () => {
  const { recovery_email, recovery_password } = useParams();

  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const [pwd, setPwd] = useState('');
  const [isPwd, setIsPwd] = useState(true);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPassword, setIsConfirmPassword] = useState(true);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setsuccessMessage] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const redir = () => {
    navigate('/admin');
  };

  const handleResetPassword = async () => {
    if (validator.isEmpty(pwd)) {
      setError(true);
      setErrorMessage('Please input your new password');
      return;
    }
    if (validator.isEmpty(confirmPassword)) {
      setError(true);
      setErrorMessage('Please re-type your new password');
      return;
    }

    if (!validator.matches(pwd, confirmPassword)) {
      setError(true);
      setErrorMessage('Password did not match.');
      return;
    }
    if (!validator.matches(confirmPassword, pwd)) {
      setError(true);
      setErrorMessage('Password did not match.');
      return;
    }
    if (confirmPassword.length <= 7) {
      setError(true);
      setErrorMessage('Password should contain atleast 8 characters.');
      return;
    }

    setError(false);
    setErrorMessage('');

    const token = localStorage.getItem('token');

    var data = {
      email: recovery_email,
      recovery_password: recovery_password,
      new_password: confirmPassword,
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    setSuccess(false);
    setError(false);
    setIsLoading(true);

    axios
      .post(
        'https://univtraze.herokuapp.com/api/admin/updateAdminPassword',
        data,
        {
          headers: headers,
        },
      )
      .then(resp => {
        if (resp.data.success === false) {
          setIsLoading(false);
          setSuccess(false);
          setError(true);
          setErrorMessage(resp.data.message);
          return;
        }

        setIsLoading(false);
        setSuccess(true);
        setError(false);
        setErrorMessage('');
        setsuccessMessage(resp.data.message);
        return;
      });
  };

  return (
    <div className="login-component">
      <div className="login-card__container">
        {isLoading ? <p className="loader">Updating your password...</p> : null}
        {error ? <p className="loader--error">{errorMessage}</p> : null}

        {success ? <p className="loader">{successMessage}</p> : null}

        <img src={logoDark} alt="" className="logo-dark" />
        <h3 className="login-card_title">Reset password</h3>
        <div className="login-card_form"></div>
        <div className="input-container">
          <p className="form-label">New Password</p>
          <div className="password-container">
            <input
              name="pwd"
              placeholder="New password"
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

          <p className="form-label">New Password</p>

          <div className="password-container">
            <input
              name="pwd"
              placeholder="Confirm password"
              type={isConfirmPassword ? 'password' : 'text'}
              value={confirmPassword}
              className="form-input password-input"
              onChange={e => setConfirmPassword(e.target.value)}
            />

            <button
              className="show-password"
              onClick={() => setIsConfirmPassword(prevState => !prevState)}
            >
              {isConfirmPassword ? 'Show' : 'Hide'}
            </button>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            handleResetPassword();
          }}
        >
          RESET PASSWORD
        </button>

        <p
          className="forgot-password"
          onClick={() => {
            navigate('/');
          }}
        >
          Login now
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordFromEmail;
