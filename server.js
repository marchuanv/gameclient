var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var release = require("./release.js");

var app = express();
var port = process.env.PORT || 3000;

var libDir = path.resolve("/lib",__dirname+"/lib");

app.use(bodyParser.json());
app.use("/external", express.static("external"));
app.use("/release", express.static("release"));
app.use("/downloads", express.static("downloads"));
app.use("/publish", express.static("publish"));
app.post(/^\/publish$/igm, function(req, res) {
	release.publish(req.query.fileName, function(){
		res.status(200).send();
	},function fail(err){
		console.log("ERROR: ",err);
	});
});
app.get(/^\/$/igm, function(req, res) {
	release.create();
	setTimeout(function(){
		res.status(200).sendFile(libDir+"/designer.html");
	},2000);
});
app.listen(port, function () {
  console.log('listening on port', port);
});