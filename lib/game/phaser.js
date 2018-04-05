function Phaser() {
	this.Game=function (width, height, type, title, callbacks) {
		callbacks.preload();

		this.inputEnabled=false;
		this.input={};
		this.input.enabled = true;
        this.add=null;
        this.load=null;
        this.time=null;
        this.state=null;
        this.world=null;
        this.stage=null;
        this.input=null;
        this.debug=null;
        this.camera=null;
        this.context=null;
        this.math=null;
        this.physics={};
       	this.sceneManager={};
       	this.sceneSelector={};
        this.physics.startSystem=function(){};
       	this.sceneSelector.getSelectedScene=function(){};
       	this.sceneManager.initialise=function(){};
	}
	this.CANVAS=function (){
	}
}
module.exports=Phaser;