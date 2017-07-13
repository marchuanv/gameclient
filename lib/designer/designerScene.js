/*[sceneManager, shapeBuilder, sceneSelector, designerdesignerSceneConfig, eventHandler, phaserGame]*/
/*CLASS*/
this.initialise = function(){

	eventHandler.subscribe(function animationComplete(animation, sceneConfig){
		if (sceneConfig.name.indexOf("submit") >= 0){
			//sceneSelector.next();
		}
	});

	eventHandler.subscribe(function onClick(mouse){

	});

	eventHandler.subscribe(function shiftKeyPress(){
		setTimeout(function(){
			console.log("pressing shift");
		    sceneManager.getSelectedSceneObj(function(shape, sceneConfig, state){
		    	shape.input.disableDrag();
		    	enumerate(designerdesignerSceneConfig, this, function (_config, cbCondition, cbRemove, cbBreak){
					if (_config.name=="stateNodeLinkTemplate"){
						var jsonStr = JSON.stringify(_config);
						var newLine = JSON.parse(jsonStr);
						newLine.enabled = true;
						newLine.name = generateGUID();
						var newShape;
						eventHandler.subscribe(function onMouseMove(mouse){
							if (mouse.isDown){

								var cX = sceneConfig.xPosition;
								var cY = sceneConfig.yPosition;
								var radius = sceneConfig.diameter/2;

								var theta = Math.atan2(mouse.x-cX, mouse.y-cY);
								var newX = Math.sin(theta) * radius;
								var newY = Math.cos(theta) * radius;

								newLine.start.xPosition = cX + newX;
								newLine.start.yPosition = cY + newY;
								newLine.end.xPosition = mouse.x;
								newLine.end.yPosition = mouse.y;

								shapeBuilder.getShapes(function(item){ //draw 4 points on the circle
									var otherShape = item.obj;
									var otherShapeConfig = item.config;
									if (otherShapeConfig.name != sceneConfig.name){
										var points = [
											{x:0,y:0,inside:false},
											{x:0,y:0,inside:false},
											{x:0,y:0,inside:false},
											{x:0,y:0,inside:false}
										];

										for(var i = 0; i < points.length; i++) {
											var destRadius = otherShapeConfig.diameter/2;
											points[i].x = otherShapeConfig.xPosition + destRadius * Math.cos(2 * Math.PI * i/points.length);
			    							points[i].y = otherShapeConfig.yPosition + destRadius * Math.sin(2 * Math.PI * i/points.length);
			    						};

	    								var right = points[0];
	    								var bottom = points[1];
	    								var left = points[2];
	    								var top = points[3];
		    							if (mouse.x < right.x && mouse.x > left.x)
		    							{
		    								if (mouse.y < bottom.y && mouse.y > top.y)
			    							{
			    								// rectangle check pass

		    									cX = otherShapeConfig.xPosition;
												cY = otherShapeConfig.yPosition;
												radius = otherShapeConfig.diameter/2;

												theta = Math.atan2(mouse.x-cX, mouse.y-cY);
												newX = Math.sin(theta) * radius;
												newY = Math.cos(theta) * radius;

												newLine.end.xPosition = cX + newX;
												newLine.end.yPosition = cY + newY;

												console.log("INSIDE!!!");
			    								
			    							}
		    							}
									}
								});

								if (newShape){
									shapeBuilder.createShape(newLine, function(shape2, sceneConfig2, state2){
										newShape = shape2;
									},true);
								}else{
									shapeBuilder.createShape(newLine, function(shape2, sceneConfig2, state2){
										newShape = shape2;
									});
								}
							}else{
								designerdesignerSceneConfig.push(newLine);
								eventHandler.unsubscribe(function onMouseMove(){});
							}
						});
						cbBreak();
					}
				},function complete(){
				});
			});
		},100);
	});
	eventHandler.subscribe(function shiftKeyRelease(){
		console.log("releasing shift");
	    sceneManager.getSelectedSceneObj(function(shape, sceneConfig, state){
	    	shape.input.enableDrag();
		});
	});

	eventHandler.subscribe(function onDoubleClick(mouse){
		var isSelectedSceneObj = false;
		sceneManager.getSelectedSceneObj(function(shape, sceneConfig, state){
			if(shape.input.pointerOver(mouse.id)){
				isSelectedSceneObj = true;
			}
		});
		setTimeout(function(){
			if (!isSelectedSceneObj){
				enumerate(designerdesignerSceneConfig, this, function (_config, cbCondition, cbRemove, cbBreak){
					if (_config.name=="stateNodeTemplate"){
						var jsonStr = JSON.stringify(_config);
						var newNode = JSON.parse(jsonStr);
						newNode.enabled = true;
						newNode.name = generateGUID();
						newNode.xPosition = mouse.x;
						newNode.yPosition = mouse.y;
						shapeBuilder.createShape(newNode, function(newShape){
							designerdesignerSceneConfig.push(newNode);
						});
						cbBreak();
					}
				},function complete(){
				});   
			}
		},200);
	});

	eventHandler.subscribe(function onDragStart(mouse){
	});

	eventHandler.subscribe(function onDragStop(mouse){

	});

	eventHandler.subscribe(function shapeDown(shape, sceneConfig, state){
		sceneManager.getSelectedSceneObj(function(shape2, sceneConfig2, state2){
			state2.isSelected = false;
			shape2.input.disableDrag();
		});
		state.isSelected = true;
		shape.input.enableDrag();
	});

	eventHandler.subscribe(function shapeUp(shape, sceneConfig, state){

		//check of lines are valid
		enumerate(designerdesignerSceneConfig, this, function (_config, cbCondition, cbRemove, cbBreak){
		});

		console.log("shape up",sceneConfig);
	});

	
};

this.load = function(){
	sceneManager.loadScene();
};

this.create = function(){
	sceneManager.createScene();
};

this.update = function(){
	sceneManager.updateScene();
};

this.reset = function(){

};