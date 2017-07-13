/*[phaserGameConfig, eventHandler, cache]*/
/*CLASS*/
function createGame(){
  return new Phaser.Game(
      phaserGameConfig.width,
      phaserGameConfig.height,
      Phaser.CANVAS,
      phaserGameConfig.title, {
        preload: function() {
          cache.get("isResume",function(){  
              factory["sceneSelector"](function(sceneSelector) {
                cache.get("requiredScene",function(_requiredScene){
                  sceneSelector.select(_requiredScene.name, _requiredScene.template);
                  eventHandler.publish(null,null,null, function gameLoad(){ },game);
                },function(){
                  sceneSelector.next();
                  eventHandler.publish(null,null,null, function gameLoad(){ },game);
                });
              });
          });
        },
        create: function() {
          cache.get("isResume",function(){
              eventHandler.publish(null,null,null, function gameCreate(){ }, game);
          });
        }
      }
  );
};

var game;
var thisInstance = this;

this.start = function(sceneName, sceneTemplate, cbStarted) {
  game = createGame();
  if (sceneName && sceneTemplate){
    cache.set("requiredScene", { name: sceneName, template: sceneTemplate });
  }
  setTimeout(function() {
    game.inputEnabled = true;
    game.input.enabled = true;
    game.stage.backgroundColor =  '#FFFFFF'
    thisInstance.add = game.add;
    thisInstance.load = game.load;
    thisInstance.state = game.state;
    thisInstance.world = game.world;
    thisInstance.stage = game.stage;
    thisInstance.input = game.input;
    thisInstance.physics = game.physics;
    thisInstance.context = game.context;
    cache.set("isResume", {});
    game.state.restart(true, true);
    setTimeout(function(){
      if (cbStarted){
        cbStarted();
      }
    },1000);
  }, 1000);
};

this.exit=function(){
  factory["sceneSelector"](function(sceneSelector) {
    sceneSelector.reset();
    eventHandler.reset();
    cache.reset();
    game.destroy();
    game = null
  });
};

this.reset = function() {
  factory["sceneSelector"](function(sceneSelector) {
      cache.get("requiredScene",function(_requiredScene){
        sceneSelector.reset();
        eventHandler.reset();
        cache.reset();
        cache.set("requiredScene", _requiredScene);
        cache.set("isResume", {});
        game.state.restart(true, true);
      });
  });
};