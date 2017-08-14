/*[textBuilderConfig, cache]*/
/*CLASS*/
/*SINGLETON*/
var builtObjIdsCacheId = "textBuiltObjIds";

function getBuiltObjects(callback, cbComplete){
	cache.get(builtObjIdsCacheId,function(builtObjIds){
		enumerate(builtObjIds,  this, function(builtObjId){
			cache.get(builtObjId,function(builtObj){
				callback(builtObj);
			});
		},cbComplete);
	});
};

function mergeConfigurations(sceneConfiguration, textConfig){
	for(var prop in textConfig){
		sceneConfiguration[prop] = textConfig[prop];
	};
};

this.initialise = function(sceneConfigurations, sceneIndex){
	cache.set(builtObjIdsCacheId, []);
	enumerate(sceneConfigurations,  this, function(sceneConfiguration){
		enumerate(textBuilderConfig, this,  function(textConfig){
			var txtId = sceneConfiguration.name.replace(/[0-9]/g, '');
			if (textConfig.name == txtId){
				var configId = "config_"+sceneConfiguration.name;
				cache.get(configId,function(){
				},function(){
					cache.set(configId, sceneConfiguration);
				});
				mergeConfigurations(sceneConfiguration, textConfig);
			}
		});
	});
};

this.loadText = function(sceneConfig, callback){
	callback();
};

this.createText = function(sceneConfig, callback){
    console.log("-------------------CREATING TEXT ("+ sceneConfig.name + ")---------------------");
	var textXPos =  sceneConfig.xPosition;
	var textYPos =  sceneConfig.yPosition;
	if (!sceneConfig.text){
		sceneConfig.text = "Blank";
	}
	factory.phaserGame(function(phaserGame){
		var text = phaserGame.add.text(textXPos,
						textYPos,
						sceneConfig.text,
						sceneConfig);
		if (sceneConfig.anchor == true){
			text.anchor.setTo(0.5, 0.5);
		}
		text.width = sceneConfig.width;
		text.height = sceneConfig.height;
		text.scale.setTo(sceneConfig.xScale, sceneConfig.yScale);

		var objId = "text_"+sceneConfig.name;
		cache.get(builtObjIdsCacheId,function(objectIds){
			objectIds.push(objId);
			cache.set(objId,{
				obj: text,
				config: sceneConfig,
				state: {
					isSelected: false
				}
			});
		});
		callback();
	});
};

this.getText = function(callback, cbComplete){
	getBuiltObjects(function(builtObject){
		callback(builtObject);
	},function (){
		if (cbComplete){
			cbComplete();
		}
	});
};

this.getTextConfigById = function(name, callback){
	enumerate(textBuilderConfig, this, function(config){
		if (name == config.name){
			callback(config);
		}
	});
};

this.reset = function(){
};