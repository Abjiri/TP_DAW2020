var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

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

var User = require('./controllers/user')

// Configuração da estratégia local
passport.use(new LocalStrategy(
  {usernameField: 'email'}, (email, password, done) => {
    User.consultar(email)
      .then(dados => {
        const user = dados
        console.log(user)

        if(!user) { return done(null, {success: false, invalidInput: 'email', message: 'Email inexistente!\n'})}
        if(password != user.password) { return done(null, {success: false, invalidInput: 'password', message: 'Password inválida!\n'})}

        return done(null, {success: true, user})
      })
      .catch(e => done(e))
    })
)

// Indica-se ao passport como serializar o utilizador
passport.serializeUser((user,done) => {
  if (user.success) {
    console.log('Serialização, email: ' + user.email)
    done(null, {success: user.success, email: user.email})
  }
  else done(null, user)
})
  
// Desserialização: a partir do id obtem-se a informação do utilizador
passport.deserializeUser((user, done) => {
  if (user.success) {
    console.log('Desserialização, email: ' + user.email)
    User.consultar(user.email)
      .then(dados => done(null, {success: true, user: dados}))
      .catch(erro => done(erro, false))
  }
  else done(null, user)
})

var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

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
