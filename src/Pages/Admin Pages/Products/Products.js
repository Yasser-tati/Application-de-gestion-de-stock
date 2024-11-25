import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaTag, FaImage, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { RiAdminLine } from "react-icons/ri";
import Menu from '../Menu/Menu';
import { GetToken } from '../../../Services/auth';
import './Products.css';
import { useNavigate } from 'react-router-dom';
import { IoIosAddCircleOutline } from "react-icons/io";


const Products = () => {
  const navigate = useNavigate();
  const [quantite, setQuantite] = useState(0);
  const [prixUnitaire, setPrixUnitaire] = useState(0);
  const [totalPrix, setTotalPrix] = useState(0);
  const [produit, setProduit] = useState({
    nomProduit: '',
    description: '',
    image: null,
  });
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  // Calculate total price automatically when quantity or price per unit changes
  useEffect(() => {
    setTotalPrix(Math.abs(quantite) * Math.abs(prixUnitaire));
  }, [quantite, prixUnitaire]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const sanitizedQuantite = Math.abs(quantite); // Ensure absolute positive value
    const sanitizedPrixUnitaire = Math.abs(prixUnitaire); // Ensure absolute positive value

    if (sanitizedQuantite === 0 || sanitizedPrixUnitaire === 0) {
      alert('La quantité et le prix unitaire doivent être des valeurs positives non nulles.');
      return;
    }

    let token = GetToken();
    if (!token) navigate('/login');

    fetch('http://164.92.219.176:8001/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: produit.nomProduit,
        description: produit.description,
        media_id: produit.image,
        count: sanitizedQuantite,
        price: sanitizedPrixUnitaire,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setIsSuccessPopupVisible(true); // Show success popup
          setProduit({ nomProduit: '', description: '', image: null }); // Reset fields
          setQuantite(0);
          setPrixUnitaire(0);
        }
      })
      .catch((err) => console.error(err));
  };

  const uploadMedia = (file) => {
    let api_endpoint = 'http://164.92.219.176:8001/api/media/upload';

    let token = GetToken();
    if (!token) navigate('/login');

    let formData = new FormData();
    formData.append('file', file);

    fetch(api_endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProduit({ ...produit, image: data.data.media_id });
      });
  };

  return (
    <div className="products-page">
      <Menu />

      <div className="products-content">
        {/* Admin Section and Product Title */}
        <div className="products-header-section">
          <h2 className="products-title">Ajouter un produit</h2>
          <div className="products-admin-info"><RiAdminLine />&nbsp;&nbsp;Admin: Monalisa</div>
        </div>

        {/* Product Form */}
        <div className="products-form">
          <form onSubmit={handleSubmit}>
            {/* Product Image */}
            <div className="products-form-group">
              <label htmlFor="image">
                <FaImage /> Image du produit:
              </label>
              <input
                type="file"
                id="image"
                onChange={(e) => uploadMedia(e.target.files[0])}
              />
            </div>

            {/* Product Name */}
            <div className="products-form-group">
              <label htmlFor="nomProduit">
                <FaBoxOpen /> Nom du produit:
              </label>
              <input
                type="text"
                id="nomProduit"
                value={produit.nomProduit}
                onChange={(e) => setProduit({ ...produit, nomProduit: e.target.value })}
                placeholder="Entrez le nom du produit"
                required
              />
            </div>

            {/* Quantité */}
            <div className="products-form-group">
              <label htmlFor="quantite">
                <FaBoxOpen /> Quantité:
              </label>
              <input
                type="number"
                id="quantite"
                value={quantite}
                onChange={(e) => setQuantite(Math.abs(parseInt(e.target.value) || 0))}
                placeholder="Entrez la quantité du produit"
                required
              />
            </div>

            {/* Prix Unitaire (Dirhams) */}
            <div className="products-form-group">
              <label htmlFor="prixUnitaire">
                <FaTag /> Prix unitaire (Dh):
              </label>
              <input
                type="number"
                id="prixUnitaire"
                value={prixUnitaire}
                onChange={(e) => setPrixUnitaire(Math.abs(parseFloat(e.target.value) || 0))}
                placeholder="Entrez le prix unitaire (en Dirhams)"
                required
              />
            </div>

            {/* Prix Total (Dirhams) */}
            <div className="products-form-group">
              <label htmlFor="totalPrix">
                <FaTag /> Prix total (Dh):
              </label>
              <input
                type="number"
                id="totalPrix"
                value={totalPrix}
                readOnly
                placeholder="Prix total calculé automatiquement"
              />
            </div>

            {/* Description */}
            <div className="products-form-group">
              <label htmlFor="description">
                <FaFileAlt /> Description:
              </label>
              <textarea
                id="description"
                value={produit.description}
                onChange={(e) => setProduit({ ...produit, description: e.target.value })}
                placeholder="Entrez la description du produit"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="products-submit-btn">
              Ajouter le produit
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {isSuccessPopupVisible && (
        <div className="products-popup">
          <div className="products-popup-content">
            <FaCheckCircle className="products-popup-icon" />
            <h3>Produit ajouté avec succès !</h3>
            <button
              className="products-popup-close-btn"
              onClick={() => setIsSuccessPopupVisible(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
