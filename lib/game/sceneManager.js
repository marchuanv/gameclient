/*[sceneObjBuilder, eventHandler, sceneUserInputEvents, cache]*/
/*CLASS*/
function playAnimationForSceneObj(animation, config, state){
	var timeOffset = Math.floor((Math.random() * 600) + 50);
	setTimeout(function(){
		try{
			console.log("playing animation for ",config.Id);
			animation.play();
		}catch(err){
			console.log("ANIMATION ERROR: "+ "("+config.name+")", err);
		}
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
		if (scene.start){
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

this.playAllAnimationsForSceneObj = function(sceneObj){
	sceneObjBuilder.getAnimations(function(scene){
		enumerate(sceneObj.animations, this, function item(indexConfig){
			if (scene.config.name == indexConfig.name){
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

};

this.reset = function(){
	sceneUserInputEvents.reset();
	eventHandler.reset();
	sceneObjBuilder.reset();
	cache.reset();
};
