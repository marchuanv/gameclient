const applicationId='gamedesigner';
require('messagebus').create(function(messageBus) {

  messageBus.publish('registerlibrary', '', { 
  	Id: applicationId, 
  	javascript: "function PhaserGame(){ this.isStarted=true; this.getStuff=function(){} }"
  });
  messageBus.subscribe('libraryregistered','',function(){
  	messageBus.subscribe('PhaserGame', applicationId, function(data) {
		console.log("PHASER GAME INSTANCE:",data);
	});
	messageBus.publish('PhaserGame', applicationId,{ arguments:[] },function done(){
	});
  });
});