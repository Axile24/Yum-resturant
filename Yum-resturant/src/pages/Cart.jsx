import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { getImageUrl } from "../utils/utils";
import { placeOrder } from "../redux/orderSlice";
import { decreaseQuantity, addToCart, removeFromCart } from "../redux/cartSlice";
import "../styles/cart.scss";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items } = useSelector((state) => state.cart); // Récupère les articles du panier depuis Redux

    console.log("Rendu du composant Cart", { items }); // Log des articles dans le panier à chaque rendu

    // Calcul dynamique du total en utilisant useMemo pour éviter les recalculs inutiles
    const total = useMemo(() => {
        const calculatedTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        console.log("Total calculé :", calculatedTotal); // Log du total à chaque mise à jour des articles
        return calculatedTotal;
    }, [items]);

    // Fonction de validation du panier et passage de la commande
    const handleCheckout = useCallback(async () => {
        console.log("Début du checkout");

        const tenantID = localStorage.getItem("tenantID"); // Récupération de l'ID du client
        console.log("ID du tenant récupéré :", tenantID);

        const orderData = { tenant: tenantID, items, total };
        console.log("Données de la commande :", orderData); // Affichage des données de la commande avant l'envoi

        await dispatch(placeOrder(orderData)); // Envoi de la commande via Redux

        console.log("Commande passée avec succès, redirection vers /order");
        navigate("/order"); // Redirige l'utilisateur vers la page de confirmation de commande
    }, [dispatch, items, total, navigate]);

    // Si le panier est vide, affiche un message approprié
    if (items.length === 0) {
        console.log("Panier vide, affichage du message correspondant");
        return (
            <div className="cart-page">
                <img
                    src={getImageUrl("Union.svg")}
                    alt="Cart Icon"
                    className="cart-icon-cart"
                    onClick={() => navigate("/menu")} // Redirige vers le menu si l'utilisateur clique sur l'icône
                />
                <p className="empty-cart">Varukorgen är tom</p> {/* Message indiquant que le panier est vide */}
            </div>
        );
    }

    return (
        <div className="cart-page">
            <img src={getImageUrl('Union.svg')}
                alt="Cart Icon"
                className="cart-icon-cart"
                onClick={() => {
                    console.log("Redirection vers la page du menu");
                    navigate("/menu");
                }}
            />

            {/* Liste des articles dans le panier */}
            <ul className="cart-items">
                {items.map((item) => (
                    <li key={item.id} className="cart-item">
                        <div className="cart-header">
                            <span className="cart-name">{item.name.toUpperCase()}</span>
                            <span className="cart-line"></span>
                            <span className="cart-price">{item.price * item.quantity} SEK</span>
                        </div>

                        {/* Contrôles pour modifier la quantité d'un article */}
                        <div className="cart-controls">
                            <button
                                className="control-btn"
                                onClick={() => {
                                    console.log(`Diminution de la quantité : ${item.name}`);
                                    dispatch(decreaseQuantity(item)); // Diminue la quantité de l'article
                                }}
                            >
                                -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button
                                className="control-btn"
                                onClick={() => {
                                    console.log(`Augmentation de la quantité : ${item.name}`);
                                    dispatch(addToCart(item)); // Augmente la quantité de l'article
                                }}
                            >
                                +
                            </button>
                            <button
                                className="trash-btn"
                                onClick={() => {
                                    console.log(`Suppression de l'article : ${item.name}`);
                                    dispatch(removeFromCart(item)); // Supprime l'article du panier
                                }}
                            >
                                🗑
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Affichage du total du panier */}
            <div className="cart-total-box">
                <span className="cart-total-label">TOTAL</span>
                <span className="cart-total-value">{total} SEK</span>
            </div>

            {/* Bouton de validation de la commande */}
            <button
                className="checkout-btn"
                onClick={() => {
                    console.log("Bouton Checkout cliqué");
                    handleCheckout();
                }}
            >
                TAKE MY MONEY
            </button>
        </div>
    );
};

export default Cart;
