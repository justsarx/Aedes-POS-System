const dbService = require("../services/db.service");
const aiService = require("../services/ai.service");

async function getProducts(req, res) {
  try {
    const result = await dbService.execute(
      "SELECT * FROM PRODUCTS ORDER BY id ASC"
    );
    // Since oracledb.outFormat is OBJECT, result.rows is already an array of objects
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

async function createProduct(req, res) {
  // Frontend sends uppercase keys now
  const { SKU, NAME, CATEGORY, BASE_PRICE, STOCK, EXPIRY_DATE } = req.body;
  try {
    await dbService.execute(
      `INSERT INTO PRODUCTS (sku, name, category, base_price, current_price, stock, expiry_date, trend_score) 
       VALUES (:sku, :name, :category, :basePrice, :basePrice, :stock, TO_DATE(:expiryDate, 'YYYY-MM-DD'), :trendScore)`,
      {
        sku: SKU,
        name: NAME,
        category: CATEGORY,
        basePrice: BASE_PRICE,
        stock: STOCK,
        expiryDate: EXPIRY_DATE || null,
        trendScore: 50, // Default neutral score, AI will update later
      },
      { autoCommit: true }
    );
    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const { NAME, CATEGORY, BASE_PRICE, STOCK, EXPIRY_DATE } = req.body;
  try {
    await dbService.execute(
      `UPDATE PRODUCTS 
       SET name = :name, 
           category = :category, 
           base_price = :basePrice, 
           stock = :stock, 
           expiry_date = TO_DATE(:expiryDate, 'YYYY-MM-DD'), 
           last_updated = CURRENT_TIMESTAMP
       WHERE id = :id`,
      {
        name: NAME,
        category: CATEGORY,
        basePrice: BASE_PRICE,
        stock: STOCK,
        expiryDate: EXPIRY_DATE || null,
        id,
      },
      { autoCommit: true }
    );
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  console.log(`Attempting to delete product with ID: ${id}`);
  try {
    // Use PL/SQL block to delete transactions and product atomically
    await dbService.execute(
      `BEGIN
         DELETE FROM TRANSACTIONS WHERE product_id = :id;
         DELETE FROM PRODUCTS WHERE id = :id;
       END;`,
      { id: parseInt(id) },
      { autoCommit: true }
    );
    console.log(`Product ${id} deleted successfully`);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
}

async function trainAI(req, res) {
  try {
    const result = await aiService.trainModel();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI Training Failed" });
  }
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  trainAI,
};
