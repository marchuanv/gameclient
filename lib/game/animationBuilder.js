/*[animationBuilderConfig, cache]*/
/*CLASS*/
/*SINGLETON*/
var builtObjIdsCacheId = "animationBuiltObjIds";

function getBuiltObjects(callback, cbComplete){
	cache.get(builtObjIdsCacheId,function(builtObjIds){
		enumerate(builtObjIds, this, function(builtObjId){
			cache.get(builtObjId,function(builtObj){
				callback(builtObj);
			});
		},cbComplete);
	});
};

function mergeConfigurations(sceneConfiguration, animationConfig){
	for(var prop in animationConfig){
		sceneConfiguration[prop] = animationConfig[prop];
	};
};

this.initialise = function(sceneConfigurations, sceneIndex){
	cache.set(builtObjIdsCacheId, []);
	enumerate(sceneConfigurations,  this, function(sceneConfiguration){
		enumerate(animationBuilderConfig,  this, function(animationConfig){
			if (animationConfig.name == sceneConfiguration.name){
				var configId = "config_"+sceneConfiguration.name;
				cache.get(configId,function(){
				},function(){
					cache.set(configId, sceneConfiguration);
				});
				mergeConfigurations(sceneConfiguration, animationConfig);
			}
		});
	});
};

this.loadAnimation = function(sceneConfig, callback){
	console.log("-------------------LOADING ANIMATION ("+ sceneConfig.name + ")---------------------");
	factory.phaserGame(function(phaserGame){
		phaserGame.load.spritesheet(
			sceneConfig.name,
			sceneConfig.file,
			sceneConfig.frameWidth,
			sceneConfig.frameHeight
		);
		callback();
	});
};

this.createAnimation = function(sceneConfig, callback){
	console.log("-------------------CREATING ANIMATION (" + sceneConfig.name + ")---------------------");
	enumerate(sceneConfig.animations,  this, function(indexConfig){
		
		var animations = [];
		if (indexConfig.startIndex < indexConfig.endIndex){
			for (var index = indexConfig.startIndex; index <= indexConfig.endIndex; index++) {
				animations.push(index);
			};
		}else{
			for (var index = indexConfig.startIndex; index >= indexConfig.endIndex; index--) {
				animations.push(index);
			};
		}
		
		var startAnimation =  false;
		if (indexConfig.name == sceneConfig.animationStartName){
			startAnimation = true;
		}
		
		var objId = "sprite_"+sceneConfig.name;
		cache.get(objId, function(item){
			var animation = item.obj.animations.add(sceneConfig.name, 
							animations,
							sceneConfig.speed, 
							sceneConfig.repeat,
							true);
			
			objId = "anim_"+indexConfig.name;
			cache.get(builtObjIdsCacheId, function(objectIds){
				cache.set(objId,{
					obj: animation,
					config: indexConfig,
					state: {
						isSelected: false
					},
					start: startAnimation
				},function(){
					objectIds.push(objId);
				});
			});
		});

	},callback);
};

this.getAnimations = function(callback, cbComplete){
	getBuiltObjects(function(builtObject){
		callback(builtObject);
	},function (){
		if (cbComplete){
			cbComplete();
		}
	});
};

this.getAnimationConfigById = function(name, callback){
	enumerate(animationBuilderConfig, this, function(config){
		if (name == config.name){
			callback(config);
		}
	});
};

this.reset = function(){
};