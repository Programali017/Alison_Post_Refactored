require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");
const path = require("path");

const app = express();

// ✅ CORS para Netlify
app.use(cors({
  origin: "https://alisonpost.netlify.app",
  credentials: true,
}));

// ✅ Headers manuales para seguridad
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://alisonpost.netlify.app");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

// ✅ Inicializar Passport
app.use(passport.initialize());

// ✅ Configuración de estrategia Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// ✅ Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

// ✅ Ruta raíz (para verificar que el backend funciona)
app.get("/api", (req, res) => {
  res.send("✅ API de Alison funcionando");
});

// ✅ Producción: servir React si está compilado (opcional)
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// ✅ Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Conectado a MongoDB");
}).catch((err) => {
  console.error("❌ Error al conectar a MongoDB:", err.message);
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});


