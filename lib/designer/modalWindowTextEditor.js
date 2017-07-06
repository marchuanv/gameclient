function ModalWindowTextEditor(name) {

	var editor = document.createElement('textarea');
	editor.setAttribute("class","form-control");
	editor.setAttribute('id',name);
	editor.style.height = "50%";
	editor.style.width = "100%";
	editor.style.position = "relative";

	var thisInstance = this;
	this.loseFocus = null;

	editor.onblur = function(){
		if (thisInstance.loseFocus){
			thisInstance.loseFocus.call(editor);
		}
	};
	
	this.populate = function(serialisableObject){
		editor.value = JSON.stringify(serialisableObject, null, 4);
	};

	this.getValue = function(){
		return editor.value;
	};

	this.clear = function(){
		editor.value = "";
	};

	this.focus = function(){
		editor.focus();
	};

	window.modalWindow.addToBody(editor);
};