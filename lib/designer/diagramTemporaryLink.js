function TemporaryLink(from, to, Id, renderer) {
	this.from = from;
	this.to = to;
	this.renderer = renderer;
	this.isSelected = false;
	if (!Id){
		this.Id = generateGUID();
	}else{
		this.Id = Id;
	}
}

TemporaryLink.prototype.draw = function(c) {
	
	// draw the line
	this.renderer.beginPath();
	this.renderer.moveTo(this.to.x, this.to.y);
	this.renderer.lineTo(this.from.x, this.from.y);
	this.renderer.stroke();

	// draw the head of the arrow
	this.this.renderer.drawArrow(this.to.x, this.to.y, Math.atan2(this.to.y - this.from.y, this.to.x - this.from.x));
};