import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CheckoutPage from './pages/CheckoutPage';
import TShirtDesigner from './pages/TShirtDesigner';
import { ShopProvider, ShopContext } from './context/ShopContext';
import { useContext } from 'react';
import './App.css';

// Protected Route for Admin
const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useContext(ShopContext);
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

function AppContent() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/design" element={<TShirtDesigner />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <ShopProvider>
      <Router>
        <AppContent />
      </Router>
    </ShopProvider>
  );
}

export default App;
