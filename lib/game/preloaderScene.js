function PreloaderScene(sceneObjBuilder, sceneSelector, sceneEventManager, sceneManager, phaserGame){
	this.create = function(){
		
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

		sceneObjBuilder.isComplete(function(){
			sceneObjBuilder.getSprites(function(obj, sceneConfig){
				sceneManager.playAnimationsForSceneObj(sceneConfig, ["play"])
			});
		});
	};
	this.reset = function(){
	};
}