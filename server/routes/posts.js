// server/routes/posts.js
const express = require("express");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Crear un post (requiere autenticación)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({
      title,
      content,
      author: req.user.id
    });
    await newPost.save();
    await newPost.populate("author", "email");
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los posts (público)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "email")
      .populate("comments.user", "email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener un post por ID (público)
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "email")
      .populate("comments.user", "email");
    if (!post) return res.status(404).json({ error: "Post no encontrado." });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un post (solo autor)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado." });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ error: "No autorizado." });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    const updatedPost = await post.save();
    await updatedPost.populate("author", "email");
    await updatedPost.populate("comments.user", "email");
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un post (solo autor)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado." });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ error: "No autorizado." });

    await post.deleteOne();
    res.json({ message: "Post eliminado." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Dar/quitar “like” a un post (solo usuarios autenticados)
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado." });

    const userId = req.user.id;
    if (post.likes.includes(userId)) {
      // Si ya dio like, lo quita (toggle)
      post.likes = post.likes.filter((u) => u.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    await post.populate("author", "email");
    await post.populate("comments.user", "email");
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Incrementar contador de “shares” (solo usuarios autenticados)
router.post("/:id/share", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado." });

    post.shares += 1;
    await post.save();
    await post.populate("author", "email");
    await post.populate("comments.user", "email");
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Añadir un comentario a un post (solo usuarios autenticados)
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comentario vacío." });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado." });

    post.comments.push({ user: req.user.id, text });
    await post.save();
    await post.populate("author", "email");
    await post.populate("comments.user", "email");
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
