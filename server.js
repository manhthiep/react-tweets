// Require our dependencies
var express = require('express'),
  http = require('http'),
  mongoose = require('mongoose'),
  twitter = require('ntwitter'),
  routes = require('./routes'),
  config = require('./config'),
  streamHandler = require('./utils/streamHandler');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

// Set up ejs for templating
app.set('view engine', 'ejs');

// Disable etag headers on responses
app.disable('etag');

// Connect to our mongo database
mongoose.connect(config.mongodb.uri);

// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));

// Index Route
app.get('/', routes.index);
// Page Route
app.get('/page/:page/:skip', routes.page);

// Fire this bitch up (start our server)
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});

// Initialize socket.io
var io = require('socket.io').listen(server);

// Create a new ntwitter instance
var twit = new twitter(config.twitter);

// Set a stream listener for tweets matching tracking keywords
twit.stream('statuses/filter',{ track: 'javascript'}, function(stream){
  streamHandler(stream,io);
});
