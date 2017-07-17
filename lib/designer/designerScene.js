/*[sceneManager, sceneEventManager, sceneObjBuilder, spriteBuilderConfig, imageBuilderConfig, animationBuilderConfig, shapeBuilder, designerSceneConfig, phaserGame]*/
/*CLASS*/

this.create = function(){

	sceneEventManager.subscribeToMouseMove(function(mouse){
		cache.get("disconnectedLink", function(linkConfig){
			// A LINK IS NOT ALLOWED TO MOVE ONCE ATTACHED TO A NODE
			isLinkOverlayNode(linkConfig.name, function(_linkNode, _linkNodeConfig, _link, _linkConfig){
				shapeBuilder.clearShapes(_linkConfig);
				shapeBuilder.createShape({
					name: _linkConfig.name,
					color: "black",
					shape: "line",
					xScale: 1,
					yScale: 1,
					start:{
						xPosition: _linkNode.x,
						yPosition: _linkNode.y
					},
					end:{
						xPosition: mouse.x,
						yPosition: mouse.y
					}
				}, null);
			});
		});
	});

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
				isLinkOverlayNode(_sceneConfig.name, function(_stateNode, _stateNodeConfig, _stateNodeLink, _stateNodeLinkConfig){
					_stateNodeLinkConfig.start.name = _stateNodeConfig.name; 
					_stateNodeLink.input.disableDrag();
					updateSceneObjectPosition(_stateNodeLinkConfig.name, _stateNode.x, _stateNode.y);
					cache.set("disconnectedLink", _stateNodeLinkConfig, null, true);
				});
			});
		} else if (_sceneConfig.name.startsWith("Link")){
			isLinkOverlayNode(_sceneConfig.name, function(_stateNode, _stateNodeConfig, _stateNodeLink, _stateNodeLinkConfig){
				_stateNodeLinkConfig.start.name = _stateNodeConfig.name; 
				_stateNodeLink.input.disableDrag();
			});
		}
		updateSceneObjectPosition(sceneConfig.name, xPos, yPos);
		changeLinkVisibility(sceneConfig.name,true);
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
			shapeBuilder.clearShapes(_linkConfig);
			_linkConfig.end.name = sceneConfig.name;
			updateSceneObjectPosition(_linkConfig.name, obj.x, obj.y);
		});
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
	// A LINK IS NOT ALLOWED TO MOVE ONCE ATTACHED TO A NODE
	getLinkNodes(sceneConfigName, function(_linkNode, _linkNodeConfig, _link, _linkConfig, isStartNode, isDisconnectedLink){ //When a link
		if (!isStartNode && !isDisconnectedLink){
			factory.phaserGame(function(_instance){
				var distance = _instance.physics.arcade.distanceBetween(_link, _linkNode);
				_link.rotation = phaserGame.physics.arcade.angleBetween(_link, _linkNode);
			});
		}else if (isDisconnectedLink){
			_link.x = x;
			_link.y = y;
			_linkConfig.xPosition = _link.x;
			_linkConfig.yPosition = _link.y;
		}
	});
	getNodeLink(sceneConfigName, function(_link, _linkConfig, _linkNode, _linkNodeConfig, isStartNode, isDisconnectedLink){
		_linkNode.x = x;
		_linkNode.y = y;
		_linkNodeConfig.xPosition = _linkNode.x;
		_linkNodeConfig.yPosition = _linkNode.y;
		if (!isDisconnectedLink){
			if (isStartNode){
				_link.x = _linkNode.x;
				_link.y = _linkNode.y;
				_linkConfig.xPosition = _link.x;
				_linkConfig.yPosition = _link.y;
			}
			getLinkNodes(_linkConfig.name, function(_otherLinkNode, _otherLinkNodeConfig, _otherlink, _otherlinkConfig, isStartNode2, isDisconnectedLink2){
				factory.phaserGame(function(_instance){
					if (_otherLinkNodeConfig.name != _linkNodeConfig.name){
						var distance = _instance.physics.arcade.distanceBetween(_linkNode, _otherLinkNode);
						_link.width += (distance- (_link.width));
						_link.width -= _otherLinkNodeConfig.diameter;
					}
					_link.rotation = phaserGame.physics.arcade.angleBetween(_link, _otherLinkNode);
				});
			});
		}
	});
};

function getNodeLink(sceneConfigName, cbFound){
	var isDisconnectedLink = true;
	sceneObjBuilder.getSprites(function(obj, config){
		if (sceneConfigName == config.name && config.name.indexOf("Node") >=0 ){
			sceneObjBuilder.getSprites(function(obj2, config2){
				if (config2.start && config2.start.name && config2.start.name == config.name){
					isDisconnectedLink = false;
					cbFound(obj2, config2, obj, config, true, isDisconnectedLink);
				}
				if (config2.end && config2.end.name && config2.end.name == config.name){
					isDisconnectedLink = false;
					cbFound(obj2, config2, obj, config, false, isDisconnectedLink);
				}
			});
			if (isDisconnectedLink == true){
				cbFound(null, null, obj, config, false, isDisconnectedLink);
			}
		}
	});
};

function getLinkNodes(sceneConfigName, cbFound){
	var isDisconnectedLink = true;
	sceneObjBuilder.getSprites(function(obj, config){
		if (sceneConfigName == config.name && config.name.indexOf("Link") >=0 ){
			sceneObjBuilder.getSprites(function(obj2, config2){
				if (config.start && config.start.name && config.start.name == config2.name){
					isDisconnectedLink = false;
					cbFound(obj2, config2, obj, config, true, isDisconnectedLink);
				}else if (config.end && config.end.name && config.end.name == config2.name){
					isDisconnectedLink = false;
					cbFound(obj2, config2, obj, config, false, isDisconnectedLink);
				}
			});
			if (isDisconnectedLink == true){
				cbFound(null, null, obj, config, false, isDisconnectedLink);
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
            cbOverlay(obj3, sceneConfig3, obj2, sceneConfig2);
          }
        }
      });
    }
  });
};

function changeLinkVisibility(sceneConfigName, isVisible){
	sceneObjBuilder.getSprites(function(obj, sceneConfig) {
		if (sceneConfig.name == sceneConfigName && sceneConfigName.startsWith("Link")) {
			if (sceneConfig.start.name){
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