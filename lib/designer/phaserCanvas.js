function PhaserCanvas() {

	var body = document.getElementsByTagName("body")[0];
	var phaserCanvas = document.createElement("div");
	phaserCanvas.setAttribute("class","phaserCanvas");
	body.appendChild(phaserCanvas);
	
	window.phaserCanvas = this;

	this.hide = function(){
		phaserCanvas.style.display = "none";
	};

	this.show = function(){
		var canvas = document.getElementsByTagName("canvas")[1];
		canvas.style.display = "";
		phaserCanvas.style.display = "";
	};

	this.setContextMenu = function(element){
		phaserCanvas.appendChild(element);
	};
};