var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')

var app = express();
var port = process.env.PORT || 3000;

var external = path.resolve("/letfly",__dirname+"/external");
var assets = path.resolve("/letfly",__dirname+"/assets");
var release = path.resolve("/letfly",__dirname+"/release");

app.use(bodyParser.json());
app.use("/external", express.static(external));
app.use("/assets", express.static(assets));
app.use("/release", express.static(release));

function deleteRoute(url) {
	for (var i = app.routes.get.length - 1; i >= 0; i--) {
		var route = app.routes.get[i];
		if (route.path === "/" + url) {
			console.log("removed route: ",route);
		  	app.routes.get.splice(i, 1);
		}
	};
}

app.get('/', function(req, res) {
	require("./release.js");
	setTimeout(function(){
		res.status(200).sendFile(release+"/index.html");
	},2000);
});

app.post('/release', function(req, res) {
	require("./release.js");
	setTimeout(function(){
		res.status(200).send({message: "All good"});
	},2000);
});

app.listen(port, function () {
  console.log('listening on port', port);
});
