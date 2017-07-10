function DiagramCanvasContextMenu() {

	var list = document.createElement('ul');
	list.setAttribute('class',"diagramCanvasContextMenu");
	// list.setAttribute('class',"list-group diagramCanvasContextMenu");
	list.setAttribute('id',"diagramCanvasContextMenu");

	this.addMenuItem = function(itemName, callback){
		var listItem = document.createElement('div');
		var listItemBtn = document.createElement('input');
		listItemBtn.setAttribute('type',"button");
		listItemBtn.setAttribute('class',"btn btn-default diagramCanvasContextMenuItem");
		listItemBtn.value = itemName;
		listItemBtn.onclick = callback;
		listItem.appendChild(listItemBtn);
		list.appendChild(listItem);
	};

	this.show = function(){
		var container = $('#diagramCanvasContextMenu');
		var fields = $('.diagramCanvasContextMenuItem');
		var width = container.width(); 
		var height = container.height();
    	var angle = 0;
    	var radius = 120;
    	var step = (2*Math.PI) / fields.length;
		fields.each(function() {
		    var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2);
		    var	y = Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2);
		    $(this).css({
		        left: x + 'px',
		        top: y + 'px'
		    });
		    angle += step;
		});
	};
	
	this.centreToMouse = function(xPos, yPos){
		var mousePos = diagramCanvas.getMousePos();
		list.style.left = mousePos.x-10;
		list.style.top = mousePos.y-45;
	};
	this.hide = function(){
		list.style.left = -9999;
		list.style.top = -9999;
	}

	window.diagramCanvas.addToBody(list);
};