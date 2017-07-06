function TextEditor(name, parentElement, rows, cols) {
	var editor = document.createElement('textarea');
	editor.setAttribute('class',"form-control");
	editor.setAttribute('Id',name);
	editor.style.height = "auto";
	editor.style.width = "auto";
	editor.style.position = "relative";
	if (!rows || !cols){
		editor.rows = 26;
		editor.cols = 104;
	}else{
		editor.rows = rows;
		editor.cols = cols;
	}
	if (parentElement){
		parentElement.appendChild(editor);
	}

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

	this.element = editor;
};