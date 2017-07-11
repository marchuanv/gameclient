function Node(x, y, z, renderer) {
	this.x = x;
	this.y = y;
	this.mouseOffsetX = 0;
	this.mouseOffsetY = 0;
	this.isAcceptState = false;
	this.text = '';
	if (!z){
		this.Id = generateGUID();
	}else{
		this.Id = z;
	}
	this.renderer = renderer;
	this.isSelected = false;
	this.nodeRadius = 30;
	this.isMoving = false;

}

Node.prototype.setMouseStart = function(x, y) {
	this.mouseOffsetX = this.x - x;
	this.mouseOffsetY = this.y - y;
};

Node.prototype.setAnchorPoint = function(x, y) {
	this.x = x + this.mouseOffsetX;
	this.y = y + this.mouseOffsetY;
};

Node.prototype.draw = function() {
	// draw the circle
	this.renderer.beginPath();
	this.renderer.arc(this.x, this.y, this.nodeRadius, 0, 2 * Math.PI, false);
	this.renderer.stroke();

	// draw the text
	this.renderer.drawText(this.text, this.x, this.y, null, this.isSelected);

	// draw a double circle for an accept state
	if(this.isAcceptState) {
		this.renderer.beginPath();
		this.renderer.arc(this.x, this.y, this.nodeRadius - 6, 0, 2 * Math.PI, false);
		this.renderer.stroke();
		this.renderer.closePath();
	}
	this.renderer.closePath();
};

Node.prototype.closestPointOnCircle = function(x, y) {
	var dx = x - this.x;
	var dy = y - this.y;
	var scale = Math.sqrt(dx * dx + dy * dy);
	return {
		'x': this.x + dx * this.nodeRadius / scale,
		'y': this.y + dy * this.nodeRadius / scale,
	};
};

Node.prototype.containsPoint = function(x, y) {
	return (x - this.x)*(x - this.x) + (y - this.y)*(y - this.y) < this.nodeRadius*this.nodeRadius;
};
