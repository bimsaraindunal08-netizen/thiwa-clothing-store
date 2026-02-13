import React, { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Trash2, Edit2, Plus, Save, X, Image as ImageIcon, Upload, Home as HomeIcon } from 'lucide-react';

const AdminDashboard = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    removeProduct, 
    paymentInstructions, 
    setPaymentInstructions,
    updateAdminCredentials,
    galleryImages,
    addGalleryImage,
    removeGalleryImage,
    orders
  } = useContext(ShopContext);


  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: ''
  });
  
  const [adminUser, setAdminUser] = useState({ username: '', password: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const handleFileUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.image) {
      alert("Please upload a photo for the product first!");
      return;
    }
    addProduct({
      ...newProduct,
      price: Number(newProduct.price)
    });
    setNewProduct({ name: '', price: '', image: '', description: '', category: '' });
    alert('✅ Product added successfully! Changes saved.');
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    updateProduct(editingProduct.id, {
      ...editingProduct,
      price: Number(editingProduct.price)
    });
    setEditingProduct(null);
    alert('✅ Product updated successfully! Changes saved.');
  };
  
  const handleUpdateAdmin = (e) => {
      e.preventDefault();
      if(adminUser.username && adminUser.password) {
          updateAdminCredentials(adminUser.username, adminUser.password);
          setAdminUser({ username: '', password: '' });
          alert('✅ Admin credentials updated successfully! Changes saved.\n\nNew login details:\nUsername: ' + adminUser.username + '\nPassword: ' + adminUser.password);
      }
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`)) {
      removeProduct(product.id);
      alert('✅ Product deleted successfully! Changes saved.');
    }
  };

  const handleDeleteGalleryImage = (id) => {
    if (window.confirm('Are you sure you want to delete this gallery image?\n\nThis action cannot be undone.')) {
      removeGalleryImage(id);
      alert('✅ Gallery image deleted successfully! Changes saved.');
    }
  };

  return (
    <div className="admin-dashboard container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <Link to="/" className="btn-back-store">
          <HomeIcon size={18} /> Back to Store
        </Link>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button 
          className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Payment Settings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Manage Gallery
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          View Orders
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Admin Settings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'products' && (
          <div className="products-manager">
            <div className="add-product-section">
              <h3>Add New Product</h3>
              <form onSubmit={handleAddProduct} className="product-form">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Price (LKR)"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  required
                />
                <div className="product-image-upload-section">
                  <div className="upload-controls">
                    <button 
                      type="button" 
                      className="btn-upload-trigger"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <Upload size={18} /> Select Product Photo
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={e => handleFileUpload(e, (base64) => setNewProduct({...newProduct, image: base64}))}
                      style={{ display: 'none' }}
                    />
                  </div>
                  
                  {newProduct.image ? (
                    <div className="image-preview-container">
                      <img src={newProduct.image} alt="Preview" className="upload-preview" />
                      <button 
                        type="button" 
                        className="btn-remove-preview"
                        onClick={() => setNewProduct({...newProduct, image: ''})}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="image-placeholder">
                      <ImageIcon size={32} />
                      <span>No photo selected</span>
                    </div>
                  )}
                </div>
                {!newProduct.image && <p className="upload-help">Click the button above to choose a photo from your PC</p>}
                <input
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  required
                />
                <button type="submit" className="btn-add">
                  <Plus size={18} /> Add Product
                </button>
              </form>
            </div>

            <div className="products-list">
              <h3>Current Products</h3>
              {products.map(product => (
                <div key={product.id} className="admin-product-item">
                  {editingProduct && editingProduct.id === product.id ? (
                    <form onSubmit={handleUpdateProduct} className="edit-form">
                      <div className="form-row">
                          <input
                            value={editingProduct.name}
                            onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                          />
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={e => setEditingProduct({...editingProduct, price: e.target.value})}
                          />
                      </div>
                      <div className="edit-image-upload">
                        <button 
                          type="button" 
                          className="btn-upload-trigger small"
                          onClick={() => editFileInputRef.current.click()}
                        >
                          <Upload size={14} /> Change Photo
                        </button>
                        <input
                          type="file"
                          ref={editFileInputRef}
                          accept="image/*"
                          onChange={e => handleFileUpload(e, (base64) => setEditingProduct({...editingProduct, image: base64}))}
                          style={{ display: 'none' }}
                        />
                        {editingProduct.image && (
                          <img src={editingProduct.image} alt="Preview" className="edit-preview-small" />
                        )}
                      </div>
                      <input
                        value={editingProduct.image}
                        onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                        placeholder="Image URL"
                      />
                      <div className="action-buttons">
                        <button type="submit" className="btn-save"><Save size={18}/></button>
                        <button type="button" onClick={() => setEditingProduct(null)} className="btn-cancel"><X size={18}/></button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <img src={product.image} alt={product.name} />
                      <div className="product-details">
                        <h4>{product.name}</h4>
                        <p>LKR {product.price}</p>
                      </div>
                      <div className="action-buttons">
                        <button onClick={() => setEditingProduct(product)} className="btn-edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDeleteProduct(product)} className="btn-delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="payment-settings">
            <h3>Payment Instructions for Customers</h3>
            <p>This text will be shown to customers during checkout.</p>
            <textarea
              className="payment-textarea"
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              rows={10}
            />
            <button 
              className="btn-add" 
              style={{marginTop: '1rem'}}
              onClick={() => alert('✅ Payment instructions saved successfully!')}
            >
              <Save size={18} /> Save Payment Instructions
            </button>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="gallery-manager">
            <div className="add-gallery-section">
              <h3>Gallery Management</h3>
              <p>Add photos of shirts to display in the design gallery.</p>
              
              <div className="gallery-upload-card">
                <label className="gallery-upload-btn">
                  <Upload size={24} />
                  <span>Choose Photo to Upload</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, (base64) => {
                      addGalleryImage(base64);
                      alert('✅ Gallery image uploaded successfully! Changes saved.');
                    })}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <div className="admin-gallery-grid">
              {galleryImages.map(img => (
                <div key={img.id} className="admin-gallery-item">
                  <img src={img.image} alt="Gallery" />
                  <button 
                    onClick={() => handleDeleteGalleryImage(img.id)} 
                    className="btn-delete-float"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders-manager">
            <h3>Customer Orders</h3>
            {orders.length === 0 ? (
              <div className="no-orders">
                <p>No orders placed yet.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => {
                  const orderTotal = order.items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
                  return (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h4>Order #{order.id}</h4>
                          <span className="order-date">
                            {new Date(order.date).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className={`order-status status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </div>
                      </div>
                      
                      <div className="order-customer-info">
                        <div className="customer-detail">
                          <strong>👤 Customer:</strong> {order.customerInfo.name}
                        </div>
                        <div className="customer-detail">
                          <strong>📞 Phone:</strong> {order.customerInfo.phone}
                        </div>
                        <div className="customer-detail">
                          <strong>📍 Address:</strong> {order.customerInfo.address}
                        </div>
                        <div className="customer-detail">
                          <strong>💳 Payment:</strong> {order.paymentMethod === 'card' ? 'Online Payment' : 'Bank Transfer'}
                        </div>
                      </div>
                      
                      <div className="order-items">
                        <strong>📦 Items:</strong>
                        <div className="items-list">
                          {order.items.map((item, index) => (
                            <div key={index} className="order-item-row">
                              <img src={item.image} alt={item.name} className="order-item-img" />
                              <div className="order-item-details">
                                <span className="item-name">{item.name}</span>
                                {item.size && <span className="item-size-badge">Size: {item.size}</span>}
                                <span className="item-quantity">Qty: {item.quantity || 1} × LKR {item.price}</span>
                              </div>
                              <div className="item-total">
                                LKR {item.price * (item.quantity || 1)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="order-total">
                        <strong>Total Amount:</strong>
                        <span className="total-amount">LKR {orderTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'settings' && (
            <div className="admin-settings">
                <h3>Update Admin Credentials</h3>
                <form onSubmit={handleUpdateAdmin} className="admin-form">
                    <input 
                        type="text" 
                        placeholder="New Username"
                        value={adminUser.username}
                        onChange={e => setAdminUser({...adminUser, username: e.target.value})}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="New Password"
                        value={adminUser.password}
                        onChange={e => setAdminUser({...adminUser, password: e.target.value})}
                        required
                    />
                    <button type="submit" className="btn-save">Update Credentials</button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
