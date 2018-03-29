const sceneObjBuilderConfig =require('./lib/config/sceneObjBuilder.js');
const spriteBuilderConfig=require('./lib/config/spriteBuilder.js');
const animationBuilderConfig=require('./lib/config/animationBuilder.js');
const textBuilderConfig=require('./lib/config/textBuilder.js');
const imageBuilderConfig=require('./lib/config/imageBuilder.js');
const shapeBuilderConfig=require('./lib/config/shapeBuilder.js');
const designerSceneConfig=require('./lib/config/designerScene.js');
const phaserConfig=require('./lib/config/phaserGame.js');
const sceneSelectorConfig=require('./lib/config/sceneSelector.js')

const animationBuilder=require('./lib/game/animationBuilder.js');
const cache=require('./node_modules/utils/cache.js');
const designerScene=require('./lib/designer/designerScene.js');
const imageBuilder=require('./lib/game/imageBuilder.js');
const phaserGame=require('./lib/game/phaserGame.js');
const sceneEventManager=require('./lib/game/sceneEventManager.js');
const sceneManager=require('./lib/game/sceneManager.js');
const sceneObjBuilder=require('./lib/game/sceneObjBuilder.js');
const sceneSelector=require('./lib/game/sceneSelector.js');
const shapeBuilder=require('./lib/game/shapeBuilder.js');
const spriteBuilder=require('./lib/game/spriteBuilder.js');
const textBuilder=require('./lib/game/textBuilder.js');
const timerBuilder=require('./lib/game/timerBuilder.js');

const config=[
    animationBuilderConfig,
    textBuilderConfig,
    imageBuilderConfig,
    shapeBuilderConfig,
    spriteBuilderConfig,
    sceneObjBuilderConfig,
    designerSceneConfig,
    phaserConfig,
    sceneSelectorConfig
];

const objects=[
    animationBuilder,
    cache,
    designerScene,
    imageBuilder,
    phaserGame,
    sceneEventManager,
    sceneManager,
    sceneObjBuilder,
    sceneSelector,
    shapeBuilder,
    spriteBuilder,
    textBuilder,
    timerBuilder
];

var API = require('messagebus');
const hostDirPath=__dirname;
const api=new API(hostDirPath);
api.initialise(function ready() {

	objects.forEach(function(obj){
		api.registerLibrary({
		    javascript: obj,
		    isClass: true
		});
	});

	config.forEach(function(config){
		api.registerLibrary({
		    javascript: config,
		    isClass: false
		});
	});

	api.requestInstance({
	    class: "phaserconfig"
	},function(instance){
		console.log("INSTANCE: ", instance);
	});

});


// require('messagebus').create(function(api) {
//   api.getPhaserGame('', function(_phaserGame){
//     console.log('PHASER GAME: ',_phaserGame);
//   });
// });