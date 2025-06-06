import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // EXTRAEMOS `user` además de `token`
  const { token, user, loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  useEffect(() => {
    // Redirigimos sólo si YA tenemos token VÁLIDO Y `user` cargado
    if (token && user) {
      navigate("/");
    }
  }, [token, user, navigate]);

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
    </div>
  );
};

export default Login;
