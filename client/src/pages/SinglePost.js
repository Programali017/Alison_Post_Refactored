// client/src/pages/SinglePost.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiosConfig"; 

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar el post");
      }
    };
    fetchPost();
  }, [id]);

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!post) return <p className="text-center mt-10">Cargando post...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h1 className="text-3xl font-bold text-vinoTinto mb-2">{post.title}</h1>
      <p className="mb-4 italic">Por: {post.author.email}</p>
      <p className="mb-6">{post.content}</p>

      {post.comments.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Comentarios:</h3>
          {post.comments.map((c) => (
            <div key={c._id} className="mb-2">
              <span className="font-bold">{c.user.email}</span>: {c.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SinglePost;
