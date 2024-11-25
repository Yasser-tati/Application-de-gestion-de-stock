import React, { useState } from 'react';
import { FaMoneyBill, FaCalendarAlt, FaComment, FaCheckCircle } from 'react-icons/fa'; // Icons for form fields and success popup
import Menu from '../Menu/Menu';
import { RiAdminLine } from "react-icons/ri";
import './Charges.css';
import { useNavigate } from 'react-router-dom';
import { IoIosSave } from "react-icons/io";
import { GetToken } from '../../../Services/auth';

const Charges = () => {
  const navigate = useNavigate();
  const [motif, setMotif] = useState('');
  const [prix, setPrix] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let token = GetToken();
    if (!token) navigate('/login');

    // Send the charge data to the server
    fetch('http://164.92.219.176:8001/api/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        motif: motif,
        amount: prix,
        date: date,
        description: description
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        // Show success popup
        setSuccessPopupVisible(true);

        // Hide popup after 3 seconds
        setTimeout(() => setSuccessPopupVisible(false), 3000);

        // Clear form fields
        setMotif('');
        setPrix('');
        setDate('');
        setDescription('');
      });
  };

  return (
    <div className="charges-page">
      <Menu />

      <div className="charges-content">
        {/* Admin Section and Charges Title */}
        <div className="charges-header">
          <h2 className="charges-title">Ajouter une charge</h2>
          <div className="charges-admin-info"><RiAdminLine />&nbsp;&nbsp;Admin: Monalisa</div>
        </div>

        {/* Charges Form */}
        <div className="charges-form">
          <form onSubmit={handleSubmit}>
            {/* Motif */}
            <div className="charges-form-group">
              <label htmlFor="motif">
                <FaMoneyBill /> Motif:
              </label>
              <input
                type="text"
                id="motif"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="Entrez le motif de la charge"
                required
              />
            </div>

            {/* Prix */}
            <div className="charges-form-group">
              <label htmlFor="prix">
                <FaMoneyBill /> Prix (Dh):
              </label>
              <input
                type="number"
                id="prix"
                value={prix}
                onChange={(e) => setPrix(Math.abs(parseFloat(e.target.value)) || '')}
                placeholder="Entrez le prix en dirhams"
                required
              />
            </div>

            {/* Date */}
            <div className="charges-form-group">
              <label htmlFor="date">
                <FaCalendarAlt /> Date:
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="charges-form-group">
              <label htmlFor="Description">
                <FaComment /> Description:
              </label>
              <textarea
                id="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Entrez une description"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="charges-submit-btn"><IoIosSave />&nbsp;&nbsp;Enregistrer la charge</button>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {successPopupVisible && (
        <div className="success-popup">
          <div className="success-popup-content">
            <FaCheckCircle className="success-icon" />
            <p>Charge ajoutée avec succès !</p>
            <button onClick={() => setSuccessPopupVisible(false)} className="success-close-btn">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Charges;
