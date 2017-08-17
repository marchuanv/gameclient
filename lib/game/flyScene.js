/*[sceneManager, sceneEventManager, sceneObjBuilder, sceneSelector]*/
/*CLASS*/
/*SINGLETON*/
this.create = function(){
	sceneEventManager.subscribeToMouseMove(function(mouse, isMoveLeft, isMoveRight, isMoveUp, isMoveDown){
		sceneObjBuilder.getImages(function(image, config, state){
			if (config.name.indexOf("cursor") >= 0){
				image.x = mouse.x;
				image.y = mouse.y;
			}
		});
	});
	sceneObjBuilder.isComplete(function(){
		sceneObjBuilder.getSprites(function(sprite, config, state){
			sceneManager.playAnimationsForSceneObj(config, [config.name+"Alive"]);
		});
	});
	sceneEventManager.subscribeToSpriteSelected(function(mouse, obj, sceneConfig, state){
		if (sceneConfig.name.indexOf("fly") >= 0){
			sceneManager.playAnimationsForSceneObj(sceneConfig, [sceneConfig.name+"Dead"]);
		}
	});
	sceneEventManager.subscribeToAnimationComplete(function(animation, animConfig){
		sceneObjBuilder.getSprites(function(sprite, config, state){
			enumerate(config.animations, this,function(animConfig2){
				if (animConfig.name == animConfig2.name){
					sprite.kill();
				}
			});
		});
	});
	console.log("Timer Started",new Date());
	sceneEventManager.subscribeToTimers(function(timer, config, state){
		console.log("Timer Expired",new Date());
	});
};

this.reset = function(){

};
