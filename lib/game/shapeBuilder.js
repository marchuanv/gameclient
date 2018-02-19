/*[shapeBuilderConfig, cache]*/
/*CLASS*/
/*SINGLETON*/
var shapeBuiltObjId = "shapeBuiltObjIds";

function getBuiltObjects(callback, cbComplete){
	cache.get(shapeBuiltObjId,function(builtObjIds){
		enumerate(builtObjIds, this, function(builtObjId){
			cache.get(builtObjId,function(builtObj){
				callback(builtObj);
			});
		},cbComplete);
	});
};

function mergeConfigurations(sceneConfiguration, gameObjectConfig){
	var gameObjectConfigClone = JSON.parse(JSON.stringify(gameObjectConfig));
	var origalName = sceneConfiguration.name;
	for(var prop in gameObjectConfigClone){
		sceneConfiguration[prop] = gameObjectConfigClone[prop];
	};
	sceneConfiguration.name = origalName;
};

this.initialise = function(sceneConfigurations){
	cache.set(shapeBuiltObjId, []);
	enumerate(sceneConfigurations, this, function(sceneConfiguration){
		enumerate(shapeBuilderConfig, this, function(_shapeBuilderConfig){
			var shpId = sceneConfiguration.name.replace(/[0-9]/g, '');
			if (_shapeBuilderConfig.name == shpId){
				var configId = "config_"+sceneConfiguration.name;
				cache.get(configId,function(){
				},function(){
					cache.set(configId, sceneConfiguration);
				});
				mergeConfigurations(sceneConfiguration, _shapeBuilderConfig);
			}
		});
	});
};

this.loadShape = function(sceneConfig, callback){
	callback();
};

this.createShape = function(sceneConfig, callback){
	console.log("-------------------CREATING SHAPE ("+ sceneConfig.name + ")---------------------");

    var shape;
	var graphics;
	var graphicsObjId = "graphics_"+sceneConfig.name;
	cache.get(graphicsObjId, function(_graphics){
		graphics = _graphics;
	},function(){
		factory.phaserGame(function(phaserGame){
			graphics = phaserGame.add.graphics();
			cache.set(graphicsObjId, graphics);
		});
	});

	graphics.inputEnabled = true;
    graphics.lineStyle(2, 0x000000, 1);
	graphics.beginFill(sceneConfig.color, 1);

    if (sceneConfig.shape == "circle"){
	    shape = graphics.drawCircle(
	    	sceneConfig.xPosition, 
			sceneConfig.yPosition, 
			sceneConfig.radius*2
	    );
		shape.scale.setTo(sceneConfig.xScale, sceneConfig.yScale);
		shape.inputEnabled = true;
		graphics.endFill();
		
    }else if (sceneConfig.shape == "line"){
    	
		graphics.moveTo(sceneConfig.start.xPosition, sceneConfig.start.yPosition);
		graphics.lineTo(sceneConfig.end.xPosition, sceneConfig.end.yPosition);
    }

    graphics.endFill();

	var state = {
		isSelected: false,
		isFocused: false,
		isMoving: false
	};

	var objId = "shape_"+sceneConfig.name;
	cache.get(shapeBuiltObjId, function(objectIds){
		objectIds.push(objId);
		cache.set(objId,{
			obj: shape,
			config: sceneConfig,
			state: state
		});
	});

	if (callback){
		callback(shape);		
	}

};

this.updateShapes = function(){
};

this.clearShapes = function(sceneConfig){
	var graphicsObjId = "graphics_"+sceneConfig.name;
	cache.get(graphicsObjId, function(graphics){
		graphics.clear();
		cache.remove(graphicsObjId);
	});
};

this.getShapes = function(callback, cbComplete){
	getBuiltObjects(function(builtObject){
		callback(builtObject);
	},function (){
		if (cbComplete){
			cbComplete();
		}
	});
};

this.getShapeConfigById = function(name, callback){
	enumerate(spriteBuilderConfig, this, function(config){
		if (name == config.name){
			callback(config);
		}
	});
};

this.reset = function(){
};