import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import Receipt from "./pages/Receipt";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/cart" element={<Cart />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<OrderConfirmation />} />
        <Route path="/receipt" element={<Receipt/>} />
      </Routes>
    </Router>
  );
}

export default App;
