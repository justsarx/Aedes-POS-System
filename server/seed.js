const dbService = require("./services/db.service");

const demoProducts = [
  {
    sku: "DAIRY001",
    name: "Fresh Milk 1L",
    category: "Dairy",
    basePrice: 60.0,
    stock: 50,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Expires in 2 days
    trendScore: 85,
  },
  {
    sku: "DAIRY002",
    name: "Cheddar Cheese",
    category: "Dairy",
    basePrice: 450.0,
    stock: 15,
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Expires in 10 days
    trendScore: 60,
  },
  {
    sku: "BAKERY001",
    name: "Sourdough Bread",
    category: "Bakery",
    basePrice: 120.0,
    stock: 8,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Expires tomorrow
    trendScore: 95,
  },
  {
    sku: "BAKERY002",
    name: "Chocolate Croissant",
    category: "Bakery",
    basePrice: 85.0,
    stock: 20,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Expires tomorrow
    trendScore: 90,
  },
  {
    sku: "ELEC001",
    name: "Wireless Earbuds",
    category: "Electronics",
    basePrice: 2499.0,
    stock: 5, // Low stock -> Scarcity pricing
    expiryDate: null,
    trendScore: 98,
  },
  {
    sku: "ELEC002",
    name: "Smart Watch Gen 2",
    category: "Electronics",
    basePrice: 5999.0,
    stock: 45,
    expiryDate: null,
    trendScore: 70,
  },
  {
    sku: "PROD001",
    name: "Organic Avocados (Pack of 2)",
    category: "Produce",
    basePrice: 300.0,
    stock: 12,
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Expires in 3 days
    trendScore: 80,
  },
  {
    sku: "SNACK001",
    name: "Gourmet Dark Chocolate",
    category: "Snacks",
    basePrice: 250.0,
    stock: 100,
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // Long expiry
    trendScore: 40,
  },
];

async function seedData() {
  console.log("🌱 Starting Database Seed...");
  try {
    // Initialize DB Pool
    await dbService.initialize();

    // Wait for schema to be present (PRODUCTS table)
    async function waitForTable(tableName, attempts = 30, delayMs = 2000) {
      const name = tableName.toUpperCase();
      for (let i = 0; i < attempts; i++) {
        try {
          const res = await dbService.execute(
            "SELECT COUNT(*) AS CNT FROM user_tables WHERE table_name = :name",
            { name }
          );
          const cnt = res.rows && res.rows[0] && (res.rows[0].CNT || res.rows[0].CNT === 0 ? res.rows[0].CNT : Object.values(res.rows[0])[0]);
          if (cnt && Number(cnt) > 0) return true;
        } catch (e) {
          // ignore and retry
        }
        await new Promise((r) => setTimeout(r, delayMs));
      }
      return false;
    }

    const ready = await waitForTable('PRODUCTS', 60, 2000);
    if (!ready) {
      throw new Error('Timed out waiting for PRODUCTS table to be created');
    }

    // 1. Clear existing data
    console.log("🧹 Clearing existing data...");
    await dbService.execute("DELETE FROM TRANSACTIONS", [], {
      autoCommit: true,
    });
    await dbService.execute("DELETE FROM PRODUCTS", [], { autoCommit: true });
    console.log("✅ Data cleared.");

    // 2. Insert new products
    console.log("📦 Inserting demo products...");
    for (const p of demoProducts) {
      await dbService.execute(
        `INSERT INTO PRODUCTS (sku, name, category, base_price, current_price, stock, expiry_date, trend_score) 
         VALUES (:sku, :name, :category, :basePrice, :basePrice, :stock, TO_DATE(:expiryDate, 'YYYY-MM-DD'), :trendScore)`,
        {
          sku: p.sku,
          name: p.name,
          category: p.category,
          basePrice: p.basePrice,
          stock: p.stock,
          expiryDate: p.expiryDate,
          trendScore: p.trendScore,
        },
        { autoCommit: true }
      );
      console.log(`   -> Added: ${p.name}`);
    }

    console.log("✨ Seeding Complete! Database is ready for demo.");
    await dbService.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Failed:", err);
    try {
      await dbService.close();
    } catch (e) {
      /* ignore */
    }
    process.exit(1);
  }
}

seedData();
