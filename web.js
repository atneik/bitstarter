var express = require('express');
var fs = require('fs');
var util = require('util');
var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  	var stats = fs.statSync('index.html');
	var buff = new Buffer(stats.size);
	buff.write(fs.readFileSync('index.html','utf-8'));
	response.send(buff.toString());
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
