import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getImageUrl } from "../utils/utils";
import "../styles/OrderConfirmation.scss";

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const { orderNumber, eta, status, error } = useSelector((state) => state.order);
  
    // Beräkna minuter från ETA
    const calculateEtaMinutes = (eta) => {
      const etaDate = new Date(eta);
      const now = new Date();
      const diffInMinutes = Math.round((etaDate - now) / 60000);
      return diffInMinutes;
    };
  
    const handleProceed = () => {
      navigate("/menu");
    };
    const handleReceipt = () => {
      navigate("/receipt");
    }
  
    return (
      <div className="order-confirmation-page">
        <img src={getImageUrl("logo2.svg")}alt="Logo" className="order-logo" />
  
        {status === "loading" && <p>Lägger order...</p>}
        {status === "failed" && <p>Fel: {error}</p>}
        {status === "succeeded" && (
          <>
            <div className="order-image-container">
              <img src={getImageUrl("boxtop.png")}  alt="Lunchbox" className="order-lunchbox" />
            </div>
            <h1>Dina Wontons Tillagas!</h1>
            <p>
              ETA <span>{calculateEtaMinutes(eta)} MIN</span>
            </p>
            <p>
              <span>#{orderNumber}</span>
            </p>
            <div className="button-container">
            <button onClick={handleProceed} className="proceed-btn">
              Gör en ny beställning
            </button>
            <button onClick={handleReceipt} className="receipt-btn">
              Se Kvitto
            </button>
            </div>
          </>
          
        )}
  
        {status === "idle" && <p>Ingen order finns att visa.</p>}
      </div>
    );
  };
  
  export default OrderConfirmation;