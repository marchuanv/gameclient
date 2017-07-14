/*[sceneManager, sceneObjBuilder, spriteBuilderConfig, imageBuilderConfig, animationBuilderConfig, sceneSelector, designerdesignerSceneConfig, eventHandler, phaserGame]*/
/*CLASS*/
this.initialise = function(){

	eventHandler.subscribe(function onMouseMove(mouse){
	    sceneManager.getSelectedSceneObj(function(obj, sceneConfig, state){
			obj.input.disableDrag();
	    	getLinkNames(function(_linkName){
	    		if (sceneConfig.name == _linkName){
					if (mouse.isDown){
					    obj.rotation = phaserGame.physics.arcade.angleBetween(obj, mouse);
    				}
	    		}
			});
		});
	});

	eventHandler.subscribe(function onDoubleClick(mouse){
		var isSelectedSceneObj = false;
		sceneManager.getSelectedSceneObj(function(stateNodeSprite, sceneConfig, state){
			cache.get('prevSelectedId',function(prevSelectedId){
				if (sceneConfig.name == prevSelectedId){
					isSelectedSceneObj = true;
					sceneManager.playAllAnimationsForSceneObj(sceneConfig);
				}
			});
			cache.set('prevSelectedId',sceneConfig.name, null, true);//immutable
		});
		setTimeout(function(){
			if (!isSelectedSceneObj){
				var newNodeName = generateGUID();
				var newNode;
				enumerate(designerdesignerSceneConfig, this, function (_config, cbCondition, cbRemove, cbBreak){
					if (_config.name=="stateNodeTemplate"){
						var jsonStr = JSON.stringify(_config);
						newNode = JSON.parse(jsonStr);
						newNode.enabled = true;
						newNode.name = newNodeName;
						newNode.xPosition = mouse.x;
						newNode.yPosition = mouse.y;
						cbBreak();
					}
				},function(){
					var newNodeLinkName = generateGUID();
					var newConnector;
					enumerate(designerdesignerSceneConfig, this, function (_config, cbCondition, cbRemove, cbBreak){
						if(_config.name=="stateNodeLinkTemplate"){
							var jsonStr = JSON.stringify(_config);
							newConnector = JSON.parse(jsonStr);
							newConnector.enabled = true;
							newConnector.name = newNodeLinkName;
							newConnector.start.xPosition = mouse.x;
							newConnector.start.yPosition = mouse.y;
							newConnector.start.name = newNodeName;
							cbBreak();
						}
					},function(){

						designerdesignerSceneConfig.push(newNode);
						spriteBuilderConfig.push({
							file: "../publish/assets/stateNodeTemplate.png",
							name: newNode.name
						});
						animationBuilderConfig.push({
							animations: [
								{
									startIndex: 0,
									endIndex: 1,
									name: "switchState",
									start: false,
									repeat: false
								}
							],
							frameHeight: 97,
							frameWidth: 103,
							name: newNode.name,
							speed: 1
						});
						designerdesignerSceneConfig.push(newConnector);
						spriteBuilderConfig.push({
							file: "../publish/assets/stateNodeLinkTemplate.png",
							name: newConnector.name
						});
						animationBuilderConfig.push({
							animations: [
								{
									startIndex: 0,
									endIndex: 1,
									name: "switchArrow",
									start: false,
									repeat: false
								}
							],
							frameHeight: 15,
							frameWidth: 332,
							name: newConnector.name,
							speed: 1
						});

						phaserGame.reset();
					});
				});   
			}
		},100);
	});

	eventHandler.subscribe(function onDragStart(mouse){
		sceneManager.getSelectedSceneObj(function(obj, sceneConfig, state){
			if (sceneConfig.name.endsWith("Template")){
				state.isSelected = false;
			}
		});
	});

	eventHandler.subscribe(function onDragStop(mouse){
		sceneManager.getSelectedSceneObj(function(obj, sceneConfig, state){
			if (sceneConfig.name.endsWith("Template")){

			}
		});
	});

	eventHandler.subscribe(function spriteDown(obj, sceneConfig, state){
		sceneManager.getSelectedSceneObj(function(obj2, sceneConfig2, state2){
			state2.isSelected = false;
			obj2.input.disableDrag();
		});
		state.isSelected = true;
	});

	eventHandler.subscribe(function spriteUp(sprite, sceneConfig, state){
		sceneManager.getSelectedSceneObj(function(obj2, sceneConfig2, state2){
			state2.isSelected = false;
			obj2.input.disableDrag();
		});
	});
	
};

this.load = function(){
	sceneManager.loadScene();
};

this.create = function(){
	sceneManager.createScene();
	//adjust existing config for this session
	getLinkNames(function(_linkName){
		getActiveLinkNodes(_linkName,function(_stateNode, _stateNodeConfig, _linkNode, _linkConfig){

			_linkNode.anchor.x = 0;
			_linkNode.anchor.y = 0.5;

			_linkNode.x = _stateNode.x;
			_linkNode.y = _stateNode.y;

			_linkConfig.xPosition = _linkNode.x;
			_linkConfig.yPosition = _linkNode.y;
			_linkConfig.xAnchorPosition = _linkNode.anchor.x;
			_linkConfig.yAnchorPosition = _linkNode.anchor.y;

			_stateNodeConfig.xPosition = _stateNode.x;
			_stateNodeConfig.yPosition = _stateNode.y;
			_stateNodeConfig.xAnchorPosition = _stateNode.anchor.x;
			_stateNodeConfig.yAnchorPosition = _stateNode.anchor.y;
			
			console.log("_stateNode: ",_stateNode);
			console.log("_stateNodeConfig: ",_stateNodeConfig);
			console.log("_linkNode: ",_linkNode);
			console.log("_linkConfig: ",_linkConfig);

		});
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
		if (_linkConfig.enabled){
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