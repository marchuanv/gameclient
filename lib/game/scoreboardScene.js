/*[playerScoreProvider, sceneObjBuilder]*/
/*CLASS*/
this.create = function(){

	// eventHandler.subscribe(function animationComplete(animation, sceneConfig){
	// 	if (sceneConfig.name.indexOf("play") >= 0){
	// 		//sceneSelector.next();
	// 	}
	// });

	// eventHandler.subscribe(function receiveSpriteFocus(sprite, sceneConfig, state){
	// 	sceneObjBuilder.getFocusedSceneObj(function(obj, _sceneConfig, _state){
	// 		_state.isSelected = false;
	// 	});
	// 	state.isSelected = true;
	// 	sceneObjBuilder.playAllAnimationsForSceneObj(sceneConfig);
	// });
	
	// eventHandler.subscribe(function mouseMove(position){
	// 	builderManager.getImages(function(image, config, state){
	// 		if (config.name.indexOf("cursor") >= 0){
	// 			image.x = position.x;
	// 			image.y = position.y;
	// 		}
	// 	});
	// });

	setTimeout(function(){
		var playerScores = playerScoreProvider.getSortedPlayers(); 
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
};

this.reset = function(){
};