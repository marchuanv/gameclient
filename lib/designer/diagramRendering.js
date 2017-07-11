function DiagramRendering(canvas, nodes, links) {
	
	this.context = canvas.getContext('2d');
	this.canvas = canvas;

	this.nodes = nodes;
	this.links = links;
	this.caretVisible = true;
	this.caretTimer = null;

	this.beginPath = function(){
		this.context.beginPath();
	};

	this.arc = function(a, b, c, d, e){
		this.context.arc(a, b, c, d, e);
	};

	this.stroke = function(){
		this.context.stroke();
	};

	this.fill = function(){
		this.context.fill();
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
		this.context.moveTo(x, y);
	};

	this.lineTo = function(x, y){
		this.context.lineTo(x, y);
	};
};

DiagramRendering.prototype.resetCaret = function(callback){
	clearInterval(this.caretTimer);
	var thisInstance = this;
	this.caretTimer = setInterval(function () {
		thisInstance.caretVisible = !thisInstance.caretVisible; 
		callback.call(thisInstance);
	}, 500);
	this.caretVisible = true;
}

DiagramRendering.prototype.render = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.save();
	this.context.translate(0.5, 0.5);
	for(var i = 0; i < this.nodes.length; i++) {
		this.context.lineWidth = 1;
		this.context.fillStyle = this.context.strokeStyle = (this.nodes[i].isSelected) ? 'blue' : 'black';
		this.nodes[i].draw();
	}
	for(var i = 0; i < this.links.length; i++) {
		this.context.lineWidth = 1;
		this.context.fillStyle = this.context.strokeStyle = (this.links[i].isSelected) ? 'blue' : 'black';
		this.links[i].draw();
	}
	this.context.restore();
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