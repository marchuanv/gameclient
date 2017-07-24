/*[sceneManager, sceneEventManager, sceneObjBuilder, spriteBuilderConfig, imageBuilderConfig, animationBuilderConfig, shapeBuilder, designerSceneConfig, phaserGame, cache]*/
/*CLASS*/

this.create = function(){

	var linksAndNodes;
	factory.phaserGame(function(_instance){
		linksAndNodes = _instance.add.group();
		sceneObjBuilder.getSprites(function(obj, config){
			if (config.name.startsWith("Node")){
				linksAndNodes.add(obj);
			}else if(config.name.startsWith("Link")) {
				linksAndNodes.add(obj);
				drawLink(config.name, phaserGame.input.mousePointer);
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
			drawLink(linkConfig.name, mouse);
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
				_sceneConfig.xPosition = mouse.x;
				_sceneConfig.yPosition = mouse.y;
				phaserGame.reset();
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
			isMouseOverlap(mouse, function(_node, _nodeConfig){
				_linkConfig.endNode = _nodeConfig.name;
				drawLink(_linkConfig.name, mouse);
			},function(){
				removeCloneConfig(linkName);
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

function isMouseOverlap(mousePointer, cbIsOver, cbNotOver){
	var isOverlap = false;
	sceneObjBuilder.getSprites(function(obj, sceneConfig) {
		if (sceneConfig.shape == "circle"){
			var area = new Phaser.Circle(obj.x, obj.y, sceneConfig.radius*2);
			if (area.contains(mousePointer.x, mousePointer.y)) {
				cbIsOver(obj, sceneConfig);
				isOverlap = true;
			}
		}
	});
	if (!isOverlap && cbNotOver){
		cbNotOver();
	}
};

function setConfigPositions(x, y, angle, link, linkConfig){
	link.x = x;
	link.y = y;
	link.rotation =  angle;
	linkConfig.xPosition = x;
	linkConfig.yPosition = y;
	linkConfig.rotation = angle;
};

function draw(startX, startY, endX, endY, angle, link, linkConfig){
	shapeBuilder.clearShapes(linkConfig);
	link.visible = true;
	shapeBuilder.createShape({
		name: linkConfig.name,
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

function drawLink(linkName, mouse){

	var startX = 0;
	var startY = 0;
	var angle = 0;
	var endX = 0;
	var endY = 0;
	var startNode;
	var startNodeConfig
	var startNodeRadius;
	var endNode;
	var endNodeConfig;
	var endNodeRadius;
	var adjustLinkPos;
	var link;
	var linkConfig;
	var atLeastOneConnection = false;

	//four attach points on rectangle
	var top = {x:0,y:0};
	var left = {x:0,y:0};
	var right = {x:0,y:0};
	var bottom = {x:0,y:0};

	getLinkNodes(linkName, function(_node, _nodeConfig, _link, _linkConfig, isStartLink){
		link = _link;
		linkConfig = _linkConfig;
		atLeastOneConnection = true;
		if (isStartLink) {
			startNodeRadius = _nodeConfig.radius;
			startNodeConfig = _nodeConfig;
			startNode = _node;
		}else{
			endNodeRadius = _nodeConfig.radius;
			endNodeConfig = _nodeConfig;
			endNode = _node;
		}
	});

	var isMouseOver = false;
	isMouseOverlap(mouse, function(_endNode, _endNodeConfig){ // snap in
		isMouseOver = true;
		endNodeRadius = _endNodeConfig.radius;
		endNodeConfig = _endNodeConfig;
		endNode = _endNode;
	});

	if (atLeastOneConnection){
		if (startNodeConfig.shape == "circle"){
			
			if (endNodeConfig && linkConfig.endNode == endNodeConfig.name){
				var startAngle =  phaserGame.physics.arcade.angleBetween(startNode, endNode);
				startX = startNode.x + startNodeRadius * Math.cos(startAngle);
				startY = startNode.y + startNodeRadius * Math.sin(startAngle);
				var endAngle =  phaserGame.physics.arcade.angleBetween(startNode, endNode);
				endX = endNode.x + endNodeConfig.radius * Math.cos(endAngle);
				endY = endNode.y + endNodeConfig.radius * Math.cos(endAngle);
				setConfigPositions(endX, endY, angle, link, linkConfig);
				draw(startX, startY, endX, endY, angle, link, linkConfig);
			} else if (!isMouseOver) {
				angle =  phaserGame.physics.arcade.angleToPointer(startNode);
				startX = startNode.x + startNodeRadius * Math.cos(angle);
				startY = startNode.y + startNodeRadius * Math.sin(angle);
				endX = mouse.x;
				endY = mouse.y;
				setConfigPositions(endX, endY, angle, link, linkConfig);
				draw(startX, startY, endX, endY, angle, link, linkConfig);
			}


		} else if (startNodeConfig.shape == "rectangle"){

			right.x = startNode.x + (startNode.width/2);
			right.y = startNode.y;
			
			left.x = startNode.x - (startNode.width/2);
			left.y =  startNode.y;

			top.x = startNode.x;
			top.y =	startNode.y - (startNode.height/2);
			
			bottom.x = startNode.x;
			bottom.y = startNode.y + (startNode.height/2);

			if (mouse.x >= right.x){
				startX = right.x;
				startY = right.y;
			}
			if (mouse.x <= left.x){
				startX = left.x;
				startY = left.y;
			}
			
			if (mouse.y <= top.y){
				startX = top.x;
				startY = top.y;
			} 
			if (mouse.y >= bottom.y){
				startX = bottom.x;
				startY = bottom.y;
			}

			isMouseOverlap(mouse, function(){ //snap in
				if (snapIn){
					right.x = endNode.x + (endNode.width/2);
					right.y = endNode.y;
					left.x = endNode.x - (endNode.width/2);
					left.y =  endNode.y;
					top.x = endNode.x;
					top.y =	endNode.y - (endNode.height/2);
					bottom.x = endNode.x;
					bottom.y = endNode.y + (endNode.height/2);

					if (link.x >= right.x){
						endX = right.x;
						endY = right.y;
					}
					if (link.x <= left.x){
						endX = left.x;
						endY = left.y;
					}

					if (link.y <= top.y){
						endX = top.x;
						endY = top.y;
					} 
					if (link.y >= bottom.y){
						endX = bottom.x;
						endY = bottom.y;
					}
				}
			});

			draw(startX, startY, endX, endY, angle, link, linkConfig);
		}
	}
};