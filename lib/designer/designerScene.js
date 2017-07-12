/*[sceneManager, sceneObjBuilder, sceneSelector, eventHandler, phaserGame]*/
/*CLASS*/
this.initialise = function(){


	eventHandler.subscribe(function animationComplete(animation, sceneConfig){
		if (sceneConfig.name.indexOf("submit") >= 0){
			//sceneSelector.next();
		}
	});

	eventHandler.subscribe(function shapeUp(shape, sceneConfig, state){
		state.isSelected = true;
	});

	eventHandler.subscribe(function keyPress(keyData){
		sceneManager.getSelectedSceneObj(function(shape, sceneConfig, state){
			console.log("keyData.keyCode",keyData.keyCode);
	        switch(keyData.keyCode) {
	            case 16:
	                break;
	        };
		});
	});
};

this.load = function(){
	sceneManager.loadScene();
};

this.create = function(){
	sceneManager.createScene();
};

this.reset = function(){

};