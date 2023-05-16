const express = require('express');
const router = express.Router();

router.get('/products', (request, response, next) => {
    response.status(200).json({ data: 'all products' });
});


module.exports = router;