/*[sceneManager, sceneEventManager, sceneObjBuilder, spriteBuilderConfig, imageBuilderConfig, animationBuilderConfig, shapeBuilder, designerSceneConfig, phaserGame]*/
/*CLASS*/

this.create = function(){

	sceneEventManager.subscribeToSpriteDragStart(function (mouse, obj, sceneConfig, state){
		changeLinkVisibility(sceneConfig.name, false);
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
				updateSceneObjectPosition(_sceneConfig.name, xPos, yPos);
			});
		} else if (_sceneConfig.name.endsWith("NodeLinkTemplate")){
			_sceneConfig = cloneConfig(xPos, yPos, _sceneConfig);
			phaserGame.reset(function(){
				isLinksOverlayLinks(function(){
					console.log("ERROR: A link already exist at location, removing it.");
					removeCloneConfig(_sceneConfig.name);
					phaserGame.reset();
				});
				isLinkOverlayNode(_sceneConfig.name, function(_stateNode, _stateNodeConfig){
					_sceneConfig.start.name = _stateNodeConfig.name; 
					_stateNode.disableDrag();
					updateSceneObjectPosition(_sceneConfig.name, _stateNode.x, _stateNode.y);

				});
			});
		} else if (_sceneConfig.name.startsWith("Node")){
			updateSceneObjectPosition(_sceneConfig.name, xPos, yPos);
		} else if (_sceneConfig.name.startsWith("Link")){
			isLinkOverlayNode(_sceneConfig.name, function(_stateNode, _stateNodeConfig){
				_sceneConfig.start.name = _stateNodeConfig.name; 
				_stateNode.disableDrag();
				updateSceneObjectPosition(_sceneConfig.name, _stateNode.x, _stateNode.y);
			});
		}
		changeLinkVisibility(sceneConfig.name,true);
	});

	sceneEventManager.subscribeToSpriteDeselected(function(obj, sceneConfig, state){
		var filter = getAnimPlayFiltersFromSceneName(sceneConfig.name);
		sceneManager.playAllAnimationsForSceneObj(sceneConfig, ["Unselected",filter])
	});

	sceneEventManager.subscribeToSpriteSelected(function(mouse, obj, sceneConfig, state){
		var filter = getAnimPlayFiltersFromSceneName(sceneConfig.name);
		sceneManager.playAllAnimationsForSceneObj(sceneConfig, ["Selected",filter]);
	});

	sceneEventManager.subscribeToSceneCreated(this, function(){

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
	}else if(sceneConfig.name.endsWith("NodeLinkTemplate")) {
		sceneType = "Link";
	}

	templateConfigClone.name = sceneType + generateGUID();
	templateConfigClone.xPosition = x;
	templateConfigClone.yPosition = y;

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

function updateSceneObjectPosition(sceneConfigName, x, y){
	sceneObjBuilder.getSprites(function(obj, sceneConfig){
		if (sceneConfigName == sceneConfig.name){

			obj.x = x;
			obj.y = y;
			sceneConfig.xPosition = obj.x;
			sceneConfig.yPosition = obj.y;

			if (sceneConfig.name.startsWith("Node")){

				//update all the links associated with this node
				sceneObjBuilder.getSprites(function(linkObj, linkObjConfig){
					if (linkObjConfig.start && linkObjConfig.start.name == sceneConfig.name){
						linkObj.x = obj.x;
						linkObj.y = obj.y;
						linkObjConfig.start.xPosition = obj.x;
						linkObjConfig.start.yPosition = obj.y;
					}
					if (linkObjConfig.end && linkObjConfig.end.name == sceneConfig.name){
						linkObj.rotation = phaserGame.physics.arcade.angleBetween(linkObj, obj);
					}
				});
			}
			if (sceneConfig.name.startsWith("Link")){
				sceneObjBuilder.getSprites(function(nodeObj, nodeObjConfig){
					if (nodeObjConfig.name == sceneConfig.start.name){
						obj.x = nodeObj.x;
						obj.y = nodeObj.y;
						sceneConfig.xPosition = obj.x;
						sceneConfig.yPosition = obj.y;
					}
				});
			}
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

function isLinksOverlayLinks(cbOverlay) {
  sceneObjBuilder.getSprites(function(obj2, sceneConfig2) {
    if (sceneConfig2.name.startsWith("Link")) {
      sceneObjBuilder.getSprites(function(obj3, sceneConfig3) {
        if (sceneConfig3.name.startsWith("Link")) {
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

function isLinkOverlayNode(sceneConfigName, cbOverlay){
  sceneObjBuilder.getSprites(function(obj2, sceneConfig2) {
    if (sceneConfig2.name.startsWith("Link") && sceneConfig2.name == sceneConfigName) {
      sceneObjBuilder.getSprites(function(obj3, sceneConfig3) {
        if (sceneConfig3.name.startsWith("Node")) {
          if (obj2.overlap(obj3)) {
            cbOverlay(obj3, sceneConfig3);
          }
        }
      });
    }
  });
};

function changeLinkVisibility(sceneConfigName, isVisible){
	sceneObjBuilder.getSprites(function(obj, sceneConfig) {
		if (sceneConfig.name == sceneConfigName && sceneConfigName.startsWith("Link")) {
			if (!sceneConfig.start.name){
				obj.visible = isVisible;
			}
		}else if(sceneConfigName.startsWith("Node")){
			sceneObjBuilder.getSprites(function(obj2, sceneConfig2) {
				if (sceneConfig2.name.startsWith("Link") && sceneConfig2.start.name == sceneConfigName){
					if (!sceneConfig2.start.name){
						obj2.visible = isVisible;
					}
				}
			});
		}
	});
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