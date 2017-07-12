/*[sceneManager, shapeBuilder, sceneSelector, designerdesignerSceneConfig, eventHandler, phaserGame]*/
/*CLASS*/
this.initialise = function(){


	eventHandler.subscribe(function animationComplete(animation, sceneConfig){
		if (sceneConfig.name.indexOf("submit") >= 0){
			//sceneSelector.next();
		}
	});

	eventHandler.subscribe(function onDoubleClick(mouse){
			console.log	("onDoubleClick");
			isMoving = true;
			enumerate(designerdesignerSceneConfig, this, function (_config, cbCondition, cbRemove, cbBreak){
				if (_config.name=="stateNodeLinkTemplate"){
					var jsonStr = JSON.stringify(_config.stateNode1);
					var newNode = JSON.parse(jsonStr);
					newNode.enabled = true;
					newNode.name = "newStateNode";
					newNode.xPosition = mouse.x;
					newNode.yPosition = mouse.y;
					shapeBuilder.createShape(_config,function(){

					});
					cbBreak();
				}
			},function complete(){
			});   
	});

	eventHandler.subscribe(function onDrag(mouse){
		console.log	("dragging");
	});

	eventHandler.subscribe(function shapeUp(shape, sceneConfig, state){
		state.isSelected = true;
	});

	eventHandler.subscribe(function keyPress(keyData){
		sceneManager.getSelectedSceneObj(function(shape, sceneConfig, state){
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

this.update = function(){
	sceneManager.updateScene();
};

this.reset = function(){

};