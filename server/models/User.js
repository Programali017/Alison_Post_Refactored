const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  googleId: { type: String }, // solo para usuarios de Google
  username: { type: String }, // nombre que viene de Google
  email: { type: String, required: true, unique: true },
  password: { type: String } // opcional para usuarios de Google
});

// Encriptar contraseña solo si existe y fue modificada
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
