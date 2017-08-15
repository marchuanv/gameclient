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
	sceneObjBuilder.getSprites(function(sprite, config, state){
		sceneManager.playAnimationsForSceneObj(config, [config.name+"Play"]);
	});
};

this.reset = function(){

};
