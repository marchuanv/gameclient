/*[sceneSelectorConfig, cache]*/
/*CLASS*/
/*SINGLETON*/
sceneSelectorConfig.sort(function(i1,i2){ //always enumerate from the bottom of the list so the highest priority needs to be at the bottom.
	return i2.priority-i1.priority;
});

this.next = function(){
	enumerate(sceneSelectorConfig, this,function(sceneConfig, cbCondition, cbRemove, cbBreak){
		if (sceneConfig.name.endsWith("designerScene") == false){
			if (sceneConfig.repeat){
				getLastSceneHistory(function(_lastSelectedScene){
					if (_lastSelectedScene.name != sceneConfig.name){
						selectScene(sceneConfig.name);
						cbBreak();
					}
				});
			}else{
				isInSceneHistory(sceneConfig.name, function found(){

				},function notFound(){
					selectScene(sceneConfig.name);
					cbBreak();
				});
			}
		}
	});
};

this.select = function(sceneName, cbSelectedScene){
	selectScene(sceneName, cbSelectedScene);
};

this.getSelectedScene = function(cbFound, cbNotFound){ //first one on the history stack is the selected scene
	getLastSceneHistory(cbFound, cbNotFound);
};

this.reset = function(){
	cache.reset();
};

function isInSceneHistory(sceneName, cbFound, cbNotFound){
	cache.get("sceneHistory", function(_history){
		if (_history.indexOf(sceneName) >= 0){
			cbFound();
		}else{
			cbNotFound();
		}
	},function(){
		cache.set("sceneHistory",[],null,true);//never remove this cache item
		cbNotFound();
	});
};

function selectScene(sceneName, cbSelectedScene){
	getSceneConfig(sceneName, function(sceneConfig){
		if (cbSelectedScene){
			cbSelectedScene(sceneConfig);
		}
		pushSceneHistory(sceneConfig);
	});
};

function pushSceneHistory(sceneConfig){
	var history = [];
	cache.get("sceneHistory", function(_history){
		history = _history;
	},function(){
		cache.set("sceneHistory",history,null,true);//never remove this cache item
	});
	//top of the stack is the last selected scene.
	history.push(sceneConfig.name);
};

function getLastSceneHistory(cbFound, cbNotFound){
	cache.get("sceneHistory", function(_history){
		var lastSceneHist;
		//top of the stack is the last selected scene.
		enumerate(_history, this, function(sceneName, cbCondition, cbRemove, cbBreak){
			lastSceneHist = sceneName;
			cbBreak();
		},function(){
			getSceneConfig(lastSceneHist, cbFound, cbNotFound);
		});
	},function(){
		cache.set("sceneHistory",[],null,true);//never remove this cache item
		if (cbNotFound){
			cbNotFound();
		}
	});
};

function getSceneConfig(sceneName, cbFound, cbNotFound){
	enumerate(sceneSelectorConfig, this, function(sceneConfig, cbCondition, cbRemove, cbBreak){
		if (sceneConfig.name == sceneName){
			cbFound(sceneConfig);
			cbBreak();
		}
	},cbNotFound);
};