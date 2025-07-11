import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { token, user, loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form)); // <-- corregido de register a login

    if (login.fulfilled.match(result)) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (token && user) {
      const from = location.state?.from || "/";
      navigate(from);
    }
  }, [token, user, navigate, location.state]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-vinoTinto">Iniciar Sesión</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p className="mb-2">Cargando...</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contraseña"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-vinoTinto text-white px-4 py-2 rounded hover:bg-black"
        >
          {loading ? "Iniciando..." : "Entrar"}
        </button>
      </form>

      {/* 🌐 Botón de Google */}
      <div className="mt-6 text-center">
        <a
          href="https://alison-post-refactored.onrender.com/api/auth/google"
          className="inline-flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          Continuar con Google
        </a>
      </div>
    </div>
  );
};

export default Login;
