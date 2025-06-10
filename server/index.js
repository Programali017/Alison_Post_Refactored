// server/index.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// ✅ CORS configurado para aceptar peticiones con credenciales desde Netlify
app.use(cors({
  origin: "https://alisonpost.netlify.app",
  credentials: true,
}));

// ✅ Cabeceras explícitas para Render (evita error de "CORS policy")
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://alisonpost.netlify.app");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

// 👉 Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("ALISON API FUNCIONANDO 🎉");
});

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
