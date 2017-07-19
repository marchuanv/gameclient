/*[phaserGameConfig, sceneManager, sceneSelector, cache]*/
/*CLASS*/
function createGame(){
  return new Phaser.Game(
      phaserGameConfig.width,
      phaserGameConfig.height,
      Phaser.CANVAS,
      phaserGameConfig.title, {
        preload: function() {
          cache.get("isResume",function(){
              sceneSelector.getSelectedScene(function(_scene){
                sceneManager.initialise(_scene.name);
                factory.sceneEventManager(function(_instance){
                  _instance.initialise();
                });
                sceneManager.loadScene();
              });
          });
        },
        create: function() {
         cache.get("isResume",function(){
              sceneSelector.getSelectedScene(function(_scene){
                sceneManager.createScene(_scene.name);
              });
          });
        },
        update: function(){
          factory.sceneEventManager(function(_instance){
            _instance.update();
          });
        }
      }
  );
};

var game;
var thisInstance = this;

this.start = function(sceneName, cbStarted, isFullScreen) {
  game = createGame();
  sceneSelector.getSelectedScene(function found(){
  },function notFound(){
    if (sceneName){
      sceneSelector.select(sceneName);
    }else{
      console.log("WARNING: ", "Could not select a scene");
    }
  });
  setTimeout(function() {
    game.inputEnabled = true;
    game.input.enabled = true;
    
    game.stage.backgroundColor =  '#f6f6f6';
    game.scale.fullScreenScaleMode  = Phaser.ScaleManager.SHOW_ALL ;
    game.scale.sourceAspectRatio = 16;
    if (isFullScreen){
      game.scale.startFullScreen();
    }else{
      game.scale.fullScreenScaleMode  = Phaser.ScaleManager.EXACT_FIT;
    }
    game.scale.setShowAll();
    game.scale.refresh();
    thisInstance.add = game.add;
    thisInstance.load = game.load;
    thisInstance.state = game.state;
    thisInstance.world = game.world;
    thisInstance.stage = game.stage;
    thisInstance.input = game.input;
    thisInstance.debug = game.debug;
    thisInstance.camera = game.camera;
    thisInstance.physics = game.physics;
    thisInstance.context = game.context;
    thisInstance.math = game.math;
    cache.set("isResume", {});
    game.state.restart(true, true);
    setTimeout(function(){
      //game.world.setBounds(0, 2000,  4000,  4000);
      thisInstance.physics.startSystem(Phaser.Physics.ARCADE);
      if (cbStarted){
        cbStarted();
      }
    },1000);
  }, 1000);
};

this.exit=function(){
    sceneSelector.reset();
    cache.reset();
    game.destroy();
    game = null
};

this.reset = function(cbStarted) {
    sceneSelector.reset();
    cache.reset();
    cache.set("isResume", {});
    game.state.restart(true, true);
    setTimeout(function(){
       thisInstance.physics.startSystem(Phaser.Physics.ARCADE);
      if (cbStarted){
        cbStarted();
      }
    },1000);
};