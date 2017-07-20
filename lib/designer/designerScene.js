/*[sceneManager, sceneEventManager, sceneObjBuilder, spriteBuilderConfig, imageBuilderConfig, animationBuilderConfig, shapeBuilder, designerSceneConfig, phaserGame, cache]*/
/*CLASS*/

this.create = function(){

	var linksAndNodes;
	factory.phaserGame(function(_instance){
		linksAndNodes = _instance.add.group();
		sceneObjBuilder.getSprites(function(obj, config){
			if (config.name.startsWith("Node") || config.name.startsWith("Link")){
				linksAndNodes.add(obj);
			}
		});
		
	});
	cache.set("pan",{});
	sceneEventManager.subscribeToMouseMove(function(mouse, isMoveLeft, isMoveRight, isMoveUp, isMoveDown){

		// cache.get("pan", function(){
		// 	if (mouse.isDown){
		// 		if (isMoveLeft){
		// 			linksAndNodes.x-= 5;	
		// 		}
		// 		else if (isMoveRight){
		// 			linksAndNodes.x+= 5;
		// 		}
		// 		if (isMoveUp){
		// 			linksAndNodes.y-= 5;
		// 		}
		// 		else if (isMoveDown){
		// 			linksAndNodes.y+= 5;
		// 		}
		// 	}
		// });

		cache.get("disconnectedLink", function(linkConfig){
			drawLink(linkConfig.name, mouse.x, mouse.y);
		});
	});

	sceneEventManager.subscribeToSpriteDragStart(function (mouse, obj, sceneConfig, state){
		factory.phaserGame(function(_instance){
			linksAndNodes = _instance.add.group();
			sceneObjBuilder.getSprites(function(obj, config){
				if (config.name.startsWith("Node") || config.name.startsWith("Link")){
					linksAndNodes.add(obj);
				}
			});
		});
		cache.remove("pan");
	});

	sceneEventManager.subscribeToSpriteDragStop(function (mouse, obj, sceneConfig, state){
		cache.get("disconnectedLink",function(_linkConfig){ //Do nothing
		},function(){
			var xPos = mouse.x; 
			var yPos = mouse.y;
			var _sceneConfig = sceneConfig;
			if (_sceneConfig.name.endsWith("NodeTemplate")){
				_sceneConfig = cloneConfig(xPos, yPos, _sceneConfig);
				phaserGame.reset(function(){
					isNodesOverlayNodes(function(){
						console.log("ERROR: A node already exist at location, removing it.");
						removeCloneConfig(_sceneConfig.name);
						phaserGame.reset();
					});
				});
			} else if (_sceneConfig.name.endsWith("LinkTemplate")){
				enumerate(designerSceneConfig, this, function(_sceneConfig2){
					if (_sceneConfig2.name.endsWith("LinkArrowTemplate")){
						var newConfig = cloneConfig(xPos, yPos, _sceneConfig2);
						phaserGame.reset(function(){
							isLinkOverlapNode(newConfig.name, function(_stateNode, _stateNodeConfig, _stateNodeLink, _stateNodeLinkConfig){
								_stateNodeLinkConfig.startNode = _stateNodeConfig.name; 
								_stateNodeLink.input.disableDrag();
								cache.set("disconnectedLink", _stateNodeLinkConfig, null, true);
							});
						});
					}
				});
			} else if (_sceneConfig.name.startsWith("Node")){
				getNodeLink(_sceneConfig.name, function(_link, _linkConfig){
					drawLink(_linkConfig.name);
				});
			}
			cache.set("pan",{});
		});
	});

	sceneEventManager.subscribeToSpriteDeselected(function(obj, sceneConfig, state){
		var filter = getAnimPlayFiltersFromSceneName(sceneConfig.name);
		sceneManager.playAllAnimationsForSceneObj(sceneConfig, ["Unselected",filter])
	});

	sceneEventManager.subscribeToSpriteSelected(function(mouse, obj, sceneConfig, state){
		var filter = getAnimPlayFiltersFromSceneName(sceneConfig.name);
		sceneManager.playAllAnimationsForSceneObj(sceneConfig, ["Selected",filter]);
		cache.get("disconnectedLink",function(_linkConfig){
			cache.remove("disconnectedLink");
			var linkName = _linkConfig.name;
			isLinkOverlapNode(_linkConfig.name, function(_stateNode, _stateNodeConfig, _stateNodeLink, _stateNodeLinkConfig){
				_linkConfig.endNode = _stateNodeConfig.name;
				_linkConfig.xPosition = _stateNodeLink.x;
				_linkConfig.yPosition = _stateNodeLink.y;
				_linkConfig.rotation = _stateNodeLink.rotation;
			},function(){
				removeCloneConfig(linkName);
			});
			phaserGame.reset(function(){
				drawLink(_linkConfig.name);
			});
		});
	});

	sceneEventManager.subscribeToDeleteKeyPress(function(){
		sceneManager.getSelectedSceneObj(function (obj, config, state) {
			getNodeLink(config.name, function(_link, _linkConfig){
				removeCloneConfig(_linkConfig.name);
			});
			removeCloneConfig(config.name);
			phaserGame.reset();
		});
	});
};


this.reset = function(){

};

function getSceneConfigItemByName(name, cbFound){
	enumerate(designerSceneConfig, this, function (_config){
		if (_config.name == name){
			cbFound(_config);
		}
	});
};

function removeCloneConfig(sceneConfigName){
	enumerate(designerSceneConfig, this, function (_config, cbCondition, cbRemove, cbBreak){
		if (_config.name == sceneConfigName){
			cbRemove();
		}
	});
}

function cloneConfig(x, y, sceneConfig){
	var templateConfigCloneStr = JSON.stringify(sceneConfig);
	var templateConfigClone = JSON.parse(templateConfigCloneStr);

	var sceneType;
	if (sceneConfig.name.endsWith("NodeTemplate")) {
		sceneType = "Node";
	}else if(sceneConfig.name.endsWith("NodeLinkArrowTemplate")) {
		sceneType = "Link";
	}

	templateConfigClone.name = sceneType + generateGUID();
	templateConfigClone.xPosition = x;
	templateConfigClone.yPosition = y;
	templateConfigClone.enabled = true;
	templateConfigClone.visible = true;

	if (templateConfigClone.type == "sprite | animation"){
		enumerate(templateConfigClone.animations, this, function (animation){
			var animationName = animation.name+generateGUID();
			if (animation.name == templateConfigClone.animationStartName){
				templateConfigClone.animationStartName = animationName;
			}
			animation.name = animationName;
		});
		designerSceneConfig.push(templateConfigClone);
	}
	return templateConfigClone;
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

function updateLinkRotation(linkName){
	if (linkName.startsWith("Link")){
		getLinkNodes(linkName, function(_linkNode, _linkNodeConfig, _link, _linkConfig, isStartNode, isDisconnectedLink){
			if (!isDisconnectedLink){
				if (!isStartNode){
					factory.phaserGame(function(_instance){
						var radius = _linkNodeConfig.radius+4;
						var distance = _instance.physics.arcade.distanceBetween(_link, _linkNode);
						_link.width = distance;
						angle = phaserGame.physics.arcade.angleBetween(_link, _linkNode);
						_link.rotation = angle;
						_linkConfig.width = _link.width;
						_linkConfig.rotation = angle;
						_linkConfig.xPosition = _link.x;
						_linkConfig.yPosition = _link.y;
					});
				}
			}
		});
	}
};

function getNodeLink(sceneConfigName, cbFound){
	sceneObjBuilder.getSprites(function(obj, config){
		if (sceneConfigName == config.name && config.name.indexOf("Node") >=0 ){
			sceneObjBuilder.getSprites(function(obj2, config2){
				if (config2.startNode == config.name){
					cbFound(obj2, config2, obj, config, true);
				}else if (config2.endNode == config.name){
					cbFound(obj2, config2, obj, config, true);
				}
			});
		}
	});
};

function getLinkNodes(sceneConfigName, cbFound){
	sceneObjBuilder.getSprites(function(_link, _linkConfig){
		if (sceneConfigName == _linkConfig.name && _linkConfig.name.indexOf("Link") >=0 ){
			sceneObjBuilder.getSprites(function(_node, _nodeConfig){
				var isStartLink = false;
				if (_linkConfig.startNode == _nodeConfig.name){
					isStartLink = true;
					cbFound(_node, _nodeConfig, _link, _linkConfig, isStartLink);
				}
				if (_linkConfig.endNode == _nodeConfig.name) {
					cbFound(_node, _nodeConfig, _link, _linkConfig, isStartLink);
				}
			});
		}
	});
};

function isNodesOverlayNodes(cbOverlap) {
  sceneObjBuilder.getSprites(function(obj2, sceneConfig2) {
    if (sceneConfig2.name.startsWith("Node")) {
      sceneObjBuilder.getSprites(function(obj3, sceneConfig3) {
        if (sceneConfig3.name.startsWith("Node")) {
          if (sceneConfig2.name != sceneConfig3.name) {
            if (obj2.overlap(obj3)) {
              cbOverlap();
            }
          }
        }
      });
    }
  });
};

function isLinkOverlapNode(sceneConfigName, cbOverlap, cbNotOverlap){
	var isOverlap = false;
	sceneObjBuilder.getSprites(function(obj2, sceneConfig2) {
		if (sceneConfig2.name.startsWith("Link") && sceneConfig2.name == sceneConfigName) {
		  sceneObjBuilder.getSprites(function(obj3, sceneConfig3) {
		    if (sceneConfig3.name.startsWith("Node")) {
		      if (obj2.overlap(obj3)) {
		      	isOverlap = true;
		        cbOverlap(obj3, sceneConfig3, obj2, sceneConfig2);
		      }
		    }
		  });
		}
	});
	if (!isOverlap && cbNotOverlap){
		cbNotOverlap();
	}
};

function drawLink(linkName, x, y){


	var startX = 0;
	var startY = 0;
	var angle = 0;
	var endX = 0;
	var endY = 0;
	var startNode;
	var adjustLinkPos;
	var link;

	cache.get("disconnectedLink",function(){
		getLinkNodes(linkName, function(_node, _nodeConfig, _link, _linkConfig, isStartLink){
			link = _link;
			if (isStartLink) {
				shapeBuilder.clearShapes(_linkConfig);
				var radius = _nodeConfig.radius;
				startNode =_node;
				angle =  phaserGame.physics.arcade.angleToPointer(_node);
				startX = _node.x + radius * Math.cos(angle);
				startY = _node.y + radius * Math.sin(angle);
				link.rotation =  angle;
				endX = x;
				endY = y;
			}
		});
	}, function() {
		getLinkNodes(linkName, function(_node, _nodeConfig, _link, _linkConfig, isStartLink){
			link = _link;
			if (isStartLink) {
				startNode =_node;
			} else {
				shapeBuilder.clearShapes(_linkConfig);
				var radius = _nodeConfig.radius;

				angle =  phaserGame.physics.arcade.angleBetween(startNode, _node);
				startX = startNode.x + radius * Math.cos(angle);
				startY = startNode.y + radius * Math.sin(angle);
				link.rotation =  angle;

				angle =  phaserGame.physics.arcade.angleBetween(_node, startNode);
				endX = _node.x + radius * Math.cos(angle);
				endY = _node.y + radius * Math.sin(angle);
			}
		});
	});

	//move link and render line
	link.x = endX;
	link.y = endY;
	shapeBuilder.createShape({
		name: linkName,
		color: "black",
		shape: "line",
		xScale: 1,
		yScale: 1,
		start:{
			xPosition: startX,
			yPosition: startY
		},
		end:{
			xPosition: endX,
			yPosition: endY 
		}
	});
};