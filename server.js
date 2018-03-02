const applicationId='gamedesigner';
require('messagebus').create(function(messageBus) {
  messageBus.publish('registerlibrary', '', { 
  	Id: applicationId, 
  	javascript: "function PhaserGame(){ this.isStarted=true; this.getStuff=function(){}; }"
  });
  messageBus.subscribe('libraryregistered','',function(){
	messageBus.subscribe('getPhaserGame', applicationId, function(data) {
		data.getStuff();
	});
	messageBus.publish('createPhaserGame', applicationId, {});
  });
});
