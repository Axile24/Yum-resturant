import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/utils";
import "../styles/receipt.scss";



const Kvitot = () => {
    const navigate = useNavigate();
    
    // Use a single useSelector call for better efficiency
    const { orderNummer, items, total } = useSelector((state) => ({
        orderNummer: state.order.orderNummer,
        items: state.cart.items,
        total: state.cart.total,
    }));

    const handleNewOrder = () => {
        navigate("/menu");
    };

    return (
        <div className="receipt-page">
               <img src={getImageUrl("logo.png")} alt="YYGS Logo" className="receipt-logo" />
            <div className="receipt-container">
                <h1>KVITTO</h1>
                <p className="receipt-order-number">#{orderNummer || "N/A"}</p>

                {items.length > 0 ? (
                    <ul className="receipt-items">
                        {items.map(({ id, name, price, quantity }) => (
                            <li key={id} className="receipt-item">
                                <div className="receipt-item-header">
                                    <span className="receipt-item-name">{name.toUpperCase()}</span>
                                    <span className="receipt-line"></span>
                                    <span className="receipt-item-price">
                                        {(price * quantity).toLocaleString()} SEK
                                    </span>
                                </div>
                                <div className="receipt-item-quantity">{quantity} stycken</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="empty-message">Inga varor i beställningen.</p>
                )}

                <div className="receipt-total-box">
                    <span className="total-text">TOTAL</span>
                    <span className="total-price">{total.toLocaleString()} SEK</span>
                </div>
            </div>

            <button className="new-order-btn" onClick={handleNewOrder}>
                Gör en ny beställning
            </button>
        </div>
    );
};

export default Kvitot;
