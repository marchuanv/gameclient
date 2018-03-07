function FlySceneConfig(){ 
	return [
		{
			"anchor": true,
			"enabled": true,
			"hasAnimations": false,
			"height": 40,
			"width": 40,
			"isStatic": true,
			"name": "cursor",
			"xPosition": 0,
			"yPosition": 0,
			"xScale": 1,
			"yScale": 1,
			"type": "image"
		},
		{
			"anchor": true,
			"enabled": true,
			"hasAnimations": true,
			"isStatic": true,
			"name": "fly",
			"height": 10,
			"width": 60,
			"xPosition": 300,
			"yPosition": 300,
			"xScale": 0.1,
			"yScale": 0.5,
			"type": "sprite | animation",
			"start": true,
			"score":1,
			"lowMoveFactor":20,
			"highMoveFactor":200
		},
		{
			"anchor": false,
			"enabled": true,
			"hasAnimations": false,
			"height": 600,
			"isStatic": true,
			"name": "flyBackground",
			"width": 800,
			"xPosition": 0,
			"xScale": 3,
			"yPosition": 0,
			"yScale": 3,
			"type": "image"
		},
		{
			"enabled": true,
			"name": "gameEndTimer",
			"totalTimeoutMilliseconds":120000,
			"xPosition": 20,
			"yPosition": 20,
			"xScale": 3,
			"yScale": 3,
			"repeat":false,
			"type": "text | timer"
		},
		{
			"enabled": true,
			"name": "flyMoveTimer",
			"totalTimeoutMilliseconds":1000,
			"xPosition": 20,
			"yPosition": 20,
			"xScale": 3,
			"yScale": 3,
			"repeat":true,
			"type": "timer"
		}
	];
}
module.exports=FlySceneConfig;