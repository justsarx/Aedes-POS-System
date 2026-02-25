const dbService = require("./db.service");

async function trainModel() {
  console.log("AI Training Started: Analyzing Sales Velocity...");

  // 1. Fetch Sales Data (Last 7 Days)
  // We group by product_id and sum quantity to get total sales volume
  const salesData = await dbService.execute(
    `SELECT product_id, SUM(quantity) as total_sold 
     FROM TRANSACTIONS 
     WHERE timestamp >= SYSDATE - 7 
     GROUP BY product_id`,
    [],
    { autoCommit: false }
  );

  const salesMap = {};
  let maxSales = 0;

  // Process rows
  if (salesData.rows) {
    salesData.rows.forEach((row) => {
      // row is { PRODUCT_ID: ..., TOTAL_SOLD: ... }
      const id = row.PRODUCT_ID;
      const sold = row.TOTAL_SOLD;
      salesMap[id] = sold;
      if (sold > maxSales) maxSales = sold;
    });
  }

  console.log(`Max Sales Volume in window: ${maxSales}`);

  // 2. Fetch All Products
  const products = await dbService.execute("SELECT id FROM PRODUCTS");

  // 3. Calculate and Update Trend Scores
  if (products.rows) {
    for (const row of products.rows) {
      const id = row.ID;
      const sold = salesMap[id] || 0;

      // Normalize Score: (Sold / MaxSales) * 100
      // If maxSales is 0, everyone gets 0 (or a baseline)
      let trendScore = 0;
      if (maxSales > 0) {
        trendScore = Math.round((sold / maxSales) * 100);
      }

      // Apply a minimum baseline so products don't die completely
      // Let's say baseline is 10 for visibility
      trendScore = Math.max(10, trendScore);

      console.log(
        `Product ${id}: Sold ${sold}, New Trend Score: ${trendScore}`
      );

      // Update DB
      await dbService.execute(
        `UPDATE PRODUCTS SET trend_score = :score, last_updated = CURRENT_TIMESTAMP WHERE id = :id`,
        { score: trendScore, id },
        { autoCommit: true }
      );
    }
  }

  return {
    message: "AI Training Complete. Trend Scores Updated.",
    productsAnalyzed: products.rows ? products.rows.length : 0,
  };
}

module.exports = {
  trainModel,
};
