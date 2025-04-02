import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartPage() {
    const navigate = useNavigate();
    const { cart, removeFromCart, clearCart } = useCart();

    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="container py-5">
            <h2 className="mb-4">Your Cart</h2>
            {cart.length === 0 ? (
                <p className="alert alert-warning">Your cart is empty</p>
            ) : (
                <div>
                    {cart.map((item) => (
                        <div key={item.bookID} className="mb-4 border p-3">
                            <h3 className="card-title">Book {item.bookID}</h3>
                            <p>
                                Quantity: 
                                <span className="badge bg-primary ms-2">{item.quantity}</span>
                            </p>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                            <button 
                                className="btn btn-danger btn-sm mb-2"
                                onClick={() => removeFromCart(item.bookID)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <h3 className="mt-4">Total: ${total.toFixed(2)}</h3>
                </div>
            )}

            <div className="mt-4">
                <button className="btn btn-primary me-2" onClick={() => navigate('/books')}>
                    Continue Shopping
                </button>
                <button className="btn btn-secondary" onClick={clearCart}>
                    Clear Cart
                </button>
            </div>
        </div>
    );
}

export default CartPage;
