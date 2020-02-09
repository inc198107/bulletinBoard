const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');
const router = express.Router();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const User = require('../models/user');
const Bulletin = require('../models/bulletin');

let userIsAutorised = false;
let currentUser = ' ';



const createUser = (email, password) => {
    return new User({
        email: email,
        password: password
    }).save()
}

const createBulletin = (mail, category, preview, text, id, name, image) => {
    return new Bulletin({
        authorMail: mail,
        rating: 0,
        category: category,
        preview: preview,
        text: text,
        id: id,
        name: name,
        image: {
            name: image.name,
            contentType: image.contenttype,
            image: image.buffer
        }
    }).save()
}

router.post('/new-bulletin', upload.any(), (req, res, next) => {
    if (!req.body) return res.sendStatus(400);
    let id = Date.now();
    let image = {
        name: req.files[0].originalname,
        contenttype: req.files[0].mimetype,
        buffer: req.files[0].buffer
    }
    createBulletin(
        currentUser,
        req.body.new_bulletin_category,
        req.body.new_bulletin_describe,
        req.body.new_bulletin_text,
        id,
        req.body.new_bulletin_name,
        image
    );
    console.log(req.body);
    console.log('file', req.files[0]);
    res.redirect('/');
})

router.post('/new-user', urlEncodedParser, (req, res, next) => {
    if (!req.body) return res.sendStatus(400);
    let userMail = req.body.new_user_email;
    let userPwd = req.body.new_user_passvord;
    User.findUserByEmail(userMail, (error, user) => {
        if (user) {
            if (user.password === userPwd) {
                userIsAutorised = true;
                currentUser = userMail;
                res.redirect('/');
            }
            else {
                res.render("errors_frame", {
                    autorised: userIsAutorised,
                    user: currentUser,
                    alertText: 'Email is currently present in database, please try to log In'
                })
            }
        }
        else {
            createUser(userMail, userPwd);
            userIsAutorised = true;
            currentUser = userMail;
            res.redirect('/');
        }
        if (error) { console.log(error) }
    })
})

router.post('/user-log-in', urlEncodedParser, (req, res, next) => {
    if (!req.body) return res.sendStatus(400);
    let userMail = req.body.user_email;
    let userPwd = req.body.user_password;
    User.findUserByEmail(userMail, (error, user) => {
        if (user) {
            if (user.password === userPwd) {
                userIsAutorised = true;
                currentUser = userMail;
                res.redirect('/');
            }
            else {
                res.render("errors_frame", {
                    autorised: userIsAutorised,
                    user: currentUser,
                    alertText: 'Password is incorrect, please try again'
                })
            }
        }
        else {
            res.render("errors_frame", {
                autorised: userIsAutorised,
                user: currentUser,
                alertText: `There is no user with ${userMail} email, please register before try to login `
            })
        }
        if (error) { console.log(error) }
    })
})

router.get('/logout', (req, res, next) => {
    currentUser = " ";
    userIsAutorised = false;
    res.redirect('/');
})

router.get('/', (req, res, next) => {
    res.render("main_page", {
        title: 'Bulletin  Test Project',
        categories: ["All", "For Kids", "Tools", "Home", "Hobby", "Different"],
        autorised: userIsAutorised,
        user: currentUser,
        bulletins: [
            {
                autor: "mail",
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