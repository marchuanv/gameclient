/*[sceneManager, sceneObjBuilder, spriteBuilderConfig, imageBuilderConfig, animationBuilderConfig, sceneSelector, designerdesignerSceneConfig, eventHandler, phaserGame]*/
/*CLASS*/
this.initialise = function(){

	eventHandler.subscribe(function onMouseMove(mouse){
	    sceneManager.getSelectedSceneObj(function(obj, sceneConfig, state){

	    	sceneObjBuilder.getSprites(function(obj2, sceneConfig2, state2){
				if (sceneConfig.name.endsWith("NodeLinkTemplate") && sceneConfig2.name.startsWith("Node") && obj.overlap(obj2)) {

					// does the node alreay have a starting link?
					var hasStartingLink = false;
					sceneObjBuilder.getSprites(function(obj3, sceneConfig3, state3){
						if (sceneConfig3.name.startsWith("Link") && sceneConfig3.start.name == sceneConfig2.name){
							hasStartingLink = true;
						}
					});
					if (!hasStartingLink){
						var linkConfig = cloneConfig(obj2, sceneConfig);
						connectToStartNode(linkConfig, sceneConfig2);
						phaserGame.reset();
					}else{
						console.log("node " + sceneConfig2.name + " already has a starting link.");
					}
				}
	    	});

	    	sceneObjBuilder.getSprites(function(obj2, sceneConfig2, state2){
				if (sceneConfig.name.startsWith("Link") && sceneConfig2.name.startsWith("Node") && obj.overlap(obj2)) {
					connectToEndNode(sceneConfig, sceneConfig2);
					phaserGame.reset();
				}
	    	});

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
			sceneManager.playAllAnimationsForSceneObj(sceneConfig, "Unselected");
		},100);
	});

	eventHandler.subscribe(function spriteDragStart(mouse){
		sceneManager.getSelectedSceneObj(function(obj, sceneConfig, state){
		 	if (sceneConfig.name.startsWith("Node")){
				sceneObjBuilder.getSprites(function(obj2, sceneConfig2, state2){
					if (sceneConfig2.name.startsWith("Link") && sceneConfig2.start.name == sceneConfig.name){
						obj2.visible = false;
					}
				});
			}
		});
	});

	eventHandler.subscribe(function spriteDragStop(mouse){
		sceneManager.getSelectedSceneObj(function(obj, sceneConfig, state){
			if (sceneConfig.name.endsWith("NodeTemplate")){
				cloneConfig(mouse, sceneConfig);
				phaserGame.reset();
			} else if (sceneConfig.name.endsWith("NodeLinkTemplate")){
				phaserGame.reset();
			} else if (sceneConfig.name.startsWith("Node")){
				sceneObjBuilder.getSprites(function(obj2, sceneConfig2, state2){
					if (sceneConfig2.name.startsWith("Link") && sceneConfig2.start.name == sceneConfig.name){
						sceneConfig2.start.xPosition = mouse.x;
						sceneConfig2.start.yPosition = mouse.y;
						obj2.x = mouse.x;
						obj2.y = mouse.y;
						obj2.visible = true;
					}
				});
			}
		});
	});
	eventHandler.subscribe(function spriteDown(obj, sceneConfig, state){
		state.isSelected = true;
		sceneManager.playAllAnimationsForSceneObj(sceneConfig, "Selected");
	});
};

this.load = function(){
	sceneManager.loadScene();
};

this.create = function(){
	sceneManager.createScene();
	sceneObjBuilder.getSprites(function(sprite, sceneConfig, state){
		if (sceneConfig.name.startsWith("Node") || sceneConfig.name.endsWith("NodeTemplate") || sceneConfig.name.endsWith("NodeLinkTemplate")){
			sprite.input.enableDrag();
		}
	});
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


function cloneConfig(obj, sceneConfig){
	var templateConfigCloneStr = JSON.stringify(sceneConfig);
	var templateConfigClone = JSON.parse(templateConfigCloneStr);

	var sceneType;
	if (sceneConfig.name.endsWith("NodeTemplate")) {
		sceneType = "Node";
	}else if(sceneConfig.name.endsWith("NodeLinkTemplate")) {
		sceneType = "Link";
	}

	templateConfigClone.name = sceneType + generateGUID();
	templateConfigClone.xPosition = obj.x;
	templateConfigClone.yPosition = obj.y;
	if (templateConfigClone.start && templateConfigClone.end){
		templateConfigClone.xAnchorPosition = 0;
		templateConfigClone.yAnchorPosition = 0.5;
		templateConfigClone.start.name = templateConfigClone.name;
	}
	if (templateConfigClone.type == "sprite | animation"){
		enumerate(templateConfigClone.animations, this, function (animation){
			var animationName = animation.name+generateGUID();
			if (animation.name == templateConfigClone.animationStartName){
				templateConfigClone.animationStartName = animationName;
			}
			animation.name = animationName;
		});
		designerdesignerSceneConfig.push(templateConfigClone);
	}
	return templateConfigClone;
};


function connectToStartNode(linkConfig, startNode){
	linkConfig.start.name = startNode.name;
	linkConfig.start.xPosition = startNode.xPosition;
	linkConfig.start.yPosition = startNode.yPosition;
};

function connectToEndNode(linkConfig, endNode){
	linkConfig.start.name = endNode.name;
	linkConfig.start.xPosition = endNode.xPosition;
	linkConfig.start.yPosition = endNode.yPosition;
};