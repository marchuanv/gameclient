/*[spriteBuilder, animationBuilder, textBuilder, imageBuilder, shapeBuilder, timerBuilder, sceneObjBuilderConfig, cache]*/
/*CLASS*/
/*SINGLETON*/
var buildConfigCacheId = "buildConfigCacheId";
this.initialise = function(sceneName, sceneConfigurations){ 
	
	var priorities = sceneObjBuilderConfig[sceneName].priorities;
	enumerate(sceneConfigurations, this, function(_config, cbCondition, cbRemove, cbBreak){
		var _sceneConfigName1 = _config.name.replace(/[0-9]/g, '');
		enumerate(priorities, this, function(priorityConfig){
			var _sceneConfigName2 = priorityConfig.name.replace(/[0-9]/g, '');
			if (_sceneConfigName1 == _sceneConfigName2 &&  _config.name != priorityConfig.name){
				var _configClone = JSON.parse(JSON.stringify(_config));
				_configClone.name = priorityConfig.name;
				sceneConfigurations.push(_configClone);
			}
		});
	});

	enumerate(sceneConfigurations, this, function(_config){
		enumerate(priorities, this, function(priorityConfig){
			if (_config.priority == null && _config.priority == undefined &&  _config.name  == priorityConfig.name){
				_config.priority = priorityConfig.priority;
				if (priorityConfig.xOffset){
					_config.xPosition += priorityConfig.xOffset;
				}
				if (priorityConfig.yOffset){
					_config.yPosition += priorityConfig.yOffset;
				}
			}
		});
	});

	sceneConfigurations.sort(function(i1,i2){
		return i1.priority - i2.priority;
	});

	var prioritisedBuildConfig = [];
	var priority = 0;
	enumerate(sceneConfigurations, this, function(sceneConfig, cbCondition, cbRemove){
		if (sceneConfig.enabled){
			if (sceneConfig.type == "sprite"){
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: spriteBuilder.loadSprite,
					createFunc: spriteBuilder.createSprite,
					config: sceneConfig
				});
			}
			if (sceneConfig.type == "animation"){
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: animationBuilder.loadAnimation,
					createFunc: animationBuilder.createAnimation,
					config: sceneConfig
				});
			}
			if (sceneConfig.type == "image"){
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: imageBuilder.loadImage,
					createFunc: imageBuilder.createImage,
					config: sceneConfig
				});
			}
			if (sceneConfig.type == "text"){
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: textBuilder.loadText,
					createFunc: textBuilder.createText,
					config: sceneConfig
				});
			}
			if (sceneConfig.type == "shape"){
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: shapeBuilder.loadShape,
					createFunc: shapeBuilder.createShape,
					config: sceneConfig
				});
			}
			if (sceneConfig.type == "sprite | animation"){
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: animationBuilder.loadAnimation,
					createFunc:  function(){},
					config: sceneConfig
				});
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: spriteBuilder.loadSprite,
					createFunc: spriteBuilder.createSprite,
					config: sceneConfig
				});
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: function(){},
					createFunc: animationBuilder.createAnimation,
					config: sceneConfig
				});
			}
			if (sceneConfig.type == "sprite | image"){
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: imageBuilder.loadImage,
					createFunc: function(){},
					config: sceneConfig
				});
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: spriteBuilder.loadSprite,
					createFunc: spriteBuilder.createSprite,
					config: sceneConfig
				});
			}
			if (sceneConfig.type == "text | timer"){
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: timerBuilder.loadTimer,
					createFunc: timerBuilder.createTimer,
					config: sceneConfig
				});
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: textBuilder.loadText,
					createFunc: textBuilder.createText,
					config: sceneConfig
				});
			}
		}
	},function(){
		prioritisedBuildConfig.sort(function(i1,i2){
			return i1.priority - i2.priority;
		});
		prioritisedBuildConfig.reverse();

		//make sure that the config of the same type are prioritised amongst each other
		var filteredSceneConfigurations = [];
		enumerate(prioritisedBuildConfig, this, function(builderConfig, cbCondition, cbRemove){
			var exists = false;
			enumerate(filteredSceneConfigurations, this, function(builderConfig2, cbCondition2, cbRemove2){
				if (builderConfig.config.name == builderConfig2.name){
					exists = true;
				}
			},function(){
				if (!exists){
					filteredSceneConfigurations.push(builderConfig.config);			
				}
			});
		},function(){
			cache.set("buildConfigCacheId",prioritisedBuildConfig);
			spriteBuilder.initialise(filteredSceneConfigurations);
			animationBuilder.initialise(filteredSceneConfigurations);
			textBuilder.initialise(filteredSceneConfigurations);
			imageBuilder.initialise(filteredSceneConfigurations);
			shapeBuilder.initialise(filteredSceneConfigurations);
			timerBuilder.initialise(filteredSceneConfigurations);
		});
	});
};

this.loadObjects = function(cbComplete){
	cache.get(buildConfigCacheId, function(allBuildConfig){
		enumerate(allBuildConfig,  this, function(buildConfig){
			buildConfig.loadFunc(buildConfig.config, function loaded(){

			});
		},cbComplete);
	});
};

this.createObjects = function(cbComplete){
	cache.get(buildConfigCacheId, function(allBuildConfig){
		enumerate(allBuildConfig,  this, function(buildConfig){
			buildConfig.createFunc(buildConfig.config, function created(){
			});
		},cbComplete);
	});
	cache.set("objectsCreated",{});
};

this.getAnimations = function(callback, cbComplete){
	animationBuilder.getAnimations(function(scene){
		callback(scene);
	});
};

this.getSprites = function(cbFound){
	spriteBuilder.getSprites(function(scene){
		cbFound(scene.obj, 
				scene.config,
				scene.state);
	});
};

this.getText = function(cbFound){
	textBuilder.getText(function(scene){
		cbFound(scene.obj, 
				scene.config,
				scene.state);
	});
};

this.getShapes = function(cbFound){
	shapeBuilder.getShapes(function(scene){
		cbFound(scene.obj, 
				scene.config,
				scene.state);
	});
};

this.getImages = function(cbFound){
	imageBuilder.getImages(function(scene){
		cbFound(scene.obj, 
				scene.config,
				scene.state);
	});
};

this.getTimers = function(cbFound){
	timerBuilder.getTimers(function(scene){
		cbFound(scene.obj, 
				scene.config,
				scene.state);
	});
};

this.isComplete =function(cbDone){
	var check = setInterval(function(){
		cache.get("objectsCreated",function(){
			cbDone();
			clearInterval(check);
		});
	},20);
};

this.reset = function(){
	spriteBuilder.reset();
	animationBuilder.reset(); 
	textBuilder.reset();
	imageBuilder.reset();
	shapeBuilder.reset();
	cache.reset();
};
