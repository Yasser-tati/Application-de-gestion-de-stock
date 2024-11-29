import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaUserPlus, FaTrash } from 'react-icons/fa'; // Import trash icon
import { RiAdminLine } from "react-icons/ri";
import { IoIosSave } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { GetToken } from '../../../Services/auth';
import Menu from '../Menu/Menu';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [note, setNote] = useState("");
  const [saleInsights, setSaleInsights] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [newUser, setNewUser] = useState({ client_name: '', amount: '', credit_date: '' });
  const [deletePopupVisible, setDeletePopupVisible] = useState(false); // For delete confirmation
  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(null); // Track the index to delete
  const [showFieldMessage, setShowFieldMessage] = useState(false); // Track for empty fields message
  const adminName = localStorage.getItem('username');
  useEffect(() => {
    // Fetch users from the server
    // get access token
    let token = GetToken();
    if (!token) navigate('/login');

    fetch('http://164.92.219.176:8001/api/credits', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data);
      });


    fetch('http://164.92.219.176:8001/api/note', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setNote(data.data.note);
      });

    fetch('http://164.92.219.176:8001/api/insights?groupBy=month', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSaleInsights(data.data);
      });
  }, []);


  // Add new user validation
  const handleAddUser = () => {
    if (!newUser.client_name || !newUser.amount || !newUser.credit_date) {
      setShowFieldMessage(true);
      return;
    }

    let token = GetToken();
    if (!token) navigate('/login');

    fetch('http://164.92.219.176:8001/api/credits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newUser)
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers([...users, { ...newUser }]);
        setIsPopupVisible(false);
        setNewUser({ client_name: '', amount: '', creadit_date: '' });
        setShowFieldMessage(false);
      });


  };

  // Handle delete confirmation popup
  const handleDeleteUser = (index) => {
    setSelectedDeleteIndex(index);
    setDeletePopupVisible(true); // Show confirmation popup
  };

  // Confirm delete user
  const confirmDeleteUser = () => {

    let token = GetToken();
    if (!token) navigate('/login');

    fetch(`http://164.92.219.176:8001/api/credits/${selectedDeleteIndex}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        fetch('http://164.92.219.176:8001/api/credits', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
          .then((res) => res.json())
          .then((data) => {
            setUsers(data.data);
          });
      });



    setDeletePopupVisible(false);
  };


  const saveNote = () => {
    let token = GetToken();
    if (!token) navigate('/login');

    fetch('http://164.92.219.176:8001/api/note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ note: note })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }
  return (
    <div className="dashboard">
      <Menu />

      <div className="dashboard-content">
        {/* Admin Section */}
        <div className="header-section">
          <h2>Accueil</h2>
          <div className="admin-info"><RiAdminLine />&nbsp;&nbsp;Admin: {adminName}</div>
        </div>

        {/* Middle Section: Diagram and Notes */}
        <div className="middle-section">
          <div className="sales-section">
            <h3>Diagramme des ventes</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={saleInsights}>
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="notes-section">
            <h3>Notes</h3>
            <textarea
              className="notes-textarea"
              placeholder="Écrivez vos notes ici..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button className="save-btn" onClick={saveNote}>
              Enregistrer <IoIosSave />
            </button>
          </div>
        </div>

        {/* User Table Section */}
        <div className="table-section">
          <div className="table-header">
            <h3>Credits</h3>
            <button className="add-btn" onClick={() => setIsPopupVisible(true)}>
              <FaUserPlus /> Ajouter un utilisateur
            </button>
          </div>
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Date</th>
                  <th>Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.client_name}</td>
                    <td>{user.amount}</td>
                    <td>{user.credit_date}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Popup */}
        {isPopupVisible && (
          <div className="popup">
            <div className="popup-content">
              <h3>Ajouter un utilisateur</h3>
              <label>Nom:</label>
              <input
                type="text"
                value={newUser.client_name}
                onChange={(e) => setNewUser({ ...newUser, client_name: e.target.value })}
                placeholder={showFieldMessage && !newUser.client_name ? 'Remplissez ce champ' : "Nom de l'utilisateur"}
                className={showFieldMessage && !newUser.client_name ? 'error-input' : ''}
              />
              <label>Prix (en DH):</label>
              <input
                type="number"
                value={newUser.amount}
                onChange={(e) => setNewUser({ ...newUser, amount: Math.abs(e.target.value) })}
                placeholder={showFieldMessage && !newUser.amount ? 'Remplissez ce champ' : 'Prix'}
                className={showFieldMessage && !newUser.amount ? 'error-input' : ''}
              />
              <label>Date:</label>
              <input
                type="date"
                value={newUser.credit_date}
                onChange={(e) => setNewUser({ ...newUser, credit_date: e.target.value })}
                className={showFieldMessage && !newUser.credit_date ? 'error-input' : ''}
              />
              <div className="popup-buttons">
                <button className="confirm" onClick={handleAddUser}>
                  Ajouter
                </button>
                <button
                  className="cancel"
                  onClick={() => {
                    setIsPopupVisible(false);
                    setShowFieldMessage(false);
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {deletePopupVisible && (
          <div className="popup">
            <div className="popup-content">
              <h3>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</h3>
              <div className="popup-buttons">
                <button className="confirm" onClick={confirmDeleteUser}>
                  Oui
                </button>
                <button className="cancel" onClick={() => setDeletePopupVisible(false)}>
                  Non
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
