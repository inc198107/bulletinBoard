const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render("main_page", { 
        title: 'Test Project',
        categories: ["All","For Kids","Tools","Home","Hobby","Different"],
        autorised: true,
        user: {email:'test@gmail.com'},
        bulletins: [
            {autor: {name: 'i am'},
             rating: 5, 
             text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                   sed do eiusmod tempor incididunt ut labore et`,
             id: '12',
             name: 'Test',
             image: false,
            }
        ]
     })
})

module.exports = router;