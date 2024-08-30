const express = require('express');
const { userViewReport } = require('../controllers/report');

const router = express.Router();

// Get user view report
router.get('/getViewReport', userViewReport);

module.exports = router;
