import { useEffect, useState } from "react";

import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import { auth } from "./firebase-config";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Bonus from "./pages/Bonus";
import Saque from "./pages/Saque";

function App() {
  const [showMobile, setShowMobile] = useState(true);
  const [money, setMoney] = useState(true)

  useEffect(() => {
    if(window.innerWidth > 765) {
      setShowMobile(false)
    }
  }, []);


  return (
    <Router>
      { showMobile &&
      <div className="wrapper">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/bonus' element={<Bonus/>} />
          <Route path='/saque' element={<Saque/>} />
        </Routes>
      </div>
      }
  </Router>
);
}

export default App;