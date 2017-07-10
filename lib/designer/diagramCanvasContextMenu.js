function DiagramCanvasContextMenu() {

	var list = document.createElement('ul');
	list.setAttribute('class',"list-group diagramCanvasContextMenu");
	list.setAttribute('id',"diagramCanvasContextMenu");

	this.addMenuItem = function(itemName, callback){
		var listItem = document.createElement('li');
		var listItemBtn = document.createElement('input');
		listItemBtn.setAttribute('class',"btn btn-default diagramCanvasContextMenuItem");
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

	window.diagramCanvas.addToBody(list);
};