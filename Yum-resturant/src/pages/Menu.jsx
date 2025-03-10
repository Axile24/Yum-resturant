import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { getImageUrl } from "../utils/utils"

const Menu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Hämtar menyn och status från Redux store
    const menu = useSelector((state) => state.menu.items) || [];
    const status = useSelector((state) => state.menu.status);

    // Hämtar kundvagnsartiklar och räknar totalt antal
    const cartItems = useSelector((state) => state.cart.items);
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Separera dips från övriga artiklar
    const dips = menu.filter((item) => item.type === "dip");
    const otherItems = menu.filter((item) => item.type !== "dip");


    // Hantera laddningsstatus
    if (status === "loading") return <p>Laddar MENY chill...</p>;
    if (status === "failed") return <p>Det gick inte att ladda menyn.</p>;

    return (
        <div className="menu-page">

            <img src={getImageUrl("logo2.svg")} alt="Yum Yum Gimme Sum Logo" className="logo2" />

            <div className="cart-container">
                <div className="cart-box" onClick={() => navigate("/cart")}>
                    {/* <img src={cartIcon} className="cart-icon" alt="Cart" />*/}
                    <span className="cart-badge">{cartItemCount}</span>
                </div>
                <div className="menu-box">
                    <h1>Meny</h1>
                    <ul>
                        {otherItems.length > 0 ? (
                            otherItems.map((item) => (
                                <li key={item.id} className="menu-item"
                                    onClick={() => dispatch(addToCart(item))}>
                                    <div className="menu-header">
                                        <span className="menu-name">{item.name.toUpperCase()}</span>
                                        <span className="menu-line"></span>
                                        <span className="menu-price">{item.price} SEK</span>
                                    </div>
                                    {item.ingredients && (
                                        <p className="menu-ingredients">{item.ingredients.join(", ")}</p>
                                    )}
                                </li>
                            ))
                        ) : (<p>Menu är töm 🎂</p>)}
                    </ul>
                    {dips.length > 0 && (
                        <>
                            <div className="menu-dips-header">
                                <span>DIPSÅS</span>
                                <span className="menu-line"></span>
                                <span className="menu-price">19 SEK</span>
                            </div>
                            <div className="dips-container">
                                {dips.map((dip) => (
                                    <span key={dip.id} className="dip-item" onClick={() => dispatch(addToCart(dip))}>
                                        {dip.name}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;
