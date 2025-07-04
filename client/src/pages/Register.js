// client/src/pages/Register.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearRegisterStatus } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, registerSuccess } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));

    if (register.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  useEffect(() => {
    // Limpia el estado del registro al cargar el componente
    dispatch(clearRegisterStatus());
  }, [dispatch]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-vinoTinto">Crear Cuenta</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p className="mb-2">Registrando...</p>}
      {registerSuccess && <p className="text-green-500 mb-2">{registerSuccess}</p>}

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
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default Register;
