const express = require('express');
const bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const router = express.Router();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

const cardDecorator = require('../decorators/cardDcorator');

let storage = multer.diskStorage({
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

let upload = multer({ storage: storage })

const User = require('../models/user');
const Bulletin = require('../models/bulletin');

const createUser = (email, password) => {
    return new User({
        email: email,
        password: password
    }).save()
}

const createBulletin = (mail, category, preview, text, idView, name, imageName, findId) => {
    return new Bulletin({
        authorMail: mail,
        ratingCount: 0,
        votesCount: 0,
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
        console.log("byCat", items);
    })
}

const getAllItems = () => {
    return Bulletin.returnAll((error, items) => {
        if (error) { return console.log(error) };
    });
}

const deleteOneBulletin = (id, res) => {
    return Bulletin.deleteBulletin(id, (error, result) => {
        if (error) {
            console.log("deleted error", error);
            res.status(204).json({ ID: req.query.id })
        }
        else {
            let file = path.basename(`${result.image}`);
            fs.unlinkSync(path.resolve('public/uploads', file));
            res.sendStatus(200)
        }
    })
}

router.patch('/edit-bulletin', upload.any(), (req, res, next) => {
    const data = req.body;
    const newFile = req.files[0];
    Bulletin.findOne({ findId: data.searchId }, function (err) {
        if (err) {
            res.status(422).json({ "errorr": `${err}` });
            res.end
        }
    }).then((result) => {
        if (newFile === undefined) {
            Bulletin.updateOne({ findId: data.searchId },
                {
                   preview: data.edit_bulletin_describe,
                   name: data.edit_bulletin_name,
                   text: data.edit_bulletin_text,
                }).then((succ) => {
                    res.status(200).send(`updated ${succ.nModified} file`);
                    res.end
                })
        }
        else {
            let oldFile = path.basename(`${result.image}`);
            fs.unlinkSync(path.resolve('public/uploads', oldFile));
            let newFilename = `${newFile.filename}`;
            Bulletin.updateOne({ findId: data.searchId },
                {
                   preview: data.edit_bulletin_describe,
                   name: data.edit_bulletin_name,
                   text: data.edit_bulletin_text,
                   image: `./uploads/${newFilename}`,
                }).then((succ) => {
                    res.status(200).send(`updated ${succ.nModified } file`);
                    res.end
                })
        }
    })
})

router.delete('/delete', (req, res, next) => {
    deleteOneBulletin(req.query.id, res);
    res.end
})

router.get('/details/vote', (req, res, next) => {
    console.log(req.query);
    let unitID = `${req.query.id}`;
    let votedRate = parseInt(req.query.rate);
    Bulletin.findBulletinBySearch(unitID, (err, item) => {
        if (err) { console.log(error) };
    })
        .then((item) => {
            let nextVote = item[0].votesCount + 1;
            let updatedRate = item[0].ratingCount + votedRate;
            Bulletin.updateRating(unitID, updatedRate, nextVote, (error, item) => {
                if (error) { res.sendStatus(422); }
                let out = JSON.stringify([{ currRate: (updatedRate / nextVote) }]);
                res.send(out)
            })
        })
})

router.get('/details', (req, res, next) => {
    console.log(req.query.id);
    let currForDet = `${req.query.id}`
    Bulletin.findBulletinBySearch(currForDet, (err, details) => {
        if (err) { res.sendStatus(422) };
        if (details) {
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
        req.session.mail,
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
                req.session.mail = userMail;
                req.session.autorised = true;
                res.redirect('/');
            }
            else {
                res.render("errors_frame", {
                    alertText: 'Email is currently present in database, please try to log In'
                })
            }
        }
        else {
            createUser(userMail, userPwd);
            req.session.mail = userMail;
            req.session.autorised = true;
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
                req.session.mail = userMail;
                req.session.autorised = true;
                res.redirect('/');
            }
            else {
                res.render("errors_frame", {
                    alertText: 'Password is incorrect, please try again'
                })
            }
        }
        else {
            res.render("errors_frame", {
                alertText: `There is no user with ${userMail} email, please register before try to login `
            })
        }
        if (error) { console.log(error) }
    })
})

router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
})

router.get('/all', (req, res, next) => {
    res.redirect('/');
})

router.get('/for-kids', (req, res, next) => {
    let sess = req.session;
    let user = ' ';
    let loggedIn = req.session.autorised || false
    if (sess.mail) {
        user = sess.mail;
    }
    getBulletinsBy('For Kids').then((result) => {
        if (result.length > 0) {
            const out = cardDecorator(result);
            res.render("main_page", {
                title: 'Bulletin  Test Project',
                categories: ["All", "For Kids", "Tools", "Home", "Hobby", "Different"],
                autorised: loggedIn,
                user: user,
                results: out
            })
        }
        else {
            res.render("errors_frame", {
                alertText: 'no any bulletin in such category'
            })
        }
    })
})

router.get('/tools', (req, res, next) => {
    let sess = req.session;
    let user = ' ';
    let loggedIn = req.session.autorised || false
    if (sess.mail) {
        user = sess.mail;
    }
    getBulletinsBy('Tools').then((result) => {
        if (result.length > 0) {
            const out = cardDecorator(result);
            res.render("main_page", {
                title: 'Bulletin  Test Project',
                categories: ["All", "For Kids", "Tools", "Home", "Hobby", "Different"],
                autorised: loggedIn,
                user: user,
                results: out
            })
        }
        else {
            res.render("errors_frame", {
                alertText: 'no any bulletin in such category'
            })
        }
    })
})

router.get('/home', (req, res, next) => {
    let sess = req.session;
    let user = ' ';
    let loggedIn = req.session.autorised || false
    if (sess.mail) {
        user = sess.mail;
    }
    getBulletinsBy('Home').then((result) => {
        if (result.length > 0) {
            const out = cardDecorator(result);
            res.render("main_page", {
                title: 'Bulletin  Test Project',
                categories: ["All", "For Kids", "Tools", "Home", "Hobby", "Different"],
                autorised: loggedIn,
                user: user,
                results: out
            })
        }
        else {
            res.render("errors_frame", {
                alertText: 'no any bulletins in such category'
            })
        }
    })
})

router.get('/hobby', (req, res, next) => {
    let sess = req.session;
    let user = ' ';
    let loggedIn = req.session.autorised || false
    if (sess.mail) {
        user = sess.mail;
    }
    getBulletinsBy('Hobby').then((result) => {
        console.log("this is it", result)
        if (result.length > 0) {
            const out = cardDecorator(result);
            res.render("main_page", {
                title: 'Bulletin  Test Project',
                categories: ["All", "For Kids", "Tools", "Home", "Hobby", "Different"],
                autorised: loggedIn,
                user: user,
                results: out
            })
        }
        else {
            res.render("errors_frame", {
                alertText: 'No any bulletins in such category'
            })
        }
    })
})

router.get('/different', (req, res, next) => {
    let sess = req.session;
    let user = ' ';
    let loggedIn = req.session.autorised || false
    if (sess.mail) {
        user = sess.mail;
    }
    getBulletinsBy('Different').then((result) => {
        console.log("this is it", result)
        if (result.length > 0) {
            const out = cardDecorator(result);
            res.render("main_page", {
                title: 'Bulletin  Test Project',
                categories: ["All", "For Kids", "Tools", "Home", "Hobby", "Different"],
                autorised: loggedIn,
                user: user,
                results: out
            })
        }
        else {
            res.render("errors_frame", {
                alertText: 'No any bulletins in such category'
            })
        }
    })
})

router.get('/', (req, res, next) => {
    let sess = req.session;
    let user = ' ';
    let loggedIn = req.session.autorised || false
    if (sess.mail) {
        user = sess.mail;
    }
    getAllItems().then((result) => {
        console.log("this is it", result)
        const out = cardDecorator(result);
        res.render("main_page", {
            title: 'Bulletin  Test Project',
            categories: ["All", "For Kids", "Tools", "Home", "Hobby", "Different"],
            autorised: loggedIn,
            user: user,
            results: out
        })
    })
})

module.exports = router;