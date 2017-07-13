/*[spriteBuilder, animationBuilder, textBuilder, imageBuilder, shapeBuilder, cache]*/
/*CLASS*/
var buildConfigCacheId = "buildConfigCacheId";
this.initialise = function(sceneConfigurations){
	sceneConfigurations.sort(function(i1,i2){
		return i1.priority - i2.priority;
	});
	var prioritisedBuildConfig = [];
	var priority = 0;
	var filteredSceneConfigurations = [];
	enumerate(sceneConfigurations, this, function(sceneConfig, cbCondition, cbRemove){
		if (sceneConfig.enabled){
			filteredSceneConfigurations.push(sceneConfig);
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
					createFunc: animationBuilder.createAnimation,
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
			if (sceneConfig.type == "sprite | image"){
				priority++;
				prioritisedBuildConfig.push({
					priority: priority,
					loadFunc: imageBuilder.loadImage,
					createFunc: imageBuilder.createImage,
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
		}else{
		}
	},function(){
		prioritisedBuildConfig.sort(function(i1,i2){
			return i1.priority - i2.priority;
		});
		cache.set("buildConfigCacheId",prioritisedBuildConfig);
		spriteBuilder.initialise(filteredSceneConfigurations);
		animationBuilder.initialise(filteredSceneConfigurations);
		textBuilder.initialise(filteredSceneConfigurations);
		imageBuilder.initialise(filteredSceneConfigurations);
		shapeBuilder.initialise(filteredSceneConfigurations);
	});
};

this.getConfigByType = function(type, cbConfig, cbComplete){
	cache.get(buildConfigCacheId, function(allBuildConfig){

		var matchingConfig = [];
		enumerate(allBuildConfig,  this, function(buildConfig){
			if (type=="animation"){
				animationBuilder.getAnimationConfigById(buildConfig.config.name, function(config){
					matchingConfig.push(config);
				});
			}else if (type == "image"){
				imageBuilder.getImageConfigById(buildConfig.config.name, function(config){
					matchingConfig.push(config);
				});
			}else if (type=="text"){
				textBuilder.getTextConfigById(buildConfig.config.name, function(config){
					matchingConfig.push(config);
				});
			}else if (type == "sprite"){
				spriteBuilder.getSpriteConfigById(buildConfig.config.name, function(config){
					matchingConfig.push(config);
				});
			}else if (type == "shape"){
				shapeBuilder.getShapeConfigById(buildConfig.config.name, function(config){
					matchingConfig.push(config);
				});
			}
		},function(){
			enumerate(matchingConfig,  this, function(_config){
				
				var duplicateCount = 0;
				enumerate(matchingConfig,  this, function(_otherConfig, cbCondition, cbRemove){
					var json01 = JSON.stringify(_config);
					var json02 = JSON.stringify(_otherConfig);
					if (json01 == json02){
						duplicateCount++;
						if (duplicateCount > 1){
							cbRemove();
						}
					}
				});

			},function(){
				enumerate(matchingConfig,  this, function(_config){
					cbConfig(_config);
				},cbComplete);
			});
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

this.reset = function(){
	spriteBuilder.reset();
	animationBuilder.reset(); 
	textBuilder.reset();
	imageBuilder.reset();
	shapeBuilder.reset();
	cache.reset();
};
