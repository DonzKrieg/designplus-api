const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function() {
        return !this.google_id; // Password wajib kalo google_id nggak ada
      },
    },
    google_id: { 
      type: String,
      default: null,
      sparse: true, // biar nggak error kalo banyak user yang google_id-nya null
    },
    avatar: { // Opsional, buat menyimpan foto profil Google
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    full_name: {
      type: String,
    },
    phone: {
      type: String,
    },
    Location: {
      type: String,
    },
    postal_code: {
      type: String,
    },
    wishlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ]
  }, 
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;