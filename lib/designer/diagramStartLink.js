function StartLink(node, start, Id, renderer) {
	this.node = node;
	this.deltaX = 0;
	this.deltaY = 0;
	this.text = '';
	if (!Id){
		this.Id = generateGUID();
	}else{
		this.Id = Id;
	}
	if(start) {
		this.setAnchorPoint(start.x, start.y);
	}
	this.renderer = renderer;
	this.isSelected = false;
	this.hitTargetPadding = 6; // pixels
	this.snapToPadding = 6;
}

StartLink.prototype.setAnchorPoint = function(x, y) {
	this.deltaX = x - this.node.x;
	this.deltaY = y - this.node.y;

	if(Math.abs(this.deltaX) < this.snapToPadding) {
		this.deltaX = 0;
	}

	if(Math.abs(this.deltaY) < this.snapToPadding) {
		this.deltaY = 0;
	}
};

StartLink.prototype.getEndPoints = function() {
	var startX = this.node.x + this.deltaX;
	var startY = this.node.y + this.deltaY;
	var end = this.node.closestPointOnCircle(startX, startY);
	return {
		'startX': startX,
		'startY': startY,
		'endX': end.x,
		'endY': end.y,
	};
};

StartLink.prototype.draw = function() {
	var stuff = this.getEndPoints();

	// draw the line
	this.renderer.beginPath();
	this.renderer.moveTo(stuff.startX, stuff.startY);
	this.renderer.lineTo(stuff.endX, stuff.endY);
	this.renderer.stroke();

	// draw the text at the end without the arrow
	var textAngle = Math.atan2(stuff.startY - stuff.endY, stuff.startX - stuff.endX);
	this.renderer.drawText(this.text, stuff.startX, stuff.startY, textAngle, selectedObject == this);

	// draw the head of the arrow
	this.renderer.drawArrow(stuff.endX, stuff.endY, Math.atan2(-this.deltaY, -this.deltaX));
};

StartLink.prototype.containsPoint = function(x, y) {
	var stuff = this.getEndPoints();
	var dx = stuff.endX - stuff.startX;
	var dy = stuff.endY - stuff.startY;
	var length = Math.sqrt(dx*dx + dy*dy);
	var percent = (dx * (x - stuff.startX) + dy * (y - stuff.startY)) / (length * length);
	var distance = (dx * (y - stuff.startY) - dy * (x - stuff.startX)) / length;
	return (percent > 0 && percent < 1 && Math.abs(distance) < this.hitTargetPadding);
};