/*[sceneSelectorConfig, sceneManager, cache]*/
/*CLASS*/
this.next = function(){

};

this.select = function(sceneName, template){
	enumerate(sceneSelectorConfig, this, function(config){
		if (config.name == sceneName && config.template == template){
			sceneManager.initialise(config.name, config.template);
			cache.set("currentScene", config);
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
	sceneManager.reset();
	cache.reset();
};