/*[sceneManager, sceneObjBuilder, spriteBuilderConfig, imageBuilderConfig, sceneSelector, designerdesignerSceneConfig, eventHandler, phaserGame]*/
/*CLASS*/
this.initialise = function(){

	eventHandler.subscribe(function onClick(mouse){
	    sceneManager.getSelectedSceneObj(function(obj, sceneConfig, state){
    		obj.input.disableDrag();
			if (mouse.isDown && sceneConfig.start){
				var targetAngle = (360 / (2 * Math.PI)) *
						game.math.angleBetween(obj.x, obj.y, mouse.x, mouse.y) + 90;
				obj.pivot.x = sceneConfig.xPosition.x;
				obj.pivot.y = sceneConfig.xPosition.y;
				obj.angle = targetAngle;
			}
		});
	});

	eventHandler.subscribe(function onDoubleClick(mouse){
		var isSelectedSceneObj = false;
		sceneManager.getSelectedSceneObj(function(stateNodeSprite, sceneConfig, state){
			if(stateNodeSprite.input.pointerOver(mouse.id)){
				isSelectedSceneObj = true;
			}
		});
		if (!isSelectedSceneObj){
			var newNodeName = generateGUID();
			enumerate(designerdesignerSceneConfig, this, function (_config){
				if (_config.name=="stateNodeTemplate"){
					var jsonStr = JSON.stringify(_config);
					var newNode = JSON.parse(jsonStr);
					newNode.enabled = true;
					newNode.name = newNodeName;
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
				}
			},function(){
				var newNodeLinkName = generateGUID();
				enumerate(designerdesignerSceneConfig, this, function (_config){
					if(_config.name=="stateNodeLinkTemplate"){
						var jsonStr = JSON.stringify(_config);
						var newConnector = JSON.parse(jsonStr);
						newConnector.enabled = true;
						newConnector.name = newNodeLinkName;
						newConnector.xPosition = mouse.x;
						newConnector.yPosition = mouse.y;
						newConnector.start.name = newNodeName;
						designerdesignerSceneConfig.push(newConnector);
						spriteBuilderConfig.push({
							file: "../publish/assets/stateNodeLinkTemplate.png",
							name: newConnector.name
						});
						imageBuilderConfig.push({
							file: "../publish/assets/stateNodeLinkTemplate.png",
							name: newConnector.name
						});
					}
				},function(){
					phaserGame.reset();
				});
			});   
		}
	});

	eventHandler.subscribe(function onDragStart(mouse){
	});

	eventHandler.subscribe(function onDragStop(mouse){

	});

	eventHandler.subscribe(function shapeDown(obj, sceneConfig, state){
		sceneManager.getSelectedSceneObj(function(obj2, sceneConfig2, state2){
			state2.isSelected = false;
			obj2.input.disableDrag();
		});
		state.isSelected = true;
		obj.input.enableDrag();
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