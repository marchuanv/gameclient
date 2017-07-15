/*[sceneManager, sceneEventManager, sceneObjBuilder, spriteBuilderConfig, imageBuilderConfig, animationBuilderConfig, shapeBuilder, designerSceneConfig, phaserGame]*/
/*CLASS*/

this.reset = function(){

};

sceneEventManager.spriteDragStart(function (mouse, obj, sceneConfig, state){
	state.isDragged = true;
 	if (sceneConfig.name.startsWith("Node")){
		sceneObjBuilder.getSprites(function(obj2, sceneConfig2, state2){
			if (sceneConfig2.name.startsWith("Link") && sceneConfig2.start.name == sceneConfig.name){
				obj2.visible = false;
			}
		});
	}
});

sceneEventManager.spriteDragStop(function (mouse, obj, sceneConfig, state){
	state.isDragged = false;
	if (sceneConfig.name.endsWith("NodeTemplate")){
		cloneConfig(mouse, sceneConfig);
		phaserGame.reset();
	} else if (sceneConfig.name.endsWith("NodeLinkTemplate")){
		var newConfig = cloneConfig(mouse, sceneConfig);
		cache.set("disconnectedLink", newConfig, null, true);
		phaserGame.reset();
	} else if (sceneConfig.name.startsWith("Link")){
		
		obj.x = mouse.x;
		obj.y = mouse.y;
		sceneConfig.xPosition = mouse.x;
		sceneConfig.yPosition = mouse.y;
	
		sceneObjBuilder.getSprites(function(obj2, sceneConfig2, state2){
			if (obj.overlap(obj2) && sceneConfig2.name.startsWith("Node")){
				cache.get("drawDisconnectedLink",function(drawData){
					drawData.startNode = obj2;
					obj.rotation = phaserGame.physics.arcade.angleBetween(obj, obj2);
					drawData.link.visible = false;
				});
			}
		});

	} else if (sceneConfig.name.startsWith("Node")) {

		obj.x = mouse.x;
		obj.y = mouse.y;
		sceneConfig.xPosition = mouse.x;
		sceneConfig.yPosition = mouse.y;

		sceneObjBuilder.getSprites(function(obj2, sceneConfig2, state2){
			if (sceneConfig2.name.startsWith("Link")){
				obj2.rotation = phaserGame.physics.arcade.angleBetween(obj2, obj);
			}
		});
	}
});

sceneEventManager.spriteDeselected(function(obj, sceneConfig, state){
	var filter = getAnimPlayFiltersFromSceneName(sceneConfig.name);
	sceneManager.playAllAnimationsForSceneObj(sceneConfig, ["Unselected",filter])
});

sceneEventManager.spriteSelected(function(mouse, obj, sceneConfig, state){
	var filter = getAnimPlayFiltersFromSceneName(sceneConfig.name);
	sceneManager.playAllAnimationsForSceneObj(sceneConfig, ["Selected",filter]);
	if (state.isDragged){
		cache.get("drawDisconnectedLink",function(drawData){
			if (drawData.startNode && !drawData.endNode && sceneConfig.name.startsWith("Node")){
				cache.remove("drawDisconnectedLink");
				drawData.config.end.xPosition =  sceneConfig.xPosition;
				drawData.config.end.yPosition =  sceneConfig.yPosition;
				drawData.link.visible = true;
			}
			shapeBuilder.clearShapes(drawData.config);
		});
	}
});

sceneEventManager.sceneCreated(this, function(){
	sceneObjBuilder.getSprites(function(sprite, sceneConfig, state){
		cache.get("disconnectedLink",function(_newLinkConfig){
			if (_newLinkConfig.name == sceneConfig.name){
				sprite.input.enableDrag();	
			}
		});
		if (sceneConfig.name.startsWith("Node") || sceneConfig.name.endsWith("NodeTemplate") || sceneConfig.name.endsWith("NodeLinkTemplate")){
			sprite.input.enableDrag();
		}
	});
});

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

function getAnimPlayFiltersFromSceneName(sceneName){
	if (sceneName.indexOf("initial")>=0){
		return "Initial";
	}else if (sceneName.indexOf("final")>=0){
		return  "Final";
	}else if (sceneName.indexOf("Link")>=0){
		return  "Link";
	}else if (sceneName.indexOf("state")>=0){
		return  "State";
	}else if (sceneName.indexOf("launch")>=0){
		return  "Launch";
	}
};



// cache.get("disconnectedLink",function(_newLinkConfig){
// 		cache.remove("disconnectedLink");
// 		sceneObjBuilder.getSprites(function(obj, sceneConfig, state){
// 			if (_newLinkConfig.name == obj.key){
// 				var startNode;
// 				sceneObjBuilder.getSprites(function(obj2, sceneConfig2){
// 					if (sceneConfig2.name.startsWith("Node") && obj.overlap(obj2)){ //start node of link
// 						startNode = obj2;
// 					}
// 				});
// 				cache.set("drawDisconnectedLink",{
// 					config:_newLinkConfig, 
// 					link: obj,
// 					startNode: startNode
// 				});
// 			}
// 		});
// 	});

// 	cache.get("drawDisconnectedLink",function(drawData){
// 		var linkConfig = drawData.config;
// 		var link = drawData.link;
// 		var startNode = drawData.startNode;
// 		if (startNode){
// 			link.visible = false;
// 			shapeBuilder.clearShapes(linkConfig);
// 			shapeBuilder.createShape({
// 				name: linkConfig.name,
// 				color: "black",
// 				shape: "line",
// 				xScale: 1,
// 				yScale: 1,
// 				start:{
// 					xPosition: startNode.x,
// 					yPosition: startNode.y
// 				},
// 				end:{
// 					xPosition: mouse.x,
// 					yPosition: mouse.y
// 				}
// 			}, null);
// 		}
// 	});