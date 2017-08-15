/*[phaserGameConfig, sceneManager, sceneSelector, cache]*/
/*CLASS*/
/*SINGLETON*/
function createGame(){
  return new Phaser.Game(
      phaserGameConfig.width,
      phaserGameConfig.height,
      Phaser.CANVAS,
      phaserGameConfig.title, {
        preload: function() {

          this.inputEnabled = true;
          this.input.enabled = true;
          thisInstance.add = this.add;
          thisInstance.load = this.load;
          thisInstance.state = this.state;
          thisInstance.world = this.world;
          thisInstance.stage = this.stage;
          thisInstance.input = this.input;
          thisInstance.debug = this.debug;
          thisInstance.camera = this.camera;
          thisInstance.physics = this.physics;
          thisInstance.context = this.context;
          thisInstance.math = this.math;
          //game.world.setBounds(0, 2000,  4000,  4000);
          this.physics.startSystem(Phaser.Physics.ARCADE);
         
          cache.get("start",function(){
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
         cache.get("start",function(){
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
    cache.set("start", {});
    game.state.restart(true, true);
    if (cbStarted){
      cbStarted();
    }
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
    cache.set("start", {});
    game.state.restart(true, true);
    if (cbStarted){
      cbStarted();
    }
};