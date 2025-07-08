const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passport = require('passport');
const router = express.Router();

// Registro de usuario local
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email ya registrado." });

    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "Usuario registrado con éxito." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login de usuario local
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Credenciales inválidas." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 NUEVAS RUTAS PARA OAUTH GOOGLE 🔥

// Ruta inicial para autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback de Google OAuth
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, email: req.user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);
});

module.exports = router;
