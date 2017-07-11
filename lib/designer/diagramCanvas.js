function DiagramCanvas() {

	var nodes = [];
	var links = [];
	var mousePos = null;
	var cursorVisible = true;
	var snapToPadding = 6; // pixels
	var currentLink = null; // a Link
	var movingObject = false;
	var originalClick;
	var shift = false;
	var width = window.innerWidth;
	var height = window.innerHeight;
	var elements = [];
	var caretTimer;
	this.caretVisible = true;
	var startCoords = {x: 0, y: 0};
	var last = {x: 0, y: 0};
	
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
		enumerate(elements, this, function(_element,  cbCondition, cbRemoveElement){
			diagramBody.removeChild(_element);
			if (remove == true){
				cbRemoveElement();
			}
		});
		diagramBody.removeChild(canvas);
	};

	this.show = function(){
		diagramBody.appendChild(canvas);
		enumerate(elements, this, function(_element){
			diagramBody.appendChild(_element);
		});
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

	diagramRendering.render();

	function canvasHasFocus() {
		return document.activeElement == canvas;
	}

	function resetCaret() {
		clearInterval(caretTimer);
		caretTimer = setInterval(function () {
			diagramCanvasInstance.caretVisible = !diagramCanvasInstance.caretVisible; 
			diagramRendering.render();
		}, 500);
		caretVisible = true;
	};

	function selectObject(documentEvent) {
		var mouse = crossBrowserRelativeMousePos(documentEvent);
		var objectAtMousePos = selectObject(mouse.x, mouse.y);
		var x = objectAtMousePos.x;
		var y = objectAtMousePos.y;
		for(var i = 0; i < nodes.length; i++) {
			if(nodes[i].containsPoint(x, y)) {
				nodes[i].isSelected = true;
				return nodes[i];
			}else{
				nodes[i].isSelected = false;
			}
		};
		for(var i = 0; i < links.length; i++) {
			if(links[i].containsPoint(x, y)) {
				links[i].isSelected = true;
				return links[i];
			}else{
				links[i].isSelected = false;
			}
		};
		return null;
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


	canvas.ondblclick = function(e) {
		var selectedObject = selectObject(e);
		if(selectedObject == null) {
			var newNode = new Node(mouse.x, mouse.y, null, diagramRendering);
			nodes.push(newNode);
			resetCaret();
		} else if(selectedObject instanceof Node) {
			selectedObject.isAcceptState = !selectedObject.isAcceptState;
		}
		diagramRendering.render();
	};


	canvas.onclick = function(e) {
		console.log("CLICK EVENT");
		var selectedObject = selectObject(e);
		if (diagramCanvasInstance.selectedNode && selectedObject instanceof Node){
			diagramCanvasInstance.selectedNode.call(diagramCanvasInstance, selectedObject);
			
		}else{
			diagramCanvasInstance.nodeLostFocus.call(diagramCanvasInstance);
		}
	};

	canvas.onmousedown = function(e) { // Are for links ONLY

		console.log("MOUSE DOWN EVENT");
		var selectedObject = selectObject(e);
		movingObject = false;
		originalClick = mouse;

		startCoords = { x: e.pageX - this.offsetLeft - last.x,
                   y: e.pageY - this.offsetTop - last.y};

		if(shift) {
			if (selectedObject != null && selectedObject instanceof Node){
				currentLink = new SelfLink(selectedObject, mouse, null , diagramRendering);
				resetCaret();
			} else if (selectedObject instanceof Link || selectedObject instanceof TemporaryLink) {
				movingObject = true;
				deltaMouseX = deltaMouseY = 0;
				resetCaret();
			} else if (selectedObject == null){
				currentLink = new TemporaryLink(mouse, mouse, null, diagramRendering);	
			}
		}else{
			movingObject = true;
			deltaMouseX = deltaMouseY = 0;
			resetCaret();
		}

		diagramRendering.render();

		if(canvasHasFocus()) {
			// disable drag-and-drop only if the canvas is already focused
			return false;
		} else {
			// otherwise, let the browser switch the focus away from wherever it was
			resetCaret();
			return true;
		}
	};

	canvas.onmousemove = function(e) {

		mousePos = {x: e.clientX, y: e.clientY };
		var selectedObject = getSelectObject();

		if(currentLink != null) {
			var targetNode = selectObject(mouse.x, mouse.y);
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

		// if(selectedObject != null){
			
		// 	resetCaret();
		// 	var xVal = e.pageX - this.offsetLeft;
		// 	var yVal = e.pageY - this.offsetTop;
		// 	var context = canvas.getContext('2d');
		// 	context.setTransform(1, 0, 0, 1,
		//                          xVal - startCoords.x,
		//                          yVal - startCoords.y);
		// 	diagramRendering.render();

		// }

		if(movingObject) {
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
		var selectedObject = getSelectedObject();
		if (movingObject && selectedObject instanceof Node && diagramCanvasInstance.nodeMoveEnd){
			diagramCanvasInstance.nodeMoveEnd.call(diagramCanvasInstance);
		}
		movingObject = false;
		if(currentLink != null) {
			if(!(currentLink instanceof TemporaryLink)) {
				selectedObject = currentLink;
				links.push(currentLink);
				if (diagramCanvasInstance.linkCreated){
					if (selectedObject.nodeA || selectedObject.nodeB || selectedObject.node){
						diagramCanvasInstance.linkCreated.call(diagramCanvasInstance, currentLink);
					}
				}
				resetCaret();
			}
			currentLink = null;
			diagramRendering.render();
		}
	};

	document.onkeydown = function(e) {
		var key = crossBrowserKey(e);
		var selectedObject = getSelectedObject();
		if(key == 16) {
			shift = true;
		} else if(!canvasHasFocus()) {
			// don't read keystrokes when other things have focus
			return true;
		} else if(key == 8) { // backspace key
			if(selectedObject != null && 'text' in selectedObject) {
				selectedObject.text = selectedObject.text.substr(0, selectedObject.text.length - 1);
				resetCaret();
				diagramRendering.render();
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
				removeSelectedObjects();
				diagramRendering.render();
			}
		}
	};

	document.onkeyup = function(e) {
		var key = crossBrowserKey(e);

		if(key == 16) {
			shift = false;
		}
	};

	document.onkeypress = function(e) {
		var selectedObject = getSelectedObject();
		// don't read keystrokes when other things have focus
		var key = crossBrowserKey(e);
		if(!canvasHasFocus()) {
			// don't read keystrokes when other things have focus
			return true;
		} else if(key >= 0x20 && key <= 0x7E && !e.metaKey && !e.altKey && !e.ctrlKey && selectedObject != null && 'text' in selectedObject) {
			selectedObject.text += String.fromCharCode(key);
			resetCaret();
			diagramRendering.render();

			// don't let keys do their actions (like space scrolls down the page)
			return false;
		} else if(key == 8) {
			// backspace is a shortcut for the back button, but do NOT want to change pages
			return false;
		}
	};
	
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

	function output(text) {
		var element = document.getElementById('output');
		element.style.display = 'block';
		element.value = text;
	}

	function det(a, b, c, d, e, f, g, h, i) {
		return a*e*i + b*f*g + c*d*h - a*f*h - b*d*i - c*e*g;
	}

	function circleFromThreePoints(x1, y1, x2, y2, x3, y3) {
		var a = det(x1, y1, 1, x2, y2, 1, x3, y3, 1);
		var bx = -det(x1*x1 + y1*y1, y1, 1, x2*x2 + y2*y2, y2, 1, x3*x3 + y3*y3, y3, 1);
		var by = det(x1*x1 + y1*y1, x1, 1, x2*x2 + y2*y2, x2, 1, x3*x3 + y3*y3, x3, 1);
		var c = -det(x1*x1 + y1*y1, x1, y1, x2*x2 + y2*y2, x2, y2, x3*x3 + y3*y3, x3, y3);
		return {
			'x': -bx / (2*a),
			'y': -by / (2*a),
			'radius': Math.sqrt(bx*bx + by*by - 4*a*c) / (2*Math.abs(a))
		};
	}

	function fixed(number, digits) {
		return number.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '');
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

	function removeSelectedObjects(){
		for (var i = nodes.length - 1; i >= 0; i--) {
			if (nodes[i].isSelected){
				nodes[i].isSelected = false;
			}
		};
		for (var i = links.length - 1; i >= 0; i--) {
			if (links[i].isSelected){
				links[i].isSelected = false;
			}
		};
	};

};