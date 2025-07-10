const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    default: null, // Para usuarios que se registran con Google
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Solo requerido si no es OAuth
    },
  },
  username: {
    type: String,
    default: null, 
  }
});

// Encriptar contraseña si el usuario no es OAuth
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.googleId) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
