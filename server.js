var userId=2;
var systemUserId=2;
require('messagebus').create(function(messageBus) {
  messageBus.publish('registerlibrary', systemUserId, "function PhaserGame(phaserGameConfig, sceneManager, sceneSelector, cache){  }");
  messageBus.publish('PhaserGame', userId, { userId: userId, class:"PhaserGame"});
  messageBus.subscribe('PhaserGame', systemUserId, function(data) {
    console.log("PHASER GAME INSTANCE:",data);
  });
});
