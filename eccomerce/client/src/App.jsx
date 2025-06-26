import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ProductList from "./components/ProductList";
import OrderSummary from "./components/OrderSummary";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <header className="app-header">
            <h1>מערכת קניות</h1>
            <nav>
              <Link to="/" className="nav-link">
                רשימת קניות
              </Link>
              <Link to="/order" className="nav-link">
                סיכום הזמנה
              </Link>
            </nav>
          </header>

          <main className="app-main">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/order" element={<OrderSummary />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
