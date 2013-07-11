var express = require('express');
var fs = require('fs');
var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  	var buff = new Buffer(200);
	var len;
	do{
		len  = buff.write(fs.readFileSync('index.html','utf-8'));
		response.send(buff.toString('utf-8', 0, len));
	}while(len!=0);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
