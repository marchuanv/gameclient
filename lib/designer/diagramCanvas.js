function DiagramCanvas() {

	var nodes = [];
	var links = [];
	var mousePos = null;
	var cursorVisible = true;
	var snapToPadding = 6; // pixels
	var currentLink = null; // a Link
	var originalClick;
	var shift = false;
	var elements = [];

	window.diagramCanvas = this;
	
	var body = document.getElementsByTagName("body")[0];

	var diagramContainer = document.createElement("div");
	diagramContainer.setAttribute("class","diagramCanvas");
	body.appendChild(diagramContainer);

	var diagramHeader = document.createElement("div");
	diagramHeader.setAttribute("class","diagramHeader");

	var diagramBody = document.createElement("div");
	diagramBody.setAttribute("class","diagramBody");

	var diagramFooter = document.createElement("div");
	diagramFooter.setAttribute("class","diagramFooter");

	diagramContainer.appendChild(diagramHeader);
	diagramContainer.appendChild(diagramBody);
	diagramContainer.appendChild(diagramFooter);

	var canvas = document.createElement('canvas');
	canvas.setAttribute("id","diagramCanvas");
	canvas.setAttribute("tabindex","1");
	canvas.height = diagramBody.clientHeight;
	canvas.width = diagramBody.clientWidth;
	diagramBody.appendChild(canvas);

	var diagramRendering = new DiagramRendering(canvas, nodes, links);
	var diagramCanvasInstance = this;
	this.linkCreated = null; // event
	this.selectedNode = null; //event
	this.nodeLostFocus = null; //event
	this.nodeDeleted = null; //event
	this.nodeMoveStart = null;
	this.nodeMoveEnd = null;

	this.getMousePos = function(){
		return mousePos;
	};

	this.reset = function(){
		links.length = 0;
		nodes.length = 0
		diagramRendering.render();
	};

	this.drawNodes = function(_nodes){
		for (var i = _nodes.length - 1; i >= 0; i--) {
			var node = _nodes[i];
			var nodeA = new Node(node.x, node.y, node.Id, diagramRendering);
			nodeA.isAcceptState = node.isAcceptState;
			nodeA.text = node.text;
			nodes.push(nodeA);         
		};
		diagramRendering.render();
	};

	this.drawLinks = function(_nodeLinks){

		for (var x = _nodeLinks.length - 1; x >= 0; x--) {
			
			var _nodeLink = _nodeLinks[x];
			var link = null;
			var nodeA = null;
			var nodeB = null;
			var oneNode = null;
			
			for (var i = nodes.length - 1; i >= 0; i--) {
				var node = nodes[i];
				if (_nodeLink.node == node.Id){
					oneNode = node;
				}else if(_nodeLink.nodeA == node.Id ){
					nodeA = node;
				}else if (_nodeLink.nodeB == node.Id ){
					nodeB = node;
				}
			};

			if(_nodeLink.type == 'SelfLink') {
				link = new SelfLink(oneNode, null, null, diagramRendering);
				link.anchorAngle = _nodeLink.anchorAngle;
				link.text = _nodeLink.text;
			} else if(_nodeLink.type == 'StartLink') {
				link = new StartLink(oneNode, diagramRendering);
				link.deltaX = _nodeLink.deltaX;
				link.deltaY = _nodeLink.deltaY;
				link.text = _nodeLink.text;
			} else if(_nodeLink.type == 'Link') {
				link = new Link(nodeA, nodeB, null, diagramRendering);
				link.parallelPart = _nodeLink.parallelPart;
				link.perpendicularPart = _nodeLink.perpendicularPart;
				link.text = _nodeLink.text;
				link.lineAngleAdjust = _nodeLink.lineAngleAdjust;
			}
			if(link != null) {
				links.push(link);
			}
		};

		diagramRendering.render();
	};

	this.hide = function(remove){
		diagramContainer.style.display = "none";
	};

	this.show = function(){
		diagramContainer.style.display = "";
	};

	this.getSelectedNode = function(cbSelectedObj){
		cbSelectedObj(getSelectedObject());
	};

	this.getNodes = function(cbComplete){
		cbComplete(nodes);
	};

	this.getNodeLinks = function(cbComplete){
		var nodeLinks = [];
		for(var i = 0; i < links.length; i++) {
			var link = links[i];
			var backupLink = null;
			if(link instanceof SelfLink) {
				backupLink = {
					'type': 'SelfLink',
					'node': link.node.Id,
					'text': link.text,
					'anchorAngle': link.anchorAngle,
					'Id': link.Id,
				};
			} else if(link instanceof StartLink) {
				backupLink = {
					'type': 'StartLink',
					'node': link.node.Id,
					'text': link.text,
					'deltaX': link.deltaX,
					'deltaY': link.deltaY,
					'Id': link.Id,
				};
			} else if(link instanceof Link) {
				backupLink = {
					'type': 'Link',
					'nodeA': link.nodeA.Id,
					'nodeB': link.nodeB.Id,
					'text': link.text,
					'lineAngleAdjust': link.lineAngleAdjust,
					'parallelPart': link.parallelPart,
					'perpendicularPart': link.perpendicularPart,
					'Id': link.Id,
				};
			}
			nodeLinks.push(backupLink);
		}
		cbComplete(nodeLinks);
	};

	this.addToHeader = function(element){
		elements.push(element);
		diagramHeader.appendChild(element);
	};

	this.addToBody = function(element){
		elements.push(element);
		diagramBody.appendChild(element);
	};

	this.addToFooter = function(element){
		elements.push(element);
		diagramFooter.appendChild(element);
	};

	canvas.onblur = function(){
		console.log("canvas lost focus");
	};

	canvas.hasFocus = function(){
		return document.activeElement == canvas;
	};

	canvas.ondblclick = function(e) {
		clearSelectedObjects();
		var selectedObject = selectObject(e);
		var mouse = crossBrowserRelativeMousePos(e);
		if(selectedObject == null) {
			var newNode = new Node(mouse.x, mouse.y, null, diagramRendering);
			newNode.isSelected = true;
			nodes.push(newNode);
			diagramRendering.resetCaret(function(){
				diagramRendering.render();
			});
		} else if(selectedObject instanceof Node) {
			selectedObject.isAcceptState = !selectedObject.isAcceptState;
		}
		diagramRendering.render();
	};

	canvas.onclick = function(e) {
		clearSelectedObjects();
		var selectedObject = selectObject(e);
		diagramCanvasInstance.nodeLostFocus.call(diagramCanvasInstance);
		if (selectedObject){
			if (diagramCanvasInstance.selectedNode && selectedObject instanceof Node){
				diagramCanvasInstance.selectedNode.call(diagramCanvasInstance, selectedObject);
			}
		}
		diagramRendering.resetCaret(function(){
			clearMovedObjects();
			diagramRendering.render();
		});
	};

	canvas.onmousedown = function(e) { // Are for links ONLY
		clearSelectedObjects();
		var selectedObject = selectObject(e);
		var mouse = crossBrowserRelativeMousePos(e);
		originalClick = mouse;

		if(shift) {
			if (selectedObject != null && selectedObject instanceof Node){
				currentLink = new SelfLink(selectedObject, mouse, null , diagramRendering);
				diagramRendering.resetCaret(function(){
					diagramRendering.render();
				});
			} else if (selectedObject instanceof Link || selectedObject instanceof TemporaryLink) {
				diagramRendering.resetCaret(function(){
					diagramRendering.render();
				});
			} else if (selectedObject == null){
				currentLink = new TemporaryLink(mouse, mouse, null, diagramRendering);	
			}
		}else{
			if (selectedObject != null){
				moveObject(selectedObject.Id);
			}
			diagramRendering.resetCaret(function(){
				diagramRendering.render();
			});
		}

		diagramRendering.render();

		if(canvas.hasFocus()) {
			// disable drag-and-drop only if the canvas is already focused
			return false;
		} else {
			// otherwise, let the browser switch the focus away from wherever it was
			diagramRendering.resetCaret(function(){
				diagramRendering.render();
			});
			return true;
		}
	};

	canvas.onmousemove = function(e) {
		mousePos = {x: e.clientX, y: e.clientY };
		var selectedObject = getSelectedObject();
		var mouse = crossBrowserRelativeMousePos(e);
		if(currentLink != null) {
			clearSelectedObjects();
			var targetNode = selectObject(e);
			if(!(targetNode instanceof Node)) {
				targetNode = null;
			}
			if(selectedObject == null) {
				if(targetNode != null) {
					currentLink = new StartLink(targetNode, originalClick, diagramRendering);
				} else {
					currentLink = new TemporaryLink(originalClick, mouse, null, diagramRendering);
				}
			} else {

				if(targetNode == selectedObject) {
					currentLink = new SelfLink(selectedObject, mouse, null, diagramRendering);
				} else if(targetNode != null) {
					currentLink = new Link(selectedObject, targetNode, null, diagramRendering);
				} else {
					currentLink = new TemporaryLink(selectedObject.closestPointOnCircle(mouse.x, mouse.y), mouse, null, diagramRendering);
				}
			}
			diagramRendering.render();
		}
		if(selectedObject && selectedObject.isMoving) {
			selectedObject.setAnchorPoint(mouse.x, mouse.y);
			if(selectedObject instanceof Node) {
				snapNode(selectedObject);
				if (diagramCanvasInstance.nodeMoveStart){
					diagramCanvasInstance.nodeMoveStart.call(diagramCanvasInstance);
				}
			}
			diagramRendering.render();
		}
	};

	canvas.onmouseup = function(e) {
		singleClick = false;
		clearMovedObjects();
		var selectedObject = getSelectedObject();
		if (selectedObject && selectedObject.isMoving && selectedObject instanceof Node && diagramCanvasInstance.nodeMoveEnd){
			diagramCanvasInstance.nodeMoveEnd.call(diagramCanvasInstance);
		}
		if(currentLink != null) {
			if(!(currentLink instanceof TemporaryLink)) {
				clearSelectedObjects();
				selectedObject = selectObject(e, currentLink.Id)
				links.push(currentLink);
				if (diagramCanvasInstance.linkCreated){
					if (selectedObject.nodeA || selectedObject.nodeB || selectedObject.node){
						diagramCanvasInstance.linkCreated.call(diagramCanvasInstance, currentLink);
					}
				}
				diagramRendering.resetCaret(function(){
					diagramRendering.render();
				});
			}
			currentLink = null;
			diagramRendering.render();
		}
	};

	canvas.onkeydown= function(e) {
		var key = crossBrowserKey(e);
		var selectedObject = getSelectedObject();

		if(key == 16) {
			shift = true;
		} else if(!canvas.hasFocus()) {
			// don't read keystrokes when other things have focus
			return true;
		} else if(key == 8) { // backspace key
			if(selectedObject != null && 'text' in selectedObject) {
				selectedObject.text = selectedObject.text.substr(0, selectedObject.text.length - 1);
				diagramRendering.resetCaret(function(){
					diagramRendering.render();
				});
			}

			// backspace is a shortcut for the back button, but do NOT want to change pages
			return false;
		} else if(key == 46) { // delete key
			if(selectedObject != null) {
				for(var i = 0; i < nodes.length; i++) {
					if(nodes[i] == selectedObject) {
						nodes.splice(i--, 1);
					}
				}
				for(var i = 0; i < links.length; i++) {
					if(links[i] == selectedObject || links[i].node == selectedObject || links[i].nodeA == selectedObject || links[i].nodeB == selectedObject) {
						links.splice(i--, 1);
					}
				}
				if (diagramCanvasInstance.nodeDeleted){
					if (selectedObject.nodeA || selectedObject.nodeB || selectedObject.node){
						return;
					}
					diagramCanvasInstance.nodeDeleted.call(diagramCanvasInstance, selectedObject);
				}
				clearSelectedObjects();
				diagramRendering.render();
			}
		} else if(key >= 0x20 && key <= 0x7E && key != 46 && !e.metaKey && !e.altKey && !e.ctrlKey && selectedObject != null && 'text' in selectedObject) {
			selectedObject.text += String.fromCharCode(key);
			diagramRendering.resetCaret(function(){
				diagramRendering.render();
			});
			// don't let keys do their actions (like space scrolls down the page)
			return false;
		}
	};

	canvas.onkeyup = function(e) {
		var key = crossBrowserKey(e);
		if(key == 16) {
			shift = false;
		}
	};

	diagramRendering.render();

	function selectObject(documentEvent, objectId) {
		var mouse = crossBrowserRelativeMousePos(documentEvent);
		var x = mouse.x;
		var y = mouse.y;
		for(var i = 0; i < nodes.length; i++) {
			if(nodes[i].containsPoint(x, y) || objectId == nodes[i].Id) {
				nodes[i].isSelected = true;
				return nodes[i];
			}
		};
		for(var i = 0; i < links.length; i++) {
			if(links[i].containsPoint(x, y) || objectId == links[i].Id) {
				links[i].isSelected = true;
				return links[i];
			}
		};
	}

	function moveObject(objectId) {
		for(var i = 0; i < nodes.length; i++) {
			if(objectId == nodes[i].Id) {
				nodes[i].isMoving = true;
				return nodes[i];
			}
		};
		for(var i = 0; i < links.length; i++) {
			if(objectId == links[i].Id) {
				links[i].isMoving = true;
				return links[i];
			}
		};
	}

	function snapNode(node) {
		for (var i = 0; i < nodes.length; i++) {
			if(nodes[i] == node) continue;

			if(Math.abs(node.x - nodes[i].x) < snapToPadding) {
				node.x = nodes[i].x;
			}

			if(Math.abs(node.y - nodes[i].y) < snapToPadding) {
				node.y = nodes[i].y;
			}
		}
	}

	function crossBrowserKey(e) {
		e = e || window.event;
		return e.which || e.keyCode;
	}

	function crossBrowserElementPos(e) {
		e = e || window.event;
		var obj = e.target || e.srcElement;
		var x = 0, y = 0;
		while(obj.offsetParent) {
			x += obj.offsetLeft;
			y += obj.offsetTop;
			obj = obj.offsetParent;
		}
		return { 'x': x, 'y': y };
	}

	function crossBrowserMousePos(e) {
		e = e || window.event;
		return {
			'x': e.pageX || e.clientX + diagramBody.scrollLeft + document.documentElement.scrollLeft,
			'y': e.pageY || e.clientY + diagramBody.scrollTop + document.documentElement.scrollTop,
		};
	}

	function crossBrowserRelativeMousePos(e) {
		var element = crossBrowserElementPos(e);
		var mouse = crossBrowserMousePos(e);
		return {
			'x': mouse.x - element.x,
			'y': mouse.y - element.y
		};
	}

	function getSelectedObject(){
		for (var i = nodes.length - 1; i >= 0; i--) {
			if (nodes[i].isSelected){
				return nodes[i];
			}
		};
		for (var i = links.length - 1; i >= 0; i--) {
			if (links[i].isSelected){
				return links[i];
			}
		};
	}

	function clearSelectedObjects(){
		for (var i = nodes.length - 1; i >= 0; i--) {
			nodes[i].isSelected = false;
		};
		for (var i = links.length - 1; i >= 0; i--) {
			links[i].isSelected = false;
		};
	};

	function clearMovedObjects(){
		for (var i = nodes.length - 1; i >= 0; i--) {
			nodes[i].isMoving = false;
		};
		for (var i = links.length - 1; i >= 0; i--) {
			links[i].isMoving = false;
		};
	};

};