import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../Assets/Logo.jpg';
import { FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const API_URL = 'http://164.92.219.176:8001/api';
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let response = fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
          username : username,
          password : password
       }),
    });

    response.then((res) => res.json()).then((data) => {
       if (data.token) {
         localStorage.setItem('token', data.token);
         localStorage.setItem('role', data.role ? data.role : 'admin');
         navigate('/dashboard', { replace: true });
       } else {
          setUsername('');
          setPassword('');
          setErrorMessage('Nom d\'utilisateur ou mot de passe incorrect. Veuillez réessayer.');
        }

    }); 

  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Toggle the password visibility
  };

  const closePopup = () => {
    setErrorMessage(''); // Close popup
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <div className="input-with-icon">
              <i className="fas fa-user"></i> {/* User icon */}
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i> {/* Lock icon */}
              <input
                type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
              />
              <span onClick={toggleShowPassword} className="toggle-password">
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon to toggle */}
              </span>
            </div>
          </div>

          <button type="submit" className="login-button">Connexion</button>
        </form>

        {/* Popup for incorrect login */}
        {errorMessage && (
          <div className="popup">
            <div className="popup-content">
              <FaTimesCircle className="popup-icon" /> {/* Red X icon */}
              <p>{errorMessage}</p>
              <button onClick={closePopup} className="popup-close-button">&times;</button> {/* Red X close button */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
