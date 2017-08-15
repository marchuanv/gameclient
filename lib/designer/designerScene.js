/*[sceneManager, sceneEventManager, sceneObjBuilder, spriteBuilderConfig, imageBuilderConfig, animationBuilderConfig, shapeBuilder, designerSceneConfig, phaserGame, cache, sceneSelector]*/
/*CLASS*/
/*SINGLETON*/
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
			if (config.name == "contextLoader"){
				obj.visible = false;
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
					isNodeOverlapNodes(function(){
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

	sceneEventManager.subscribeToAnimationComplete(function(){
		sceneObjBuilder.getSprites(function(obj, config, state){
			if (config.name == "contextLoader"){
				if (!state.isBusy){
					state.isBusy = true;
					setTimeout(function(){
						obj.visible = false;
						state.isBusy = false;
					},1500);
				}
			}
		});
	});

	sceneEventManager.subscribeToSpriteDeselected(function(obj, sceneConfig, state){
		var filter = getAnimPlayFiltersFromSceneName(sceneConfig.name);
		sceneManager.playAnimationsForSceneObj(sceneConfig, ["Unselected",filter])
	});

	sceneEventManager.subscribeToSpriteSelected(function(mouse, obj, sceneConfig, state){

		var filter = getAnimPlayFiltersFromSceneName(sceneConfig.name);
		sceneManager.playAnimationsForSceneObj(sceneConfig, ["Selected",filter]);
		if (sceneConfig.name.startsWith("Node")){
			sceneObjBuilder.getSprites(function(obj2, config2, state2){
				if (config2.name == "contextLoader" && !state.isDragged){
					phaserGame.world.bringToTop(obj2);
					setTimeout(function(){
						obj.input.disableDrag();
						obj2.input.disableDrag();
						obj2.visible = true;
						obj2.x = obj.x;
						obj2.y = obj.y;
						sceneManager.playAnimationsForSceneObj(config2, ["load"]);
					},600);
				}else {
					obj.input.enableDrag();
				}
			});
		}

		if (sceneConfig.name.startsWith("launchGame")){
			sceneSelector.next();
			phaserGame.reset();
		}

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

function isNodeOverlapNodes(cbOverlap) {
	sceneObjBuilder.getSprites(function(obj2, sceneConfig2) {
		if (sceneConfig2.name.startsWith("Node") || sceneConfig2.name.endsWith("NodeTemplate")) {
			sceneObjBuilder.getSprites(function(obj3, sceneConfig3) {
				if (sceneConfig3.name.startsWith("Node") || sceneConfig3.name.endsWith("NodeTemplate")) {
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
		if (!isOverlap){
			if (sceneConfig.shape == "circle"){
				var area = new Phaser.Circle(obj.x, obj.y, sceneConfig.radius*2);
				if (area.contains(mousePointer.x, mousePointer.y)) {
					cbIsOver(obj, sceneConfig);
					isOverlap = true;
				}
			}
			if (sceneConfig.shape == "rectangle"){
				if (obj.getBounds().contains(mousePointer.x, mousePointer.y)) {
					cbIsOver(obj, sceneConfig);
					isOverlap = true;
				}
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

function draw(startX, startY, endX, endY, linkConfig){
	shapeBuilder.clearShapes(linkConfig);
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

function getSquareNodePositions(node){
	
	var top = {x:0,y:0};
	var left = {x:0,y:0};
	var right = {x:0,y:0};
	var bottom = {x:0,y:0};

	var width = node.width;
	if (!width){
		width = 10;
	}
	var height = node.height;
	if (!height){
		height = 10;	
	}

	right.x = node.x + (width/2);
	right.y = node.y;

	left.x = node.x - (width/2);
	left.y =  node.y;

	top.x = node.x;
	top.y =	node.y - (height/2);

	bottom.x = node.x;
	bottom.y = node.y + (height/2);

	return {
		top: top,
		left: left,
		right: right,
		bottom: bottom
	}
};

function calculateShortesDistanceToNode(startNode, endNode){
	var endNodePositions = getSquareNodePositions(endNode);
	var left = endNodePositions.left;
	var right = endNodePositions.right;
	var top = endNodePositions.top;
	var bottom = endNodePositions.bottom;
	var endX = 0;
	var endY = 0;

	//choose the shortest distance
	var distance_left = phaserGame.physics.arcade.distanceToXY(startNode, left.x, left.y);
	var distance_right = phaserGame.physics.arcade.distanceToXY(startNode, right.x, right.y);
	var distance_top = phaserGame.physics.arcade.distanceToXY(startNode, top.x, top.y);
	var distance_bottom = phaserGame.physics.arcade.distanceToXY(startNode, bottom.x, bottom.y);

	if (distance_left > distance_right){
		endX = right.x;
		endY = right.y;
		if (distance_right > distance_top || distance_right > distance_bottom){
			if (distance_top > distance_bottom){
				endX = bottom.x;
				endY = bottom.y;
			}else{
				endX = top.x;
				endY = top.y;
			}
		}
	}else{
		endX = left.x;
		endY = left.y;
		if (distance_left > distance_top || distance_left > distance_bottom){
			if (distance_top > distance_bottom){
				endX = bottom.x;
				endY = bottom.y;
			}else{
				endX = top.x;
				endY = top.y;
			}
		}
	}

	return {
		x: endX,
		y: endY
	};
};

function startLinkDraw(startNode, startNodeConfig, endNode, endNodeConfig, link, linkConfig, isMouseOver, mouse){
	//four attach points on rectangle
	var startX;
	var startY;
	var endX;
	var endY;
	if (endNode){
		if (startNodeConfig.shape == "circle"){
			angle =  phaserGame.physics.arcade.angleBetween(startNode, endNode);
			startX = startNode.x + startNodeConfig.radius * Math.cos(angle);
			startY = startNode.y + startNodeConfig.radius * Math.sin(angle);
		}
		if (startNodeConfig.shape == "rectangle"){
			angle =  phaserGame.physics.arcade.angleBetween(startNode, endNode);
			var startPos = calculateShortesDistanceToNode(endNode, startNode);
			startX = startPos.x;
			startY = startPos.y;
		}
		if (endNodeConfig.shape == "circle"){
			var endAngle =  phaserGame.physics.arcade.angleBetween(endNode, startNode);
			endX = endNode.x + endNodeConfig.radius	 * Math.cos(endAngle);
			endY = endNode.y + endNodeConfig.radius	 * Math.sin(endAngle);
			setConfigPositions(endX, endY, angle, link, linkConfig);
			draw(startX, startY, endX, endY, linkConfig);
		} 
		if (endNodeConfig.shape == "rectangle"){
			var endPos = calculateShortesDistanceToNode(startNode, endNode);
			endX = endPos.x;
			endY = endPos.y;
			setConfigPositions(endX, endY, angle, link, linkConfig);
			draw(startX, startY, endX, endY, linkConfig);
		}
	} else if (!isMouseOver) {
		if (startNodeConfig.shape == "circle"){
			angle =  phaserGame.physics.arcade.angleToPointer(startNode);
			startX = startNode.x + startNodeConfig.radius * Math.cos(angle);
			startY = startNode.y + startNodeConfig.radius * Math.sin(angle);
			endX = mouse.x;
			endY = mouse.y;
			setConfigPositions(endX, endY, angle, link, linkConfig);
			draw(startX, startY, endX, endY, linkConfig);
		} 
		if (startNodeConfig.shape == "rectangle"){
	
			angle =  phaserGame.physics.arcade.angleToPointer(startNode);
			
			var startPos = calculateShortesDistanceToNode(mouse, startNode);
			startX = startPos.x;
			startY = startPos.y;

			endX = mouse.x;
			endY = mouse.y;

			setConfigPositions(endX, endY, angle, link, linkConfig);
			draw(startX, startY, endX, endY, linkConfig);
		}
	}
};

function drawLink(linkName, mouse){

	var startX = 0;
	var startY = 0;
	var angle = 0;
	var endX = 0;
	var endY = 0;
	var link;
	var linkConfig;
	var atLeastOneConnection = false;
	var startNodeConfig
	var startNodeRadius;
	var startNode;
	var endNode;
	var endNodeConfig;
	var endNodeRadius;
	var adjustLinkPos;

	getLinkNodes(linkName, function(_node, _nodeConfig, _link, _linkConfig, isStartLink){
		link = _link;
		linkConfig = _linkConfig;
		atLeastOneConnection = true;
		if (isStartLink) {
			startNodeRadius = _nodeConfig.radius;
			startNodeConfig = _nodeConfig;
			startNode = _node;

		} else {
			endNodeRadius = _nodeConfig.radius;
			endNodeConfig = _nodeConfig;
			endNode = _node;
		}
	});
	if (atLeastOneConnection){
		isMouseOverlap(mouse, function(_endNode, _endNodeConfig){ // snap in
			if (linkConfig.endNode == _endNodeConfig.name){
				endNodeRadius = _endNodeConfig.radius;
				endNodeConfig = _endNodeConfig;
				endNode = _endNode;
			}
			startLinkDraw(startNode, startNodeConfig, endNode, endNodeConfig, link, linkConfig, true, mouse);
		},function(){
			startLinkDraw(startNode, startNodeConfig, endNode, endNodeConfig, link, linkConfig, false, mouse);
		});
	}
};