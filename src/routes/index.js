const express = require('express');
const locationRoutes = require('./location.route');
const config = require('../config/config');

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));
router.get('/google-key', (req, res) => res.json({'data':config.googleApiKey}))

router.use('/location', locationRoutes);


module.exports = router;
