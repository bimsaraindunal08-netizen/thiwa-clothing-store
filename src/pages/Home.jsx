import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Home = () => {
  const { products, addToCart, galleryImages } = useContext(ShopContext);
  const [productSizes, setProductSizes] = useState({});

  const handleSizeSelect = (productId, size) => {
    setProductSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product) => {
    const selectedSize = productSizes[product.id] || 'M';
    addToCart({ ...product, size: selectedSize });
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-logo-container">
            <div className="hero-logo-3d">
              <img src={logo} alt="GTΞRA 3D Logo" />
            </div>
          </div>
          <h1>GTΞRA</h1>
          <p>-Define Your Own Era-</p>
          <a href="#shop" className="cta-button">Shop Now</a>
        </div>
      </section>

      <div id="shop" className="product-grid container">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} />
              <div className="overlay">
                <button onClick={() => handleAddToCart(product)} className="btn-add-cart">
                  <ShoppingBag size={20} /> Add to Cart
                </button>
              </div>
            </div>
            <div className="product-info">
              <span className="category">{product.category}</span>
              <h3>{product.name}</h3>
              <div className="size-selector-product">
                {['S', 'M', 'L', 'XL', '2XL'].map(size => (
                  <button
                    key={size}
                    className={`size-btn-small ${(productSizes[product.id] || 'M') === size ? 'active' : ''}`}
                    onClick={() => handleSizeSelect(product.id, size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="price-rating">
                <span className="price">LKR {product.price}</span>
                <div className="rating">
                  <Star size={16} fill="#FFD700" stroke="#FFD700" />
                  <span>4.8</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="gallery-section">
        <div className="container overflow-visible">
          <div className="section-header">
            <h2>Design Gallery</h2>
            <p>Explore our recent custom prints and creative designs from GTΞRA.</p>
          </div>
          <div className="gallery-carousel-wrapper">
            <div className="gallery-carousel">
              {galleryImages.map((img, index) => (
                <div 
                  key={img.id} 
                  className="gallery-carousel-item"
                  style={{ '--i': index, '--total': galleryImages.length }}
                >
                  <img src={img.image} alt="Custom Shirt Design" />
                </div>
              ))}
            </div>
            
            <div className="carousel-floor"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
