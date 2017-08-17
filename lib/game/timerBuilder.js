/*[cache]*/
/*CLASS*/
/*SINGLETON*/
var builtObjIdsCacheId = "timerBuiltObjIds";

function getBuiltObjects(callback, cbComplete){
	cache.get(builtObjIdsCacheId,function(builtObjIds){
		enumerate(builtObjIds,  this, function(builtObjId){
			cache.get(builtObjId,function(builtObj){
				callback(builtObj);
			});
		},cbComplete);
	});
};

function mergeConfigurations(sceneConfiguration, gameObjectConfig){
	var origName = sceneConfiguration.name;
	var gameObjectConfigClone = JSON.parse(JSON.stringify(gameObjectConfig));
	for(var prop in gameObjectConfigClone){
		sceneConfiguration[prop] = gameObjectConfigClone[prop];
	};
	sceneConfiguration.name = origName;
};

this.initialise = function(sceneConfigurations){
	cache.set(builtObjIdsCacheId, []);
	enumerate(sceneConfigurations,  this, function(sceneConfiguration){
		var configId = "config_"+sceneConfiguration.name;
		cache.get(configId,function(){
		},function(){
			cache.set(configId, sceneConfiguration);
		});
	});
};

this.loadTimer = function(sceneConfig, callback){
	console.log("-------------------LOADING TIMER ("+ sceneConfig.name + ")---------------------");
};

this.createTimer = function(sceneConfig, callback){
	console.log("-------------------CREATING TIMER (" + sceneConfig.name + ")---------------------");
	factory.phaserGame(function(phaserGame){
		var timer = phaserGame.time.create(false);
		var objId = "timer_"+sceneConfig.name;
		cache.get(builtObjIdsCacheId, function(objectIds){
			objectIds.push(objId);
			cache.set(objId,{
				obj: timer,
				config: sceneConfig,
				state: {}
			});
		});
		callback();
	});
};

this.getTimers = function(callback, cbComplete){
	getBuiltObjects(function(builtObject){
		callback(builtObject);
	},function (){
		if (cbComplete){
			cbComplete();
		}
	});
};

this.getTimerConfigById = function(name, callback){
	enumerate(imageBuilderConfig, this, function(config){
		if (name == config.name){
			callback(config);
		}
	});
};

this.reset = function(){
};