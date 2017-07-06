function ModalWindowTextBox(name, isPwd) {
	var inputField = document.createElement('input');
	inputField.setAttribute('class',"form-control");
	if (isPwd){
		inputField.setAttribute('id',"pwd");
		inputField.setAttribute("placeholder","enter github password");
		inputField.setAttribute('type',"password");
	}else{
		inputField.setAttribute('id',name);
		inputField.setAttribute('type',"text");
		inputField.setAttribute("placeholder","enter github username");
	}
	this.getValue = function(){
		return inputField.value;
	};
	this.setValue = function(value){
		inputField.value = value;
	};
	window.modalWindow.addToBody(inputField);
};