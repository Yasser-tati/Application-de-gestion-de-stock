import React, { useState, useEffect } from 'react';
import Menu from '../Menu/Menu';
import { FiEdit } from "react-icons/fi";
import { GetToken, getRole } from '../../../Services/auth'; // Added getRole for role check
import { RiAdminLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import './Stock.css';


const Stock = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const adminName = localStorage.getItem('username');
  useEffect(() => {
    let token = GetToken();
    if (!token) navigate('/login');

    fetch('http://164.92.219.176:8001/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data);
      });
  }, []);

  const handleModifyClick = (product) => {
    setCurrentProduct({ ...product, totalPrix: product.count * product.price });
    setIsPopupVisible(true);
  };

  const handleSave = () => {
    if (!currentProduct.name || !currentProduct.count || !currentProduct.price || !currentProduct.description) {
      alert('Tous les champs doivent être remplis avant de pouvoir sauvegarder.');
      return;
    }

    let token = GetToken();
    if (!token) navigate('/login');

    fetch(`http://164.92.219.176:8001/api/products/${currentProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: currentProduct.name,
        count: currentProduct.count,
        price: currentProduct.price,
        description: currentProduct.description,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === currentProduct.id
              ? { ...currentProduct, totalPrix: currentProduct.count * currentProduct.price }
              : product
          )
        );
        setIsPopupVisible(false);
      });
  };

  const handleFieldChange = (field, value) => {
    setCurrentProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
      totalPrix: field === 'count' || field === 'price'
        ? (field === 'count' ? value : prevProduct.count) * (field === 'price' ? value : prevProduct.price)
        : prevProduct.totalPrix,
    }));
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.count === 0 ? 1 : b.count === 0 ? -1 : 0));

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const isSuperAdmin = getRole() === 'admin';

  return (
    <div className="stock-page">
      <Menu />
      <div className="stock-content">
        <div className="stock-header-section">
          <h2 className="stock-title">Stock</h2>
          <div className="admin-info"><RiAdminLine />&nbsp;&nbsp;Admin: {adminName}</div>
        </div>

        <div className="stock-search-bar">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="stock-table-container">
          <table className="stock-products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom du produit</th>
                <th>Quantité</th>
                <th>Prix unitaire (Dh)</th>
                <th>Prix total (Dh)</th>
                <th>Description</th>
                {isSuperAdmin && <th>Modifier</th>} {/* Only show header if role is SuperAdmin */}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={`http://164.92.219.176:8001/api/media/${product.media_id}`}
                      alt={product.name}
                      onClick={() => handleImageClick(`http://164.92.219.176:8001/api/media/${product.media_id}`)}
                      className="stock-product-image"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.count}</td>
                  <td>{product.price}</td>
                  <td>{product.price * product.count}</td>
                  <td>{product.description}</td>
                  {isSuperAdmin && (
                    <td>
                      <button className="modify-btn" onClick={() => handleModifyClick(product)}><FiEdit />
                        Modifier
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isPopupVisible && currentProduct && (
          <div className="stock-popup">
            <div className="stock-popup-content">
              <h3>Modifier le produit</h3>
              <label>Nom du produit:</label>
              <input
                type="text"
                value={currentProduct.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
              />
              <label>Quantité:</label>
              <input
                type="number"
                value={currentProduct.count}
                onChange={(e) => handleFieldChange('count', parseInt(e.target.value))}
              />
              <label>Prix unitaire (Dh):</label>
              <input
                type="number"
                value={currentProduct.price}
                onChange={(e) => handleFieldChange('price', parseFloat(e.target.value))}
              />
              <label>Prix total (Dh):</label>
              <input type="number" value={currentProduct.totalPrix} readOnly />
              <label>Description:</label>
              <textarea
                value={currentProduct.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              ></textarea>

              <div className="stock-popup-buttons">
                <button className="save" onClick={handleSave}>
                  Sauvegarder
                </button>
                <button className="cancel" onClick={() => setIsPopupVisible(false)}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {isImageModalOpen && (
          <div className="image-modal" onClick={() => setIsImageModalOpen(false)}>
            <img src={selectedImage} alt="Zoomed" className="modal-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;
