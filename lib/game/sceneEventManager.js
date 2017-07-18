/*[phaserGame, eventHandler, sceneObjBuilder, sceneManager]*/
/*CLASS*/
this.initialise = function() {
	phaserGame.input.keyboard.start();
};

this.subscribeToDeleteKeyPress = function(cbEvent){
	phaserGame.input.keyboard.onDownCallback = function(keyCodeData) {
		if (phaserGame.input.keyboard.event.keyCode == 46){ //DeleteKeyCode
			cbEvent();
		}       
	};
};

this.subscribeToMouseMove = function(cbEvent){
	phaserGame.input.addMoveCallback(function(mouse){
		cbEvent.call(this, mouse);
	}, this);
};

this.subscribeToSceneCreated = function(cbEvent){
	cache.get("sceneCreated",function(_cbEvent){
		_cbEvent();
	},function(){
		cache.set("sceneCreated",cbEvent);
	});
};

this.subscribeToSpriteSelected = function(cbEvent){
	sceneObjBuilder.getSprites(function(obj, sceneConfig, state){
		obj.events.onInputDown.add(function() {
			state.isSelected = true;
			console.log("SELECTED OBJECT: ",sceneConfig);
			setTimeout(function(){
				sceneManager.getSelectedSceneObj(function(obj2, sceneConfig2, state2){
					if (sceneConfig.name != sceneConfig2.name){
						cache.get("deselectedSprite",function(cbEvent){
							cbEvent(obj2, sceneConfig2, state2);
						});
						console.log("DESELECTED OBJECT: ", sceneConfig2);
						state2.isSelected = false;
					}
				});

			},200);
			cbEvent(phaserGame.input.mousePointer, obj, sceneConfig, state);
		}, this);
	});
};

this.subscribeToSpriteDeselected = function(cbEvent){
	cache.set("deselectedSprite",cbEvent);
};

this.subscribeToSpriteDragStart = function(cbEvent){
	sceneObjBuilder.getSprites(function(obj, sceneConfig, state){
		obj.events.onDragStart.add(function() {
			state.isDragged = true;
			cbEvent(phaserGame.input.mousePointer, obj, sceneConfig, state);
		}, this);
	});
};

this.subscribeToSpriteDragStop = function(cbEvent){
	sceneObjBuilder.getSprites(function(obj, sceneConfig, state){
		obj.events.onDragStop.add(function() {
			state.isDragged = false;
			cbEvent(phaserGame.input.mousePointer, obj, sceneConfig, state);
		}, this);
	});
};

this.reset = function() {
	phaserGame.input.deleteMoveCallback(mouseMoveEvent, this);
	phaserGame.input.keyboard.stop();
};