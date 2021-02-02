var express = require('express');
var router = express.Router();

var axios = require('axios');
var moment = require('moment')

router.get('/', function(req, res) {
  if (req.cookies.token) {
    axios.get('http://localhost:8001/noticias?token=' + req.cookies.token)
      .then(dados => {
        var noticias = [];
        
        dados.data.forEach(n => {
          var not = `${moment(n.data).format('HH:mm:SS, DD-MM-YYYY')}`
          not += `<p>O produtor <a href="/perfil/${n.idAutor}">${n.nomeAutor}</a> disponibilizou ${n.recursos.length > 1 ? 'os seguintes recursos' : 'o seguinte recurso'}: <ul>`
          n.recursos.forEach(r => not += `<li> <a href="/recursos/${r.id}">${r.titulo}</a> (${r.tipo})`)
          not += `</ul></p><hr>`

          noticias.push(not)
        })
        
        axios.get('http://localhost:8001/recursos/tipos?token=' + req.cookies.token)
          .then(tipos => res.render('home', {auth: true, noticias, tipos: tipos.data}))
          .catch(error => res.render('error', {error}))
      })
      .catch(error => res.render('error', {error}))
  }
  else res.render('home', {auth: req.cookies.token ? true : false});
});

module.exports = router;
