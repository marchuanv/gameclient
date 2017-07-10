function DiagramCanvasButton(name) {

	var button = document.createElement('button');
	button.setAttribute('type',"button");
	button.setAttribute('class',"btn btn-default diagramCanvasButton");
	button.setAttribute('id',name);
	button.value = name;
	button.innerText = name;

	this.subscribe = function(callback){
		var eventName = getFunctionName(callback);
		button[eventName] = callback;
	};

	window.diagramCanvas.addToHeader(button);
};