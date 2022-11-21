const express = require('express');
const urlController = require('../controller/urlController');


const router = express.Router();

router
    .route('/:urlCode')
    .get(urlController.getOriginalUrl);
router
    .route('/url/shorten')
    .post(urlController.createUrl);

module.exports = router;
