// client/src/pages/CreatePost.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión para crear un post.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/posts",
        { title: form.title, content: form.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear el post.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-vinoTinto">Crear Nuevo Post</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
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
          Publicar
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
