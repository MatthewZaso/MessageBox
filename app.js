var express = require('express');
var path = require('path');
var Datastore = require('nedb');
var db = new Datastore({ filename: '.data/datafile', autoload: true });
var app = express();
var bodyParser = require('body-parser')

// Define the port to run on
app.set('port', process.env.PORT || 8888);

app.use(express.static('dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var initData = [
  {
    'recipient': 'John',
    'message': 'Hello from nedb'
  },
];

db.count({}, function (err, count) {
  if (err) console.log("Database Error: ", err);
  else if (count <= 0) {
    db.insert(initData, function (err, dataAdded) {
      if (err) console.log("Error Inserting Data: ", err);
      else if (dataAdded) console.log("Data successfully imported!");
    });
  }
});

app.post('/send', function (request, response) {
  db.insert({ recipient: request.body.recipient, message: request.body.message }, function (err, message) {
    if (err) {
      console.log("Problem adding to database: ", err);
    }
    else if (message) {
      console.log("New message inserted in the database");
    }
  });
  response.sendStatus(200);
});

app.get('/messages', function(request, response) {
  db.find({}, function (err, messages) {
    if(err) {
      console.log('Error getting messages');
    }
    var output = messages.map(function (message) {
      return message;
    });
    response.send(output);
  });
});

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Express running on port ' + port);
});
