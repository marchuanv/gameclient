function DiagramRendering(canvas, nodes, links) {
	
	var context = canvas.getContext('2d');

	this.nodes = nodes;
	this.links = links;

	this.beginPath = function(){
		context.beginPath();
	};

	this.arc = function(a, b, c, d, e){
		context.arc(a, b, c, d, e);
	};

	this.stroke = function(){
		context.stroke();
	};

	this.fill = function(){
		context.fill();
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
		context.moveTo(x, y);
	};

	this.lineTo = function(x, y){
		context.lineTo(x, y);
	};

	this.drawText = function(text, x, y, angleOrNull, isSelected) {
		context.font = '20px "Times New Roman", serif';
		var width = context.measureText(text).width;

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
		if('advancedFillText' in context) {
			context.advancedFillText(text, text, x + width / 2, y, angleOrNull);
		} else {
			x = Math.round(x);
			y = Math.round(y);
			context.fillText(text, x, y + 6);
			if(isSelected && caretVisible && canvasHasFocus() && document.hasFocus()) {
				x += width;
				context.beginPath();
				context.moveTo(x, y - 10);
				context.lineTo(x, y + 10);
				context.stroke();
			}
		}
	};


	this.render = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.save();
		context.translate(0.5, 0.5);
		for(var i = 0; i < this.nodes.length; i++) {
			context.lineWidth = 1;
			context.fillStyle = context.strokeStyle = (this.nodes[i].isSelected) ? 'blue' : 'black';
			this.nodes[i].draw();
		}
		for(var i = 0; i < this.links.length; i++) {
			context.lineWidth = 1;
			context.fillStyle = context.strokeStyle = (this.links[i].isSelected) ? 'blue' : 'black';
			this.links[i].draw();
		}
		context.restore();
	}

};