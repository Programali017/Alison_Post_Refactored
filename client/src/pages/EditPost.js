// client/src/pages/EditPost.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setForm({ title: res.data.title, content: res.data.content });
      } catch (err) {
        setError("No se pudo cargar el post.");
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para editar.");
      return;
    }
    try {
      await axios.put(
        `/api/posts/${id}`,
        { title: form.title, content: form.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar el post.");
    }
  };

  if (error) return <p className="text-red-500 mt-10 text-center">{error}</p>;
  if (!form.title && !form.content) return <p className="mt-10 text-center">Cargando...</p>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-vinoTinto">Editar Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Contenido"
          required
          className="w-full border px-3 py-2 rounded h-32"
        />
        <button
          type="submit"
          className="w-full bg-vinoTinto text-white px-4 py-2 rounded hover:bg-black"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditPost;
