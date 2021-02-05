var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/TP_DAW2020', 
      { useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000});
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB...'));
db.once('open', function() {
  console.log("Conexão ao MongoDB realizada com sucesso...")
});

var publicacaoRouter = require('./routes/publicacao');
var noticiasRouter = require('./routes/noticias');
var recursoRouter = require('./routes/recurso');
var usersRouter = require(('./routes/users'))

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  var token = req.query.token || req.body.token;

  if (token == 'consumidor') next();
  else if (token) {
    jwt.verify(token, 'TP_DAW2020', function(e, payload) {
      if (e) res.status(401).jsonp({error: e});
      else next();
    })
  } 
  else res.status(401).jsonp({error: 'Token inexistente'});
})

app.use('/publicacoes', publicacaoRouter);
app.use('/noticias', noticiasRouter);
app.use('/recursos', recursoRouter);
app.use('/users', usersRouter);

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
});

module.exports = app;
