function PreloaderSceneConfig(){ 
	return [
		{
			"anchor": false,
			"enabled": true,
			"hasAnimations": true,
			"height": 600,
			"name": "preloader",
			"width": 800,
			"xPosition": 0,
			"xScale": 1,
			"yPosition": 0,
			"yScale": 1,
			"type": "sprite | animation"
		},
		{
			"anchor": true,
			"enabled": true,
			"hasAnimations": false,
			"height": 40,
			"name": "cursor",
			"width": 40,
			"xPosition": 0,
			"xScale": 1,
			"yPosition": 0,
			"yScale": 1,
			"type": "image"
		}
	];
}
module.exports=PreloaderSceneConfig;