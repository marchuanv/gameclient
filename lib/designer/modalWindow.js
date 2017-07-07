function ModalWindow() {

	var body = document.getElementsByTagName('body')[0];

	var modal = document.createElement('div');
	modal.setAttribute('class',"modal fade");
	modal.setAttribute('id',"modalWindow");
	
	modal.setAttribute('role',"dialog");

	var modalDialog = document.createElement('div');
	modalDialog.setAttribute('class',"modal-dialog");
	
	var modalDialogContent = document.createElement('div');
	modalDialogContent.setAttribute('class',"modal-content");

	var modalDialogHead = document.createElement('div');
	modalDialogHead.setAttribute('class',"modal-header");
	
	var modalDialogTitle = document.createElement('h4');
	
	modalDialogHead.appendChild(modalDialogTitle);

	var modalDialogSubTitle = document.createElement('h6');
	
	modalDialogHead.appendChild(modalDialogSubTitle);

	var modalDialogBody = document.createElement('div');
	modalDialogBody.setAttribute('class',"modal-body");
	
	var modalDialogFooter = document.createElement('div');
	modalDialogFooter.setAttribute('class',"modal-footer");

	modalDialogContent.appendChild(modalDialogHead);
	modalDialogContent.appendChild(modalDialogBody);
	modalDialogContent.appendChild(modalDialogFooter);
	modalDialog.appendChild(modalDialogContent);

	modal.appendChild(modalDialog);
	body.appendChild(modal);

	this.setTitle = function(title, subTitle){
		modalDialogSubTitle.setAttribute('class',"modal-title");
		modalDialogTitle.setAttribute('class',"modal-title");
		modalDialogTitle.innerText = title;
		modalDialogSubTitle.innerText = subTitle;
	}

	this.clear = function(){ // clear elements
		modalDialogBody.innerHTML = "";
		modalDialogFooter.innerHTML = "";
	};

	this.show = function(){
		$('#modalWindow').modal('show');
	};

	this.addToBody = function(element){
		modalDialogBody.appendChild(element);
	};

	this.addToFooter = function(element){
		modalDialogFooter.appendChild(element);
	};

	window.modalWindow = this;
};