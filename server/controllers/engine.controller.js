const dbService = require('../services/db.service');

async function runEngine(req, res) {
  try {
    console.log('Running Aedes Pricing Engine...');
    
    // Execute the stored procedure
    await dbService.execute(
      `BEGIN PRC_AEDES_PRICING; END;`,
      [],
      { autoCommit: true }
    );

    res.json({ message: 'Aedes Pricing Engine executed successfully. Prices updated.' });
  } catch (err) {
    console.error('Error running engine:', err);
    res.status(500).json({ error: 'Failed to run Aedes Pricing Engine' });
  }
}

module.exports = {
  runEngine
};
