const express = require('express');
const router = express.Router();
const engineController = require('../controllers/engine.controller');

router.post('/run', engineController.runEngine);

module.exports = router;
