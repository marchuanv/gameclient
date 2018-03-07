function FlyScene(sceneManager, sceneEventManager, sceneObjBuilder, sceneSelector, phaserGame, playerScoreManager){
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
		sceneEventManager.subscribeToTimers("gameEndTimer", function(timer, config, state){
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
				isAtEdge(sprite, function xBound(side){
					if (side == "left"){
						if (sprite.scale.x < 0){
							sprite.scale.x = (sprite.scale.x*-1);
						}
						sprite.body.velocity.x = 0;
						state.xVelocity = randomVelocity;
					}
					if (side == "right"){
						if (sprite.scale.x > 0){
							sprite.scale.x =  (sprite.scale.x*-1);
						}
						sprite.body.velocity.x = 0;
						state.xVelocity = (randomVelocity*-1);
					}
				},function yBound(side){
					if (side == "bottom"){
						sprite.body.velocity.y = 0;
						state.yVelocity = (randomVelocity*-1);
					}
					if (side == "top"){
						sprite.body.velocity.y = 0;
						state.yVelocity = randomVelocity;
					}
				},function notMoved(){
					if (sprite.body.velocity.x == 0){
						sprite.body.velocity.x += randomVelocity;
						sprite.body.velocity.y += randomVelocity;
					}
				});
			});
			sceneObjBuilder.getSprites(function(sprite, flyConfig, state){
				if (sprite.body.velocity.x == 0){
					sprite.body.velocity.x += state.xVelocity;
					sprite.body.velocity.y += state.yVelocity;
				} 
			});
		});
		function isAtEdge(sprite, cbXBound, cbYBound, cbNotAtBound) {
			var atBound = false;
			if (sprite.world.x <= (Math.abs(sprite.width) + 10)){
				cbXBound("left");
				atBound = true;
			}
			else if (sprite.world.x >= (phaserGame.world.width - (Math.abs(sprite.width) + 10))) {
				cbXBound("right");
				atBound = true;
			}
			if (sprite.world.y >= (phaserGame.world.height - (Math.abs(sprite.height) + 10))) {
				cbYBound("bottom");
				atBound = true;
			}
			else if (sprite.world.y <= (Math.abs(sprite.height) + 10)){
				cbYBound("top");
				atBound = true;
			}
			if (atBound == false){
				cbNotAtBound();
			}
		};
	};
	this.reset = function(){
	};
}
module.exports=FlyScene;