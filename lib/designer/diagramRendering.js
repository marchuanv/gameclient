function DiagramRendering(canvas, nodes, links) {
	
	var _context = canvas.getContext('2d');
	this.context = _context;
	this.canvas = canvas;

	this.nodes = nodes;
	this.links = links;
	this.caretVisible = true;
	this.caretTimer = null;

	this.beginPath = function(){
		_context.beginPath();
	};

	this.closePath = function(){
		_context.closePath();
	};

	this.arc = function(a, b, c, d, e){
		_context.arc(a, b, c, d, e);
	};

	this.stroke = function(){
		_context.stroke();
	};

	this.fill = function(){
		_context.fill();
	};

	this.deltaX =-1;
	this.deltaY =-1;
	this.prevDeltaX=-1;
	this.prevDeltaY=-1;
	var hasUpdates = true;
	this.update = function(x,y){
		if (this.prevDeltaX == -1 || this.prevDeltaY == -1){
			this.prevDeltaX = x;
			this.prevDeltaY = y;
		}else{
			this.prevDeltaX = this.deltaX;
			this.prevDeltaY = this.deltaY;
		}
		this.deltaX = x;
		this.deltaY = y;
		hasUpdates = true;
	};
	
	this.drawArrow = function(x, y, angle) {
		var dx = Math.cos(angle);
		var dy = Math.sin(angle);
		this.beginPath();
		this.moveTo(x, y);
		this.lineTo(x - 8 * dx + 5 * dy, y - 8 * dy - 5 * dx);
		this.lineTo(x - 8 * dx - 5 * dy, y - 8 * dy + 5 * dx);
		this.fill();
	};

	this.moveTo = function(x, y){
		_context.moveTo(x, y);
	};

	this.lineTo = function(x, y){
		_context.lineTo(x, y);
	};

	var thisInstance = this;
	var prevY = 0;
	setInterval(function(){
		thisInstance.caretVisible = !thisInstance.caretVisible; 
		_context.clearRect(0, 0, canvas.width, canvas.height);
		_context.save();
		for(var i = 0; i < nodes.length; i++) {
			_context.lineWidth = 1;
			_context.fillStyle = _context.strokeStyle = (nodes[i].isSelected) ? 'blue' : 'black';
			if (hasUpdates){
				if (thisInstance.deltaY >= thisInstance.prevDeltaY){
					var newPos = (thisInstance.deltaY - thisInstance.prevDeltaY)*30;
					nodes[i].y += newPos;
				}else{
					var newPos =(thisInstance.prevDeltaY - thisInstance.deltaY)*30;
					nodes[i].y -= newPos;
				}
				if (thisInstance.deltaX >= thisInstance.prevDeltaX){
					var newPos = (thisInstance.deltaX- thisInstance.prevDeltaX)*30;
					nodes[i].x += newPos;
				}else{
					var newPos =(thisInstance.prevDeltaX - thisInstance.deltaX)*30;
					nodes[i].x -= newPos;
				}
			}
			nodes[i].draw();
		};
		for(var i = 0; i < links.length; i++) {
			_context.lineWidth = 1;
			_context.fillStyle = _context.strokeStyle = (links[i].isSelected) ? 'blue' : 'black';
			links[i].draw();
		};

	    hasUpdates  =false;
	   	_context.clip();//call the clip method so the next render is clipped in last path
	    _context.restore();
	}, 100);
};

DiagramRendering.prototype.resetCaret = function(callback){
	clearInterval(this.caretTimer);
	this.caretVisible = true;
	callback();
}

DiagramRendering.prototype.render = function() {
	
}

DiagramRendering.prototype.drawText = function(text, x, y, angleOrNull, isSelected) {
	this.context.font = '20px "Times New Roman", serif';
	var width = this.context.measureText(text).width;

	// center the text
	x -= width / 2;

	// position the text intelligently if given an angle
	if(angleOrNull != null) {
		var cos = Math.cos(angleOrNull);
		var sin = Math.sin(angleOrNull);
		var cornerPointX = (width / 2 + 5) * (cos > 0 ? 1 : -1);
		var cornerPointY = (10 + 5) * (sin > 0 ? 1 : -1);
		var slide = sin * Math.pow(Math.abs(sin), 40) * cornerPointX - cos * Math.pow(Math.abs(cos), 10) * cornerPointY;
		x += cornerPointX - sin * slide;
		y += cornerPointY + cos * slide;
	}

	// draw text and caret (round the coordinates so the caret falls on a pixel)
	if('advancedFillText' in this.context) {
		this.context.advancedFillText(text, text, x + width / 2, y, angleOrNull);
	} else {
		x = Math.round(x);
		y = Math.round(y);
		this.context.fillText(text, x, y + 6);
		if(isSelected && this.caretVisible && this.canvas.hasFocus() && document.hasFocus()) {
			x += width;
			this.context.beginPath();
			this.context.moveTo(x, y - 10);
			this.context.lineTo(x, y + 10);
			this.context.stroke();
		}
	}
};