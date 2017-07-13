/*[phaserGame, eventHandler]*/
/*CLASS*/
var count = 0;
this.initialise = function() {
	phaserGame.input.addMoveCallback(function(mouse){
		eventHandler.publish(mouse,null,null, function onMouseMove(){ });
	},this);
	phaserGame.input.onDown.add(function(mouse){
		count++;
		setTimeout(function(){
			if(count == 1) {
				count = 0;
				eventHandler.publish(mouse,null,null, function onClick(){ });
			}else if(count == 2){
				count = 0;
				eventHandler.publish(mouse,null,null, function onDoubleClick(){ });
			}
		},250);
		var key = phaserGame.input.keyboard.addKey(16); //ShiftKey
		if (key.isDown){
			eventHandler.publish(null,null,null, function shiftKeyPress(){ });
			var check = setInterval(function(){
				if (!key.isDown){
					eventHandler.publish(null,null,null, function shiftKeyReleased(){ });
					clearInterval(check);
				}
			},250);
		}
	});
};

this.reset = function() {
	phaserGame.input.moveCallbacks.length =0;;
	phaserGame.input.keyboard.stop();
	phaserGame.input.keyboard.start();
};