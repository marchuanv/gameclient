/*[sceneObjBuilder, eventHandler, phaserGame, sceneUserInputEvents, cache]*/
/*CLASS*/
function playAnimationForSceneObj(animation, config, state){
	var timeOffset = Math.floor((Math.random() * 600) + 50);
	setTimeout(function(){
		animation.play();
		console.log("playing animation for ",config.Id);
	},timeOffset);
};
this.initialise = function(sceneName, templateName){

	var sceneConfigName = sceneName;
	sceneConfigName = sceneConfigName.replace(" ","").toLowerCase();
	sceneConfigName = sceneConfigName + templateName + "Config";
	sceneUserInputEvents.initialise();
	
	factory[sceneConfigName](function(sceneConfig){

		console.log("");
		console.log("loading the ",sceneConfigName + " state.");

		eventHandler.unsubscribe(function gameLoad(){});
		eventHandler.unsubscribe(function gameCreate(){});
		eventHandler.unsubscribe(function gameUpdate(){});
		eventHandler.unsubscribe(function animationCreated(){});
		eventHandler.unsubscribe(function spriteUpdate(){});
		eventHandler.unsubscribe(function imageUpdate(){});

		factory[templateName](function(sceneInstance){
			sceneInstance.initialise();
		});
		eventHandler.subscribe(function gameLoad(){
			factory[templateName](function(sceneInstance){
				sceneInstance.load();
			});
		});
		eventHandler.subscribe(function gameCreate(){
			factory[templateName](function(sceneInstance){
				sceneInstance.create();
			});
		});
		eventHandler.subscribe(function gameUpdate(){
			factory[templateName](function(sceneInstance){
				sceneInstance.update();
			});
		});
		sceneObjBuilder.initialise(sceneConfig);
	});
};

this.loadScene = function(){
	sceneObjBuilder.loadObjects();
};

this.createScene = function(){
	sceneObjBuilder.createObjects();
	sceneObjBuilder.getAnimations(function(scene){
		if (scene.config.start == true){
			console.log("auto starting animation");
			playAnimationForSceneObj(scene.obj, 
					scene.config,
					scene.state);
		}
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

this.getFocusedSceneObj = function(cbFound){
	sceneObjBuilder.getSprites(function(obj, config, state){
		if (state.isFocused == true){
			cbFound(obj, config, state);
		}
	});
	sceneObjBuilder.getText(function(obj, config, state){
		if (state.isFocused == true){
			cbFound(obj, config, state);
		}
	});
	sceneObjBuilder.getShapes(function(obj, config, state){
		if (state.isFocused == true){
			cbFound(obj, config, state);
		}
	});
};

this.getMovingObject = function(cbFound){
	sceneObjBuilder.getSprites(function(obj, config, state){
		if (state.isMoving == true){
			cbFound(obj, config, state);
		}
	});
	sceneObjBuilder.getText(function(obj, config, state){
		if (state.isMoving == true){
			cbFound(obj, config, state);
		}
	});
	sceneObjBuilder.getShapes(function(obj, config, state){
		if (state.isMoving == true){
			cbFound(obj, config, state);
		}
	});
};

this.playAllAnimationsForSceneObj = function(sceneObj){
	sceneObjBuilder.getAnimations(function(scene){
		enumerate(sceneObj.animations, this, function item(indexConfig){
			if (scene.config.Id == indexConfig.Id){
				playAnimationForSceneObj(scene.obj, 
						scene.config,
						scene.state);
			}
		});
	});
};

this.getSceneConfig = function(sceneTitle, callback){
	factory["sceneSelectorConfig"](function(sceneSelectorConfig){
		enumerate(sceneSelectorConfig, this, function(sceneSelectorConfigItem){
			var formattedTitle = sceneSelectorConfigItem.title.replace(new RegExp(" ", 'g'),"");
			if (formattedTitle == sceneTitle){
				factory[sceneSelectorConfigItem.name+"Config"](function(allSceneConfig){
					var sceneConfig = allSceneConfig[sceneSelectorConfigItem.index.toString()];
					callback(sceneConfig, sceneSelectorConfigItem);
				});
			}
		});
	});
};

this.updateScene = function(){
	sceneUserInputEvents.update();
};

this.reset = function(){
	sceneUserInputEvents.reset();
};
