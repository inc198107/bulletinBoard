const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render("layout", { 
        title: 'Test Project',
        categories: ["All","For Kids","Tools","Home","Hobby","Different"],
        autorised: true,
        user: {email:'test@gmail.com'}
     })
})

module.exports = router;