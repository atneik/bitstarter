var express = require('express');
var fs = require('fs');
var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  	var buff = new Buffer(256);
	var len=256;
	var ctr = 0;
	do{
		len  = buff.write(fs.readFileSync('index.html','utf-8').slice(ctr,ctr+len),'utf-8');
		ctr = ctr + len;
		response.send(buff.toString());
		buff.fill(' ');
	}while(len!=0);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
