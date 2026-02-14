import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { cart, isAdmin, logoutAdmin } = useContext(ShopContext);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <img src={logo} alt="GTΞRA Logo" className="logo-img" />
          <span>GTΞRA</span>
        </Link>
        
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/design" className="nav-link" onClick={() => setIsMenuOpen(false)}>Design T-Shirt</Link>
          <Link to="/cart" className="nav-link cart-link" onClick={() => setIsMenuOpen(false)}>
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
          {isAdmin ? (
            <div className="admin-menu">
              <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { logoutAdmin(); setIsMenuOpen(false); }} className="btn-logout">
                <LogOut size={20} /> Logout
              </button>
            </div>
          ) : (
            <div className="admin-menu">
                <Link to="/admin-login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    <User size={24} />
                </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
