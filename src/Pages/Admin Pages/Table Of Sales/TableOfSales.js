import React, { useState, useEffect } from 'react';
import Menu from '../Menu/Menu';
import './TableOfSales.css';
import { RiAdminLine } from "react-icons/ri";
import { GetToken, getRole } from '../../../Services/auth'; // Added getRole for role check
import { useNavigate } from 'react-router-dom';

const TableOfSales = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]); // State for filtered sales
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  useEffect(() => {
    let token = GetToken();
    if (!token) navigate('/login');
    fetch('http://164.92.219.176:8001/api/sales', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSales(data.data);
        setFilteredSales(data.data); // Initialize filtered sales
        setTotalPrice(data.total_case_amount);
      });
  }, []);

  const handleResetClick = () => {
    setIsPopupVisible(true); // Show the confirmation popup
  };

  const handleConfirmReset = () => {
    let token = GetToken();
    if (!token) navigate('/login');

    fetch('http://164.92.219.176:8001/api/sales/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setTotalPrice(0);
        setFilteredSales([]); // Reset filtered sales
        setSales([]); // Reset sales list
      });

    setIsPopupVisible(false); // Close the popup
  };

  const handleCancelReset = () => {
    setIsPopupVisible(false); // Close the popup without resetting
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredSales(
      sales.filter(
        (sale) =>
          sale.buyer_name.toLowerCase().includes(term) ||
          sale.product.name.toLowerCase().includes(term) ||
          sale.description.toLowerCase().includes(term)
      )
    );
  };

  const isSuperAdmin = getRole() === 'admin'; // Check if user is SuperAdmin

  return (
    <div className="tableofsales-page">
      <Menu />

      <div className="tableofsales-content">
        <div className="tableofsales-header-section">
          <h2 className="tableofsales-title">Tableau des ventes</h2>

          <div className="tableofsales-admin-info"><RiAdminLine />&nbsp;&nbsp;Admin: Monalisa</div>
          
        </div>

        {/* Search Bar */}
        <div className="tableofsales-search-bar">
          <input
            type="text"
            placeholder="Rechercher une vente..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Table Section */}
        <div className="tableofsales-table-container">
          <table className="tableofsales-table">
            <thead>
              <tr>
                <th>Nom du vendeur</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire (Dh)</th>
                <th>Prix Total en DH</th>
                <th>Date</th>
                <th>Commentaire</th>
                <th>Profit (Dh)</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => {
                const prixTotal = sale.count * sale.unit_price; // Quantité x Prix Unitaire
                const totalProfit = ( sale.unit_price - sale.product.price ) * sale.count; // Profit per item sold
                // const totalProfit = profitPerItem * sale.count; // Total Profit for this sale

                return (
                  <tr key={sale.id}>
                    <td>{sale.buyer_name}</td>
                    <td>{sale.product.name}</td>
                    <td>{sale.count}</td>
                    <td>{sale.unit_price.toFixed(2)}</td>
                    <td>{prixTotal.toFixed(2)}</td>
                    <td>{sale.created_at}</td>
                    <td>{sale.description}</td>
                    <td>{totalProfit.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Section */}
      {isSuperAdmin && (
        <div className="tableofsales-footer-section">
          <button className="tableofsales-reset-btn" onClick={handleResetClick}>
            Réinitialiser
          </button>
          <h3>
            Total des ventes : <span>{totalPrice.toFixed(2)} Dh</span>
          </h3>
        </div>
      )}

      {/* Confirmation Popup */}
      {isPopupVisible && (
        <div className="tableofsales-popup">
          <div className="tableofsales-popup-content">
            <h3>Êtes-vous sûr de vouloir réinitialiser le total des ventes ?</h3>
            <div className="tableofsales-popup-buttons">
              <button className="confirm" onClick={handleConfirmReset}>
                Oui
              </button>
              <button className="cancel" onClick={handleCancelReset}>
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableOfSales;
