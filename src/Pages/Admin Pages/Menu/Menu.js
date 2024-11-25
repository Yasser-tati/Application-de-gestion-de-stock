import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'; // Use NavLink instead of Link
import { FaHome, FaBox, FaUsers, FaChartBar, FaCashRegister, FaStore, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { GetToken, getRole } from '../../../Services/auth';
import './Menu.css';


const sidebarNavItems = [
  { display: 'Accueil', icon: <FaHome />, to: '/dashboard', section: 'dashboard' },
  { display: 'Ajouter un produit', icon: <FaStore />, to: '/products', section: 'products' },
  { display: 'Stock', icon: <FaBox />, to: '/stock', section: 'stock' },
  { display: 'Vente', icon: <FaShoppingCart />, to: '/sales', section: 'sales' },
  { display: 'Tableau de ventes', icon: <FaChartBar />, to: '/tableofsales', section: 'tableofsales' },
  { display: 'Les charges', icon: <FaUsers />, to: '/charges', section: 'charges' },
  { display: 'Caisse totale', icon: <FaCashRegister />, to: '/cash', section: 'cash' }
];

const sidebarNavItemsForUser = [
  { display: 'Accueil', icon: <FaHome />, to: '/dashboard', section: 'dashboard' },
  { display: 'Ajouter un produit', icon: <FaStore />, to: '/products', section: 'products' },
  { display: 'Stock', icon: <FaBox />, to: '/stock', section: 'stock' },
  { display: 'Vente', icon: <FaShoppingCart />, to: '/sales', section: 'sales' },
  { display: 'Tableau de ventes', icon: <FaChartBar />, to: '/tableofsales', section: 'tableofsales' }
];

const Menu = () => {
  const navigate = useNavigate();
  const API_URL = 'http://164.92.219.176:8001/api';
  const handleLogout = () => {

    let token = GetToken();
    if (!token) navigate('/login');

    let res = fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    res.then((res) => res.json()).then((data) => {
      if (data.error === false) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login', { replace: true });
      }
    });
  };

  return (
    <div className="menu">
      <div className="menu-logo">
        <img src={require('../../../Assets/Logo.jpg')} alt="Logo" className="menu-logo-img" />
      </div>

      <div className="menu-nav">
        {
          getRole() === 'user' ? (
            sidebarNavItemsForUser.map((item, index) => (
              <NavLink
                to={item.to}
                key={index}
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              >
                <div className="menu-item-icon">{item.icon}</div>
                <div className="menu-item-text">{item.display}</div>
              </NavLink>
            ))) : (

            sidebarNavItems.map((item, index) => (
              <NavLink
                to={item.to}
                key={index}
                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              >
                <div className="menu-item-icon">{item.icon}</div>
                <div className="menu-item-text">{item.display}</div>
              </NavLink>
            ))
          )
        }
      </div>

      <div className="logout">
        <div className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          <span>Déconnexion</span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
