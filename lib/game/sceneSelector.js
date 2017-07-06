/*[sceneSelectorConfig, sceneManager, cache]*/
/*CLASS*/
var cacheId = "sceneState";
this.next = function(){

	function selectScene(state){
		var nextScene = sceneSelectorConfig[state.sceneIndex];
		if (state.sceneCount > 1){
			sceneManager.initialise(nextScene.name, nextScene.template);
			eventHandler.publish(scene, null, null, function nextScene(){},this);
		} else if (state.sceneCount == 1) {
			state.sceneCount--;
			sceneManager.initialise(nextScene.name, nextScene.template);
			eventHandler.publish(scene, null, null, function nextScene(){},this);
		} else {
			console.log("There is only one scene.");
		}
		state.sceneIndex--;
		if (state.sceneIndex == -1){
			state.sceneIndex = sceneSelectorConfig.length-1;
		}
	};

	cache.get(cacheId,function(state){
		selectScene(state);
	},function(){
		var state = {
			sceneIndex : sceneSelectorConfig.length-1,
			sceneCount : sceneSelectorConfig.length
		};

		cache.set(cacheId, state);
		selectScene(state);
	});
};

this.select = function(sceneName, template){
	enumerate(sceneSelectorConfig, this, function(config){
		if (config.name == sceneName && config.template == template){
			sceneManager.initialise(config.name, config.template);
		}
	});
};

this.getSceneConfig = function(callback, cbComplete){
	sceneSelectorConfig.sort(function(i1, i2){
		return i1.index-i2.index;
	});
	enumerate(sceneSelectorConfig, this, function(sceneConfig){
		callback(sceneConfig);
	},cbComplete);
};

this.reset = function(){
	cache.get(cacheId,function(state){
		state.sceneIndex = sceneSelectorConfig.length-1;
		state.sceneCount = sceneSelectorConfig.length;
	});
	sceneManager.reset();
};