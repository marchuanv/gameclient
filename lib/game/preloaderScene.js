/*[sceneObjBuilder, sceneSelector, sceneEventManager, sceneManager, phaserGame]*/
/*CLASS*/
this.create = function(){
	sceneObjBuilder.getSprites(function(obj, sceneConfig){
		sceneManager.playAllAnimationsForSceneObj(sceneConfig, ["play"])
	});
	sceneEventManager.subscribeToMouseMove(function(mouse, isMoveLeft, isMoveRight, isMoveUp, isMoveDown){
		sceneObjBuilder.getImages(function(image, config, state){
			if (config.name.indexOf("cursor") >= 0){
				image.x = mouse.x;
				image.y = mouse.y;
			}
		});
	});
	sceneEventManager.subscribeToAnimationComplete(function(){
		sceneSelector.next();
		phaserGame.reset();
	});
};
this.reset = function(){
};
