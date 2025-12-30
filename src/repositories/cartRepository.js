const db = require("../config/database");

class CartRepository {
  static async getByUserId(userId) {
    const [rows] = await db.query(
      `
    SELECT
      c.id,
      c.product_id,
      c.quantity,
      c.material,
      c.warna,
      p.nama,
      p.harga,
      p.file
    FROM carts c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
  `,
      [userId]
    );

    return rows;
  }

  static async findByUserAndProduct(userId, productId) {
    const [rows] = await db.query(
      `SELECT * FROM carts
             WHERE user_id = ? AND product_id = ?`,
      [userId, productId]
    );
    return rows[0];
  }

  static async create(data) {
    const [result] = await db.query(`INSERT INTO carts SET ?`, [data]);
    return result.insertId;
  }

  static async update(id, data) {
    await db.query(`UPDATE carts SET ? WHERE id = ?`, [data, id]);
  }

  static async deleteById(id) {
    await db.query(`DELETE FROM carts WHERE id = ?`, [id]);
  }

  static async deleteSelectedByUser(userId) {
    await db.query(
      `DELETE FROM carts
             WHERE user_id = ? AND is_selected = 1`,
      [userId]
    );
  }
}

module.exports = CartRepository;
