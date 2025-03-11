import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMenuData } from "../redux/menuSlice"; // Import action
import { addToCart } from "../redux/cartSlice";
import { getImageUrl } from "../utils/utils";
import "../styles/menu.scss";

const Menu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Dispatching fetchMenuData...");
        dispatch(fetchMenuData()); // Fetch menu when component mounts
    }, [dispatch]);

    const menu = useSelector((state) => state.menu.items) || [];
    const status = useSelector((state) => state.menu.status);
    const cartItems = useSelector((state) => state.cart.items);
    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    console.log("Menu state from Redux:", menu);

    const dips = menu.filter((item) => item.type === "dip");
    const otherItems = menu.filter((item) => item.type !== "dip");

    if (status === "loading") return <p>Laddar MENY chill...</p>;
    if (status === "failed") return <p>Det gick inte att ladda menyn.</p>;

    return (
        <div className="menu-page">
            <img src={getImageUrl("logo2.svg")}
             alt="Yum Yum Gimme Sum Logo"
              className="logo2" />

            <div className="cart-container">
                <div className="cart-box" onClick={() => navigate("/cart")}>
                <img src={getImageUrl("Union.svg")}
             alt="Bag Logo"
              className="cart-container-bag" />

                    <span className="cart-badge">{cartItemCount}</span>
                </div>
            </div>

            <div className="menu-box">
                <h1>Meny</h1>
                <ul>
                    {otherItems.length > 0 ? (
                        otherItems.map((item) => (
                            <li key={item.id} className="menu-item" onClick={() => dispatch(addToCart(item))}>
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
                    ) : (
                        <p>Menu är tom 🎂</p>
                    )}
                </ul>

                {dips.length > 0 && (
                    <>
                        <div className="menu-header">
                            <span className="menu-name">DIPSÅS</span>
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
    );
};

export default Menu;
