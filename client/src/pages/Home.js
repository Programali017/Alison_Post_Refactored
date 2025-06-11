// client/src/pages/Home.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  likePost,
  sharePost,
  commentPost
} from "../redux/slices/postSlice";
import axios from "../axiosConfig"; 
import { useNavigate } from "react-router-dom";

const colors = [
  "bg-paloRosa",
  "bg-vinoTinto",
  "bg-black",
  "bg-[#FFC0CB]",
  "bg-[#8B0000]"
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { posts, loading, error } = useSelector((state) => state.posts);
  const { user, token } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState({});
  const [showCommentBox, setShowCommentBox] = useState({});

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleDelete = async (postId) => {
  if (!token) return;
  try {
    await axios.delete(`/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch(fetchPosts());
  } catch (err) {
    alert("No se pudo eliminar el post.");
  }
  };

  const handleLike = (postId) => {
    if (!token) return;
    dispatch(likePost({ postId }));
  };

  const handleShare = (postId) => {
    if (!token) return;
    dispatch(sharePost({ postId }));
  };

  const handleCommentSubmit = (postId) => {
    if (!token) return;
    const text = commentText[postId];
    if (!text) return;
    dispatch(commentPost({ postId, text }));
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    setShowCommentBox((prev) => ({ ...prev, [postId]: false }));
  };

  if (loading) return <p className="mt-10 text-center">Cargando posts...</p>;
  if (error) return <p className="mt-10 text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-8">
      {/* Si NO hay usuario: mostrar botones de Registro/Login */}
      {!user && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-vinoTinto text-white px-4 py-2 rounded hover:bg-black"
          >
            Registrarse
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-vinoTinto text-white px-4 py-2 rounded hover:bg-black"
          >
            Iniciar Sesión
          </button>
        </div>
      )}

      {/* Si HAY usuario: encabezado y botón “Crear nuevo post” */}
      {user && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-vinoTinto">Posts Recientes</h2>
          <button
            onClick={() => navigate("/create-post")}
            className="bg-vinoTinto text-white px-4 py-2 rounded hover:bg-black"
          >
            Crear nuevo post
          </button>
        </div>
      )}

      {/* Si usuario logueado y no hay posts */}
      {user && posts.length === 0 && (
        <p className="text-center">No hay posts todavía. ¡Sé el primero en crearlos!</p>
      )}

      {/* Mostrar cada post */}
      {user &&
        posts.map((post, idx) => (
          <div
            key={post._id}
            className={`p-6 rounded-lg text-white ${colors[idx % colors.length]}`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3
                onClick={() => navigate(`/post/${post._id}`)}
                className="text-xl font-semibold cursor-pointer hover:underline"
              >
                {post.title}
              </h3>
              <small className="italic">Por: {post.author.email}</small>
            </div>
            <p className="mb-4">{post.content}</p>

            <div className="space-x-4 mb-4">
              {user.id === post.author._id ? (
                <>
                  <button
                    onClick={() => navigate(`/edit-post/${post._id}`)}
                    className="bg-black text-white px-3 py-1 rounded hover:bg-vinoTinto"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-black text-white px-3 py-1 rounded hover:bg-vinoTinto"
                  >
                    Eliminar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleLike(post._id)}
                    className="bg-black text-white px-3 py-1 rounded hover:bg-vinoTinto"
                  >
                    {post.likes.includes(user.id) ? "❤️" : "🤍"} {post.likes.length}
                  </button>
                  <button
                    onClick={() => handleShare(post._id)}
                    className="bg-black text-white px-3 py-1 rounded hover:bg-vinoTinto"
                  >
                    🔄 {post.shares}
                  </button>
                  <button
                    onClick={() =>
                      setShowCommentBox((prev) => ({
                        ...prev,
                        [post._id]: !prev[post._id]
                      }))
                    }
                    className="bg-black text-white px-3 py-1 rounded hover:bg-vinoTinto"
                  >
                    💬 {post.comments.length}
                  </button>
                </>
              )}
            </div>

            {/* Caja de comentario si NO soy autor */}
            {user.id !== post.author._id && showCommentBox[post._id] && (
              <div className="mb-4">
                <textarea
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [post._id]: e.target.value
                    }))
                  }
                  placeholder="Escribe un comentario..."
                  className="w-full border px-3 py-2 rounded mb-2 text-black"
                />
                <button
                  onClick={() => handleCommentSubmit(post._id)}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-vinoTinto"
                >
                  Enviar comentario
                </button>
              </div>
            )}

            {/* Comentarios existentes */}
            {post.comments.length > 0 && (
              <div className="mt-4 bg-black bg-opacity-50 p-4 rounded">
                <h4 className="font-semibold mb-2">Comentarios:</h4>
                {post.comments.map((c) => (
                  <div key={c._id} className="mb-2">
                    <span className="font-bold">{c.user.email}</span>: {c.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Home;
