import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { getImageUrl } from "../utils/utils";
import { placeOrder } from "../redux/orderSlice";
import { decreaseQuantity, addToCart, removeFromCart } from "../redux/cartSlice";
import "../styles/cart.scss";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items } = useSelector((state) => state.cart);
    const [clickedItem, setClickedItem] = useState(null); // State to track clicked item for animation

    // Compute total dynamically
    const total = useMemo(() => {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }, [items]);

    // Handle checkout process
    const handleCheckout = useCallback(async () => {
        const tenantID = localStorage.getItem("tenantID");
        const orderData = { tenant: tenantID, items, total };
        await dispatch(placeOrder(orderData));
        navigate("/order");
    }, [dispatch, items, total, navigate]);

    // Handle quantity change with animation
    const handleQuantityChange = (item, type) => {
        setClickedItem(item.id); // Set the clicked item to apply animation
        setTimeout(() => setClickedItem(null), 200); // Reset animation after 200ms

        if (type === "increase") {
            dispatch(addToCart(item));
        } else {
            dispatch(decreaseQuantity(item));
        }
    };

    // Handle item removal
    const handleRemove = (item) => {
        dispatch(removeFromCart(item));
    };

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <img
                    src={getImageUrl("Union.svg")}
                    alt="Cart Icon"
                    className="cart-icon-cart"
                    onClick={() => navigate("/menu")}
                />
                <p className="empty-cart">Varukorgen är tom</p>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <img
                src={getImageUrl("Union.svg")}
                alt="Cart Icon"
                className="cart-icon-cart"
                onClick={() => navigate("/menu")}
            />

            <ul className="cart-items">
                {items.map((item) => (
                    <li key={item.id} className="cart-item">
                        <div className="cart-header">
                            <span className="cart-name">{item.name.toUpperCase()}</span>
                            <span className="cart-line"></span>
                            <span className="cart-price">{item.price * item.quantity} SEK</span>
                        </div>

                        <div className="cart-controls">
                            <button
                                className={`control-btn ${clickedItem === item.id ? "btn-clicked" : ""}`}
                                onClick={() => handleQuantityChange(item, "decrease")}
                            >
                                -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button
                                className={`control-btn ${clickedItem === item.id ? "btn-clicked" : ""}`}
                                onClick={() => handleQuantityChange(item, "increase")}
                            >
                                +
                            </button>
                            <button className="trash-btn" onClick={() => handleRemove(item)}>🗑</button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="cart-bottom-container">
                <div className="cart-total-box">
                    <span className="cart-total-label">TOTAL</span>
                    <span className="cart-total-value">{total} SEK</span>
                </div>

                <button className="checkout-btn" onClick={handleCheckout}>
                    TAKE MY MONEY
                </button>
            </div>
        </div>
    );
};

export default Cart;
