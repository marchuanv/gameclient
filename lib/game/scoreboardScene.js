/*[playerScoreProvider, sceneObjBuilder, sceneEventManager, sceneManager, sceneSelector, phaserGame]*/
/*CLASS*/
/*SINGLETON*/
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

	playerScoreProvider.getSortedPlayers(function(playerScores){
		setTimeout(function(){
			sceneObjBuilder.getText(function(scoreText, sceneConfig, state){
				if (sceneConfig.name.indexOf("playerScoreText") >= 0){
					enumerate(playerScores, this, function(score, cbCondition, cbRemove, cbBreak){
						scoreText.text = score.name + "\xa0\xa0\xa0\xa0" + score.value;
						cbRemove();
						cbBreak();
					});
				}
			});
		},100);
	}); 

};

this.reset = function(){
};