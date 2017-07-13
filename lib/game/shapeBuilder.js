/*[shapeBuilderConfig, phaserGame, eventHandler, cache]*/
/*CLASS*/
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
	for(var prop in gameObjectConfig){
		sceneConfiguration[prop] = gameObjectConfig[prop];
	};
};

this.initialise = function(sceneConfigurations){
	cache.set(shapeBuiltObjId, []);
	enumerate(sceneConfigurations, this, function(sceneConfiguration){
		enumerate(shapeBuilderConfig, this, function(_shapeBuilderConfig){
			if (_shapeBuilderConfig.name == sceneConfiguration.name){
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

this.createShape = function(sceneConfig, callback, reset){
	console.log("-------------------CREATING SHAPE ("+ sceneConfig.name + ")---------------------");

    var shape;
	var graphics;
	var graphicsObjId = "graphics_"+sceneConfig.name;
	cache.get(graphicsObjId, function(_graphics){
		graphics = _graphics;
	},function(){
		graphics = phaserGame.add.graphics();
		cache.set(graphicsObjId, graphics);
	});
	if (reset){
		graphics.clear();
	}
	graphics.inputEnabled = true;
    graphics.lineStyle(2, 0x000000, 1);
    
    if (sceneConfig.shape == "circle"){
		graphics.beginFill(sceneConfig.color, 1);
	    shape = graphics.drawCircle(
	    	sceneConfig.xPosition, 
			sceneConfig.yPosition, 
			sceneConfig.diameter
	    );
		shape.scale.setTo(sceneConfig.xScale, sceneConfig.yScale);
		shape.inputEnabled = true;
		graphics.endFill();
		shape.events.onInputDown.add(function() {
			eventHandler.publish(shape, sceneConfig, state, function shapeDown(){
			},this);
		}, this);

		shape.events.onInputUp.add(function() {
			eventHandler.publish(shape, sceneConfig, state, function shapeUp(){
			},this);
		}, this);

		shape.events.onDragStart.add(function(){
			eventHandler.publish(shape, sceneConfig, state, function onDragStart(){
			},this);
		});

		shape.events.onDragStop.add(function(){
			eventHandler.publish(shape, sceneConfig, state, function onDragStop(){
			},this);
		});
    }else if (sceneConfig.shape == "arrow"){
		graphics.beginFill(sceneConfig.color, 1);
		graphics.moveTo(
	    	sceneConfig.start.xPosition,
			sceneConfig.start.yPosition
	    );
	    shape = graphics.lineTo(
	    	sceneConfig.end.xPosition,
			sceneConfig.end.yPosition
	    );

    }

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

	callback(shape);
};

this.updateShapes = function(){
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