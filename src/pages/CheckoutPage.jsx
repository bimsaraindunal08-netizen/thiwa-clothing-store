import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { CheckCircle, AlertCircle, CreditCard, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
    const { cart, paymentInstructions, clearCart, addOrder } = useContext(ShopContext);

    const [orderPlaced, setOrderPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('bank'); // 'bank' or 'card'
    const [isProcessing, setIsProcessing] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        address: ''
    });
    
    const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    const sendWhatsAppNotification = (method, customerInfo) => {
        // Admin WhatsApp numbers (without +)
        const adminNumbers = ['94726444214', '94773274491'];
        
        // Format order items with sizes
        const orderItems = cart.map(item => {
            const sizeInfo = item.size ? ` [Size: ${item.size}]` : '';
            return `  • ${item.name}${sizeInfo}\n    Qty: ${item.quantity || 1} × LKR ${item.price} = LKR ${item.price * (item.quantity || 1)}`;
        }).join('\n\n');
        
        // Get current date and time
        const orderDate = new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Create detailed message for admin
        const message = `🛍️ *NEW ORDER - GTΞRA* 🛍️\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        `📅 *Order Date:* ${orderDate}\n` +
                        `💳 *Payment Method:* ${method === 'card' ? 'Online Payment' : 'Bank Transfer'}\n` +
                        `💰 *Total Amount:* LKR ${total.toLocaleString()}\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        `📦 *ORDER DETAILS:*\n\n${orderItems}\n\n` +
                        `━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        `${customerInfo.name ? `👤 *Customer Name:* ${customerInfo.name}\n` : ''}` +
                        `${customerInfo.phone ? `📞 *Contact:* ${customerInfo.phone}\n` : ''}` +
                        `${customerInfo.address ? `📍 *Address:* ${customerInfo.address}\n\n` : '\n'}` +
                        `━━━━━━━━━━━━━━━━━━━━━\n\n` +
                        `✅ *Status:* ${method === 'card' ? 'Payment Successful ✅' : 'Awaiting Payment Confirmation ⏳'}\n\n` +
                        `_Check Admin Dashboard for full order management._`;

        const encodedMessage = encodeURIComponent(message);
        
        // Open WhatsApp for both admin numbers
        // Primary admin
        window.open(`https://wa.me/${adminNumbers[0]}?text=${encodedMessage}`, '_blank');
        
        // Secondary admin (with slight delay to prevent popup blocker)
        setTimeout(() => {
            window.open(`https://wa.me/${adminNumbers[1]}?text=${encodedMessage}`, '_blank');
        }, 1000);
        
        console.log("✅ Order notifications sent to both admin numbers");
    };

    const handlePlaceOrder = () => {
        // Validate customer information
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
            alert('කරුණාකර ඔබගේ සම්පූර්ණ විස්තර ඇතුළත් කරන්න!\nPlease fill in all customer information!');
            return;
        }

        setIsProcessing(true);
        // Simulate payment/order processing
        setTimeout(() => {
            // Save order to admin panel
            addOrder({
                items: cart,
                customerInfo: customerInfo,
                paymentMethod: paymentMethod,
                total: total
            });
            
            setIsProcessing(false);
            setOrderPlaced(true);
            sendWhatsAppNotification(paymentMethod, customerInfo);
            clearCart();
        }, 2000);
    };




    if (orderPlaced) {
        return (
            <div className="checkout-page container success-view">
                <CheckCircle size={64} className="icon-success" />
                <h1>{paymentMethod === 'card' ? 'Payment Successful!' : 'Order Placed Successfully!'}</h1>
                <p>Thank you for shopping with Thiwa Clothing Store.</p>
                {paymentMethod === 'bank' && <p>Please follow the manual payment instructions below to complete your order.</p>}
                <Link to="/" className="btn-home">Back to Shop More</Link>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="checkout-page container">
                <div className="empty-cart">
                    <h2>Your cart is empty.</h2>
                    <Link to="/" className="btn-home">Browse Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page container">
            <h1>Checkout</h1>
            
            <div className="checkout-grid">
                <div className="order-summary-card">
                    <h2>Order Summary</h2>
                    <div className="summary-items">
                        {cart.map(item => (
                            <div key={item.id} className="checkout-item">
                                <span>{item.name} x {item.quantity || 1}</span>
                                <span>LKR {item.price * (item.quantity || 1)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="total-row">
                        <span>Total Amount</span>
                        <span>LKR {total}</span>
                    </div>
                </div>

                <div className="customer-info-card">
                    <h2>Customer Information</h2>
                    <div className="customer-form">
                        <input 
                            type="text" 
                            placeholder="Full Name *" 
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                            required
                        />
                        <input 
                            type="tel" 
                            placeholder="Phone Number *" 
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                            required
                        />
                        <textarea 
                            placeholder="Delivery Address *" 
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                            rows="3"
                            required
                        />
                    </div>
                </div>

                <div className="payment-info-card">
                    <h2>Select Payment Method</h2>
                    
                    <div className="payment-methods">
                        <div 
                            className={`method-card ${paymentMethod === 'bank' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('bank')}
                        >
                            <Landmark size={32} />
                            <span>Bank Transfer</span>
                        </div>
                        <div 
                            className={`method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <CreditCard size={32} />
                            <span>Online Payment</span>
                        </div>
                    </div>

                    {isProcessing ? (
                        <div className="payment-loading">
                            <div className="spinner"></div>
                            <p>Processing your payment...</p>
                        </div>
                    ) : (
                        <>
                            {paymentMethod === 'bank' ? (
                                <div className="manual-payment-section">
                                    <div className="info-box">
                                        <AlertCircle size={20} />
                                        <span>Manual Payment Required</span>
                                    </div>
                                    <pre className="payment-details">
                                        {paymentInstructions}
                                    </pre>
                                    <button onClick={handlePlaceOrder} className="btn-place-order">
                                        Confirm & Place Order
                                    </button>
                                </div>
                            ) : (
                                <div className="card-payment-form">
                                    <div className="info-box">
                                        <CreditCard size={20} />
                                        <span>Enter Card Details</span>
                                    </div>
                                    <input type="text" placeholder="Card Number (4444 4444 4444 4444)" maxLength="19" />
                                    <input type="text" placeholder="Card Holder Name" />
                                    <div className="input-row">
                                        <input type="text" placeholder="MM/YY" maxLength="5" />
                                        <input type="password" placeholder="CVC" maxLength="3" />
                                    </div>
                                    <button onClick={handlePlaceOrder} className="btn-place-order">
                                        Pay LKR {total} Now
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
