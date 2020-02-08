const express = require('express');
const session = require('express-session');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const router = express.Router();

const urlEncodedParser = bodyParser.urlencoded({ extended: false });

const User = require('../models/user');
const Bulletin = require('../models/bulletin');

let userIsAutorised = false;

const createUser = (email, password) => {
   return new User({
        email: email,
        password: password
    }).save()
}

function findUser(email) {
    return User.findOne({ email })
}

router.post('/new-user', urlEncodedParser, (req, res, next) => {
    if (!req.body) return res.sendStatus(400);
    createUser(req.body.new_user_email, req.body.new_user_passvord);
    userIsAutorised = true;
    res.redirect('/');
})

router.get('/logout', (req, res, next) => {
    console.log(req.query)
    userIsAutorised = false;
    res.redirect('/');
})

router.get('/', (req, res, next) => {
    User.find({}, (eror, users) => {
        console.log(eror, users)
    })
    res.render("main_page", {
        title: 'Test Project',
        categories: ["All", "For Kids", "Tools", "Home", "Hobby", "Different"],
        autorised: userIsAutorised,
        user: 'user',
        bulletins: [
            {
                autor: { name: 'i am' },
                rating: 5,
                category: 'All',
                preview: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                          sed do eiusmod temp`,
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