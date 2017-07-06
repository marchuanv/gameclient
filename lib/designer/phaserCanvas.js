function PhaserCanvas() {

	var elements = [];
	var body = document.getElementsByTagName("body")[0];
	var head = document.getElementsByTagName('head')[0];
	
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "http://"+window.location.host+"/external/phaser.js";
	
	window.phaserCanvas = this;

	this.hide = function(){
		enumerate(elements, this, function(_element,  cbCondition, cbRemoveElement){
			body.removeChild(_element);
			cbRemoveElement();
		},function(){
			var canvas = body.getElementsByTagName("canvas")[0];
			head.removeChild(script);
			body.removeChild(canvas);
		});
	};

	this.load = function(){
		head.appendChild(script);
	};

	this.show = function(){
		enumerate(elements, this, function(_element){
			body.appendChild(_element);
		});
	};

	this.addToFooter = function(element){
		elements.push(element);
		body.appendChild(element);
	};
};