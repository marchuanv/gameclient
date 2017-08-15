/*[sceneObjBuilder]*/
/*CLASS*/
/*SINGLETON*/
function clone(sceneConfig, _sceneConfigItem, cloneCount, isXPos){
	if (isXPos == undefined || isXPos == null){
		var prevXVal;
		var prevYVal;
		for (var i = cloneCount - 1; i > 0; i--) {
			var clonedSceneConfigItem = JSON.parse(JSON.stringify(_sceneConfigItem));
			clonedSceneConfigItem.name += i;
			if (prevXVal || prevYVal){
				clonedSceneConfigItem.xPosition = prevXVal + _sceneConfigItem.width;
				clonedSceneConfigItem.yPosition = prevYVal + _sceneConfigItem.height;
			}else{
				clonedSceneConfigItem.xPosition += _sceneConfigItem.width;
				clonedSceneConfigItem.yPosition += _sceneConfigItem.height;
			}
			prevXVal = clonedSceneConfigItem.xPosition;
			prevYVal = clonedSceneConfigItem.yPosition;
			sceneConfig.push(clonedSceneConfigItem);
		};
	}else{
		var prevVal;
		for (var i = cloneCount - 1; i > 0; i--) {
			var clonedSceneConfigItem = JSON.parse(JSON.stringify(_sceneConfigItem));
			clonedSceneConfigItem.name += i;
			if (isXPos == false){
				if (prevVal){
					clonedSceneConfigItem.yPosition = prevVal + _sceneConfigItem.height;
				}else{
					clonedSceneConfigItem.yPosition += _sceneConfigItem.height;
				}
				prevVal = clonedSceneConfigItem.yPosition;
				sceneConfig.push(clonedSceneConfigItem);
			}else if (isXPos == true){
				if (prevVal){
					clonedSceneConfigItem.xPosition = prevVal + _sceneConfigItem.width;
				}else{
					clonedSceneConfigItem.xPosition += _sceneConfigItem.width;
				}
				prevVal = clonedSceneConfigItem.xPosition;
				sceneConfig.push(clonedSceneConfigItem);
			}
		};
	}
};

this.initialise = function(sceneName){
	factory[sceneName+"Config"](function(sceneConfig){
		console.log("");
		console.log("initialising the " + sceneName + " scene.");
		enumerate(sceneConfig, this, function(_sceneConfigItem){
			var cloneOnXPos = (_sceneConfigItem.cloneX !== null && _sceneConfigItem.cloneX !== undefined);
			var cloneOnYPos = (_sceneConfigItem.cloneY !== null && _sceneConfigItem.cloneY !== undefined);
			var cloneOnXYPos = (_sceneConfigItem.cloneXY !== null && _sceneConfigItem.cloneXY !== undefined);
			if (cloneOnXPos == true){
				clone(sceneConfig, _sceneConfigItem, _sceneConfigItem.cloneX, true);
			}else if (cloneOnYPos == true){
				clone(sceneConfig, _sceneConfigItem, _sceneConfigItem.cloneY, false);
			}else if (cloneOnXYPos == true){
				clone(sceneConfig, _sceneConfigItem, _sceneConfigItem.cloneXY, null);
			}
		});
		sceneObjBuilder.initialise(sceneConfig);
	});
};

this.loadScene = function(){
	sceneObjBuilder.loadObjects();
};

this.createScene = function(sceneName){
	sceneObjBuilder.createObjects(function(){
		factory[sceneName](function(scene){
			console.log("");
			console.log("creating the " + sceneName + " scene.");
			scene.create();
			sceneObjBuilder.getAnimations(function(scene){
				if (scene.start){
					console.log("auto starting animation");
					playAnimationForSceneObj(scene.obj, 
							scene.config,
							scene.state);
				}
			});
		});
	});
};

this.getSelectedSceneObj = function(cbFound){
	sceneObjBuilder.getSprites(function(obj, config, state){
		if (state.isSelected == true){
			cbFound(obj, config, state);
		}
	});
	sceneObjBuilder.getText(function(obj, config, state){
		if (state.isSelected == true){
			cbFound(obj, config, state);
		}
	});
	sceneObjBuilder.getShapes(function(obj, config, state){
		if (state.isSelected == true){
			cbFound(obj, config, state);
		}
	});
};

this.getDraggedSceneObj = function(cbFound){
	sceneObjBuilder.getSprites(function(obj, config, state){
		if (state.isDragged == true){
			cbFound(obj, config, state);
		}
	});
	sceneObjBuilder.getText(function(obj, config, state){
		if (state.isDragged == true){
			cbFound(obj, config, state);
		}
	});
	sceneObjBuilder.getShapes(function(obj, config, state){
		if (state.isDragged == true){
			cbFound(obj, config, state);
		}
	});
};

this.playAnimationsForSceneObj = function(sceneObj, animNameFilters){
	sceneObjBuilder.getAnimations(function(scene){
		enumerate(sceneObj.animations, this, function item(indexConfig){
			if (scene.config.name == indexConfig.name){
				var passedFilters = true;
				enumerate(animNameFilters, this, function(_filter){
					 if (indexConfig.name.indexOf(_filter) == -1) {
					 	passedFilters = false;
					 }
				},function(){
					if (passedFilters){
						playAnimationForSceneObj(scene.obj, 
							scene.config,
							scene.state);
					}
				});
			}
		});
	});
};

this.reset = function(){
	sceneUserInputEvents.reset();
	sceneObjBuilder.reset();
	cache.reset();
};

function playAnimationForSceneObj(animation, config, state){
	var timeOffset = Math.floor((Math.random() * 600) + 50);
	setTimeout(function(){
		try{
			console.log("playing animation for ",config.name);
			animation.play();
		}catch(err){
			console.log("ANIMATION ERROR: "+ "("+config.name+")", err);
		}
	},timeOffset);
};