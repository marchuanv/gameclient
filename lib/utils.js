

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

var fs;
var path;

if (typeof module !== 'undefined' && module.exports) {
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
