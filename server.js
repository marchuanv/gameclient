


const applicationId='gamedesigner';
const sceneObjBuilderConfig =require('./lib/config/sceneObjBuilder.json');
const spriteBuilderConfig=require('./lib/config/spriteBuilder.json');
const animationBuilderConfig=require('./lib/config/animationBuilder.json');
const textBuilderConfig=require('./lib/config/textBuilder.json');
const imageBuilderConfig=require('./lib/config/imageBuilder.json');
const shapeBuilderConfig=require('./lib/config/shapeBuilder.json');

const sceneObjBuilder=require('./lib/game/sceneObjBuilder.js');
const spriteBuilder=require('./lib/game/spriteBuilder.js');
const animationBuilder=require('./lib/game/animationBuilder.js');
const textBuilder=require('./lib/game/textBuilder.js');
const imageBuilder=require('./lib/game/imageBuilder.js');
const shapeBuilder=require('./lib/game/shapeBuilder.js');
const timerBuilder=require('./lib/game/timerBuilder.js');

const objects=[
    animationBuilderConfig,
    animationBuilder,
    textBuilderConfig,
    textBuilder,
    imageBuilderConfig,
    imageBuilder,
    shapeBuilderConfig,
    shapeBuilder,
    timerBuilder,
    spriteBuilderConfig,
    spriteBuilder,
    sceneObjBuilderConfig,
    sceneObjBuilder
];

require('messagebus').create(function(messageBus) {
  for (var i = objects.length - 1; i >= 0; i--) {
      const func=objects[i];
      messageBus.publish('registerlibrary', '', {
      	Id: applicationId, 
      	javascript: func
      });
  };
  messageBus.subscribe('libraryregistered','',function(){
    messageBus.subscribe('getPhaserGame', applicationId, function(data) {
      console.log("PHASER GAME INSTANCE:",data);
    });
	  messageBus.publish('createPhaserGame', applicationId, {});
  });
});