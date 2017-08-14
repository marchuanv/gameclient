/*[sceneObjBuilder]*/
/*CLASS*/
/*SINGLETON*/
this.initialise = function(sceneName){
	factory[sceneName+"Config"](function(sceneConfig){
		console.log("");
		console.log("initialising the " + sceneName + " scene.");
		enumerate(sceneConfig, this, function(_sceneConfigItem){
			if (_sceneConfigItem.cloneY){
				var previousY;
				for (var i = _sceneConfigItem.cloneY - 1; i >= 0; i--) {
					var clonedSceneConfigItem = JSON.parse(JSON.stringify(_sceneConfigItem));
					clonedSceneConfigItem.name += i;
					if (previousY){
						clonedSceneConfigItem.yPosition = previousY + _sceneConfigItem.height;
					}else{
						clonedSceneConfigItem.yPosition += _sceneConfigItem.height;
					}
					previousY = clonedSceneConfigItem.yPosition; 
					delete clonedSceneConfigItem["clone"];
					sceneConfig.push(clonedSceneConfigItem);
				};
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

this.playAllAnimationsForSceneObj = function(sceneObj, animNameFilters){
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