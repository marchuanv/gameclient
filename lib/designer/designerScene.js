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

		cache.get("pan", function(){
			if (mouse.isDown){
				if (isMoveLeft){
					linksAndNodes.x-= 5;	
				}
				else if (isMoveRight){
					linksAndNodes.x+= 5;
				}
				if (isMoveUp){
					linksAndNodes.y-= 5;
				}
				else if (isMoveDown){
					linksAndNodes.y+= 5;
				}
			}
		});

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
						isLinkOverlayNode(newConfig.name, function(_stateNode, _stateNodeConfig, _stateNodeLink, _stateNodeLinkConfig){
							_stateNodeLinkConfig.startNode = _stateNodeConfig.name; 
							_stateNodeLink.input.disableDrag();
							cache.set("disconnectedLink", _stateNodeLinkConfig, null, true);
						});
					});
				}
			});
		}
		cache.set("pan",{});
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
			isLinkOverlayNode(_linkConfig.name, function(_stateNode, _stateNodeConfig, _stateNodeLink, _stateNodeLinkConfig){
				_linkConfig.endNode = _stateNodeConfig.name;
			},function(){
				removeCloneConfig(_linkConfig.name);
			});
			phaserGame.reset();

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

	sceneEventManager.subscribeToSceneObjCollision(function(sceneObj, sceneConfig, sceneObj2, sceneConfig2){

		// var linkStartNode;
		// var linkEndNode;
		// var linkStartNodeConfig;
		// var linkEndNodeConfig;
		// var linkConfig;
		// var link;
		// var linkName;
		// var nodeName;

		// if (sceneConfig.name.startsWith("Link")){
		// 	linkName = sceneConfig.name;
		// }
		// if (sceneConfig.name.startsWith("Node")){
		// 	nodeName = sceneConfig.name;
		// }

		// if (sceneConfig2.name.startsWith("Link")){
		// 	linkName = sceneConfig2.name;
		// }
		// if (sceneConfig2.name.startsWith("Node")){
		// 	nodeName = sceneConfig2.name;
		// }

		// getLinkNodes(linkName, function(_linkNode, _linkNodeConfig, _link, _linkConfig, isStartNode){
		// 	if (isStartNode && nodeName == _linkNodeConfig.name){
		// 		linkStartNode = _linkNode;
		// 		linkStartNodeConfig = _linkNodeConfig;
		// 		link = _link;
		// 		linkConfig = _linkConfig;
		// 	}
		// });
		// getLinkNodes(linkName, function(_linkNode, _linkNodeConfig, _link, _linkConfig, isStartNode){
		// 	if (!isStartNode && nodeName == _linkNodeConfig.name){
		// 		linkEndNode = _linkNode;
		// 		linkEndNodeConfig = _linkNodeConfig;
		// 		link = _link;
		// 		linkConfig = _linkConfig;
		// 	}
		// });
	
		// if (link && linkStartNode){
		// 	getLinkNodes(linkName, function(_linkNode, _linkNodeConfig, _link, _linkConfig, isStartNode){
		// 		if (!isStartNode){
		// 			var radius = linkStartNodeConfig.radius+4;
		// 			linkEndNode = _linkNode;
		// 			var angle = phaserGame.physics.arcade.angleBetween(link, linkEndNode);
		// 			link.x = linkStartNode.x + radius * Math.cos(angle);
		// 			link.y = linkStartNode.y + radius * Math.sin(angle);
		// 			linkConfig.xPosition = link.x;
		// 			linkConfig.yPosition = link.y;
		// 		}
		// 	});
		// }

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
				if (config2.nodeName == config.name){
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

function isNodesOverlayNodes(cbOverlay) {
  sceneObjBuilder.getSprites(function(obj2, sceneConfig2) {
    if (sceneConfig2.name.startsWith("Node")) {
      sceneObjBuilder.getSprites(function(obj3, sceneConfig3) {
        if (sceneConfig3.name.startsWith("Node")) {
          if (sceneConfig2.name != sceneConfig3.name) {
            if (obj2.overlap(obj3)) {
              cbOverlay();
            }
          }
        }
      });
    }
  });
};

function isLinkOverlayNode(sceneConfigName, cbOverlay, cbNotOverlay){
	var isOverlay = false;
	sceneObjBuilder.getSprites(function(obj2, sceneConfig2) {
		if (sceneConfig2.name.startsWith("Link") && sceneConfig2.name == sceneConfigName) {
		  sceneObjBuilder.getSprites(function(obj3, sceneConfig3) {
		    if (sceneConfig3.name.startsWith("Node")) {
		      if (obj2.overlap(obj3)) {
		      	isOverlay = true;
		        cbOverlay(obj3, sceneConfig3, obj2, sceneConfig2);
		      }
		    }
		  });
		}
	});
	if (!isOverlay && cbNotOverlay){
		cbNotOverlay();
	}
};

function drawLink(linkName, endX, endY){
	getLinkNodes(linkName, function(_node, _nodeConfig, _link, _linkConfig, isStartLink){
		shapeBuilder.clearShapes(_linkConfig);

		if (isStartLink){

			_link.x = endX;
			_link.y = endY;
			var radius = _nodeConfig.radius;
			var angle = phaserGame.physics.arcade.angleBetween(_node, _link);
			var x = _node.x + radius * Math.cos(angle);
			var y = _node.y + radius * Math.sin(angle);

			shapeBuilder.createShape({
				name: _linkConfig.name,
				color: "black",
				shape: "line",
				xScale: 1,
				yScale: 1,
				start:{
					xPosition: x,
					yPosition: y
				},
				end:{
					xPosition: endX,
					yPosition: endY
				}
			}, null);
		}

	});
};