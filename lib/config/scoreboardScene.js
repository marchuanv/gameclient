function ScoreboardScene(){ return
	`[
		{
			"anchor": true,
			"enabled": true,
			"hasAnimations": false,
			"height": 40,
			"width": 40,
			"isStatic": false,
			"name": "cursor",
			"xPosition": 0,
			"xScale": 1,
			"yPosition": 0,
			"yScale": 1,
			"type": "image"
		},
		{
			"anchor": false,
			"enabled": true,
			"hasAnimations": false,
			"height": 50,
			"isStatic": true,
			"name": "scoreboardHeading",
			"width": 170,
			"xPosition": 300,
			"xScale": 1,
			"yPosition": 100,
			"yScale": 1,
			"type": "image"
		},
		{
			"anchor": false,
			"enabled": true,
			"hasAnimations": false,
			"height": 50,
			"isStatic": true,
			"name": "playerScore",
			"width": 400,
			"xPosition": 400,
			"xScale": 1,
			"yPosition": 180,
			"yScale": 1,
			"type": "sprite | image"
		},
		{
			"anchor": false,
			"enabled": true,
			"hasAnimations": false,
			"height": 50,
			"isStatic": true,
			"name": "playerScoreText",
			"width": 350,
			"xPosition": 200,
			"xScale": 0.8,
			"yPosition": 170,
			"yScale": 0.8,
	      	"type": "text"
		},
		{
			"anchor": false,
			"enabled": true,
			"hasAnimations": true,
			"height": 50,
			"isStatic": true,
			"name": "closeButton",
			"width": 150,
			"xPosition": 500,
			"xScale": 1,
			"yPosition": 500,
			"yScale": 1,
			"type": "sprite | animation"
		},
		{
			"anchor": false,
			"enabled": true,
			"hasAnimations": true,
			"height": 50,
			"isStatic": true,
			"name": "playButton",
			"width": 150,
			"xPosition": 320,
			"xScale": 1,
			"yPosition": 500,
			"yScale": 1,
			"type": "sprite | animation"
		},
		{
			"anchor": false,
			"enabled": true,
			"hasAnimations": false,
			"height": 600,
			"isStatic": true,
			"name": "scoreboardBackground",
			"width": 800,
			"xPosition": 0,
			"xScale": 1,
			"yPosition": 0,
			"yScale": 1,
			"type": "image"
		}
	]`;
}
module.exports=ScoreboardScene