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

      if (!this.game){
        this.game =  new thisInstance.Phaser.Game(
            this.phaserGameConfig.width,
            this.phaserGameConfig.height,
            thisInstance.Phaser.CANVAS,
            this.phaserGameConfig.title, {
              preload: function() {
                
                this.game.inputEnabled = true;
                this.game.input.enabled = true;

                this.thisInstance.add = this.game.add;
                this.thisInstance.load = this.game.load;
                this.thisInstance.time = this.game.time;
                this.thisInstance.state = this.game.state;
                this.thisInstance.world = this.game.world;
                this.thisInstance.stage = this.game.stage;
                this.thisInstance.input = this.game.input;
                this.thisInstance.debug = this.game.debug;
                this.thisInstance.camera = this.game.camera;
                this.thisInstance.physics = this.game.physics;
                this.thisInstance.context = this.game.context;
                this.thisInstance.math = this.game.math;
                
                //game.world.setBounds(0, 2000,  4000,  4000);
                this.game.physics.startSystem( thisInstance.Phaser.Physics.ARCADE);
               
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
      
        game.stage.backgroundColor =  '#f6f6f6';
        game.scale.fullScreenScaleMode  =  thisInstance.Phaser.ScaleManager.SHOW_ALL ;
        game.scale.sourceAspectRatio = 16;
        if (isFullScreen){
          game.scale.startFullScreen();
        }else{
          game.scale.fullScreenScaleMode  =  thisInstance.Phaser.ScaleManager.EXACT_FIT;
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
        this.sceneSelector.reset();
        cache.reset();
        game.destroy();
        game = null
    };

    this.reset = function(cbStarted) {
        this.sceneSelector.reset();
        cache.reset();
        cache.set("start", {});
        game.state.restart(true, true);
        if (cbStarted){
          cbStarted();
        }
    };
}
module.exports=PhaserGame;