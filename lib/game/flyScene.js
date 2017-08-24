/*[sceneManager, sceneEventManager, sceneObjBuilder, sceneSelector, phaserGame, playerScoreManager]*/
/*CLASS*/
/*SINGLETON*/
this.create = function(){
	sceneEventManager.subscribeToMouseMove(function(mouse, isMoveLeft, isMoveRight, isMoveUp, isMoveDown){
		sceneObjBuilder.getImages(function(image, config, state){
			if (config.name.indexOf("cursor") >= 0){
				image.x = mouse.x;
				image.y = mouse.y;
			}
		});
	});
	sceneObjBuilder.isComplete(function(){
		sceneObjBuilder.getSprites(function(sprite, config, state){
			sceneManager.playAnimationsForSceneObj(config, [config.name+"Alive"]);
		});
	});
	sceneEventManager.subscribeToSpriteSelected(function(mouse, sprite, sceneConfig){
		if (sceneConfig.name.indexOf("fly") >= 0 && sprite.alive ==true){
			sceneManager.playAnimationsForSceneObj(sceneConfig, [sceneConfig.name+"Dead"]);
		}
	});
	sceneEventManager.subscribeToAnimationComplete(function(animation, animConfig){
		sceneObjBuilder.getSprites(function(sprite, config, state){
			enumerate(config.animations, this,function(animConfig2){
				if (animConfig.name == animConfig2.name){
					sprite.kill();
					playerScoreManager.getCurrentPlayerScore(function(playerScore){
						playerScore.value += config.score;
					});
					var hasLivingFlies = false;
					sceneObjBuilder.getSprites(function(_sprite){
						if (_sprite.alive == true){
							hasLivingFlies = true;
						}
					});
					if (hasLivingFlies == false){
						sceneSelector.next();
						phaserGame.reset();
					}
				}
			});
		});
	});
	sceneEventManager.subscribeToTimers("gameTimer", function(timer, config, state){
		sceneSelector.next();
		phaserGame.reset();
	},function(timer, config, state, date){
		sceneObjBuilder.getText(function(text, config, state){
			text.text = date.getMinutes() + "m " + date.getSeconds() + "s";
		});
	});
	sceneEventManager.subscribeToTimers("flyMoveTimer", function(timer, config, state){
		sceneObjBuilder.getSprites(function(sprite, flyConfig, state){
			var randomVelocity = generateRandomNumber(flyConfig.lowMoveFactor, flyConfig.highMoveFactor);
			moveAwayFromEdge(sprite,function moved(boundSide){
				if (boundSide == "left"){
					sprite.body.velocity.x = 0;
					state.velocity = randomVelocity;
					state.direction = "east";
				}
				if (boundSide == "right"){
					sprite.body.velocity.x = 0;
					state.velocity = (randomVelocity*-1);
					state.direction = "west";
				}
			},function notMoved(){
				state.velocity = 10;
				if (state.direction == undefined){
					state.direction = "east";
					state.velocity = randomVelocity;
				}
			});
		});
		sceneObjBuilder.getSprites(function(sprite, flyConfig, state){
			if (state.direction == "west"){
				sprite.scale.x *= -1;
				state.direction = "";
			}
			if (state.direction == "east"){
				sprite.scale.x *= 1;
				state.direction = "";
			}
			if (sprite.body.velocity.x == 0){
				sprite.body.velocity.x += state.velocity;
				sprite.body.velocity.y += state.velocity;
			} 
		});
	});
	function isAtEdge(sprite, cbleftEdge, cbRightEdge, cbBottomEdge, cbUpperEdge, cbEdge) {
		if (sprite.world.y >= (phaserGame.world.height - (Math.abs(sprite.height) + 10))) {
			cbBottomEdge();
		}
		else if (sprite.world.y <= (Math.abs(sprite.height) + 10)){
			cbUpperEdge();
		}
		else if (sprite.world.x <= (Math.abs(sprite.width) + 10)){
			cbleftEdge();
		}
		else if (sprite.world.x >= (phaserGame.world.width - (Math.abs(sprite.width) + 10))) {
			cbRightEdge();
		} else {
			cbEdge();
		}
	};
	function moveAwayFromEdge(sprite, cbMove, cbNotMoved){
		isAtEdge(sprite, function left(){
			cbMove("left");
		},function right(){
			cbMove("right");
		},function down(){
			cbMove("down");
		},function up(){
			cbMove("up");
		}, function(){
			cbNotMoved();
		});
	};
};

this.reset = function(){
};