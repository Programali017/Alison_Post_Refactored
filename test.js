const mongoose = require("mongoose");

const uri = "mongodb+srv://alisonPost1:AlisonSecure123@cluster0.zj6k1ha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conexión exitosa desde local"))
  .catch((err) => console.error("❌ Error de conexión:", err));
