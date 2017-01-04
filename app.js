var AWS = require('aws-sdk');
var express = require('express');
var app = express();
app.locals.moment = require('moment');
app.locals.moment.locale('pt-br');

//config express
app.use(express.static(__dirname));
app.set('views', __dirname);
app.set('view engine', 'jade');

AWS.config.update({region: 'sa-east-1'});

//rotas
app.get('/', function (req, res) {
  res.render('index', { usuarios:[
    {
      photo: 'https://randomuser.me/api/portraits/men/51.jpg',
      name: 'Joshua Gray',
      email: 'joshua.gray13@example.com',
      me:true
    },
    {
      photo: 'https://randomuser.me/api/portraits/women/94.jpg',
      name: 'myrtle ryan',
      email: 'myrtle.ryan13@example.com'
    },
    {
      photo: 'https://randomuser.me/api/portraits/men/19.jpg',
      name: 'fernando freeman',
      email: 'fernando.freeman40@example.com'
    }
  ],
  mensagens: [
    {
      usuario: {
        photo: 'https://randomuser.me/api/portraits/men/51.jpg',
        name: 'Joshua Gray',
        email: 'joshua.gray13@example.com'
      },
      mensagem: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.",
      datetime: new Date()
    }
  ]});
})

app.post('/', function(req, res){

})

app.listen(80, function () {
  console.log('appdynamodb rodando na porta 80!')
});

