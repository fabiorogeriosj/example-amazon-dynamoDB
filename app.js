var AWS = require('aws-sdk');
var express = require('express');
var app = express();

//config express
app.use(express.static(__dirname));
app.set('views', __dirname);
app.set('view engine', 'jade');

AWS.config.update({region: 'us-east-1'});

//rotas
app.get('/', function (req, res) {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = { TableName : "tarefas", Limit : 50 };
  console.log("vai")
  docClient.query(params, function(err, data) {
      if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Query succeeded.");
          data.Items.forEach(function(item) {
              console.log(item);
          });
      }
  });
})

app.post('/', function(req, res){

})

app.listen(80, function () {
  console.log('appdynamodb rodando na porta 80!')
});

