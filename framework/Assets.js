// 
//  Assets.js
//  CreateJS_Game_Framework
//  
//  Created by Vinodkumar K N on 2012-12-19.
//  Copyright 2012 Vinodkumar K N. All rights reserved.
// 

var CGFW;
(function (CGFW) {
    var Assets = (function () {
    	/**
    	 *This Assets class is responsible for preloading assets and make it available from preloadjs. 
    	 *This class can't be instantiated. All methods and properties are static.
    	 * @class	Assets 
    	 */
        function Assets() { }
        /**
         *Loaded item count
         * @property	loaded
         * @type	int
         * @default	0
         * @static 
         */
        Assets.loaded= 0;
        /**
         *Total item count
         * @property	total
         * @type	int
         * @default	0
         * @static 
         */
        Assets.total = 0;
        /**
         *CreateJS PreloadJS instance
         * @property	preloader
         * @type	createjs.Preloader
         * @static 
         */
        Assets.preloader = new createjs.PreloadJS();
        /**
         *Load the assets in the manifest given. 
         * @method	load
         * @return	void
		 * @param {Object} manifest	An array of objects with id and src attributes
		 * @param {Function} [onComplete]	Callback which will be called after loading all assets.
         */
        Assets.load = function load(manifest, onComplete) {
        	Assets.total = manifest.length;
            Assets.preloader.loadManifest(manifest);
            Assets.preloader.onFileLoad = _onFileLoad;
            if(onComplete != null){
            	Assets.preloader.onComplete = onComplete;
            }
        }
        /**
         *Fires when a single file load is completed and this increments the loaded count
         * @method _onFileLoad
         * @return	void
         * @private 
         */
        function _onFileLoad(){
        	Assets.loaded += 1;
        }
        /**
         *Get the loaded asset from createjs preloader. 
         * @method get
         * @return	*	The loaded asset. 
 		 * @param {String} id The id used in the manifest file
         */
        Assets.get = function get(id) {
            return Assets.preloader.getResult(id).result;
        }
        return Assets;
    })();
    CGFW.Assets = Assets;    
})(CGFW || (CGFW = {}));
