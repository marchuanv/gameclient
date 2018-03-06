function SceneObjBuilder(){ return 
	{
		"designerScene":{
			"priorities":[
				{
					"name":"initialStateNodeTemplate",
					"priority":1
				},
				{
					"name":"stateNodeTemplate",
					"priority":1
				},
				{
					"name":"stateNodeLinkTemplate",
					"priority":2
				},
				{
					"name":"finalStateNodeTemplate",
					"priority":1
				},
				{
			        "name": "diagramMenu",
			        "priority": 3
			    },
				{
					"name":"contextLoader",
					"priority":1
				},
				{
					"name":"publish",
					"priority":3
				},
				{
					"name":"preview",
					"priority":3
				},
				{
					"name":"stateNodeLinkArrowTemplate",
					"priority":2
				}
			]
		},
		"capturePlayerScene":{
			"priorities":[
				{
					"name": "cursor",
					"priority": 1
				},
				{
					"name": "playerCaptureText",
					"priority": 2
				},
				{
					"name": "playerCapture",
					"priority": 3
				},
				{
					"name": "submitButton",
					"priority": 4
				},
				{
					"name": "scoreboardBackground",
					"priority": 5
				}
			]
		},
		"preloaderScene":{
			"priorities":[
				{
					"name": "preloader",
					"priority":2
				},
				{
					"name": "cursor",
					"priority":1
				}
			]
		},
		"scoreboardScene":{
			"priorities":[
				{
					"name": "cursor",
					"priority": 0
				},
				{
					"name": "scoreboardHeading",
					"priority": 1
				},
				{
					"name": "playerScore",
					"priority": 11
				},
				{
					"name": "playerScore2",
					"priority": 12,
					"xOffset":0,
					"yOffset":52
				},
				{
					"name": "playerScore3",
					"priority": 13,
					"xOffset":0,
					"yOffset":104
				},
				{
					"name": "playerScore4",
					"priority": 14,
					"xOffset":0,
					"yOffset":158
				},
				{
					"name": "playerScore5",
					"priority": 15,
					"xOffset":0,
					"yOffset":210
				},
				{
					"name": "playerScoreText",
					"priority": 5
				},
				{
					"name": "playerScoreText2",
					"priority": 6,
					"xOffset":0,
					"yOffset":52
				},
				{
					"name": "playerScoreText3",
					"priority": 7,
					"xOffset":0,
					"yOffset":104
				},
				{
					"name": "playerScoreText4",
					"priority": 8,
					"xOffset":0,
					"yOffset":158
				},
				{
					"name": "playerScoreText5",
					"priority": 9,
					"xOffset":0,
					"yOffset":210
				},
				{
					"name": "closeButton",
					"priority": 19
				},
				{
					"name": "playButton",
					"priority": 19
				},
				{
					"name": "scoreboardBackground",
					"priority": 21
				}
			]
		},
		"flyScene":{
			"priorities":[
				{
					"name": "cursor",
					"priority": 1
				},
				{
					"name": "gameTimer",
					"priority": 1
				},
				{
					"name": "flyMoveTimer",
					"priority": 1
				},
				{
					"name": "fly",
					"priority": 3
				},
				{
					"name": "fly2",
					"priority": 4,
					"xOffset":180,
					"yOffset":130
				},
				{
					"name": "fly3",
					"priority": 5,
					"xOffset":260,
					"yOffset":20
				},
				{
					"name": "fly4",
					"priority": 6,
					"xOffset":230,
					"yOffset":190
				},
				{
					"name": "fly5",
					"priority": 7,
					"xOffset":200,
					"yOffset":100
				},
				{
					"name": "fly6",
					"priority": 8,
					"xOffset":130,
					"yOffset":170
				},
				{
					"name": "fly7",
					"priority": 9,
					"xOffset":280,
					"yOffset":200
				},
				{
					"name": "fly8",
					"priority": 10,
					"xOffset":127,
					"yOffset":110
				},
				{
					"name": "fly9",
					"priority": 11,
					"xOffset":300,
					"yOffset":100
				},
				{
					"name": "flyBackground",
					"priority": 60
				}
			]
		}
	}
}