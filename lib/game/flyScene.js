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
					playerScoreManager.getPlayerScore(function(playerScore){
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
	sceneEventManager.subscribeToTimers(function(timer, config, state){
		sceneSelector.next();
		phaserGame.reset();
	},function(timer, config, state, date){
		sceneObjBuilder.getText(function(text, config, state){
			text.text = date.getMinutes() + "m " + date.getSeconds() + "s";
		});
	});
};
this.reset = function(){
};