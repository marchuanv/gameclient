/*[phaserGame, sceneObjBuilder, sceneManager]*/
/*CLASS*/
/*SINGLETON*/
this.initialise = function() {
	phaserGame.input.keyboard.start();
};

this.subscribeToDeleteKeyPress = function(cbEvent){
	phaserGame.input.keyboard.onDownCallback = function(keyCodeData) {
		if (keyCodeData.keyCode == 46){ //DeleteKeyCode
			cbEvent();
		}       
	};
};

this.subscribeToKeyPress = function(cbEvent){
	phaserGame.input.keyboard.onDownCallback = function(keyCodeData) {
		cbEvent(keyCodeData.keyCode);
	};
};

this.subscribeToAnimationComplete = function(cbEvent){
	sceneObjBuilder.getAnimations(function(scene){
		scene.obj.onComplete.add(function () {
			cbEvent(scene.obj, scene.config);
		}, this);
	});
};

this.subscribeToMouseDown = function(cbEvent){
	phaserGame.input.onDown.add(function(mouse) {
		setTimeout(function(){
	    	cbEvent(mouse);
		},280);
	});
};

this.subscribeToMouseOver = function(cbEvent){
	sceneObjBuilder.getSprites(function(obj, sceneConfig, state){
		obj.events.onInputOver.add(function(_obj, mouse){
			cbEvent(obj, sceneConfig, state, mouse);
		}, this);
	});
};

this.subscribeToMouseMove = function(cbEvent){
	cache.set("prevMousePos",{
		x:phaserGame.world.centerX,
		y:phaserGame.world.centerY
	});
	phaserGame.input.useHandCursor = true;
	phaserGame.input.addMoveCallback(function(mouse){
		cache.get("prevMousePos",function(_prevMousePos) {
			var isMoveLeft;
			var isMoveRight;
			var isMoveUp;
			var isMoveDown;
			if (mouse.x >= _prevMousePos.x){
				isMoveLeft = false;
				isMoveRight = true;
			}else{
				isMoveLeft = true;
				isMoveRight = false;
			}
			if (mouse.y >= _prevMousePos.y){
				isMoveUp = false;
				isMoveDown = true;
			}else{
				isMoveUp = true;
				isMoveDown = false;
			}
			cache.set("prevMousePos",{ x: mouse.x, y:mouse.y });
			cbEvent.call(this, mouse, isMoveLeft, isMoveRight, isMoveUp, isMoveDown);
		});
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
	cache.set("deselectedSprite", cbEvent);
};

this.subscribeToSpriteDragStart = function(cbEvent){
	sceneObjBuilder.getSprites(function(obj, sceneConfig, state){
		obj.events.onDragStart.add(function() {

			var stateId = sceneConfig.name + "_state";
			cache.get(stateId, function(_state){
				_state.prevX = phaserGame.input.mousePointer.x;
				_state.prevY = phaserGame.input.mousePointer.y;
			}, function(){
				cache.set(stateId, {
					prevX : phaserGame.input.mousePointer.x,
					prevY : phaserGame.input.mousePointer.y
				}, null, true);
			});

			setTimeout(function(){
				cache.get(stateId, function(_state){
					var prevX = _state.prevX; 
					var prevY = _state.prevY;
					var curX = phaserGame.input.mousePointer.x;
					var curY = phaserGame.input.mousePointer.y;
					isTrueMove(prevX, prevY, curX, curY, function(){
						state.isDragged = true;
						cbEvent(phaserGame.input.mousePointer, obj, sceneConfig, state);
					});
				});
			},250);

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

this.subscribeToTimers = function(name, cbEvent, cbIntervalEvent){
	sceneObjBuilder.getTimers(function(timer, sceneConfig, state, intervalTimer){
		if (name == sceneConfig.name){
			var date = new Date();
			date.setHours(00, 02, 00);  
			timer.loop(1000, function(){
				date.setSeconds(date.getSeconds()-1);
				if (timer.ms >= sceneConfig.totalTimeoutMilliseconds){
					if (sceneConfig.repeat == false){
						timer.stop();
					}
					cbEvent(timer, sceneConfig, state);
				} else if (sceneConfig.repeat == false) {
					cbIntervalEvent(timer, sceneConfig, state, date);
					timer.start();
				}
			}, this);
			timer.start();
		}
	});
};

this.subscribeToSceneObjCollision = function(cbEvent){
	cache.set("overlapCallback",cbEvent);
};

this.update = function(){
	sceneObjBuilder.getSprites(function(obj, sceneConfig, state){
		sceneObjBuilder.getSprites(function(obj2, sceneConfig2, state2){
			if (sceneConfig.name != sceneConfig2.name && obj.overlap(obj2)){
				cache.get("overlapCallback",function(overlapCallback){
					overlapCallback(obj, sceneConfig, obj2, sceneConfig2);
				});
			}
		});	
	});
};

this.reset = function() {
	phaserGame.input.deleteMoveCallback(mouseMoveEvent, this);
	phaserGame.input.keyboard.stop();
};

function isTrueMove(prevX, prevY, curX, curY, cbIsMove){
	var xDiff = Math.abs(curX - prevX);
	var yDiff = Math.abs(curY - prevY);
	if (xDiff >= 15 || yDiff >= 15 && phaserGame.input.mousePointer.isDown == true){
		cbIsMove();
	}
};