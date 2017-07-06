/*[sceneManager, sceneObjBuilder, sceneSelector, eventHandler]*/
/*CLASS*/
var sceneName = "preloaderScene";
this.initialise = function(){
	eventHandler.subscribe(function animationComplete(){
		//sceneSelector.next();
	});
	eventHandler.subscribe(function mouseMove(position){
		sceneObjBuilder.getImages(function(image, config, state){
			if (config.name.indexOf("cursor") >= 0){
				image.x = position.x;
				image.y = position.y;
			}
		});
	});
};

this.load = function(){
	sceneManager.loadScene(sceneName);
};
this.create = function(){
	sceneManager.createScene(sceneName);
};

this.reset = function(){
};
