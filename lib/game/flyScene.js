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
		// sceneObjBuilder.getSprites(function(sprite){
		// });
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
		var _velocity = 10;
		var _switch = true;
		sceneObjBuilder.getSprites(function(sprite, flyConfig){
			moveAwayFromEdge(sprite, _velocity,function moved(){
			},function notMoved(){
				_switch = false;
			});
		});
		sceneObjBuilder.getSprites(function(sprite, flyConfig){
			moveAwayFromEdge(sprite, _velocity,function moved(){
			},function notMoved(){
				if (_switch == false){
					sprite.scale.x *= -1;
					sprite.body.velocity.x -= _velocity;
				}else{
					sprite.scale.x *= 1;
					sprite.body.velocity.x += _velocity;
				}
			});
		});
	});
	
	function isAtEdge(sprite, cbleftEdge, cbRightEdge, cbBottomEdge, cbUpperEdge, cbEdge) {
		if (sprite.world.y >= (phaserGame.world.height - sprite.height) ){
			cbBottomEdge();
		}
		else if (sprite.world.y <= sprite.height){
			cbUpperEdge();
		}
		else if (sprite.world.x <= sprite.width){
			cbleftEdge();
		}
		else if (sprite.world.x >= (phaserGame.world.width - sprite.width)){
			cbRightEdge();
		} else {
			cbEdge();
		}
	};
	
	function moveAwayFromEdge(sprite, _velocity, cbMove, cbNotMoved){
		isAtEdge(sprite, function left(){
			//sprite.body.velocity.x += _velocity;
			cbMove();
		},function right(){
			//sprite.body.velocity.x -= _velocity;
			cbMove();
		},function down(){
			//sprite.body.velocity.y -= _velocity;
			cbMove();
		},function up(){
			//sprite.body.velocity.y += _velocity;
			cbMove();
		}, function(){
			cbNotMoved();
		});
	};
};

this.reset = function(){
};
