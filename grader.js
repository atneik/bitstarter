#!/usr/bin/env node
var util = require('util');
var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://warm-mesa-7096.herokuapp.com/";
var flag = 0;

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertUrlExists = function(url) {
  return url;
};

var cheerioHtmlFile = function(htmlfile) {
    var data = fs.readFileSync(htmlfile);
	var hh = cheerio.load(fs.readFileSync(htmlfile));
	//console.log(hh);
	return hh;
};

var cheerioUrl = function(url, checksfile) {
	var dataString;
	var flag = 0;
	rest.get(url).on('complete',function(result){
		if (result instanceof Error){
			console.log('Error' +result.message);
			this.retry(5000);
		}else{

		var checkJson =	 checkUrl(cheerio.load(result), checksfile);	 

    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);

		}
	});
};


var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
//console.log($);    
var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
//console.log($(checks[ii]));        
out[checks[ii]] = present;
    }
    return out;
};

var dummyF = function(dataString){
return dataString;
};

var checkUrl = function(dataString, checksfile) {
    $ = dummyF(dataString);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
//console.log($(checks[ii]));        
out[checks[ii]] = present;
    }
    return out;
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url_link>', 'Url to index.html', clone(assertUrlExists), URL_DEFAULT)
	.parse(process.argv);
    var checkJson = checkHtmlFile(program.file, program.checks);
   var outJson = JSON.stringify(checkJson, null, 4);
   console.log(outJson);

     cheerioUrl(program.url, program.checks);
   } else {
    exports.checkHtmlFile = checkHtmlFile;
    exports.checkUrl = checkUrl;
}
