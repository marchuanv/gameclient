/*[sceneSelectorConfig, cache]*/
/*CLASS*/
this.next = function(){

};

this.select = function(sceneName, cbSelectedScene){
	enumerate(sceneSelectorConfig, this, function(sceneConfig){
		if (sceneConfig.name == sceneName){
			cache.set("selectedScene", sceneConfig, null, true);
			if (cbSelectedScene){
				cbSelectedScene(sceneConfig);
			}
		}
	});
};

this.getSelectedScene = function(cbSelectedScene, dbNotFound){
	cache.get("selectedScene",function(_selectedScene){
     	cbSelectedScene(_selectedScene);
    },dbNotFound);
};

this.reset = function(){
	cache.reset();
};