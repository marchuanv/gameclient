/*[sceneManager, sceneObjBuilder, sceneSelector, sceneEventManager, phaserGame]*/
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

	sceneEventManager.subscribeToAnimationComplete(function(animation, sceneConfig){
		if (sceneConfig.name.indexOf("submit") >= 0){
			sceneSelector.next();
			phaserGame.reset();
		}
	});
	
	sceneEventManager.subscribeToSpriteSelected(function(mouse, obj, sceneConfig, state){
		if (sceneConfig.name.indexOf("playerCapture") >= 0){
			sceneObjBuilder.getText(function(text, _sceneConfig, _state){
				text.text = "";
			});
		}else{
			sceneManager.playAnimationsForSceneObj(sceneConfig, [sceneConfig.name+"Anim"]);
		}
	});

	sceneEventManager.subscribeToKeyPress(function(keyCode){
		sceneObjBuilder.getText(function(inputText, _sceneConfig, _state){
			if (inputText.text.length < 14) {
		        switch(keyCode) {
		            case 8:
		            	var text = inputText.text.replaceAt(inputText.text.length-1, " ");
		            	text = text.replace(" ","");
		        		inputText.text =  text;
		                break;
		            case 13:
		                break;
		            default:
		                isKeyAlphaNumeric(keyCode,function(){
		                	var char = String.fromCharCode(keyCode).toString();	
							inputText.text += char;
		                });
		                break;
		        };
			} else {
			    switch(keyCode) {
		            case 8:
		            	var text = inputText.text.replaceAt(inputText.text.length-1, " ");
		            	text = text.replace(" ","");
		        		inputText.text =  text;
		                break;
		        };
			}
		});
	});
};

this.reset = function(){
};