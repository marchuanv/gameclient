/*[sceneManager, sceneObjBuilder, spriteBuilderConfig, imageBuilderConfig, sceneSelector, designerdesignerSceneConfig, eventHandler, phaserGame]*/
/*CLASS*/
this.initialise = function(){

	eventHandler.subscribe(function onClick(mouse){

	});

	eventHandler.subscribe(function shiftKeyPress(){
		setTimeout(function(){
			console.log("pressing shift");
		    sceneManager.getSelectedSceneObj(function(stateNodeSprite, sceneConfig, state){
		    	stateNodeSprite.input.disableDrag();
		    	enumerate(designerdesignerSceneConfig, this, function (_config){
					if (_config.name=="stateNodeLinkTemplate"){
						var jsonStr = JSON.stringify(_config);
						var newConnector = JSON.parse(jsonStr);
						newConnector.enabled = true;
						newConnector.name = generateGUID();
						designerdesignerSceneConfig.push(newConnector);
						spriteBuilderConfig.push({
							file: "../publish/assets/stateNodeLinkTemplate.png",
							name: newConnector.name
						});
						imageBuilderConfig.push({
							file: "../publish/assets/stateNodeLinkTemplate.png",
							name: newConnector.name
						});
						sceneManager.reset();
						sceneManager.initialise("Designer","designerScene");
						sceneObjBuilder.getSprites(function(_newSpriteConnector, sceneConfig2, state2){
							if (sceneConfig2.Id == newConnector.Id){
								eventHandler.subscribe(function onMouseMove(mouse){
									if (mouse.isDown){
										var targetAngle = (360 / (2 * Math.PI)) *
												game.math.angleBetween(logo.x, logo.y, mouse.x, mouse.y) + 90;
										_newSpriteConnector.pivot.x = sceneConfig.xPosition.x;
										_newSpriteConnector.pivot.y = sceneConfig.xPosition.y;
										_testSprite.angle = targetAngle;
									}else{
										eventHandler.unsubscribe(function onMouseMove(){});
									}
								});
							}
						});
					}
				});
			});
		},100);
	});
	eventHandler.subscribe(function shiftKeyRelease(){
		console.log("releasing shift");
	    sceneManager.getSelectedSceneObj(function(stateNodeSprite, sceneConfig, state){
	    	stateNodeSprite.input.enableDrag();
		});
	});

	eventHandler.subscribe(function onDoubleClick(mouse){
		var isSelectedSceneObj = false;
		sceneManager.getSelectedSceneObj(function(stateNodeSprite, sceneConfig, state){
			if(stateNodeSprite.input.pointerOver(mouse.id)){
				isSelectedSceneObj = true;
			}
		});
		setTimeout(function(){
			if (!isSelectedSceneObj){
				enumerate(designerdesignerSceneConfig, this, function (_config){
					if (_config.name=="stateNodeTemplate"){
						var jsonStr = JSON.stringify(_config);
						var newNode = JSON.parse(jsonStr);
						newNode.enabled = true;
						newNode.name = generateGUID();
						newNode.xPosition = mouse.x;
						newNode.yPosition = mouse.y;
						designerdesignerSceneConfig.push(newNode);
						spriteBuilderConfig.push({
							file: "../publish/assets/stateNodeTemplate.png",
							name: newNode.name
						});
						imageBuilderConfig.push({
							file: "../publish/assets/stateNodeTemplate.png",
							name: newNode.name
						});
						sceneManager.reset();
						sceneManager.initialise("Designer","designerScene");
					}
				});   
			}
		},200);
	});

	eventHandler.subscribe(function onDragStart(mouse){
	});

	eventHandler.subscribe(function onDragStop(mouse){

	});

	eventHandler.subscribe(function shapeDown(stateNodeSprite, sceneConfig, state){
		sceneManager.getSelectedSceneObj(function(stateNodeSprite2, sceneConfig2, state2){
			state2.isSelected = false;
			stateNodeSprite2.input.disableDrag();
		});
		state.isSelected = true;
		stateNodeSprite.input.enableDrag();
	});

	eventHandler.subscribe(function shapeUp(shape, sceneConfig, state){

		//check of lines are valid
		enumerate(designerdesignerSceneConfig, this, function (_config, cbCondition, cbRemove, cbBreak){
		});

		console.log("shape up",sceneConfig);
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