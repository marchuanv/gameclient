function ScoreboardScene(playerScoreProvider, sceneObjBuilder, sceneEventManager, sceneManager, sceneSelector, phaserGame) {
	this.create = function(){
		sceneEventManager.subscribeToAnimationComplete(function(animation, sceneConfig){
			if (sceneConfig.name.indexOf("playButton") >= 0){
				sceneSelector.next();
				phaserGame.reset();
			}
		});
		sceneEventManager.subscribeToSpriteSelected(function(mouse, obj, sceneConfig, state){
			sceneManager.playAnimationsForSceneObj(sceneConfig, [sceneConfig.name+"Anim"]);
		});
		sceneEventManager.subscribeToMouseMove(function(mouse, isMoveLeft, isMoveRight, isMoveUp, isMoveDown){
			sceneObjBuilder.getImages(function(image, config, state){
				if (config.name.indexOf("cursor") >= 0){
					image.x = mouse.x;
					image.y = mouse.y;
				}
			});
		});
		sceneObjBuilder.isComplete(function(){
			playerScoreProvider.getPlayers(function(playerScore){
				var exit = false;
				sceneObjBuilder.getText(function(scoreText, sceneConfig){
					if (sceneConfig.name.indexOf("playerScoreText") >= 0 && sceneConfig.text == "Blank"){
						if (exit == false){
							exit = true;
							var text = playerScore.name + "\xa0\xa0\xa0\xa0" + playerScore.value;
							sceneConfig.text = text;
							scoreText.text = text;
						}
					}
				});
			});
		});
	};

	this.reset = function(){
	};
}
module.exports=ScoreboardScene;