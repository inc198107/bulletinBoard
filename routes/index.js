const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render("layout", { title: 'Test Project' })
})

module.exports = router;