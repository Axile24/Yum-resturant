import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Menu from "./pages/Menu";
import Cart from "./pages/Cart"

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/cart" element={<Cart />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </Router>
  );
}

export default App;
