/*[sceneSelectorConfig, cache]*/
/*CLASS*/
sceneSelectorConfig.sort(function(i1,i2){ //always enumerate from the bottom of the list so the highest priority needs to be at the bottom.
	return i2.priority-i1.priority;
});

this.next = function(){
	enumerate(sceneSelectorConfig, this,function(sceneConfig, cbCondition, cbRemove, cbBreak){
		if (sceneConfig.name.endsWith("designerScene") == false){
			if (sceneConfig.repeat){
				this.select(sceneConfig.sceneName);
				cbBreak();
			}else{
				getSelectedScene(function(_selectedScene){
					if (_selectedScene.name == sceneConfig.name){

					}
				});
			}
		}
	});
};

this.select = function(sceneName, cbSelectedScene){
	enumerate(sceneSelectorConfig, this, function(sceneConfig){
		if (sceneConfig.name == sceneName){
			cbSelectedScene(sceneConfig);
			getSceneHistory(sceneConfig.name, function found(){
			},function notFound(_history){ //first one on the history stack is the selected scene
				_history.push(sceneConfig.name);
			});
		}
	});
};

this.getSelectedScene = function(cbSelectedScene, dbNotFound){ //first one on the history stack is the selected scene
	enumerate(sceneSelectorConfig, this,function(sceneConfig, cbCondition, cbRemove, cbBreak){
		getSceneHistory(sceneConfig.name, function found(){
			cbSelectedScene(sceneConfig);
			cbBreak();
		},dbNotFound);
	});
};

this.reset = function(){
	cache.reset();
	cache.set("sceneHistory",[]);
};

function getSceneHistory(sceneName, cbFound, cbNotFound){
	cache.get("sceneHistory", function(_history){
		if (_history.indexOf(item.sceneName) >= 0) {
			cbFound(_history);
		}else{
			cbNotFound(_history);
		}
	},function(){
		var history = [];
		cache.set("sceneHistory",history);
		cbNotFound(history);
	});
};

function removeHistory(sceneName){

};

function getConfig(){
	enumerate(sceneSelectorConfig, this, function(sceneConfig){
		if (sceneConfig.name == sceneName){
			
		}
	});
};