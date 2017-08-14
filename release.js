var common = require('./lib/utils.js');
var path = require('path');
var beautify = require('js-beautify').js_beautify;
var UglifyJS = require("uglify-js");

var libDir = __dirname+"/lib";
var extLib = __dirname+"/external";
var assets = __dirname+"/assets";
var releaseDir = __dirname + "/release";
var publishDir = __dirname + "/publish";
var downloadsDir = __dirname + "/downloads";

function compress(fileName, jsCode){
	return jsCode;
	// var result  = UglifyJS.minify(jsCode); // parse code and get the initial AST
	// if (result.error){
	// 	throw "Tried to compress " + fileName +" but resulted in error: "+ result.error;
	// }else{
	// 	return result.code // compressed code here
	// }
};

function Release(){
	this.create = function(){
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
		console.log('----------------------< GENERATING INTERNAL LIBRARIES >---------------------');
		common.enumerateDir(libDir, ".js,.css", function item (jsResolvedPath) {

			var isSceneTemplate = false;
			if (jsResolvedPath.indexOf("templates") >= 0 && jsResolvedPath.endsWith("Scene.js") >= 0){
				isSceneTemplate = true;
			}
			if (!isSceneTemplate){
				common.readFile(jsResolvedPath, function complete(data){ //DO JS FILES
					
					var newData = data;
					var releaseFilePath = jsResolvedPath.replace("lib","release");
					var startExp = '/*[';
					var endExp = ']*/';
					var startIndex = newData.indexOf('/*[');
					var startIndexOffset =  startIndex+ startExp.length;
					var endIndex = newData.indexOf(']*/',startIndex);
					var endIndexOffset = endIndex + endExp.length-3;
					var header  = newData.substring(startIndex, endIndex + endExp.length);
					if (header.startsWith('/*[')){
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

						var isSingleton = false;
						if (newData.indexOf("/*SINGLETON*/") >= 0){
							isSingleton = true;
							newData = newData.replace("/*SINGLETON*/","");
						}

						newData = "factory(function(factory){\r\n factory.register("+isClass+", "+isSingleton+", function " +  functionName + "("+arguments+"){\r\n" + newData + " \r\n }, function error(err){})});";
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
						var obj = JSON.parse(jsonStr);
						var _newConfig = JSON.stringify(obj);
						var config = "factory(function(factory){ factory.register(false, false, function " +  functionName + "(){\r\n return '"+_newConfig+"'; \r\n }, function error(err){})});";
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
					common.enumerateDir(libDir, ".tpl.html", function (jsonResolvedPath) {
						
						var releaseFilePath = jsonResolvedPath.replace("lib","release");
						releaseFilePath = releaseFilePath.replace(".tpl","");
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
	this.publish = function(publishFileName, cbComplete, cbFail){

		console.log();
		console.log('----------------------< CLEANUP >---------------------');

		common.enumerateDir(publishDir, ".js", function (resolvedPath) {
			console.log("removing ",resolvedPath);
			common.removeFile(resolvedPath);
		},function complete(){
		},function fail(){
		});
		common.enumerateDir(publishDir, ".json", function (resolvedPath) {
			console.log("removing ",resolvedPath);
			common.removeFile(resolvedPath);
		},function complete(){
		},function fail(){
		});
		common.enumerateDir(publishDir, ".html", function (resolvedPath) {
			console.log("removing ",resolvedPath);
			common.removeFile(resolvedPath);
		},function complete(){
		},function fail(){
		});
		common.enumerateDir(publishDir, ".zip", function (resolvedPath) {
			console.log("removing ",resolvedPath);
			common.removeFile(resolvedPath);
		},function complete(){
		},function fail(){
		});

		console.log('----------------------< STARTING PUBLISH >---------------------');
		var compressedJs;
		common.enumerateDir(releaseDir, ".js", function (jsResolvedPath) {
			if (jsResolvedPath.indexOf("github") == -1){
				if (jsResolvedPath.indexOf(".min.") == -1 ){
					common.readFile(jsResolvedPath, function(jsScript){
						if (jsScript){
							compressedJs += compress(jsResolvedPath, jsScript);
						}
					}, cbFail);
				}else{
					var fileName = common.getFileName(jsResolvedPath);
					common.copyFile(jsResolvedPath, publishDir + "/" + fileName);
				}
			}
		},function complete(){
			var releaseFilePath = publishDir + "/game.min.js";
			compressedJs = compressedJs.replace("undefinedfunction","function");
			common.saveFile(releaseFilePath, compressedJs, function saved(){
				console.log(releaseFilePath + " was created.");
				console.log();
				console.log('----------------------< GENERATING INDEX.HTML FOR PUBLISH >---------------------');
				common.enumerateDir(libDir, "index.tpl.html", function (jsonResolvedPath) {
					var htmlReleaseFilePath = jsonResolvedPath.replace("lib","publish");
					var fileName = common.getFileName(jsonResolvedPath);
					htmlReleaseFilePath = htmlReleaseFilePath.replace(fileName,"index.html");
					common.readFile(jsonResolvedPath, function(htmlStr){
						var newHtmlStr = htmlStr;
						common.enumerateDir(releaseDir, ".min.js", function (resolvedJSPath) {
							if (resolvedJSPath.indexOf("github") == -1){
								var fileName = common.getFileName(resolvedJSPath);
								newHtmlStr = newHtmlStr.replace("[script]",'\r\n<script type="text/javascript" src="'+fileName+'"></script> [script]');
								console.log("adding js script",resolvedJSPath);
							}
						}, function complete(){
							newHtmlStr = newHtmlStr.replace("[script]",'\r\n<script type="text/javascript" src="game.min.js"></script> [script]');
							newHtmlStr = newHtmlStr.replace("[script]","");
							common.saveFile(htmlReleaseFilePath, newHtmlStr, function saved(){
								console.log(htmlReleaseFilePath + " was created.");
								console.log('----------------------< GENERATING PUBLISH ZIP FILE >---------------------');
								common.zipFile(publishDir, downloadsDir+"/"+publishFileName,function complete(){
									console.log('----------------------< ZIP FILE GENERATED >---------------------');
									cbComplete(downloadsDir+"/"+publishFileName);
								},cbFail);
							}, cbFail);
						}, cbFail);
					}, cbFail);
				},function complete(){
				}, cbFail);
			},cbFail);
		},cbFail);
	};
};

module.exports = new Release();