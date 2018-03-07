const applicationId='gamedesigner';

const sceneObjBuilderConfig =require('./lib/config/sceneObjBuilder.js');
const spriteBuilderConfig=require('./lib/config/spriteBuilder.js');
const animationBuilderConfig=require('./lib/config/animationBuilder.js');
const textBuilderConfig=require('./lib/config/textBuilder.js');
const imageBuilderConfig=require('./lib/config/imageBuilder.js');
const shapeBuilderConfig=require('./lib/config/shapeBuilder.js');
const designerSceneConfig=require('./lib/config/designerScene.js');

const sceneObjBuilder=require('./lib/game/sceneObjBuilder.js');
const spriteBuilder=require('./lib/game/spriteBuilder.js');
const animationBuilder=require('./lib/game/animationBuilder.js');
const textBuilder=require('./lib/game/textBuilder.js');
const imageBuilder=require('./lib/game/imageBuilder.js');
const shapeBuilder=require('./lib/game/shapeBuilder.js');
const timerBuilder=require('./lib/game/timerBuilder.js');
const designerScene=require('./lib/designer/designerScene.js');

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
    sceneObjBuilder,
    designerSceneConfig,
    designerScene
];

require('messagebus').create(function(messageBus) {

  messageBus.subscribe('libraryregistered', '', function(data){
    var registeredLib=data.class;
    if (registeredLib=="DesignerScene"){
      messageBus.subscribe('getDesignerScene', applicationId, function(_data) {
        console.log("DESIGNER SCENE INSTANCE:", _data);
      });
      messageBus.subscribe('getDesignerScene', applicationId, function(_data) {
        console.log("INSTANCE WAS EMPTY:", _data.class);
      });
      messageBus.publish('createDesignerScene', applicationId, {});
    }
  });

  messageBus.subscribe('invalidlibrary', '', function(data){
    console.log("LIBRARY NOT VALID:".data.class);
  });
  
  for (var i = objects.length - 1; i >= 0; i--) {
      const func=objects[i];
      messageBus.publish('registerlibrary', '', {
      	Id: applicationId, 
      	javascript: func
      });
  };

});