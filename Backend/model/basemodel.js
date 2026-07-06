const bcrypt = require("bcrypt");
const db = require("../config/db.js");

exports.register = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)",
      [nama, email, hashed]
    );

    res.json({ message: "Registrasi berhasil" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
