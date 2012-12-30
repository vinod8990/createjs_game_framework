// 
//  Scene.js
//  CreateJS_Game_Framework
//  
//  Created by Vinodkumar K N on 2012-12-19.
//  Copyright 2012 Vinodkumar K N. All rights reserved.
// 

var CGFW;
(function (CGFW) {
    var Scene = (function () {
    	/**
    	 *The base class for a game scene. All game scenes has to be extended from this. 
    	 *All overriden methods must have a super call before all except for onSave method.
    	 * @class	Scene
    	 * @constructor 
    	 */
        function Scene() {
        	/**
        	 *This will hold the references to the containers added in current scene instance. 
        	 *For every stage created in the game, a container is created and added to the stage.
        	 *These are key value pairs where key is the name of the stage while value is the container itself.
        	 * @property	containers
        	 * @type	Object
        	 * @default	{} 
        	 */
            this.containers = null;
        }
        var p = Scene.prototype;
        
        /**
         *When a scene is added to the display, this is called at once.
         *Override this method in the child classes with a super call on first line.
         * @method onInit
         * @return void 
         */
        p.onInit = function () {
        	this.containers = {};
        	//Create containers for each stage
        	for(var key in CGFW.gameInstance.stages){
        		var container = new createjs.Container();
        		this.containers[key] = container;
        		CGFW.gameInstance.stages[key].addChild(container);
        	}
        };
        
        /**
         *On every window resize event, this method is called. 
         *This is useful if we need to do something on a window.resize event. 
         *Override this method in the child classes with a super call on first line.
         * @method	onResize
         * @return	void
         */
        p.onResize = function () {
        	
        };
        
        /**
         *Before saving a scene, this method is called. If overlay is true, then all containers of all stages are collected and added to
         * the first added stage. If overlay is false, all containers are simply removed from display. 
         * Note that, this will only be removed from display and not from memory to make it restore later.
         * Override this method and do something if needed before the super call.
         * @method onSave
		 * @param {Boolean} overlay
		 * @return void
         */
        p.onSave = function(overlay){
        	var bgStage = CGFW.gameInstance.stages[CGFW.gameInstance.stageDepthOrder[0]];
        	for(var i=1;i<CGFW.gameInstance.stageDepthOrder.length;i+=1){
        		var container = this.containers[CGFW.gameInstance.stageDepthOrder[i]];
        		if(overlay == true){
        			bgStage.addChild(container);
        			container._saveOffset = {
        				left: ($('#'+CGFW.gameInstance.stageDepthOrder[i]).offset().left - $('#'+CGFW.gameInstance.stageDepthOrder[i]).parent().offset().left),
        				top: ($('#'+CGFW.gameInstance.stageDepthOrder[i]).offset().top - $('#'+CGFW.gameInstance.stageDepthOrder[i]).parent().offset().top)
        			};
        			container.x = container._saveOffset.left / CGFW.gameInstance._stageScaleX;
        			container.y = container._saveOffset.top / CGFW.gameInstance._stageScaleY;
        		}else{
        			container.parent.removeChild(container);
        		}
        	}
        	if(overlay != true){
        		var c = this.containers[CGFW.gameInstance.stageDepthOrder[0]]
        		c.parent.removeChild(c);
        	}
        	CGFW.gameInstance.updateAllStages();
        }
        /**
         *This will be called after the scene is restored from memory. 
         *All containers are added to their corresponding stages.
         *Override this method in the child classes with a super call on first line.
         * @method	onRestore
         * @return	void 
         */
        p.onRestore = function(){
        	for(var key in this.containers){
        		CGFW.gameInstance.stages[key].addChild(this.containers[key]);
        		this.containers[key].x = 0;
        		this.containers[key].y = 0;
        	}
        	CGFW.gameInstance.updateAllStages();
        }
        
        /**
         *This is the loop which is called on every tick.
         *Override this method in the child classes with a super call on first line.
         * @method 	onUpdate
         * @return	void 
         */
        p.onUpdate = function () {
        	
        };
        
        /**
         *Add a display object to the container. This immediately updates the corresponding stage if its stage's autoUpdate is false.
         * @method	addChild
         * @param	{createjs.DisplayObject}	displayObject	The display object to be added to the container.
         * @param	{String}	containerName	The container's name to where the display object is to be added.
         * @return void 
         */
        p.addChild = function(displayObject,containerName) {
        	this.containers[containerName].addChild(displayObject);
        	if(CGFW.gameInstance.getStageByName(containerName).autoUpdate != true){
        		CGFW.gameInstance.updateStage(containerName);
        	}
        }
        /**
         *Remove the display object from its container. This immediately updates the corresponding stage if its stage's autoUpdate is false. 
         * @method	removeChild
         * @param	{createjs.DisplayObject}	displayObject	The display object which is to be removed.
         * @param	{String}	containerName	The container's name from where the display object is to be removed.
         * @return void
         */
        p.removeChild = function(displayObject,containerName){
        	this.containers[containerName].removeChild(displayObject);
        	if(CGFW.gameInstance.getStageByName(containerName).autoUpdate != true){
        		CGFW.gameInstance.updateStage(containerName);
        	}
        }
        
        /**
         *This will be called when a scene is disposed. All containers and their immediate children are removed. 
         *Override this method in the child classes with a super call on first line.
         * @method	onExit
         * @return	void
         */
        p.onExit = function () {
        	for(var key in this.containers){
        		this.containers[key].removeAllChildren();
        	}
        	for(var key in CGFW.gameInstance.stages){
        		CGFW.gameInstance.stages[key].removeAllChildren();
        		CGFW.gameInstance.updateStage(key);
        	}
        	this.containers = {};
        };
        return Scene;
    })();
    CGFW.Scene = Scene;    
})(CGFW || (CGFW = {}));
