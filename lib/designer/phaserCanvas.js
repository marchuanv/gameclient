function PhaserCanvas() {

	var body = document.getElementsByTagName("body")[0];
	var phaserCanvas = document.createElement("div");
	
	window.phaserCanvas = this;

	this.hide = function(){
		phaserCanvas.style.display = "none";
	};

	this.show = function(){
		setTimeout(function(){
			var canvas = document.getElementsByTagName("canvas")[0];
			canvas.setAttribute("id","phaserCanvas");
			canvas.setAttribute("tabindex","1");
			canvas.style.display = "";
			
			canvas.focus();
		},1000);
	};

	this.setContextMenu = function(element){
		phaserCanvas.appendChild(element);	};

};