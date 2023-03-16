import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Base from "./components/Base";
import ParkingSpace from "./components/ParkingSpace";
import PaymentScreen from "./components/PaymentScreen";
import store from "./components/redux/store/store";
import { Provider } from "react-redux";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Base />} />
            <Route path="/spaces" element={<ParkingSpace />} />
            <Route path="/payment" element={<PaymentScreen />} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
