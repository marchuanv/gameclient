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
		sceneObjBuilder.getSprites(function(sprite){
			sprite.rotation = phaserGame.physics.arcade.angleToPointer(sprite);
		});
	});
	sceneObjBuilder.isComplete(function(){
		sceneObjBuilder.getSprites(function(sprite, config, state){
			sceneManager.playAnimationsForSceneObj(config, [config.name+"Alive"]);
		});
		var _velocity = 0.1;
		setInterval(function(){
			// sceneObjBuilder.getSprites(function(sprite){
			// 	isAtEdge(sprite, function bottom(){
			// 		if (_velocity == 0.1){
			// 			_velocity = -0.1;
			// 		}else{
			// 			_velocity = 0.1;
			// 		}
			// 		sprite.body.velocity.y += _velocity;
			// 	},function top(){
			// 		if (_velocity == 0.1){
			// 			_velocity = -0.1;
			// 		}else{
			// 			_velocity = 0.1;
			// 		}
			// 		sprite.body.velocity.y += _velocity;
			// 	},function left(){
			// 		if (_velocity == 0.1){
			// 			_velocity = -0.1;
			// 		}else{
			// 			_velocity = 0.1;
			// 		}
			// 		sprite.body.velocity.x += _velocity;
			// 	},function right(){
			// 		if (_velocity == 0.1){
			// 			_velocity = -0.1;
			// 		}else{
			// 			_velocity = 0.1;
			// 		}
			// 		sprite.body.velocity.x += _velocity;
			// 	},function(){
			// 		// sprite.body.velocity.x += _velocity;
			// 		// sprite.body.velocity.y += _velocity;
			// 	});
			// });
		},1);
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

	sceneEventManager.subscribeToMouseOver(function(sprite, config, state, mouse){
		if (config.name.indexOf("fly") >= 0){
			var id = config.name + "velocity";
			var moveX = null;
			var moveY = null;
			cache.set(id, 1);
			if (mouse.x > sprite.x){
				moveX = setInterval(function(){
					cache.get(id, function(_velocity){
						if (_velocity < 50){
							_velocity++;
			    			cache.set(id, _velocity);
			    			moveAwayFromEdge(sprite, _velocity, function(){
								sprite.body.velocity.x -= _velocity;
			    			});
						}else{
							sprite.body.velocity.x = 0;
		    				clearInterval(moveX);
						}
					});
				},1);
			}else{
				moveX = setInterval(function(){
					cache.get(id, function(_velocity){
						if (_velocity < 50){
							_velocity++;
			    			cache.set(id, _velocity);
							moveAwayFromEdge(sprite, _velocity, function(){
								sprite.body.velocity.x += _velocity;
			    			});
						}else{
							sprite.body.velocity.x = 0;
		    				clearInterval(moveX);
						}
					});
				},1);
			}
			if (mouse.y > sprite.y){
				moveY = setInterval(function(){
					cache.get(id, function(_velocity){
						if (_velocity < 50){
							_velocity++;
			    			cache.set(id, _velocity);
			    			moveAwayFromEdge(sprite, _velocity, function(){
								sprite.body.velocity.y -= _velocity;
			    			});
						}else{
							sprite.body.velocity.y = 0;
		    				clearInterval(moveY);
						}
					});
				},1);
			}else{
				moveY = setInterval(function(){
					cache.get(id, function(_velocity){
						if (_velocity < 50){
							_velocity++;
			    			cache.set(id, _velocity);
							moveAwayFromEdge(sprite, _velocity, function(){
								sprite.body.velocity.y += _velocity;
			    			});
						}else{
							sprite.body.velocity.y = 0;
		    				clearInterval(moveY);
						}
					});
				},1);
			}
		}
		
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
	
	function moveAwayFromEdge(sprite, _velocity, cbEdge){
		isAtEdge(sprite, function bottom(){
			sprite.body.velocity.y -= _velocity;
		},function top(){
			sprite.body.velocity.y += _velocity;
		},function left(){
			sprite.body.velocity.x += _velocity;
		},function right (){
			sprite.body.velocity.x -= _velocity;
		}, function(){
			cbEdge();
		});
	};
};

this.reset = function(){
};
