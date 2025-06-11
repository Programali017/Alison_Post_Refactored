// client/src/pages/CreatePost.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../redux/slices/postSlice";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.posts);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createPost(form));
    if (createPost.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-vinoTinto">Crear nuevo post</h2>
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
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-vinoTinto text-white px-4 py-2 rounded hover:bg-black"
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;