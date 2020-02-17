const express = require("express");
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const uri = "mongodb+srv://iAm:qwedf1981@cluster0-kgvh0.mongodb.net/test?retryWrites=true&w=majority";
const mongoose = require('mongoose');
const app = express();

const port = process.env.port || 3030;

const connectionDB = () => {
    mongoose.Promise = require('bluebird');
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    return mongoose.connection
}

const index = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));  //pug engine init
app.set('view engine', 'pug');

app.use(express.json());

app.use(cookieParser());

app.use(session({
    secret: 'myBulletinSecret',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ 
        url: uri,
      })
}));

app.use(sassMiddleware({
    src: path.join(__dirname, 'src'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    indentedSyntax: false,
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development;
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//database connection and server start
connectionDB()
    .on('error', console.log)
    .on('disconnected', connectionDB)
    .once('open', () => {
        console.log('db connected')
        app.listen(port,"0.0.0.0", () => {
            console.log(`started on ${port}`)
        })
    })

