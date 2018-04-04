function PhaserGame(phaserGameConfig, sceneManager, sceneSelector, cache, Phaser){

    this.phaserGameConfig=phaserGameConfig;
    this.sceneManager=sceneManager;
    this.sceneSelector=sceneSelector;
    this.cache=cache;
    this.Phaser=Phaser;

    var thisInstance;
    this.initialise=function () {
      thisInstance=this;
      thisInstance.game=null;
    }

    this.start = function(sceneName, cbStarted, isFullScreen) {

      if (!thisInstance.game){
        thisInstance.game =  new thisInstance.Phaser.Game(
            this.phaserGameConfig.width,
            this.phaserGameConfig.height,
            thisInstance.Phaser.CANVAS,
            this.phaserGameConfig.title, {
              preload: function() {
                
                thisInstance.game.inputEnabled = true;
                thisInstance.game.input.enabled = true;

                this.thisInstance.add = thisInstance.game.add;
                this.thisInstance.load = thisInstance.game.load;
                this.thisInstance.time = thisInstance.game.time;
                this.thisInstance.state = thisInstance.game.state;
                this.thisInstance.world = thisInstance.game.world;
                this.thisInstance.stage = thisInstance.game.stage;
                this.thisInstance.input = thisInstance.game.input;
                this.thisInstance.debug = thisInstance.game.debug;
                this.thisInstance.camera = thisInstance.game.camera;
                this.thisInstance.physics = thisInstance.game.physics;
                this.thisInstance.context = thisInstance.game.context;
                this.thisInstance.math = thisInstance.game.math;
                
                //game.world.setBounds(0, 2000,  4000,  4000);
                thisInstance.game.physics.startSystem( thisInstance.Phaser.Physics.ARCADE);
               
                cache.get("start",function(){
                    this.sceneSelector.getSelectedScene(function(_scene){
                      this.sceneManager.initialise(_scene.name);
                      factory.sceneEventManager(function(_instance){
                        _instance.initialise();
                      });
                      this.sceneManager.loadScene();
                    });
                });
              },
              create: function() {
               cache.get("start",function(){
                    this.sceneSelector.getSelectedScene(function(_scene){
                      this.sceneManager.createScene(_scene.name);
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
      }
      
      this.sceneSelector.getSelectedScene(function found(){
      },function notFound(){
        if (sceneName){
          this.sceneSelector.select(sceneName);
        }else{
          console.log("WARNING: ", "Could not select a scene");
        }
      });

      setTimeout(function() {
      
        thisInstance.game.stage.backgroundColor =  '#f6f6f6';
        thisInstance.game.scale.fullScreenScaleMode  =  thisInstance.Phaser.ScaleManager.SHOW_ALL ;
        thisInstance.game.scale.sourceAspectRatio = 16;
        if (isFullScreen){
          thisInstance.game.scale.startFullScreen();
        }else{
          thisInstance.game.scale.fullScreenScaleMode  =  thisInstance.Phaser.ScaleManager.EXACT_FIT;
        }
        thisInstance.game.scale.setShowAll();
        thisInstance.game.scale.refresh();
        cache.set("start", {});
        thisInstance.game.state.restart(true, true);
        if (cbStarted){
          cbStarted();
        }
      }, 1000);
      
    };

    this.exit=function(){
        this.sceneSelector.reset();
        cache.reset();
        thisInstance.game.destroy();
        thisInstance.game = null
    };

    this.reset = function(cbStarted) {
        this.sceneSelector.reset();
        cache.reset();
        cache.set("start", {});
        thisInstance.game.state.restart(true, true);
        if (cbStarted){
          cbStarted();
        }
    };
}
module.exports=PhaserGame;