function getAllDependeciesFromCache(callback){
	window.cache.get("dependencies",function(dependencies){
		callback(dependencies);
	},function(){
		var dependencies = [];
		window.cache.set("dependencies", dependencies, null, true);
		callback(dependencies);
	});
};

function getFactoryInstanceIds(callback){
	var allIds = [];
	window.cache.get("ids",function(allIdsArray){
		allIds = allIdsArray;
	},function(){
		window.cache.set("ids", allIds);
	});
	callback(allIds);
};

function getDependencyItemFromCache(callbackItem, callbackComplete){
	getAllDependeciesFromCache(function(dependencies){
		enumerate(dependencies, this, function item(dep){
			callbackItem(dep);
		},function(){
			callbackComplete();
		});
	});
};

function ctorClass(type, params){
	var obj = Reflect.construct(type, params);
	obj["isClass"] = true;
	if (!obj.reset){
		throw  (Id + " does not have a function called reset.");
	}
	return obj;
}

function ctor(Id, type, params, isClass, isSingleton){
	getFactoryInstanceIds(function(allIds){
		if (Id.endsWith("cache")){
			allIds.push(Id);
			window.cache.set(Id, window.cache, null, isSingleton);
		}else if (isClass) {
			var obj = ctorClass(type, params);
			allIds.push(Id);
			window.cache.set(Id, obj, null, isSingleton);
		}else {
			var obj = type(params);
			try {
				obj = JSON.parse(obj);
			} catch(err) {
				console.log("Factory: there was an error pasring config for " + Id);
			}
			allIds.push(Id);
			window.cache.set(Id, obj, null, isSingleton);
		}
	});
};

function ensureInstance(Id, params, newClass, isClass, isSingleton, cbCreated){
	window.cache.get(Id, function found(instance){
		cbCreated(instance);
	},function notFound(){
		console.log("creating instance for "+Id);
		ctor(Id, newClass, params, isClass, isSingleton);
		ensureInstance(Id, params, newClass, isClass, isSingleton, cbCreated);
	});
};

function getParameters(typeName, cbFound, cbNotFound){
	var params = [];
	var totalNoDep = 0;
	var paramTypes = [];
	var isClass;
	var type;
	getDependencyItemFromCache(function item(dep){
		if (dep.typeName == typeName && dep.dependantTypeName){
			type = dep.type;
			isClass = dep.isClass;
			var depId = "_"+dep.dependantTypeName;
			totalNoDep = dep.totalNoDep;
			paramTypes.push(dep.dependantTypeName);
			window.cache.get(depId, function complete(instance){
				params.push(instance);
			});
		}else if (dep.typeName == typeName){
			type = dep.type;
			isClass = dep.isClass;
		}
	},function complete(){
		if (totalNoDep == params.length){
			cbFound(params, type, isClass);
		}else{
			cbNotFound(paramTypes);
		}
	});
};

function createGetInstanceFunction(typeName, isSingleton){
	window.cache.get("factoryFunctions", function(factoryFunctions){
		cache.set(typeName, function(cbFound){
			getParameters(typeName, function found(params, type, _isClass){
				var Id = "_"+typeName;
				ensureInstance(Id, params, type, _isClass, isSingleton, function found(instance){
					cbFound(instance);
				});
			},function notFound(paramTypes){
				enumerate(paramTypes, this, function item(depType){
					window.cache.get(depType, function(func){
						func(function(){
						});
					},function(){
						throw "can't find depend type "+depType;
					});
				},function complete(){
					window.cache.get(typeName, function(func){
						func(function(instance){
							cbFound(instance);
						});
					},function(){
						throw "can't find type "+typeName;
					});
				});
			});
		},function(func){
			window.cache.get(typeName, function(func){
				factoryFunctions[typeName] = func;
			});
		},true);
	});
};

function register(isClass, isSingleton, ctor, errCallback){
	if (typeof ctor !== 'function'){
		var err = new Error();
		throw "failed to register type, one or more callback parameters are not of type function or are missing. STACK: /n " + err.stack;
	} else {
		var typeName = getFunctionName(ctor);
		var args = getFunctionArguments(ctor);
        var depCount = args.length;
		if (args.length == 1 && args.indexOf("") >= 0){
    		depCount--;
    	}
		enumerate(args, this, function item(arg) {
			getAllDependeciesFromCache(function(dependencies){
				var dep = { 
					Id: generateGUID(), 
					typeName: typeName, 
					dependantTypeName: arg,
					priority: 0,
					type: ctor,
					isClass: isClass,
					totalNoDep: depCount,
					isResolved: false
				};
				dependencies.push(dep);
			});
		},function complete(){
			createGetInstanceFunction(typeName, isSingleton);
		});
	}
};

function reload(cbComplete) {
	console.clear();
	getFactoryInstanceIds(function(allIds) {
		enumerate(allIds, this, function item(instanceId, cbCondition, cbRemove, cbBreak){
			if (instanceId.startsWith("_")){
				window.cache.get(instanceId, function(_instance){
					if (_instance.isClass){
						_instance.reset();
					}
				});
			}
		},function(){
			if (cbComplete){
				cbComplete();
			}
		});
	});
};

function factory(cbReady) {
	if (typeof window.cache === 'function'){
		window.cache = ctorClass(cache,[]);
	}
	window.cache.get("factoryFunctions", function(_factoryFunctions){
		cbReady(_factoryFunctions);
	},function(){
		var factoryFunctions = {
			reload: reload,
			register: register
		};
		window.cache.set("factoryFunctions", factoryFunctions, null, true);
		cbReady(factoryFunctions);
	});
};

var cacheFunc = cache;
factory(function(factory){
	factory.register(true, true, cacheFunc);
});