function ModalWindowButton(name, isCloseModal) {
	
	var button = document.createElement('button');
	button.setAttribute('type',"button");
	button.setAttribute('class',"btn btn-default");
	button.setAttribute('id',name);
	if (isCloseModal){
		button.setAttribute('data-dismiss',"modal");
	}else{
		button.setAttribute('data-toggle',"modal");
		button.setAttribute('data-target',"#userModal");
	}
	
	button.value = name;
	button.innerText = name;
	button.style.height = "auto";
	button.style.width = "auto";
	button.style.position = "relative";

	this.subscribe = function(callback){
		var eventName = getFunctionName(callback);
		button[eventName] = callback;
	};

	window.modalWindow.addToFooter(button);
};