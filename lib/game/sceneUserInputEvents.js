/*[phaserGame, eventHandler]*/
/*CLASS*/
this.initialise = function() {
	phaserGame.input.keyboard.addCallbacks(this, null, function(keyData) {
	 	eventHandler.publish(keyData,null,null, function keyPress(){ });
	}, null);
};

var mylatesttap;
this.update = function(){
	var mouse = phaserGame.input.mousePointer;
	var now = new Date().getTime();
	if (mouse.totalTouches > 1){
		var timesince = now - mylatesttap;
		if(timesince < 1000){
			eventHandler.publish(mouse,null,null, function onDoubleClick(){ });
		}else{
			if (mouse.isDown){
				eventHandler.publish(mouse,null,null, function onDrag(){ });
			}else{
				eventHandler.publish(mouse,null,null, function onClick(){ });
			}
		}
		mylatesttap = new Date().getTime();
		mouse.totalTouches=0;
	}
};

this.reset = function() {
	phaserGame.input.mouse.mouseMoveCallback = null;
	phaserGame.input.mouse.mouseDownCallback = null;
	phaserGame.input.mouse.mouseUpCallback = null;
	phaserGame.input.keyboard.stop();
	phaserGame.input.keyboard.start();
};