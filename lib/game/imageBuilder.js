/*[imageBuilderConfig, cache]*/
/*CLASS*/
var builtObjIdsCacheId = "imageBuiltObjIds";

function getBuiltObjects(callback, cbComplete){
	cache.get(builtObjIdsCacheId,function(builtObjIds){
		enumerate(builtObjIds,  this, function(builtObjId){
			cache.get(builtObjId,function(builtObj){
				callback(builtObj);
			});
		},cbComplete);
	});
};

function mergeConfigurations(sceneConfiguration, imageConfig){
	for(var prop in imageConfig){
		sceneConfiguration[prop] = imageConfig[prop];
	};
};

this.initialise = function(sceneConfigurations){
	cache.set(builtObjIdsCacheId, []);
	enumerate(sceneConfigurations,  this, function(sceneConfiguration){
		enumerate(imageBuilderConfig,  this, function(imageConfig){
			if (imageConfig.name == sceneConfiguration.name){
				var configId = "config_"+sceneConfiguration.name;
				cache.get(configId,function(){
				},function(){
					cache.set(configId, sceneConfiguration);
				});
				mergeConfigurations(sceneConfiguration, imageConfig);
			}
		});
	});
};

this.loadImage = function(sceneConfig, callback){
	console.log("-------------------LOADING IMAGE ("+ sceneConfig.name + ")---------------------");
	factory.phaserGame(function(phaserGame){
		phaserGame.load.image(sceneConfig.name, sceneConfig.file);
		callback();
	});
};

this.createImage = function(sceneConfig, callback){
	console.log("-------------------CREATING IMAGE (" + sceneConfig.name + ")---------------------");
	factory.phaserGame(function(phaserGame){
		var image = phaserGame.add.image(
			sceneConfig.xPosition,
			sceneConfig.yPosition, 
			sceneConfig.name
		);
		if (sceneConfig.anchor == true){
			image.anchor.setTo(0.5, 0.5);
		}
		image.height = sceneConfig.height;
		image.width = sceneConfig.width;

		var objId = "img_"+sceneConfig.name;
		cache.get(builtObjIdsCacheId, function(objectIds){
			objectIds.push(objId);
			cache.set(objId,{
				obj: image,
				config: sceneConfig,
				state: {
					isSelected: false
				}
			});
		});
		callback();
	});
};

this.getImages = function(callback, cbComplete){
	getBuiltObjects(function(builtObject){
		callback(builtObject);
	},function (){
		if (cbComplete){
			cbComplete();
		}
	});
};

this.getImageConfigById = function(name, callback){
	enumerate(imageBuilderConfig, this, function(config){
		if (name == config.name){
			callback(config);
		}
	});
};

this.reset = function(){
};