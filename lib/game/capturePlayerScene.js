/*[sceneManager, sceneObjBuilder, sceneSelector, eventHandler]*/
/*CLASS*/
var sceneName = "capturePlayerScene";
this.initialise = function(){
	
	eventHandler.subscribe(function animationComplete(animation, sceneConfig){
		if (sceneConfig.name.indexOf("submit") >= 0){
			//sceneSelector.next();
		}
	});

	eventHandler.subscribe(function receiveSpriteFocus(sprite, sceneConfig, state){
		sceneManager.getFocusedSceneObj(function(obj, _sceneConfig, _state){
			_state.isSelected = false;
		});
		if (sceneConfig.name.indexOf("playerCapture") >= 0){
			sceneObjBuilder.getText(function(text, _sceneConfig, _state){
				text.text = "";
				_state.isSelected = true;
			});
		}else{
			sceneManager.playAllAnimationsForSceneObj(sceneConfig);
		}
	});

	eventHandler.subscribe(function keyPress(keyData){
		sceneManager.getFocusedSceneObj(function(inputText, sceneConfig, state){
			if (inputText.text.length < 14) {
		        switch(keyData.keyCode) {
		            case 8:
		            	var text = inputText.text.replaceAt(inputText.text.length-1, " ");
		            	text = text.replace(" ","");
		        		inputText.text =  text;
		                break;
		            case 13:
		                break;
		            default:
		                isKeyAlphaNumeric(keyData.keyCode,function(){
		                	var char = String.fromCharCode(keyData.keyCode).toString();	
							inputText.text += char;
		                });
		                break;
		        };
			} else {
			    switch(keyData.keyCode) {
		            case 8:
		            	var text = inputText.text.replaceAt(inputText.text.length-1, " ");
		            	text = text.replace(" ","");
		        		inputText.text =  text;
		                break;
		        };
			}
		});
	});

	eventHandler.subscribe(function mouseMove(position){
		sceneObjBuilder.getImages(function(image, config, state){
			if (config.name.indexOf("cursor") >= 0){
				image.x = position.x;
				image.y = position.y;
			}
		});
	});
};

this.load = function(){
	sceneManager.loadScene(sceneName);
};

this.create = function(){
	sceneManager.createScene(sceneName);
};

this.reset = function(){

};
