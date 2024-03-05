import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logoDark from '../assets/logo-full.png';
import { genericPostRequest } from '../services/api/genericPostRequest';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      const payload = {
        username: email,
        email: email,
        password: password,
      };

      const res = await genericPostRequest('admins/signin', payload);
      localStorage.setItem('token', res.token);
      localStorage.setItem('admin', JSON.stringify(res.admin));

      setError(false);
      setErrorMessage('');
      setSuccess(true);
      setSuccessMessage('Login in Successfully');
      setLoading(false);

      navigate('/admin');
    } catch (error) {
      setError(true);
      setErrorMessage(error.response.data?.message ?? 'Unknown error occured');
      setSuccess(false);
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-component">
      <div className="login-card__container">
        {loading && <p className="loader">Logging you in...</p>}
        {error && <p className="loader--error">{errorMessage}</p>}
        {success && <p className="loader--success">{successMessage}</p>}
        <img src={logoDark} alt="" className="logo-dark" />
        <h3 className="login-card_title">Login</h3>
        <div className="login-card_form"></div>
        <div className="input-container">
          <p className="form-label">Username</p>
          <input
            type="text"
            placeholder="Email or Username"
            className="form-input"
            onChange={e => handleInputChange(e, setEmail)}
          />
        </div>
        <div className="input-container">
          <p className="form-label">Password</p>
          <div className="password-container">
            <input
              name="password"
              placeholder="Password"
              type={showPassword ? 'password' : 'text'}
              value={password}
              className="form-input password-input"
              onChange={e => handleInputChange(e, setPassword)}
            />

            <button
              className="show-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Show' : 'Hide'}
            </button>
          </div>
        </div>

        <button className="btn-primary" onClick={handleLogin}>
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
