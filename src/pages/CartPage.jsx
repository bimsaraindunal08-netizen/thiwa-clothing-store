import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cart, removeFromCart, updateCartQuantity, clearCart } = useContext(ShopContext);

    const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    return (
        <div className="cart-page container">
            <h1>Your Shopping Cart</h1>
            {cart.length === 0 ? (
                <div className="empty-cart">
                    <ShoppingBag size={64} className="icon-empty" />
                    <p>Your cart feels empty.</p>
                    <Link to="/" className="btn-shop">Start Shopping</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    {item.size && <p className="item-size">Size: {item.size}</p>}
                                    <p className="item-price">LKR {item.price}</p>
                                    <div className="quantity-control">
                                        <span>Qty: {item.quantity || 1}</span>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="btn-remove">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>LKR {total}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>LKR {total}</span>
                        </div>
                        <Link to="/checkout" className="btn-checkout">
                            Proceed to Checkout <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
