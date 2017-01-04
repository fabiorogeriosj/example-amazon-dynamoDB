var AWS = require('aws-sdk');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.locals.moment = require('moment');
app.locals.moment.locale('pt-br');

//config express
app.use(express.static(__dirname+'/www'));
app.set('views', __dirname+'/www');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

AWS.config.update({region: 'sa-east-1'});
var docClient = new AWS.DynamoDB.DocumentClient();

var salas = [
  {
    nome: 'geral',
    icone: 'megaphone.png',
    descricao: 'Assunto geral que rola no mundo!'
  },
  {
    nome: 'música',
    icone: 'headphones.png',
    descricao: 'Trocar ideias no estilo musical ;)'
  },
  {
    nome: 'filme',
    icone: 'youtube.png',
    descricao: 'O que ta rolando sobre filmes, séries e novalas?'
  },
  {
    nome: 'festa',
    icone: 'theater.png',
    descricao: 'Aquela festa animal! Onde? Quando? #bora!'
  },
  {
    nome: 'viagem',
    icone: 'airplane.png',
    descricao: 'O mundo é grande de mais para ficar apenas em um lugar!'
  },
  {
    nome: 'universidade',
    icone: 'mortarboard.png',
    descricao: 'Duas canetas um papel e bora pro papo de universitários :)'
  },
];

//rotas
app.get('/*', function (req, res) {
  var sala = "geral";
  var salasPorLink = [];
  if(req.url === "/"){
    salas[0].principal=true;
  } else {
    sala = decodeURI(req.url.replace("/",""));
    var heSalaOficial=false;
    for(i in salas){
      if(salas[i].nome === sala){
        salas[i].principal=true;
        heSalaOficial=true;
      } else {
        salas[i].principal=false;
      }
    }
    if(!heSalaOficial){
      salasPorLink.push({
        nome: sala,
        icone: 'target.png',
        descricao: 'Apenas os usuários que tiverem o link da sala poderam enviar mensagens.',
        principal:true
      })
    }
  }
  var params = {
      TableName : "mensagens",
      Limit: 100,
      KeyConditionExpression: "#sala = :sala",
      ExpressionAttributeNames:{
          "#sala": "sala"
      },
      ExpressionAttributeValues: {
          ":sala":sala
      },
      ScanIndexForward: false
  };
  docClient.query(params, function(err, data){
    //console.log(err, data);
    if(err){
      res.render('index', {error:err});
    } else {
      res.render('index', {mensagens:data.Items, salas:salas, salasPorLink: salasPorLink, sala:sala});
    }
  });
})

app.post('/*', function(req, res){
  if(!req.body.usuario || !req.body.usuario.name || !req.body.usuario.photo || !req.body.mensagem){
    res.jsonp({isValid:false, msg:"Você precisa estar logado e digitar uma mensagem para conversar com a galera!"});
  } else if(req.body.mensagem.length > 10000){
    res.jsonp({isValid:false, msg:"Eita! Sua mensagem é muito grande, não foi possível enviar :("});
  } else {
    var sala = "geral";
    if(req.url != "/"){
      sala = decodeURI(req.url.replace("/",""));
    }
    var table = "mensagens";
    var params = {
        TableName:table,
        Item: {
            "sala": sala,
            "timestamp": new Date().getTime(),
            "usuario": req.body.usuario,
            "mensagem": req.body.mensagem
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            res.jsonp({isValid:false, data:err})
        } else {
            res.jsonp({isValid:true, data:data})
        }
    });
  }
});

app.listen(80, function () {
  console.log('appdynamodb rodando na porta 80!')
});
