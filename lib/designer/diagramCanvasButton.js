function DiagramCanvasButton(name) {

	var button = document.createElement('button');
	button.setAttribute('type',"button");
	button.setAttribute('class',"btn btn-default");
	button.setAttribute('id',name);
	button.value = name;
	button.innerText = name;
	button.style.height = "auto";
	button.style.width = "auto";
	button.style.position = "relative";

	this.subscribe = function(callback){
		var eventName = getFunctionName(callback);
		button[eventName] = callback;
	};

	window.diagramCanvas.addToFooter(button);
};