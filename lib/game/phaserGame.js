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
              eventHandler.publish(null,null,null, function gameLoad(){ },game);
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
var requiredSceneName;
var requiredSceneTemplate;

this.start = function(sceneName, sceneTemplate, cbStarted) {
  game = createGame();
  if (requiredSceneName != sceneName || requiredSceneTemplate != sceneTemplate){
    requiredSceneName = sceneName;
    requiredSceneTemplate = sceneTemplate;
  }
  setTimeout(function() {
    game.inputEnabled = true;
    thisInstance.add = game.add;
    thisInstance.load = game.load;
    thisInstance.state = game.state;
    thisInstance.world = game.world;
    thisInstance.stage = game.stage;
    thisInstance.input = game.input;
    thisInstance.physics = game.physics;
    game.stage.backgroundColor =  '#FFFFFF'
    factory["sceneSelector"](function(sceneSelector) {
      if (requiredSceneName && requiredSceneTemplate) {
        sceneSelector.select(requiredSceneName, requiredSceneTemplate);
      } else {
        sceneSelector.next();
      }
    });
    cache.set("isResume", {});
    game.state.restart(true, true);
    if (cbStarted){
      cbStarted();
    }
  }, 1000);
};

this.exit=function(){
  factory["sceneSelector"](function(sceneSelector) {
    sceneSelector.reset();
    eventHandler.reset();
    cache.reset();
    game.destroy();
  });
};

this.reset = function() {
  this.start();
};