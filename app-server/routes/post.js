var express = require('express');
var router = express.Router();

var axios = require('axios');

router.get('/:id/classificar/:pont', (req,res) => {
    var token = aux.unveilToken(req.cookies.token);
    console.log("boas")
  
    axios.put(`http://localhost:8001/recursos/${req.params.id}/classificar/?token=${req.cookies.token}`,
      {user: token._id, pontuacao: Number.parseInt(req.params.pont)})
        .then(dados => res.redirect('/recursos'))
        .catch(error => res.render('error', {error}))
})

module.exports = router;
