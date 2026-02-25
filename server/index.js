const express = require('express');
const cors = require('cors');
const dbService = require('./services/db.service');
const engineRoutes = require('./routes/engine.routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const productsRoutes = require('./routes/products.routes');

// Routes
app.use('/api/engine', engineRoutes);
app.use('/api/products', productsRoutes);

// Create Transaction
app.post('/api/transactions', async (req, res) => {
    const { productId, quantity, soldPrice } = req.body;
    try {
        await dbService.execute(
            `INSERT INTO TRANSACTIONS (product_id, quantity, sold_price) VALUES (:productId, :quantity, :soldPrice)`,
            { productId, quantity, soldPrice },
            { autoCommit: true }
        );
        res.status(201).json({ message: 'Transaction recorded' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to record transaction' });
    }
});


// Start Server
async function startServer() {
  try {
    await dbService.initialize();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
