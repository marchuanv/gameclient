const applicationId='gamedesigner';

const sceneObjBuilderConfig =require('./lib/config/sceneObjBuilderConfig.js');
const sceneObjBuilder=require('./lib/game/sceneObjBuilder.js');

const spriteBuilderConfig=require('./lib/config/spriteBuilderConfig.js');
const spriteBuilder=require('./lib/game/spriteBuilder.js');

const animationBuilderConfig=require('./lib/config/animationBuilderConfig.js');
const animationBuilder=require('./lib/game/animationBuilder.js');

const textBuilderConfig=require('./lib/config/textBuilderConfig.js');
const textBuilder=require('./lib/game/textBuilder.js');

const imageBuilderConfig=require('./lib/config/imageBuilderConfig.js');
const imageBuilder=require('./lib/game/imageBuilder.js');

const shapeBuilderConfig=require('./lib/config/shapeBuilderConfig.js');
const shapeBuilder=require('./lib/game/shapeBuilder.js');

const timerBuilderConfig=require('./lib/config/timerBuilderConfig.js');
const timerBuilder=require('./lib/game/timerBuilder.js');

const cache =require('./cache.js');

const objects=[
    animationBuilderConfig,
    animationBuilder,
    textBuilderConfig,
    textBuilder,
    imageBuilderConfig,
    imageBuilder,
    shapeBuilderConfig,
    shapeBuilder,
    timerBuilderConfig,
    timerBuilder,
    spriteBuilderConfig,
    spriteBuilder,
    sceneObjBuilderConfig,
    sceneObjBuilder,
    cache
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