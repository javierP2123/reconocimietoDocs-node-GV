var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
const fs = require('fs');
const util = require('util');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var analyzeRouteRest = require('./routes/analyzeDocs');
const fileUpload = require('express-fileupload');

var app = express();
app.options('*', cors());

var log_file = fs.createWriteStream('./logs/node'+Date.now+'.log', {
  flags: 'w'
});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
  extended: false
}))
// app.use(cookieParser());

app.use(fileUpload());

// app.use(express.static(path.join(__dirname, 'public')));

// app.use(cors());
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//   next();
// });

app.use('/docsAnalyze', analyzeRouteRest);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;





/*
instalar google cloud platform e iniciar sesion
añadir la variable de entorno (obtenida desde cloud):: GOOGLE_APPLICATION_CREDENTIALS indicando la localizacion del archivo json que contiene las llaves
instalar los modulos de npm
correr la aplicacion


liga de interes::
https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually
*/
