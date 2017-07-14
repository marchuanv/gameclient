/*[sceneManager, sceneObjBuilder, spriteBuilderConfig, imageBuilderConfig, animationBuilderConfig, sceneSelector, designerdesignerSceneConfig, eventHandler, phaserGame]*/
/*CLASS*/
this.initialise = function(){

	eventHandler.subscribe(function onMouseMove(mouse){
	    sceneManager.getSelectedSceneObj(function(obj, sceneConfig, state){
	    	getLinkNames(function(_linkName){
	    		if (sceneConfig.name == _linkName){
					if (mouse.isDown){
					    obj.rotation = phaserGame.physics.arcade.angleBetween(obj, mouse);
    				}
	    		}
			});
		});
	});
	eventHandler.subscribe(function spriteUp(sprite, sceneConfig, state){
		setTimeout(function(){
			state.isSelected = false;
		},100);
	});
	eventHandler.subscribe(function spriteDragStart(mouse){

	});
	eventHandler.subscribe(function spriteDragStop(mouse){
		sceneManager.getSelectedSceneObj(function(obj, sceneConfig, state){
			if (sceneConfig.name.endsWith("Template")){
				var templateConfigCloneStr = JSON.stringify(sceneConfig);
				var templateConfigClone = JSON.parse(templateConfigCloneStr);
				templateConfigClone.name =generateGUID();
				templateConfigClone.xPosition = mouse.x;
				templateConfigClone.yPosition = mouse.y;
				if (templateConfigClone.start && templateConfigClone.end){
					templateConfigClone.xAnchorPosition = 0;
					templateConfigClone.yAnchorPosition = 0.5;
					templateConfigClone.start.name = templateConfigClone.name;
				}
				if (templateConfigClone.type == "sprite | animation"){
					enumerate(templateConfigClone.animations, this, function (animation){
						var animationName = generateGUID();
						if (animation.name == templateConfigClone.animationStartName){
							templateConfigClone.animationStartName = animationName;
						}
						animation.name = animationName;
					});
					designerdesignerSceneConfig.push(templateConfigClone);
				}
				phaserGame.reset();
			}
		});
	});
	eventHandler.subscribe(function spriteDown(obj, sceneConfig, state){
		state.isSelected = true;
	});
};

this.load = function(){
	sceneManager.loadScene();
};

this.create = function(){
	sceneManager.createScene();
	sceneObjBuilder.getSprites(function(sprite, sceneConfig, state){
		if (sceneConfig.name.endsWith("Template")){
			sprite.input.enableDrag();
		}
	});
};

this.update = function(){
	sceneManager.updateScene();
};

this.reset = function(){

};

function getLinkNames(cbFound){
	enumerate(designerdesignerSceneConfig, this, function (_config){
		if (_config.start && _config.end){
			cbFound(_config.name);
		}
	});
};

function getActiveLinkNodes(linkName, cbFound){
	getConfigObjectByName(linkName, function(_linkConfig){
		if (_linkConfig.enabled && _linkConfig.start && _linkConfig.end){
			getConfigObjectByName(_linkConfig.start.name, function(_stateNodeConfig){
				if (_stateNodeConfig.enabled){
					sceneObjBuilder.getSprites(function(_stateNode, _stateNodeSceneConfig){
						if (_stateNodeSceneConfig.name == _stateNodeConfig.name){ // state nodes
							sceneObjBuilder.getSprites(function(_linkNode, _linkSceneConfig){
								if (_linkSceneConfig.name == linkName){ // state node link
									cbFound(_stateNode, _stateNodeConfig, _linkNode, _linkConfig);
								}
							});
						}
					});
				}
			});
		}
	});
};

function getConfigObjectByName(name, cbFound){
	enumerate(designerdesignerSceneConfig, this, function (_config){
		if (_config.name == name){
			cbFound(_config);
		}
	});
};