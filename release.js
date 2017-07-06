var common = require('./lib/utils.js');
var path = require('path');
var beautify = require('js-beautify').js_beautify;
var libDir = __dirname+"/lib";
var extLib = __dirname+"/external";
var assets = __dirname+"/assets";
var releaseDir = __dirname + "/release";


function createRelease(){
	console.log();
	console.log('----------------------< CLEANUP >---------------------');
	common.enumerateDir(releaseDir, ".js", function (resolvedPath) {
		console.log("removing ",resolvedPath);
		common.removeFile(resolvedPath);
	},function complete(){
	},function fail(){
	});
	common.enumerateDir(releaseDir, ".json", function (resolvedPath) {
		console.log("removing ",resolvedPath);
		common.removeFile(resolvedPath);
	},function complete(){
	},function fail(){
	});
	common.enumerateDir(releaseDir, ".html", function (resolvedPath) {
		console.log("removing ",resolvedPath);
		common.removeFile(resolvedPath);
	},function complete(){
	},function fail(){
	});

	console.log();
	console.log('----------------------< GENERATING JS FILES >---------------------');
	common.enumerateDir(libDir, ".js", function item (jsResolvedPath) {

		var isSceneTemplate = false;
		if (jsResolvedPath.indexOf("templates") >= 0 && jsResolvedPath.endsWith("Scene.js") >= 0){
			isSceneTemplate = true;
		}
		if (!isSceneTemplate){
			common.readFile(jsResolvedPath, function complete(data){ //DO JS FILES
				var newData = data;
				var releaseFilePath = jsResolvedPath.replace("lib","release");
				if (releaseFilePath.indexOf("game") >= 0){
					var startExp = '/*[';
					var endExp = ']*/';
					var startIndex = newData.indexOf('/*[');
					var startIndexOffset =  startIndex+ startExp.length;
					var endIndex = newData.indexOf(']*/',startIndex);
					var endIndexOffset = endIndex + endExp.length-3;
					var header  = newData.substring(startIndex, endIndex + endExp.length);
					var arguments = newData.substring(startIndexOffset, endIndexOffset);
					var factoryDepArray = arguments.split(',');
					var functionName = common.getFileName(releaseFilePath);
					functionName = functionName.replace(".js","");

					newData = newData.replace(header,"");
					arguments = arguments.replace(/\ /g, "");

					var isClass = false;
					if (newData.indexOf("/*CLASS*/") >= 0){
						isClass = true;
						newData = newData.replace("/*CLASS*/","");
					}

					newData = "factory(function(factory){\r\n factory.register("+isClass+", function " +  functionName + "("+arguments+"){\r\n" + newData + " \r\n }, function error(err){})});";
					newData = beautify(newData, { indent_size: 2 });
				} 
				common.saveFile(releaseFilePath, newData, function () {
					console.log("code file saved at ",releaseFilePath);
				}, function fail(err){
					console.log("ERROR:",err);
				});
			}, function fail(){
			});
		}
	},function complete(){ //DO CONFIGURATIONS
		
		console.log();
		console.log('----------------------< GENERATING CONFIG >---------------------');
		
		common.enumerateDir(libDir, ".json", function (jsonResolvedPath) {
			var isSceneTemplate = false;
			if (jsonResolvedPath.indexOf("templates") >= 0 && jsonResolvedPath.endsWith("Scene.json")){
				isSceneTemplate = true;
			}
			if (!isSceneTemplate){
				var releaseFilePath = jsonResolvedPath.replace("lib","release");
				var functionName = common.getFileName(releaseFilePath);
				functionName = functionName.replace(".json","Config");
				releaseFilePath = releaseFilePath.replace(".json","Config.js");
				common.readFile(jsonResolvedPath, function(jsonStr){
					var config = "factory(function(factory){ factory.register(false, function " +  functionName + "(){\r\n return `"+jsonStr+"`; \r\n }, function error(err){})});";
					common.saveFile(releaseFilePath, config, function saved(){
						console.log("config json file saved at ",releaseFilePath);
					}, function fail(){
					});

				}, function fail(){
				});
			}
		},function complete(){
			console.log();
			console.log('----------------------< GENERATE EXTERNAL LIBRARIES >---------------------');
			common.enumerateDir(extLib, ".js", function (jsResolvedPath) {
				var releaseFilePath = jsResolvedPath.replace("external","release");
				common.readFile(jsResolvedPath, function(jsFileData){
					common.saveFile(releaseFilePath, jsFileData, function saved(){
						console.log(releaseFilePath + " was created.");
					}, function fail(){
					});
				}, function fail(){
				});

				common.enumerateDir(extLib, ".css", function (jsResolvedPath) {
					var releaseFilePath = jsResolvedPath.replace("external","release");
					common.readFile(jsResolvedPath, function(jsFileData){
						common.saveFile(releaseFilePath, jsFileData, function saved(){
							console.log(releaseFilePath + " was created.");
						}, function fail(){
						});
					}, function fail(){
					});
				},function complete(){
				});

			},function complete(){
				console.log();
				console.log('----------------------< GENERATING INDEX.HTML >---------------------');
				common.enumerateDir(libDir, ".html", function (jsonResolvedPath) {
					var releaseFilePath = jsonResolvedPath.replace("lib","release");
					common.readFile(jsonResolvedPath, function(htmlStr){
						var newHtmlStr = htmlStr;
						common.enumerateDir(releaseDir, ".js", function (resolvedJSPath) {
							if (resolvedJSPath.indexOf("server.js") == -1){
								var relativePath = path.relative("designs", resolvedJSPath);
								newHtmlStr = newHtmlStr.replace("[script]",'\r\n<script type="text/javascript" src="'+relativePath+'"></script> [script]');
								console.log("adding js script",resolvedJSPath);
							}
						}, function complete(){
							newHtmlStr = newHtmlStr.replace("[script]","");
							common.saveFile(releaseFilePath, newHtmlStr, function saved(){
								console.log(releaseFilePath + " was created.");
							}, function fail(){
							});
						}, function fail(err){
							console.log("Error:",err);
						});
					}, function fail(){
					});
				},function complete(){
					
				}, function fail(){
				});
			}, function fail(){
			});
		}, function fail(){
		});
	}, function fail(){
	});
};

module.exports = createRelease();