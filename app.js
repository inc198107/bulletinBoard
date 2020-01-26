const express = require("express");
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const bodyParser = require("body-parser");

const app = express();

const index = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));  //pug engine init
app.set('view engine', 'pug');

app.use(express.json());

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
app.use(function(err, req, res, next) {
 // set locals, only providing error in development;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3030, () => {
    console.log("started on :3030")
})