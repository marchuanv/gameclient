function AnimationBuilderConfig() { 
	return 
	`[
		{
			"animations": [
				{
					"startIndex": 0,
					"endIndex": 1,
					"name": "playButtonAnim",
					"speed": 10				
				}
			],
			"frameHeight": 46,
			"frameWidth": 150,
			"name": "playButton"
		},
		{
			"animations": [
				{
					"startIndex": 1,
					"endIndex": 0,
					"name": "closeButtonAnim",
					"speed": 10				
				}
			],
			"frameHeight": 46,
			"frameWidth": 150,
			"name": "closeButton"
		},
		{
			"animations": [
				{
					"startIndex": 1,
					"endIndex": 0,
					"name": "submitButtonAnim",
					"speed": 0				
				}
			],
			"frameHeight": 46,
			"frameWidth": 150,
			"name": "submitButton"
		},
		{
			"animations": [
				{
					"startIndex": 0,
					"endIndex": 168,
					"name": "play",
					"speed": 0
				}
			],
			"frameHeight": 600,
			"frameWidth": 800,
			"name": "preloader"
		},
		{
			"animations": [
				{
					"startIndex": 0,
					"endIndex": 15,
					"name": "flyAlive",
					"repeat": true,
					"speed": 50
				},
				{
					"startIndex": 16,
					"endIndex": 21,
					"name": "flyDead",
					"speed": 8
				}
			],
			"frameHeight": 128,
			"frameWidth": 128,
			"name": "fly"
		},
		{
			"animations": [
				{
					"startIndex": 1,
					"endIndex": 0,
					"name": "switchUnselectedState",
					"speed": 100
				},
				{
					"startIndex":0,
					"endIndex": 1,
					"name": "switchSelectedState",
					"speed": 100
				}
			],
			"frameHeight": 98,
			"frameWidth": 152.2,
			"name": "stateNodeTemplate"
		},
		{
			"animations": [
				{
					"startIndex": 2,
					"endIndex": 0,
					"name": "switchUnselectedInitalState",
					"speed": 100
				},
				{
					"startIndex": 0,
					"endIndex": 2,
					"name": "switchSelectedInitalState",
					"speed": 100
				}
			],
			"frameHeight": 99,
			"frameWidth": 100,
			"name": "initialStateNodeTemplate"
		},
		{
			"animations": [
				{
					"startIndex": 0,
					"endIndex": 1,
					"name": "switchUnselectedFinalState",
					"speed": 100
				},
				{
					"startIndex": 1,
					"endIndex": 3,
					"name": "switchSelectedFinalState",
					"speed": 100
				}
			],
			"frameHeight": 99,
			"frameWidth": 100,
			"name": "finalStateNodeTemplate"
		},
		{
			"animations": [
				{
					"startIndex": 1,
					"endIndex": 0,
					"name": "switchUnselectedStateNodeLink",
					"speed": 100
				},
				{
					"startIndex": 0,
					"endIndex": 1,
					"name": "switchSelectedStateNodeLink",
					"speed": 100
				}
			],
			"frameHeight": 15,
			"frameWidth": 332,
			"name": "stateNodeLinkTemplate"
		},
		{
			"animations": [
				{
					"startIndex": 1,
					"endIndex": 0,
					"name": "buttonSelectedPreview",
					"speed": 10
				}
			],
			"frameHeight": 44,
			"frameWidth": 181,
			"name": "preview"
		},
		{
			"animations": [
				{
					"startIndex": 1,
					"endIndex": 0,
					"name": "buttonSelectedPublish",
					"speed": 10
				}
			],
			"frameHeight": 44,
			"frameWidth": 181,
			"name": "publish"
		},
		{
			"animations": [
				{
					"startIndex": 1,
					"endIndex": 0,
					"name": "switchUnselectedStateNodeLinkArrow",
					"speed": 100
				},
				{
					"startIndex": 0,
					"endIndex": 1,
					"name": "switchSelectedStateNodeLinkArrow",
					"speed": 100
				}
			],
			"frameHeight": 15,
			"frameWidth": 15,
			"name": "stateNodeLinkArrowTemplate"
		},
		{
			"animations": [
				{
					"startIndex": 0,
					"endIndex": 3,
					"name": "load",
					"speed": 10
				}
			],
			"frameHeight": 50,
			"frameWidth": 50,
			"name": "contextLoader"
		}
	]`;
}
module.exports=AnimationBuilderConfig;