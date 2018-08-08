// server.js
// where your node app starts

// init project
var express = require('express');
var stackexchange = require('stackexchange');

var cache = require('memory-cache');
 
var options = { version: 2.2 };
var context = new stackexchange(options);
 
var filter = {
  key: process.env.STACK_KEY,
  pagesize: 100,
  tagged: 'javascript',
  sort: 'creation',
  order: 'desc'
}; 

getQuestions();

var app = express();

//CORS enable
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/questions', function(req,resp){
  resp.json({result: cache.get('questions')});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

function getQuestions(){
  context.questions.questions(filter, function(err, results){
    if (err) cache.put('questions',null);
    cache.put('questions',results,21600000, function(){
    ///blah
      getQuestions();
    });
  });
}