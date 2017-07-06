function DiagramCanvasContextMenu() {

	var list = document.createElement('ul');
	list.setAttribute('class',"list-group");
	list.setAttribute('id',"diagramContextMenu");
	list.style.height = "auto";
	list.style.width = "auto";
	list.style.position = "absolute";
	list.style.float="left";
	list.style.left = -150;
	list.style.top = -150;

	this.addMenuItem = function(itemName, callback){
		var listItem = document.createElement('li');
		var listItemBtn = document.createElement('input');
		listItemBtn.setAttribute('class',"btn btn-default");
		listItemBtn.value = itemName;
		listItemBtn.onclick = callback;
		listItem.appendChild(listItemBtn);
		list.appendChild(listItem);
	};
	
	this.moveToMouse = function(xPos, yPos){
		list.style.left = xPos;
		list.style.top = yPos;
	};
	this.hide = function(){
		list.style.left = -150;
		list.style.top = -150;
	}

	window.diagramCanvas.addContextMenu(list);
};