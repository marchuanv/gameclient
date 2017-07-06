/*[phaserGame, eventHandler]*/
/*CLASS*/
this.initialise = function() {
	phaserGame.input.mouse.mouseMoveCallback = function(position) {
		eventHandler.publish(position,null,null, function mouseMove(){ });
	};
	phaserGame.input.keyboard.addCallbacks(this, null, function(keyData) {
	 	eventHandler.publish(keyData,null,null, function keyPress(){ });
	}, null);
};

this.reset = function() {
	phaserGame.input.mouse.mouseMoveCallback = null;
	phaserGame.input.keyboard.stop();
	phaserGame.input.keyboard.start();
};