// client/src/pages/EditPost.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editPost, fetchPosts } from "../redux/slices/postSlice";
import { useNavigate, useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.posts);

  const post = posts.find((p) => p._id === id);
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    if (!post) {
      dispatch(fetchPosts());
    } else {
      setForm({ title: post.title, content: post.content });
    }
  }, [dispatch, post]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(editPost({ postId: id, ...form }));
    if (editPost.fulfilled.match(result)) {
      navigate("/");
    }
  };

  if (!post) return <p className="text-center mt-10">Cargando post...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-vinoTinto">Editar post</h2>
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
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
