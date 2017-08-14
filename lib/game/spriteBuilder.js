/*[spriteBuilderConfig, cache]*/
/*CLASS*/
/*SINGLETON*/
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
			var spriteId = sceneConfiguration.name.replace(/[0-9]/g, '');
			if (spriteConfig.name == spriteId){
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
	var x = Number(sceneConfig.xPosition);
	var y = Number(sceneConfig.yPosition);
	factory.phaserGame(function(phaserGame){
		if (!x){
			x = phaserGame.world.centerX;
		} 
		if (!y){
			y = phaserGame.world.centerY;
		}
		
		var sprite = phaserGame.add.sprite(x, y, sceneConfig.name);
		phaserGame.physics.enable(sprite, Phaser.Physics.ARCADE)
		sprite.inputEnabled = true;
		sprite.enableBody = true;
		sprite.scale.setTo(sceneConfig.xScale, sceneConfig.yScale);

		if (sceneConfig.width){
			sprite.width = 	sceneConfig.width;		
		}

		if (sceneConfig.rotation){
			sprite.rotation = 	sceneConfig.rotation;		
		}

		if (sceneConfig.shape == "circle"){
			sprite.body.setCircle(sceneConfig.radius);
		}

		if (sceneConfig.shape == "rectangle"){
			sprite.body.width = sceneConfig.width;
			sprite.body.height = sceneConfig.height
		}

		if (sceneConfig.dragDrop == true){
			sprite.input.enableDrag();
		}


		if (sceneConfig.visible == false){
			sprite.visible = false;
		}

		if (sceneConfig.xAnchorPosition > -1 && sceneConfig.yAnchorPosition > -1){
			sprite.anchor.setTo(sceneConfig.xAnchorPosition, sceneConfig.yAnchorPosition);
		}else{
			sprite.anchor.setTo(0.5, 0.5);
		}
		
		sceneConfig.originalWidth = sprite.width;				
		var state = {
			isSelected: false
		};
		
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
	});
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
