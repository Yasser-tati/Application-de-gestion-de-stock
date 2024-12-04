import React, { useState, useEffect } from 'react';
import Menu from '../Menu/Menu';
import './Cash.css';
import { useNavigate } from 'react-router-dom';
import { RiAdminLine } from "react-icons/ri";
import { GetToken } from '../../../Services/auth';

const Cash = () => {
  const navigate = useNavigate();
  const [cashEntries, setCashEntries] = useState([]);
  const [totalCash, setTotalCash] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [amountAfterMotifs, setAmountAfterMotifs] = useState(0);
  const adminName = localStorage.getItem('username');
  useEffect(() => {

    let token = GetToken();
    if (!token) navigate('/login');

    fetch('http://164.92.219.176:8001/api/charges', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        // conver the amount to number
        data.data.forEach((entry) => entry.amount = parseFloat(entry.amount));
        setCashEntries(data.data);
      });

    fetch('http://164.92.219.176:8001/api/charges/addedAmountByAdmin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setTotalCash(parseFloat(data.data.amount));
      });

    
    const totalMotifs = cashEntries.reduce((sum, entry) => sum + Number(entry.amount), 0);

    setAmountAfterMotifs(totalCash - totalMotifs);
  }, []);

  useEffect(() => {
    const totalMotifs = cashEntries.reduce((sum, entry) => sum + entry.amount, 0);
    setAmountAfterMotifs(totalCash - totalMotifs);
    console.log('totalMotifs', totalMotifs);
    console.log('totalCash', totalCash);
  }, [cashEntries, totalCash]);

  const handleAddMoneyClick = () => {
    setIsPopupVisible(true);
  };

  const handleSave = () => {
    const amount = parseFloat(newAmount);

    let token = GetToken();
    if (!token) navigate('/login');

    fetch('http://164.92.219.176:8001/api/charges/addAmountByAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: amount
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });




    if (isNaN(amount) || amount === 0) {
      setErrorMessage('Veuillez entrer une valeur valide.');
    } else {
      setTotalCash(totalCash + amount);
      setIsPopupVisible(false);
      setNewAmount('');
      setErrorMessage('');
    }
  };

  return (
    <div className="cash-page">
      <Menu />

      <div className="cash-content">
        <div className="cash-header">
          <h2 className="cash-title">Caisse Totale</h2>
          <div className="admin-info"><RiAdminLine />&nbsp;&nbsp;Admin: {adminName}</div>
        </div>

        <div className="cash-nav">
          <p>Argent ajouté par administrateur: {totalCash} Dh</p>
        </div>

        <div className="cash-table-container">
          <table className="cash-table">
            <thead>
              <tr>
                <th>Motif</th>
                <th>Prix (Dh)</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {cashEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.motif}</td>
                  <td>{entry.amount}</td>
                  <td>{entry.date}</td>
                  <td>{entry.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cash-footer">
          <div className="cash-footer-left">
            <p className="cash-motifs-info">
              Argent après motifs: {isNaN(amountAfterMotifs) ? 'NaN' : amountAfterMotifs.toFixed(2)} Dh
            </p>
          </div>
          <button className="cash-add-money-btn" onClick={handleAddMoneyClick}>Ajouter</button>
        </div>

        {isPopupVisible && (
          <div className="cash-popup">
            <div className="cash-popup-content">
              <h3>Ajouter de l'argent</h3>
              {errorMessage && <p className="cash-error-message">{errorMessage}</p>}
              <label>Montant (Dh):</label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Entrez le montant"
                required
              />
              <div className="cash-popup-buttons">
                <button onClick={handleSave}>Ajouter</button>
                <button className="cancel" onClick={() => { setIsPopupVisible(false); setErrorMessage(''); }}>Annuler</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cash;
