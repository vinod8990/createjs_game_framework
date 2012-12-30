// 
//  CGFW.js
//  CreateJS_Game_Framework
//  
//  Created by Vinodkumar K N on 2012-12-19.
//  Copyright 2012 Vinodkumar K N. All rights reserved.
// 

/**
 * CreateJS Game Framework Module.
 * After you create a new game instance, you can get the current game instance from anywhere by accessing CGFW.gameInstance property
 * @module	CGFW
 */
var CGFW;
(function (CGFW) {
    var Game = (function () {
    	var debugBlock = null;
    	/**
    	 *The base Game class. You must extend this class to create your game class
    	 * @class	Game
    	 * @constructor 
    	 */
        function Game() {
        	CGFW.gameInstance = this;
        	/**
        	 *Contains all stages that are added.
        	 * @property	stages
        	 * @type	Object 
        	 * @default	{}
        	 */
            this.stages = {};
            /**
             *Holds the currentScene instance
             * @property	currentScene
             * @type	Scene
             * @default	null 
             */
            this.currentScene = null;
            /**
             *All saved scenes. This is used internally when switching between scenes.
             * @property	savedScenes
             * @type	Object
             * @default	{} 
             */
            this.savedScenes = {};
            /**
             * Default framerate used. Change this before calling init().
             * @property	defaultFPS
             * @type	int
             * @default	60
             */
            this.defaultFPS = 60;
            /**
             *This is used internally when switching scenes with overlay to draw the display objects in order.
             * @property	stageDepthOrder
             * @type	Array
             * @default	[] 
             */
            this.stageDepthOrder = [];
            /**
             *The game fit mode used. Accepted values are "noScale", "exactFit", "showAll", "noBorder".
             * --------------
             * - showAll		-	makes the entire game visible in the display area without distortion while maintaining the original aspect ratio. Borders can appear on two sides.
             * - exactFit		-	makes the entire game visible in the display area without trying to preserve the original aspect ratio. Distortion can occur.
             * - noScale		-	makes the size of the game fixed, so that it remains unchanged. Cropping may occur if the window is smaller than the game.
             * - noBorder 	-	scales the game to fill the specified area, without distortion but possibly with some cropping, while maintaining the original aspect ratio.
             * --------------
             * @property	scaleMode
             * @type	String
             * @default	showAll
             */
            this.scaleMode = "showAll";
            /**
             * The game width used for calculating logic. Even if the canvas is resized, this position will remain static. 
             * For a game resized to 1200x720, 800px in game is 1200px in display. You can resize the game by changing canvas width and height values.
             * @property	gameWidth
             * @type	int
             * @default	800
             */
            this.gameWidth = 800;
            /**
             * The game height used for calculating logic. Even if the canvas is resized, this position will remain static. 
             * For a game resized to 1200x720, 480px in game is 720px in display. You can resize the game by changing canvas width and height values.
             * @property	gameHeight
             * @type	int
             * @default	480
             */
            this.gameHeight = 480;
            /**
             *The display width of the complete game. The gameWidth and gameHeight will be scaled to displayWidth and displayHeight respectively.  
             *The mode of scaling is determined by the scaleMode property.
             * @property	displayWidth
             * @type	int
             * @default	800
             */
            this.displayWidth = 800;
            /**
             *The display height of the complete game. The gameWidth and gameHeight will be scaled to displayWidth and displayHeight respectively.  
             *The mode of scaling is determined by the scaleMode property.
             * @property	displayHeight
             * @type	int
             * @default	480
             */
            this.displayHeight = 480;
            /**
             *The max display width of the complete game. The game will not be scaled above this limit   
             * @property	displayMaxWidth
             * @type	int
             * @default	1200
             */
            this.displayMaxWidth = 1200;
            /**
             *The max display height of the complete game. The game will not be scaled above this limit   
             * @property	displayMaxHeight
             * @type	int
             * @default	720
             */
            this.displayMaxHeight = 720;
            /**
             * The horizontal scale of the stage. This is used internally to calculate game to canvas and canvas to game positions. 
             * @property	stageScaleX
             * @type	Number
             * @default	1
             * @protected
             * @readOnly
             */
            this._stageScaleX = 1;
            /**
             * The vertical scale of the stage. This is used internally to calculate game to canvas and canvas to game positions
             * @property	stageScaleY
             * @type	Number
             * @default	1
             * @protected
             * @readOnly
             */
            this._stageScaleY = 1;
        }
        var p = Game.prototype;
        
        /**
         * Original gameWidth and gameHeight are stored internally for resizing
         * @property	_gameWidth;
         * @type	int
         * @private
         */
        var _gameWidth;
        /**
         * Original gameWidth and gameHeight are stored internally for resizing
         * @property	_gameHeight;
         * @type	int
         * @private
         */
        var _gameHeight;
        /**
         *Initialize the Game. This will start the game ticker with defaultFPS.
         * @method	init
         * @return void
         */
        p.init = function(){
        	_gameHeight = this.gameHeight;
        	_gameWidth = this.gameWidth;
        	createjs.Ticker.useRAF = true;
        	createjs.Ticker.setFPS(this.defaultFPS);
        	createjs.Ticker.addListener(this);
        	//Set stage scale ratio
        	this.scaleView();
        	window.addEventListener('resize',_onResize,false);
			window.addEventListener('orientationchange', _onResize, false);
        };
        /**
         * Calls when a window.resize or orientationchange event occurs, this in turn calls onResize()
         * @method	_onResize
         * @return	void
         * @private
         */
        function _onResize(){
        	CGFW.gameInstance.onResize();
        }
        
        /**
         * Scale the canvases according to the parameters defined (gameWidth, gameHeight, displayWidth, displayHeight, scaleMode).
         * @method	scaleView
         * @return	void
         */
        p.scaleView = function(){
        	var container = $('#container');
        	//Scale the #container div to displayWidth and height
        	if(this.scaleMode == 'noScale'){
        		this.displayWidth = _gameWidth;
        		this.displayHeight = _gameHeight;
        	}
        	container.css({
				width: this.displayWidth+'px',
				height: this.displayHeight+'px',
			});
			
        	switch(this.scaleMode){
        		case "noScale":
        			//Nothing..
        		break;
        		case "exactFit":
        			this._stageScaleX = this.displayWidth/_gameWidth;
        			this._stageScaleY = this.displayHeight/_gameHeight;
        			for(var key in this.stages){
        				var canvas = $('#'+key);
        				var ox = canvas.attr('width');
        				var oy = canvas.attr('height');
        				canvas.css({
        					width: ox * this.displayWidth/_gameWidth+'px',
        					height: oy * this.displayHeight/_gameHeight+'px'
        				});
        			}
        			
        		break;
        		case "noBorder":
        			var widthToHeight = _gameWidth/_gameHeight;
        			
        			var newWidth = Math.min(this.displayMaxWidth,this.displayWidth);
        			var newHeight = Math.min(this.displayMaxHeight,this.displayHeight);
        			var newWidthToHeight = newWidth/newHeight;
        			
        			if(newWidthToHeight <= widthToHeight){
        				newWidth = newHeight * widthToHeight;
        			}else{
        				newHeight = newWidth / widthToHeight;
        			}
        			$('body').css({overflow:'hidden'});
        			container.css({
        				overflow:'hidden',
        				width:newWidth+'px',
        				height:newHeight+'px',
        				'margin-top':(this.displayHeight/2 - newHeight/2) +'px',
        				'margin-left':(this.displayWidth/2 - newWidth/2)+'px',
        			});
        			this._stageScaleX = newWidth/_gameWidth;
        			this._stageScaleY = newHeight/_gameHeight;
        			
        			for(var key in this.stages){
        				this.stages[key].scaleX = this._stageScaleX;
        				this.stages[key].scaleY = this._stageScaleY;
        				var canvas = $('#'+key);
        				var ox = canvas.attr('data-w');
        				var oy = canvas.attr('data-h');
        				canvas.attr('width',ox*this._stageScaleX);
        				canvas.attr('height',oy*this._stageScaleY);
        			}
        		break;
        		default:
        			var widthToHeight = _gameWidth/_gameHeight;
        			
        			var newWidth = Math.min(this.displayMaxWidth,this.displayWidth);
        			var newHeight = Math.min(this.displayMaxHeight,this.displayHeight);
        			var newWidthToHeight = newWidth/newHeight;
        			
        			if(newWidthToHeight > widthToHeight){
        				newWidth = newHeight * widthToHeight;
        			}else{
        				newHeight = newWidth / widthToHeight;
        			}
        			
        			container.css({
        				width:newWidth+'px',
        				height:newHeight+'px',
        				'margin-top':(this.displayHeight/2 - newHeight/2) +'px',
        				'margin-left':(this.displayWidth/2 - newWidth/2)+'px',
        			});
        			this._stageScaleX = newWidth/_gameWidth;
        			this._stageScaleY = newHeight/_gameHeight;
        			
        			for(var key in this.stages){
        				this.stages[key].scaleX = this._stageScaleX;
        				this.stages[key].scaleY = this._stageScaleY;
        				var canvas = $('#'+key);
        				var ox = canvas.attr('data-w');
        				var oy = canvas.attr('data-h');
        				canvas.attr('width',ox*this._stageScaleX);
        				canvas.attr('height',oy*this._stageScaleY);
        			}
        		break;
        	}
        }
        /**
         * Checks if this is a device or desktop
         * @method	isDevice
         * @returns	{Boolean}	True for device and False for desktop
         */
        p.isDevice = function(){
        	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
 				return true;
			}
			return false;
        }
        
        /**
         * Convert screen X co-ordinate value to game X. When we resize the canvas, the mouse co-ordinates won't 
         * correspond to the game co-ordinates. So when we need to get the mouseX and mouseY points on the game, use this. 
         * @method	screenToGameX
         * @param	{Number}	Screen X position to be converted
         * @return	{Number}
         */
        p.screenToGameX = function(value){
        	
        }
        /**
         * Convert screen Y co-ordinate value to game Y. When we resize the canvas, the mouse co-ordinates won't 
         * correspond to the game co-ordinates. So when we need to get the mouseX and mouseY points on the game, use this. 
         * @method	screenToGameY
         * @param	{Number}	Screen Y position to be converted
         * @return	{Number}
         */
        p.screenToGameY = function(value){
        	
        }
        
        
        /**
         *Add a new stage. The order of the addition matters so that add all stages according to their depth. 
         *Add background stages first and foreground stages last.
         * @method	addStage 
 		 * @param {String} name	Id of the canvas to where this stage is to be added. You should create one stage for each canvas used.
 		 * @param {Boolean} autoUpdate	Determines if the stage is updated on every game tick.
 		 * @return void
 		 * 
 		 * @example
 		 * 	this.addStage('bgCanvas',false);
 		 * 	this.addStage('mainCanvas',true);
         */
        p.addStage = function (name, autoUpdate) {
        	var canvas = $('#' + name);
        	canvas.attr('data-w',canvas.attr('width'));
        	canvas.attr('data-h',canvas.attr('height'));
            var stage = new createjs.Stage(canvas.get(0));
            stage.autoUpdate = autoUpdate || false;
            this.stages[name] = stage;
            this.stageDepthOrder.push(name);
        };
        
        /**
         *Get the createjs.Stage object by name
         * @method	getStageByName
         * @param {String} name The name(which is used to add the stage) to lookup
         * @return {createjs.Stage}	CreateJS Stage Object
         */
        p.getStageByName = function(name){
        	return this.stages[name];
        };
        /**
         *Update the stage
         * @method updateStage
         * @param {String} name	The name of the stage which is to be updated.
         * @return void
         */
        p.updateStage = function(name){
        	this.stages[name].update();
        }
        /**
         *Update all stages
         * @method	updateAllStages
         * @return	void
         */
        p.updateAllStages = function(){
        	for(var key in this.stages){
        		this.stages[key].update();
        	}
        }
        
        /**
         *Change scene. This will dispose the current scene and adds a new scene.
         * @method changeScene
         * @param {Scene} SceneClass	The Scene class to which the Game to be changed into.
         * @return	void
         */
        p.changeScene = function(SceneClass){
        	if(this.currentScene != null){
        		this.currentScene.onExit();
        		this.currentScene = null;
        	}
        	this.currentScene = new SceneClass();
        	this.currentScene.onInit();
        };
        
        /**
         *Switch to a new scene. This will save the current scene and then changes to the specified scene. 
         *By default, calling this will remove the current scene from display and then adds the new scene. 
         *But you can keep it below the new scene by passing overlay parameter as true. 
         *In both conditions, the saved scene will not be updated.
         * @method switchScene
		 * @param {Scene} SceneClass	The Scene class to which the Game to be switched into.
		 * @param {Boolean} overlay	If true, the new scene will be added over the old scene.
		 * @return void
		 * @example
		 * 	this.switchScene(PauseScene,true);	//Add pause scene above the current scene
         */
        p.switchScene = function(SceneClass,overlay){
        	this.saveScene(overlay);
        	this.changeScene(SceneClass);
        }
        
        /**
         *Save the current scene. This is called internally when switchScene is called.
         * @method saveScene 
         * @param {Boolean} overlay	If true, the scene won't be removed from display.
         * @return void
         */
        p.saveScene = function(overlay){
        	if(typeof(this.currentScene.onSave) == "function"){
				this.currentScene.onSave(overlay);
			}
			this.savedScenes[this.currentScene.constructor.name] = this.currentScene;
			this.currentScene = null;
        }
        
        /**
         *Restore a previously saved scene. This will remove the current scene and switches back to a saved scene. 
         * @method restoreScene
	   	 * @param {Scene} SceneClass	The old saved scene class to which the Game is to be restored.
	   	 * @return void
         */
        p.restoreScene = function(SceneClass){
        	if(this.currentScene){
				this.currentScene.onExit();
				this.currentScene = null;
			}
			if(this.savedScenes[SceneClass.prototype.constructor.name]){
				this.currentScene = this.savedScenes[SceneClass.prototype.constructor.name];
				if(typeof(this.currentScene.onRestore) == "function"){
					this.currentScene.onRestore();
				}
			}
        }
        
        /**
         *This will be called when a window resize is happened. This method will call current scene's onResize method.
         * @method onResize
         * @return void 
         */
        p.onResize = function(){
        	if(CGFW.gameInstance.currentScene == null){
        		return;
        	}
        	CGFW.gameInstance.currentScene.onResize();
        	for(var key in CGFW.gameInstance.stages){
        		CGFW.gameInstance.stages[key].update();
        	}
        };
        
        /**
         *This is the game loop. On every createjs Ticker tick, this method is called.  
         *This will update all auto-updatable stages.
         * @method onUpdate
         * @return void
         */
        p.onUpdate = function(){
        	if(this.currentScene == null){
        		return;
        	}
        	this.currentScene.onUpdate();
        	for(var key in this.stages){
        		var stage = this.stages[key];
        		if(stage.autoUpdate){
        			stage.update();
        		}
        	}
       		if(debugBlock != null){
        		debugBlock.html((createjs.Ticker.getMeasuredFPS() | 0)+"/"+(createjs.Ticker.getFPS() | 0));
        	}
        };
        
        /**
         *The tick method. This will call onUpdate on every timer tick.
         * @method tick
         * @return void 
         */
        p.tick = function(){
        	this.onUpdate();
        }
        
        /**
         *Shows an fps display on top left of the first canvas. 
         *By default, it will display measured framerate and target framerate.
         * @method	showDebug
         * @return void 
         */
        p.showDebug = function(){
        	if(debugBlock != null){
        		console.log("Debug is already running");
        	}
        	debugBlock = $('<span id="debug"></span>');
        	debugBlock.css({
        		position:'fixed',
        		left:0,
        		top:0,
        		background:'#000',
        		color:'#ccc',
        		margin:0,
        		padding:'5px',
        		font:'bold 10px Tahoma'
        	})
        	$('body canvas').parent().append(debugBlock);
        }
        
        return Game;
    })();
    CGFW.Game = Game;    
})(CGFW || (CGFW = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};