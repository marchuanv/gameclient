const applicationId='gamedesigner';
require('messagebus').create(function(messageBus) {
  messageBus.subscribe('PhaserGame', applicationId, function(data) {
    console.log("PHASER GAME INSTANCE:",data);
  },function done(){
	  messageBus.publish('registerlibrary', '', { 
	  	Id: applicationId, 
	  	javascript: "function PhaserGame(){ this.isStarted=true; }"
	  },function done(){
  			messageBus.publish('PhaserGame', applicationId,{ arguments:[] });
	  });
  });
});