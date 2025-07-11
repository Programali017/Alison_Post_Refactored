// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./redux/slices/authSlice";
import Logo from "./components/Logo";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import SinglePost from "./pages/SinglePost";
import OauthCallback from './pages/OauthCallback';
import GoogleSuccess from './pages/GoogleSuccess'; 

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-vinoTinto text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Logo />
        <span className="font-bold text-xl">Alison Post</span>
      </div>

      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-paloRosa">Inicio</Link>

        {!user && (
          <>
            <Link to="/login" className="hover:text-paloRosa">Login</Link>
            <Link to="/register" className="hover:text-paloRosa">Registro</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/create-post" className="hover:text-paloRosa">Crear Post</Link>
            <button 
              onClick={handleLogout} 
              className="hover:text-paloRosa focus:outline-none"
            >
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  console.log("🚀 Build limpio");
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/oauth-callback" element={<OauthCallback />} />
        <Route path="/google-success" element={<GoogleSuccess />} /> {/* ✅ Nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;
