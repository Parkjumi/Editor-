var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.set('views');
app.set('view engine', 'ejs');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'20152595',
  database:'editortest'
});

con.connect(function (err) {
  if(err){
    console.log('mysal connection is fail');
    console.log(err);
  }else{
    console.log('mysql connetion is sucess');
  }
});

app.use('/script', express.static(__dirname + "/script"));

app.listen(3000, function () {
  console.log('Server Start');
});

app.get('/', function (req, res) {
  var sql = "select * from test";

  con.query(sql, function (err ,result,fields) {
      if(err){
        console.log('executing query string is fail');
      }else{
        console.log(result[0].test, "나왔음");
        res.render('test');
      }
    });
  res.render('test');
});

app.post('/poster/insert', function(req, res) {
  var sql = "insert into test values(?,?)" ;
  var test = req.body.d;

  var index = ["test", test]

  con.query(sql, index, function (err,result,rows) {
    if(err){
      console.log('executing query string is fail');
      res.send({result:"이런"});
    }else{
      console.log("들어갔음");
      res.send({result:"들어감"});
    }
  });
});

app.get('/noanswer', function (req,res) {
  var sql = "select * from test";

  con.query(sql, function (err,result,rows) {
    if(err){
      console.log('executing query string is fail');
    }else{
      res.render("noanswer");
    }
  });
});

app.post('/setdata', function (req, res) {
  var sql = "select * from test where title=?";
  var title = req.body.title;
  con.query(sql, title, function (err,result,rows) {
    if(err){
      console.log('executing query string is fail');
    }else{
      console.log(result);
      res.send({result:result});
    }
  })
});
