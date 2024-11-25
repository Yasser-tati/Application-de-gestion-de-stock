import React, { useState, useEffect } from 'react';
import { FaUserTie, FaBoxOpen, FaTag, FaFileAlt, FaCaretDown, FaCheckCircle } from 'react-icons/fa';
import { RiAdminLine } from "react-icons/ri";
import Menu from '../Menu/Menu';
import './Sales.css';
import { IoIosSave } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { GetToken } from '../../../Services/auth';

const Sales = () => {
  const navigate = useNavigate();

  const [vendeur, setVendeur] = useState('');
  const [quantite, setQuantite] = useState(0);
  const [prixUnitaire, setPrixUnitaire] = useState(0);
  const [totalPrix, setTotalPrix] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);

  // Fetch products from API
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
        if (data?.data) {
          const availableProducts = data.data.filter((product) => product.count > 0); // Filter out products with stock = 0
          setProducts(availableProducts);
          setFilteredProducts(availableProducts);
        }
      });
  }, []);

  // Automatically set price based on the selected product
  useEffect(() => {
    const product = products.find((p) => p.name === selectedProduct);
    if (product) {
      setPrixUnitaire(product.price);
    }
  }, [selectedProduct, products]);

  // Recalculate total price
  useEffect(() => {
    setTotalPrix(Math.abs(quantite) * Math.abs(prixUnitaire)); // Ensure absolute values
  }, [quantite, prixUnitaire]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let token = GetToken();
    if (!token) navigate('/login');

    const selectedProductData = products.find((p) => p.name === selectedProduct);

    if (!selectedProductData) {
      alert('Veuillez sélectionner un produit valide.');
      return;
    }

    if (quantite > selectedProductData.count) {
      alert('La quantité saisie dépasse le stock disponible.');
      return;
    }

    const data = {
      buyer_name: vendeur,
      count: Math.abs(quantite), // Ensure positive
      total_price: totalPrix,
      unit_price: Math.abs(prixUnitaire), // Ensure positive
      description,
      product_id: selectedProductData.id,
    };

    fetch('http://164.92.219.176:8001/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        setSuccessPopupVisible(true);
        setVendeur('');
        setSelectedProduct('');
        setQuantite(0);
        setPrixUnitaire(0);
        setTotalPrix(0);
        setDescription('');
      });
  };

  return (
    <div className="sales-page">
      <Menu />

      <div className="sales-content">
        <div className="sales-header-section">
          <h2 className="sales-title">Ajouter une vente</h2>
          <div className="sales-admin-info"><RiAdminLine />&nbsp;&nbsp;Admin: Monalisa</div>
        </div>

        <div className="sales-form">
          <form onSubmit={handleSubmit}>
            <div className="sales-form-group">
              <label htmlFor="vendeur">
                <FaUserTie className="sales-icon" /> Nom du vendeur:
              </label>
              <input
                type="text"
                id="vendeur"
                value={vendeur}
                onChange={(e) => setVendeur(e.target.value)}
                placeholder="Nom du vendeur"
                required
              />
            </div>

            <div className="sales-form-group">
              <label htmlFor="produit">
                <FaBoxOpen className="sales-icon" /> Produit:
              </label>
              <div className="sales-dropdown-container">
                <input
                  type="text"
                  id="productSearch"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  placeholder="Rechercher un produit"
                  onFocus={() => setIsDropdownVisible(true)}
                />
                <FaCaretDown
                  className="sales-dropdown-icon"
                  onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                />
                {isDropdownVisible && (
                  <div className="sales-dropdown">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="sales-dropdown-item"
                          onClick={() => {
                            setSelectedProduct(product.name);
                            setIsDropdownVisible(false);
                          }}
                        >
                          {product.name} (Stock: {product.count})
                        </div>
                      ))
                    ) : (
                      <div className="sales-dropdown-item">Aucun produit trouvé</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="sales-form-group">
              <label htmlFor="quantite">
                <FaBoxOpen className="sales-icon" /> Quantité:
              </label>
              <input
                type="number"
                id="quantite"
                value={quantite}
                onChange={(e) => setQuantite(Math.abs(parseInt(e.target.value) || 0))}
                required
              />
            </div>

            <div className="sales-form-group">
              <label htmlFor="prixUnitaire">
                <FaTag className="sales-icon" /> Prix unitaire (Dh):
              </label>
              <input
                type="number"
                id="prixUnitaire"
                value={prixUnitaire}
                onChange={(e) => setPrixUnitaire(Math.abs(parseFloat(e.target.value) || 0))}
                required
              />
            </div>

            <div className="sales-form-group">
              <label htmlFor="totalPrix">
                <FaTag className="sales-icon" /> Prix total (Dh):
              </label>
              <input
                type="number"
                id="totalPrix"
                value={totalPrix}
                readOnly
              />
            </div>

            <div className="sales-form-group">
              <label htmlFor="description">
                <FaFileAlt className="sales-icon" /> Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Entrez une description"
                required
              ></textarea>
            </div>

            <button type="submit" className="sales-submit-btn"><IoIosSave />&nbsp;&nbsp;Enregistrer la vente</button>
          </form>
        </div>
      </div>

      {successPopupVisible && (
        <div className="success-popup">
          <div className="success-popup-content">
            <FaCheckCircle className="success-icon" />
            <p>Vente enregistrée avec succès !</p>
            <button
              className="close-popup-btn"
              onClick={() => setSuccessPopupVisible(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
