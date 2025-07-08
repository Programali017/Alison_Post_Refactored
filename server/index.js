require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

const app = express();

// ✅ CORS configurado para aceptar peticiones desde Netlify
app.use(cors({
  origin: "https://alisonpost.netlify.app",
  credentials: true,
}));

// ✅ Cabeceras explícitas (útiles especialmente para Render/Heroku)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://alisonpost.netlify.app");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

// ⚡ Configuración de Passport (Google OAuth)
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) return done(null, existingUser);

    const newUser = await new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      username: profile.displayName
    }).save();

    done(null, newUser);
  } catch (err) {
    done(err, false);
  }
}));

app.use(passport.initialize());

// 👉 Tus rutas existentes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

// ✅ Ruta de prueba
app.get("/", (req, res) => {
  res.send("ALISON API FUNCIONANDO 🎉");
});

// 🚀 Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
