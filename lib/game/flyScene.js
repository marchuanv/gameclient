/*[sceneManager, sceneObjBuilder, sceneSelector, eventHandler]*/
/*CLASS*/
/*SINGLETON*/
var sceneName = "flyScene";
this.initialise = function(){
	eventHandler.subscribe(function animationComplete(animation, sceneObj){
		sceneManager.getFocusedSceneObj(function(obj, _sceneConfig, _state){
			obj.destroy();
		});
	});

	eventHandler.subscribe(function receiveSpriteFocus(sprite, sceneConfig, state){
		console.log("selected scene object Id ",sprite.Id);
		sceneManager.getFocusedSceneObj(function(obj, _sceneConfig, _state){
			_state.isSelected = false;
		});
		state.isSelected = true;
		sceneManager.playAllAnimationsForSceneObj(sceneConfig);
	});

	eventHandler.subscribe(function keyPress(keyData){
		sceneManager.getFocusedSceneObj(function(obj, objConfig){
		});
	});

	eventHandler.subscribe(function mouseMove(position){
		sceneObjBuilder.getImages(function(image, config){
			if (config.name.indexOf("cursor") >= 0){
				image.x = position.x;
				image.y = position.y;
			}
		});
	});

};

this.reset = function(){

};
