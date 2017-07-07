var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var release = require("./release.js");

var app = express();
var port = process.env.PORT || 3000;

var external = path.resolve("/letfly",__dirname+"/external");
var assets = path.resolve("/letfly",__dirname+"/assets");
var releaseDir = path.resolve("/letfly",__dirname+"/release");

app.use(bodyParser.json());
app.use("/external", express.static(external));
app.use("/assets", express.static(assets));
app.use("/release", express.static(releaseDir));

app.get(/^\/publish$/igm, function(req, res) {
	release.publish(function(publishData){
		res.status(200).send({
			message: "All good", 
			publish: publishData
		});
	},function fail(err){
		console.log("ERROR: ",err);
	});
});

app.get(/^\/$/igm, function(req, res) {
	release.create();
	setTimeout(function(){
		res.status(200).sendFile(releaseDir+"/index.html");
	},2000);
});

app.listen(port, function () {
  console.log('listening on port', port);
});