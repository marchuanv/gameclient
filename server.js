const applicationId='gamedesigner';
require('messagebus').create(function(messageBus) {
  
  messageBus.subscribe('PhaserGame', applicationId, function(data) {
    console.log("PHASER GAME INSTANCE:",data);
  });
  
  messageBus.publish('PhaserGame', applicationId,{ arguments:[] });
  
  messageBus.publish('registerlibrary', '', { 
  	Id: applicationId, 
  	javascript: "function PhaserGame(){ this.isStarted=true; }"
  });

});