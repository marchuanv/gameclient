function ModalWindowCheckBox(name) {
	
	var checkbox = document.createElement('input');
	checkbox.setAttribute('type',"checkbox");
	checkbox.setAttribute('id',name);
	checkbox.style.left = "60px";
	checkbox.height = "auto";
	checkbox.width = "auto";
	checkbox.style.position = "absolute";
	checkbox.style.left = "18px";
	
	var checkboxLabel = document.createElement('label');
	checkboxLabel.innerText = name;
	checkboxLabel.appendChild(checkbox);
	checkboxLabel.height = "auto";
	checkboxLabel.width = "auto";
	checkboxLabel.style.position = "relative";

	var checkboxContainer = document.createElement('div');
	checkboxContainer.appendChild(checkboxLabel);
	checkboxContainer.setAttribute('class',"checkbox");
	checkboxContainer.height = "auto";
	checkboxContainer.width = "auto";
	checkboxContainer.style.position = "relative";
	
	this.isChecked = function(){
		return checkbox.checked;
	};

	this.subscribe = function(callback){
		var eventName = getFunctionName(callback);
		checkbox[eventName] = callback;
	};

	window.modalWindow.addToBody(checkboxContainer);
};