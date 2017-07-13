/*[spriteBuilderConfig, phaserGame, eventHandler, cache]*/
/*CLASS*/
var builtObjIdsCacheId = "spriteBuiltObjIds";

function getBuiltObjects(callback, cbComplete){
	cache.get(builtObjIdsCacheId,function(builtObjIds){
		enumerate(builtObjIds, this, function(builtObjId){
			cache.get(builtObjId,function(builtObj){
				callback(builtObj);
			});
		},cbComplete);
	});
};

function mergeConfigurations(sceneConfiguration, gameObjectConfig){
	for(var prop in gameObjectConfig){
		sceneConfiguration[prop] = gameObjectConfig[prop];
	};
};

this.initialise = function(sceneConfigurations){
	cache.set(builtObjIdsCacheId, []);
	enumerate(sceneConfigurations, this, function(sceneConfiguration){
		enumerate(spriteBuilderConfig, this, function(spriteConfig){
			if (spriteConfig.name == sceneConfiguration.name){
				var configId = "config_"+sceneConfiguration.name;
				cache.get(configId,function(){
				},function(){
					cache.set(configId, sceneConfiguration);
				});
				mergeConfigurations(sceneConfiguration, spriteConfig);
			}
		});
	});
};

this.loadSprite = function(sceneConfig, callback){
	callback();
};

this.createSprite = function(sceneConfig, callback){
	console.log("-------------------CREATING SPRITE ("+ sceneConfig.name + ")---------------------");
		
	var sprite = phaserGame.add.sprite(sceneConfig.xPosition, sceneConfig.yPosition, sceneConfig.name);
	sprite.enableBody = true;
	sprite.inputEnabled = true;
	sprite.width = sceneConfig.width;
	sprite.height = sceneConfig.height;
	sprite.anchor.setTo(0.5, 0.5);
	
	var state = {
		isSelected: false
	};

	if (sceneConfig.isStatic == false){
		eventHandler.subscribe(function gameUpdate(){
		});
	}
	sprite.scale.setTo(sceneConfig.xScale, sceneConfig.yScale);
	
	sprite.events.onInputDown.add(function() {
		eventHandler.publish(sprite, sceneConfig, state, function receiveSpriteFocus(){
		},this);
	}, this);

	var objId = "sprite_"+sceneConfig.name;
	cache.get(builtObjIdsCacheId, function(objectIds){
		objectIds.push(objId);
		cache.set(objId,{
			obj: sprite,
			config: sceneConfig,
			state: state
		});
	});
	callback();
};

this.updateSprites = function(){
};

this.getSprites = function(callback, cbComplete){
	getBuiltObjects(function(builtObject){
		callback(builtObject);
	},function (){
		if (cbComplete){
			cbComplete();
		}
	});
};

this.getSpriteConfigById = function(name, callback){
	enumerate(spriteBuilderConfig, this, function(config){
		if (name == config.name){
			callback(config);
		}
	});
};

this.reset = function(){
};
