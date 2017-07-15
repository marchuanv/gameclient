/*[phaserGame, eventHandler, sceneObjBuilder, sceneManager]*/
/*CLASS*/
var count = 0;
function mouseMoveEvent(mouse){
	eventHandler.publish(mouse,null,null, function onMouseMove(){ });
};

this.initialise = function() {
	phaserGame.input.addMoveCallback(mouseMoveEvent, this);
	phaserGame.input.keyboard.start();
	phaserGame.input.onDown.add(function(mouse){
		count++;
		setTimeout(function(){
			if(count == 1) {
				count = 0;
				eventHandler.publish(mouse,null,null, function onClick(){ });
			}else if(count == 2){
				count = 0;
				eventHandler.publish(mouse,null,null, function onDoubleClick(){ });
			}
		},250);
		var key = phaserGame.input.keyboard.addKey(16); //ShiftKey
		if (key.isDown){
			eventHandler.publish(null,null,null, function shiftKeyPress(){ });
			var check = setInterval(function(){
				if (!key.isDown){
					eventHandler.publish(null,null,null, function shiftKeyReleased(){ });
					clearInterval(check);
				}
			},250);
		}
	});
};

this.sceneCreated = function(cbEvent){
	cache.get("sceneCreated",function(_cbEvent){
		_cbEvent();
	},function(){
		cache.set("sceneCreated",cbEvent);
	});
};

this.reset = function() {
	phaserGame.input.deleteMoveCallback(mouseMoveEvent, this);
	phaserGame.input.keyboard.stop();
};

this.spriteSelected = function(cbEvent){
	sceneObjBuilder.getSprites(function(item){
		item.obj.events.onInputDown.add(function() {
			item.state.isSelected = true;
			console.log("SELECTED OBJECT: ",item.config);
			setTimeout(function(){
				sceneManager.getSelectedSceneObj(function(obj, sceneConfig, state){
					if (item.config.name != sceneConfig.name){
						cache.get("deselectedSprite",function(cbEvent){
							cbEvent(obj, sceneConfig, state);
						});
						console.log("DESELECTED OBJECT: ",sceneConfig);
						state.isSelected = false;
					}
				});

			},200);
			cbEvent(phaserGame.input.mousePointer, item.obj, item.config, item.state);
		}, this);
	});
};

this.spriteDeselected = function(cbEvent){
	cache.set("deselectedSprite",cbEvent);
};

this.spriteDragStart = function(cbEvent){
	sceneObjBuilder.getSprites(function(item){
		item.obj.events.onDragStart.add(function() {
			cbEvent(phaserGame.input.mousePointer, item.obj, item.config, item.state);
		}, this);
	});
};

this.spriteDragStop = function(cbEvent){
	sceneObjBuilder.getSprites(function(item){
		item.obj.events.onDragStop.add(function() {
			cbEvent(phaserGame.input.mousePointer, item.obj, item.config, item.state);
		}, this);
	});
};