var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/lib", express.static("lib"));
app.listen(port, function () {
  console.log('listening on port', port);
});