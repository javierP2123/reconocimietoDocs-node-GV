const express = require('express');
const router = express.Router();
const path = require("path");

var analyzeDocs = require(path.join(__dirname,'../modules/analyzeDocs'));

router.post('/docsAnalyze', analyzeDocs.analyze);

module.exports = router;
