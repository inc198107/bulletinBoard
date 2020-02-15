const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');
const router = express.Router();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        let fileOriginalName = file.originalname.split('.');
        let origName = fileOriginalName[0];
        let origExt = fileOriginalName[1]
        cb(null, `${origName}_${Date.now()}.${origExt}`);
    }
})

var upload = multer({ storage: storage })

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

const createBulletin = (mail, category, preview, text, idView, name, imageName, findId) => {
    return new Bulletin({
        authorMail: mail,
        rating: 0,
        category: category,
        preview: preview,
        text: text,
        id: idView,
        name: name,
        image: `./uploads/${imageName}`,
        findId: findId
    }).save()
}

const getBulletinsBy = (category) => {
    return Bulletin.findBulletinByCategory(category, (error, items) => {
        if (error) { return console.log(error) }
        if (items) {
            let bulletinsArr = [];
            console.log(items);
            forEach.items((item) => {
                bulletinsArr.push({
                    authorMail: item.authorMail,
                    rating: item.rating,
                    category: item.category,
                    preview: item.preview,
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    findId: item.findId
                })
            })
            return bulletinsArr
        }
    })
}

const getAllItems = () => {
    return Bulletin.returnAll((error, items) => {
        if (error) { return console.log(error) };
        if (items) {
            console.log("get all", items);
            let bulletinsArr = [];
            items.forEach((item) => {
                bulletinsArr.push({
                    authorMail: item.authorMail,
                    rating: item.rating,
                    category: item.category,
                    preview: item.preview,
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    findId: item.findId
                })
            })
            return bulletinsArr;
        }
    });
}

router.get('/details', (req, res, next) => {
    console.log(req.query.id);
    let currForDet = `${req.query.id}`
    Bulletin.findBulletinBySearch(currForDet, (err, details) => {
        if (err) { res.sendStatus(402) };
        if (details) {
            console.log("det", details);
            let out = JSON.stringify(details);
            res.send(out)
        }
    })

})

router.post('/new-bulletin', upload.any(), (req, res, next) => {
    if (!req.body) return res.sendStatus(400);
    let id = `${Date.now()}`;
    let redId = id.substr(-6, id.length);
    createBulletin(
        currentUser,
        req.body.new_bulletin_category,
        req.body.new_bulletin_describe,
        req.body.new_bulletin_text,
        redId,
        req.body.new_bulletin_name,
        `${req.files[0].filename}`,
        id
    );
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
    getAllItems().then((result) => {
        console.log("this is it", result)
        res.render("main_page", {
            title: 'Bulletin  Test Project',
            categories: ["All", "For Kids", "Tools", "Home", "Hobby", "Different"],
            autorised: userIsAutorised,
            user: currentUser,
            results: result
        })
    })
})

module.exports = router;