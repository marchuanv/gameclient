function generateGUID(argument) {
    function S4() {
        return (((1 + Math.random()) * 0x10000) |0).toString(16).substring(1); 
    }
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
};

function titleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function(word) {
            return word[0].toUpperCase() + word.substr(1);
        })
        .join(' ');
};

function getFunctionName(func) {
    var ret = func.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
};

function getFunctionArguments(func){
	var args = func.toString().
  		replace(/[\r\n\s]+/g, ' ').
  		match(/function\s*\w*\s*\((.*?)\)/)[1].split (/\s*,\s*/);
  	return args;
}

function enumerate(collection, context, callback, callbackComplete){

	if (!collection){
		throw "colection not supplied for enumeration.";
	}
	if (!context){
		throw "context not supplied for callbacks.";
	}
	if (!callback){
		throw "callback not supplied.";
	}
	if (typeof callback !== 'function'){
		throw "callback not supplied.";
	}
	for (var i = collection.length - 1; i >= 0; i--) {
		var item = collection[i];
		var exit = false;
		if (item != undefined){
			callback.call(context, item, function setCondition(condition, cbCondition){
				if (condition == true){
					cbCondition();
				}
			}, function remove(){
				collection.splice(i,1);
			},function _break(){
				exit = true;
			},function replace(newItem){
				collection[i] = newItem;
			},function begin(){
			},function end(){
			});
		}
		if (exit){
			break;
		}
	};
	if (callbackComplete){
		callbackComplete.call(context);
	}
};

function escapePath(_path){
	var newPath = _path.replace(/[\\]/gm,'/');
	return newPath;
};

function generateRandomNumber(min, max){
	 return Math.floor(Math.random() * (max - min + 1)) + min;
};

function sortArray(array, numericSortingProperty){
	var sortCount = array.length * 2;
	for (var i = sortCount; i > 0; i--) {
		array.sort(function(obj1,obj2){
			return obj1[numericSortingProperty] - obj2[numericSortingProperty];
		});
	}
	array.reverse();
};

function isKeyAlphaNumeric(keyCode, cbDone){
	if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 48 && keyCode <= 57)) {
		cbDone();
	}
}

function getFileName(filePath){
	return path.basename(filePath);
};

function getDirectories (srcpath, cbDir, cbComplete, cbFail) {
	try{
		var _srcpath = escapePath(srcpath);
		var resolvedPath = path.resolve(_srcpath);
	  	var dirs = fs.readdirSync(_srcpath)
	    	.filter(file => fs.statSync(path.join(resolvedPath, file)).isDirectory());
	    if (dirs.length > 0){
		    for (var i = dirs.length - 1; i >= 0; i--) {
		    	var resolvedDir =  escapePath(path.join(resolvedPath, dirs[i]));
		    	cbDir(resolvedDir);
		    };
	    }
	    cbComplete();
	}catch(err){
		cbFail(err);
	}
};

function getFiles(srcpath, cbFile, cbComplete, cbFail) {
	try{
		var _srcpath = escapePath(srcpath);
		var files = fs.readdirSync(_srcpath)
	    	.filter(file => fs.statSync(path.join(_srcpath, file)).isFile());
	    for (var i = files.length - 1; i >= 0; i--) {
	    	cbFile(files[i]);
	    };
		cbComplete();
	}catch(err){
		cbFail(err);
	}
};

function enumerateDir(parentDir, filter, callback, cbComplete, cbFail, isRoot){

	var _parentDir = escapePath(parentDir);
	var _resolvedDir = escapePath(path.resolve(_parentDir));
	
	getFiles(_resolvedDir, function(fileName){
		var filePath = escapePath(path.join(_resolvedDir, fileName));
		if (fileName.endsWith(filter)){
			callback(filePath);											
		}
	}, function complete(){
	}, cbFail);

	var _resolvedChildDir = null;
	getDirectories(_resolvedDir, function(childDir){
		_resolvedChildDir = escapePath(childDir);
		enumerateDir(_resolvedChildDir, filter, callback, cbComplete, cbFail, false);
	}, function complete(){
		if (isRoot === undefined){
			cbComplete();
		}
	}, cbFail);
};

function wrapInFactoryRegister(funcName, bodyCode, cbDone){
	var js = 'window.factory.register(function [funcName](input) { \r\n [bodyCode] 	\r\n}, function constructor(obj){\r\n    Object.seal(obj);\r\n},function errorHandle(errMsg){\r\n    throw errMsg;\r\n});\r\n';
	js = js.replace("[funcName]",funcName);
	js = js.replace("[bodyCode]",bodyCode);
	cbDone(js);
};

function saveFile(fileSpec, data, cbComplete, cbFail){
	try{
		var options = { flag : 'w+',encoding: "utf8" };
		fs.writeFileSync(fileSpec, data, options);
		cbComplete();
	}catch(err){
		cbFail(err);
	}
};

function readFile(fileSpec, cbComplete, cbFail){
	try{
		var data = fs.readFileSync(fileSpec, 'utf8');
		cbComplete(data);
	}catch(err){
		cbFail(err);
	}
};

function cache() {
	
	this.Id = generateGUID();
	var cache = this;
	function getKeys(callback){
		for (var obj in cache){
			var key =obj.toString() 
			if (key.startsWith("_") && !key.startsWith("_keys")){
				callback(key);
			}
		}
	};

	this._keys = [];
	this.isClass = true;

	this.set = function(key, instance, callback, canBeDestroyed){
		var newKey = "_"+key;
		if (cache._keys.indexOf(newKey) == -1){
			cache._keys.push(newKey);
		}
		cache[newKey] = {
			instance: instance,
			destroy: canBeDestroyed
		};
		if (callback){
			callback(instance);
		}
	};

	this.get = function(key, cbFound, cbNotFound){
		var newKey = "_"+key;
		var item = cache[newKey];
		if (item && item.instance){
			cbFound(item.instance);
		}else{
			if (cbNotFound){
				cbNotFound();
			}
		}
	};
	
	this.remove = function(key){
		var newKey = "_"+key;
		delete cache[key];
	};
	
	this.reset = function() {
		var keysToKeep = [];
		getKeys(function(key){
			var item = cache[key];
			if (item.instance.destroy && (item.destroy == undefined || item.destroy == true)){
				item.instance.destroy();
			}
			if (item.destroy == undefined || item.destroy == true){
				delete cache[key];
			}else{
				keysToKeep.push(key);
			}
		});
		cache._keys = [];
		cache._keys = cache._keys.concat(keysToKeep);
	};
};

function removeFile(filePath){
	var _filePath = escapePath(filePath);
	fs.unlinkSync(_filePath);
};

function getConfigFromGithub(configName, username, password, cbDone){

	// basic auth
	var gh = new GitHub({
	   username: username,
	   password: password
	});

	var repo = gh.getRepo(username, "designs");
	var path = "lib/config/"+configName+".json";

	repo.getContents('refs/heads/designer', path, true, function(http){
		if (http && http.response && http.response.status == 403){
			throw http.response.data.message;
		}
		if (http && http.response && http.response.status == 404){
			cbDone(null, repo, path);
		}
	}).then(function(content) {
		if (content && content.data){
			var payload = content.data;
			cbDone(payload, repo, path);
		}
	});
};

function sendToGithub(configName, username, password, changedConfigArray, cbDone, isNewFile){
	getConfigFromGithub(configName, username, password, function(payload, repository, repoFilePath){
		var jsonStr = JSON.stringify(changedConfigArray, null, 4);
		repository.writeFile("designer", repoFilePath, jsonStr, "auto commit config by designer",{}).then(function() {
		  cbDone();
		}, function() {
		  // one or more failed
		});
	});
};

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

var fs;
var path;
var libPath;

if (typeof module !== 'undefined' && module.exports) {
	libPath = __dirname + '/../lib/';
	fs = require('fs')
	path = require('path')

	module.exports = {
		titleCase:titleCase,
		getFiles: getFiles,
		readFile: readFile,
		saveFile: saveFile,
		wrapInFactoryRegister: wrapInFactoryRegister,
		getDirectories: getDirectories,
		enumerateDir, enumerateDir,
		removeFile:removeFile,
		enumerate: enumerate,
		getFileName: getFileName
	};
} 
