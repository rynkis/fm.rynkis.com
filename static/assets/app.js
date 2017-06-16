/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(4);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list, options);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list, options) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove, transformResult;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    transformResult = options.transform(obj.css);
	    
	    if (transformResult) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = transformResult;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css. 
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  FM.GITMV: GITMV = get my way
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  https://fm.gitmv.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  Version 1.0.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  Copyright 2017, Rynki <gernischt@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  Released under the MIT license
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     **/


__webpack_require__(13);

__webpack_require__(12);

var _jQuery = __webpack_require__(3);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _album = __webpack_require__(16);

var _album2 = _interopRequireDefault(_album);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.$ = window.jQuery = _jQuery2.default;

var FM_GITMV = function () {
  function FM_GITMV() {
    var _this = this;

    _classCallCheck(this, FM_GITMV);

    this.data = {};
    this.recursion = {
      currentTime: null,
      requestID: null
    };
    this.config = {
      volume: 1.0,
      expire: 1200,
      localName: 'FM.GITMV.logger',
      source: 'https://github.com/Shy07/FM.GITMV',
      player: 'player',
      playlist: 'playlist'
    };
    this.domNodes = {
      home: document.querySelector('#controller [data-id="fa-home"] .fa-button'),
      back: document.querySelector('#controller [data-id="fa-back"] .fa-button'),
      over: document.querySelector('#controller [data-id="fa-over"] .fa-button'),
      mode: document.querySelector('#controller [data-id="fa-mode"] .fa-button'),
      name: document.querySelector('#detail .name'),
      album: document.querySelector('#surface .album'),
      magic: document.querySelector('#surface .magic'),
      artists: document.querySelector('#detail .artists'),
      buffered: document.querySelector('#thread .buffered'),
      elapsed: document.querySelector('#thread .elapsed'),
      surface: document.querySelector('#surface'),
      faMagic: document.querySelector('#surface .magic .fa'),
      lyric: $('.lrc'),
      tLyric: $('.tlrc')
    };
    this.audio = document.createElement('audio');
    this.audio.volume = this.config.volume;
    this.image = new Image();
    this.domNodes.name.textContent = 'Title';
    this.domNodes.artists.textContent = 'Artists';

    this.playingIndex = 0;
    this.songNum = 0;
    this.playList = null;

    this.autoSkip = false;
    this.touched = false; // for iOS

    $.getJSON(this.config.playlist, function (data) {
      _this.playList = data;
      _this.songNum = data.length;
      _this.playingIndex = Math.round((_this.songNum - 1) * Math.random() + 1);
      _this.decorator();
    });
  }

  _createClass(FM_GITMV, [{
    key: 'decorator',
    value: function decorator() {
      this.createAlbum();
      this.addAlbumEvents();
      this.getLatestData();
      this.loadMusicInfo();
      this.addAudioEvents();
      this.addOtherEvents();
    }
  }, {
    key: 'getLatestData',
    value: function getLatestData() {
      var latestData = this.getLocalData();
      var dom = $('#mode');

      $.isPlainObject(latestData) && (this.data = latestData);
      this.data.lastID && (this.playingIndex = this.data.lastID);
      this.data.playMode && dom.attr('class', this.data.playMode);
      switch (this.data.playMode) {
        case 'fa fa-align-justify':
          this.audio.loop = false;
          dom.attr({ 'class': 'fa fa-align-justify', 'title': 'List' });
          break;
        case 'fa fa-repeat':
          this.audio.loop = true;
          dom.attr({ 'class': 'fa fa-repeat', 'title': 'Single' });
          break;
        case 'fa fa-random':
          this.audio.loop = false;
          dom.attr({ 'class': 'fa fa-random', 'title': 'Random' });
          break;
      }
    }
  }, {
    key: 'getLocalData',
    value: function getLocalData() {
      try {
        return JSON.parse(localStorage.getItem(this.config.localName));
      } catch (e) {
        console.warn(e.message);
        return null;
      }
    }
  }, {
    key: 'setLocalData',
    value: function setLocalData() {
      this.data.lastID = this.playingIndex;
      this.data.playMode = $('#mode').attr('class');
      try {
        localStorage.setItem(this.config.localName, JSON.stringify(this.data));
      } catch (e) {
        console.warn(e.message);
      }
    }
  }, {
    key: 'nextTrack',
    value: function nextTrack() {
      this.pauseAudio();
      if ($('#mode').attr('class') === 'fa fa-random') {
        this.playingIndex = Math.round((this.songNum - 1) * Math.random() + 1);
      } else {
        this.playingIndex += 1;
        this.playingIndex === this.songNum && (this.playingIndex = 0);
      }
      this.loadMusicInfo();
    }
  }, {
    key: 'prevTrack',
    value: function prevTrack() {
      this.pauseAudio();
      this.playingIndex -= 1;
      this.playingIndex === 0 && (this.playingIndex = this.songNum - 1);
      this.loadMusicInfo();
    }
  }, {
    key: 'createAlbum',
    value: function createAlbum(src) {
      this.image.src = typeof src === 'string' ? src : _album2.default;
    }
  }, {
    key: 'requestAlbumRotate',
    value: function requestAlbumRotate() {
      var _this2 = this;

      var ANIMATION_FPS = 60;
      var ONE_TURN_TIME = 30;
      var ONE_TURN = Math.PI * 2;
      var MAX_EACH_FRAME_TIME = 1000 / 50;
      var EACH_FRAME_RADIAN = 1 / (ANIMATION_FPS * ONE_TURN_TIME) * ONE_TURN;

      var context = this.domNodes.album.getContext('2d');

      var prevTimestamp = 0;
      var loopAnimation = function loopAnimation(timestamp) {
        var MAX_LENGTH = Math.max(_this2.domNodes.album.width, _this2.domNodes.album.height) / 2;
        var HALF_LENGTH = MAX_LENGTH / 2;

        // prevTimestamp && timestamp - prevTimestamp > MAX_EACH_FRAME_TIME && console.warn(timestamp - prevTimestamp)
        prevTimestamp = timestamp;

        context.translate(HALF_LENGTH, HALF_LENGTH);
        context.rotate(EACH_FRAME_RADIAN);
        context.translate(-HALF_LENGTH, -HALF_LENGTH);
        context.clearRect(0, 0, MAX_LENGTH, MAX_LENGTH);

        context.beginPath();
        context.fillStyle = context.createPattern(_this2.image, 'no-repeat');
        context.arc(HALF_LENGTH, HALF_LENGTH, HALF_LENGTH, 0, ONE_TURN);
        context.fill();
        context.closePath();

        context.beginPath();
        context.fillStyle = '#FFF';
        context.arc(HALF_LENGTH, HALF_LENGTH, HALF_LENGTH / 8, 0, ONE_TURN);
        context.fill();
        context.closePath();

        if (_this2.audio.paused) {
          _this2.cancelAlbumRotate();
        } else {
          _this2.recursion.requestID = window.requestAnimationFrame(loopAnimation);
        }
      };

      // In slow network, `this.requestAlbumRotate` will be trigger many times.
      // So we should run `cancelAnimationFrame` firstly.
      this.cancelAlbumRotate();
      this.recursion.requestID = window.requestAnimationFrame(loopAnimation);
    }
  }, {
    key: 'cancelAlbumRotate',
    value: function cancelAlbumRotate() {
      this.recursion.requestID && window.cancelAnimationFrame(this.recursion.requestID);
    }
  }, {
    key: 'addAlbumEvents',
    value: function addAlbumEvents() {
      var _this3 = this;

      $(this.image).on({
        'load': function load(e) {
          var ONE_TURN = Math.PI * 2;
          var MAX_LENGTH = Math.max(_this3.image.width, _this3.image.height);
          var HALF_LENGTH = MAX_LENGTH / 2;

          _this3.domNodes.album.width = _this3.domNodes.album.height = MAX_LENGTH * 2;

          var context = _this3.domNodes.album.getContext('2d');
          context.scale(2, 2);

          context.clearRect(0, 0, MAX_LENGTH, MAX_LENGTH);
          context.beginPath();
          context.fillStyle = context.createPattern(_this3.image, 'no-repeat');
          context.arc(HALF_LENGTH, HALF_LENGTH, HALF_LENGTH, 0, ONE_TURN);
          context.fill();
          context.closePath();

          context.beginPath();
          context.fillStyle = '#FFF';
          context.arc(HALF_LENGTH, HALF_LENGTH, HALF_LENGTH / 8, 0, ONE_TURN);
          context.fill();
          context.closePath();
        },
        'error': function error(e) {
          _this3.src !== _album2.default && _this3.createAlbum(_album2.default);
        }
      });
    }
  }, {
    key: 'loadMusicInfo',
    value: function loadMusicInfo() {
      var _this4 = this;

      $.getJSON(this.config.player + '?id=' + this.playList[this.playingIndex].id, function (song) {
        if (song.url === '' && _this4.autoSkip) {
          _this4.nextTrack();
        } else {
          _this4.renderAudio(song);
        }
      });
    }
  }, {
    key: 'renderAudio',
    value: function renderAudio(song) {
      var size = $(this.domNodes.album).width() * 2;
      this.image.src = song.cover.replace(/\d+y\d+/, size + 'y' + size);
      this.domNodes.name.textContent = song.music_name;
      this.domNodes.artists.textContent = song.artists;
      this.domNodes.lyric.html('');
      this.domNodes.tLyric.html('');
      this.audio.sourcePointer = song;
      if (song.url === '') {
        this.domNodes.lyric.html("Can't be played because of Copyright");
        this.domNodes.tLyric.html('因版权原因暂时无法播放');
      } else {
        this.audio.src = song.url;
        this.touched && this.playAudio();
      }
    }
  }, {
    key: 'playAudio',
    value: function playAudio() {
      var _this5 = this;

      if (this.audio.sourcePointer.url === '') return;

      var time = Math.ceil(Date.now() / 1000);
      var song = this.audio.sourcePointer;
      var rest = this.audio.duration - this.audio.currentTime; // Maybe `NaN`
      var minExpire = this.audio.duration || 120;
      var expire = song.expire < minExpire ? this.config.expire : song.expire;
      var isExpire = Math.ceil(rest) < expire && time - song.timestamp + Math.ceil(rest || 0) > expire;

      // NO risk of recursion
      if (isExpire) {
        this.recursion.currentTime = this.audio.currentTime;

        $.getJSON(this.config.player + '?id=' + this.playList[this.playingIndex].id, function (song) {
          _this5.audio.src = song.url;
          _this5.audio.sourcePointer = song;
          _this5.touched && _this5.playAudio();
        });
      } else {
        if (this.recursion.currentTime) {
          this.audio.currentTime = this.recursion.currentTime;
          this.recursion.currentTime = null;
        }
        this.audio.play();
        if (this.audio.sourcePointer.lrc != '') {
          this.lrcInterval = setInterval(this.displayLrc.bind(this), 500);
        }
        if (this.audio.sourcePointer.tlrc != '') {
          this.tlrcInterval = setInterval(this.displayTlrc.bind(this), 500);
        }
      }
    }
  }, {
    key: 'pauseAudio',
    value: function pauseAudio() {
      this.audio.pause();
      this.audio.sourcePointer.lrc != '' && clearInterval(this.lrcInterval);
      this.audio.sourcePointer.tlrc != '' && clearInterval(this.tlrcInterval);
    }
  }, {
    key: 'displayLrc',
    value: function displayLrc() {
      var playTime = Math.floor(this.audio.currentTime).toString();
      this.domNodes.lyric.html(this.audio.sourcePointer.lrc[playTime]);
    }
  }, {
    key: 'displayTlrc',
    value: function displayTlrc() {
      var playTime = Math.floor(this.audio.currentTime).toString();
      this.domNodes.tLyric.html(this.audio.sourcePointer.tlrc[playTime]);
    }
  }, {
    key: 'addAudioEvents',
    value: function addAudioEvents() {
      var _this6 = this;

      $(this.audio).on({
        'playing': function playing(e) {
          _this6.requestAlbumRotate();
        },
        'waiting': function waiting(e) {
          _this6.cancelAlbumRotate();
        },
        'play': function play(e) {
          $(_this6.domNodes.faMagic).removeClass('fa-play').addClass('fa-pause');
        },
        'pause': function pause(e) {
          $(_this6.domNodes.faMagic).removeClass('fa-pause').addClass('fa-play');
        },
        'ended': function ended(e) {
          // HTML5 video/audio doesn't become paused after playback ends on IE
          // Bug: https://connect.microsoft.com/IE/feedback/details/810454/html5-video-audio-doesnt-become-paused-after-playback-ends
          _this6.autoSkip = true;
          _this6.nextTrack();
        },
        'timeupdate': function timeupdate(e) {
          $(_this6.domNodes.elapsed).css('width', (_this6.audio.currentTime / _this6.audio.duration).toFixed(5) * 100 + '%');
        },
        'error': function error(e) {
          // console.warn(e.message)
          _this6.recursion.currentTime = _this6.audio.currentTime;
          _this6.pauseAudio();
          _this6.audio.src = _this6.audio.src;
          _this6.audio.load();
          _this6.playAudio();
        }
      });

      setInterval(function () {
        _this6.domNodes.buffered.style.width = (_this6.audio.buffered.length > 0 ? Math.round(_this6.audio.buffered.end(0)) / Math.round(_this6.audio.duration) * 100 : 0) + '%';
      }, 60);
    }
  }, {
    key: 'addOtherEvents',
    value: function addOtherEvents() {
      var _this7 = this;

      $(window).on('unload', function (e) {
        _this7.setLocalData();
      });

      $(document).on('keydown', function (e) {
        switch (e.which) {
          case 32:
            // Space
            e.preventDefault();
            _this7.touched = true;
            _this7.audio.paused ? _this7.playAudio() : _this7.pauseAudio();
            break;
          case 37:
            // Left
            e.preventDefault();
            _this7.touched = true;
            _this7.autoSkip = false;
            _this7.prevTrack();
            break;
          case 39:
            // Right
            e.preventDefault();
            _this7.touched = true;
            _this7.autoSkip = false;
            _this7.nextTrack();
            break;
        }
      });

      $(this.domNodes.home).on('click', function (e) {
        window.open(_this7.config.source);
      });

      $(this.domNodes.back).on('click', function (e) {
        _this7.touched = true;
        _this7.autoSkip = false;
        _this7.prevTrack();
      });

      $(this.domNodes.over).on('click', function (e) {
        _this7.touched = true;
        _this7.autoSkip = false;
        _this7.nextTrack();
      });

      $(this.domNodes.mode).on('click', function (e) {
        var dom = $('#mode');
        switch (dom.attr('class')) {
          case 'fa fa-align-justify':
            _this7.audio.loop = true;
            dom.attr({ 'class': 'fa fa-repeat', 'title': 'Single' });
            break;
          case 'fa fa-repeat':
            _this7.audio.loop = false;
            dom.attr({ 'class': 'fa fa-random', 'title': 'Random' });
            break;
          case 'fa fa-random':
            _this7.audio.loop = false;
            dom.attr({ 'class': 'fa fa-align-justify', 'title': 'List' });
            break;
        }
      });

      $(this.domNodes.magic).on('click', function (e) {
        _this7.touched = true;
        _this7.audio.paused ? _this7.playAudio() : _this7.pauseAudio();
      });
    }
  }]);

  return FM_GITMV;
}();

$(document).ready(function () {
  return new FM_GITMV();
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
(function (global, factory) {

	"use strict";

	if (( false ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ? factory(global, true) : function (w) {
			if (!w.document) {
				throw new Error("jQuery requires a window with a document");
			}
			return factory(w);
		};
	} else {
		factory(global);
	}

	// Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : undefined, function (window, noGlobal) {

	// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
	// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
	// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
	// enough that all such attempts are guarded in a try block.
	"use strict";

	var arr = [];

	var document = window.document;

	var getProto = Object.getPrototypeOf;

	var _slice = arr.slice;

	var concat = arr.concat;

	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var fnToString = hasOwn.toString;

	var ObjectFunctionString = fnToString.call(Object);

	var support = {};

	function DOMEval(code, doc) {
		doc = doc || document;

		var script = doc.createElement("script");

		script.text = code;
		doc.head.appendChild(script).parentNode.removeChild(script);
	}
	/* global Symbol */
	// Defining this global in .eslintrc.json would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module


	var version = "3.2.1",


	// Define a local copy of jQuery
	jQuery = function jQuery(selector, context) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init(selector, context);
	},


	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,


	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	    rdashAlpha = /-([a-z])/g,


	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function fcamelCase(all, letter) {
		return letter.toUpperCase();
	};

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function toArray() {
			return _slice.call(this);
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function get(num) {

			// Return all the elements in a clean array
			if (num == null) {
				return _slice.call(this);
			}

			// Return just the one element from the set
			return num < 0 ? this[num + this.length] : this[num];
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function pushStack(elems) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function each(callback) {
			return jQuery.each(this, callback);
		},

		map: function map(callback) {
			return this.pushStack(jQuery.map(this, function (elem, i) {
				return callback.call(elem, i, elem);
			}));
		},

		slice: function slice() {
			return this.pushStack(_slice.apply(this, arguments));
		},

		first: function first() {
			return this.eq(0);
		},

		last: function last() {
			return this.eq(-1);
		},

		eq: function eq(i) {
			var len = this.length,
			    j = +i + (i < 0 ? len : 0);
			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},

		end: function end() {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function () {
		var options,
		    name,
		    src,
		    copy,
		    copyIsArray,
		    clone,
		    target = arguments[0] || {},
		    i = 1,
		    length = arguments.length,
		    deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !jQuery.isFunction(target)) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {

			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {

				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

						if (copyIsArray) {
							copyIsArray = false;
							clone = src && Array.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = jQuery.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend({

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function error(msg) {
			throw new Error(msg);
		},

		noop: function noop() {},

		isFunction: function isFunction(obj) {
			return jQuery.type(obj) === "function";
		},

		isWindow: function isWindow(obj) {
			return obj != null && obj === obj.window;
		},

		isNumeric: function isNumeric(obj) {

			// As of jQuery 3.0, isNumeric is limited to
			// strings and numbers (primitives or objects)
			// that can be coerced to finite numbers (gh-2662)
			var type = jQuery.type(obj);
			return (type === "number" || type === "string") &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN(obj - parseFloat(obj));
		},

		isPlainObject: function isPlainObject(obj) {
			var proto, Ctor;

			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if (!obj || toString.call(obj) !== "[object Object]") {
				return false;
			}

			proto = getProto(obj);

			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if (!proto) {
				return true;
			}

			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
			return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
		},

		isEmptyObject: function isEmptyObject(obj) {

			/* eslint-disable no-unused-vars */
			// See https://github.com/eslint/eslint/issues/6125
			var name;

			for (name in obj) {
				return false;
			}
			return true;
		},

		type: function type(obj) {
			if (obj == null) {
				return obj + "";
			}

			// Support: Android <=2.3 only (functionish RegExp)
			return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
		},

		// Evaluates a script in a global context
		globalEval: function globalEval(code) {
			DOMEval(code);
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE <=9 - 11, Edge 12 - 13
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function camelCase(string) {
			return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
		},

		each: function each(obj, callback) {
			var length,
			    i = 0;

			if (isArrayLike(obj)) {
				length = obj.length;
				for (; i < length; i++) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					if (callback.call(obj[i], i, obj[i]) === false) {
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android <=4.0 only
		trim: function trim(text) {
			return text == null ? "" : (text + "").replace(rtrim, "");
		},

		// results is for internal usage only
		makeArray: function makeArray(arr, results) {
			var ret = results || [];

			if (arr != null) {
				if (isArrayLike(Object(arr))) {
					jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
				} else {
					push.call(ret, arr);
				}
			}

			return ret;
		},

		inArray: function inArray(elem, arr, i) {
			return arr == null ? -1 : indexOf.call(arr, elem, i);
		},

		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		merge: function merge(first, second) {
			var len = +second.length,
			    j = 0,
			    i = first.length;

			for (; j < len; j++) {
				first[i++] = second[j];
			}

			first.length = i;

			return first;
		},

		grep: function grep(elems, callback, invert) {
			var callbackInverse,
			    matches = [],
			    i = 0,
			    length = elems.length,
			    callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for (; i < length; i++) {
				callbackInverse = !callback(elems[i], i);
				if (callbackInverse !== callbackExpect) {
					matches.push(elems[i]);
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function map(elems, callback, arg) {
			var length,
			    value,
			    i = 0,
			    ret = [];

			// Go through the array, translating each of the items to their new values
			if (isArrayLike(elems)) {
				length = elems.length;
				for (; i < length; i++) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}

				// Go through every key on the object,
			} else {
				for (i in elems) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply([], ret);
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function proxy(fn, context) {
			var tmp, args, proxy;

			if (typeof context === "string") {
				tmp = fn[context];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if (!jQuery.isFunction(fn)) {
				return undefined;
			}

			// Simulated bind
			args = _slice.call(arguments, 2);
			proxy = function proxy() {
				return fn.apply(context || this, args.concat(_slice.call(arguments)));
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});

	if (typeof Symbol === "function") {
		jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
	}

	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});

	function isArrayLike(obj) {

		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
		    type = jQuery.type(obj);

		if (type === "function" || jQuery.isWindow(obj)) {
			return false;
		}

		return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
	}
	var Sizzle =
	/*!
  * Sizzle CSS Selector Engine v2.3.3
  * https://sizzlejs.com/
  *
  * Copyright jQuery Foundation and other contributors
  * Released under the MIT license
  * http://jquery.org/license
  *
  * Date: 2016-08-08
  */
	function (window) {

		var i,
		    support,
		    Expr,
		    getText,
		    isXML,
		    tokenize,
		    compile,
		    select,
		    outermostContext,
		    sortInput,
		    hasDuplicate,


		// Local document vars
		setDocument,
		    document,
		    docElem,
		    documentIsHTML,
		    rbuggyQSA,
		    rbuggyMatches,
		    matches,
		    contains,


		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		    preferredDoc = window.document,
		    dirruns = 0,
		    done = 0,
		    classCache = createCache(),
		    tokenCache = createCache(),
		    compilerCache = createCache(),
		    sortOrder = function sortOrder(a, b) {
			if (a === b) {
				hasDuplicate = true;
			}
			return 0;
		},


		// Instance methods
		hasOwn = {}.hasOwnProperty,
		    arr = [],
		    pop = arr.pop,
		    push_native = arr.push,
		    push = arr.push,
		    slice = arr.slice,

		// Use a stripped-down indexOf as it's faster than native
		// https://jsperf.com/thor-indexof-vs-for/5
		indexOf = function indexOf(list, elem) {
			var i = 0,
			    len = list.length;
			for (; i < len; i++) {
				if (list[i] === elem) {
					return i;
				}
			}
			return -1;
		},
		    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",


		// Regular expressions

		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",


		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",


		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
		    pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" + ")\\)|)",


		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp(whitespace + "+", "g"),
		    rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
		    rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
		    rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
		    rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
		    rpseudo = new RegExp(pseudos),
		    ridentifier = new RegExp("^" + identifier + "$"),
		    matchExpr = {
			"ID": new RegExp("^#(" + identifier + ")"),
			"CLASS": new RegExp("^\\.(" + identifier + ")"),
			"TAG": new RegExp("^(" + identifier + "|[*])"),
			"ATTR": new RegExp("^" + attributes),
			"PSEUDO": new RegExp("^" + pseudos),
			"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
			"bool": new RegExp("^(?:" + booleans + ")$", "i"),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
		},
		    rinputs = /^(?:input|select|textarea|button)$/i,
		    rheader = /^h\d$/i,
		    rnative = /^[^{]+\{\s*\[native \w/,


		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
		    rsibling = /[+~]/,


		// CSS escapes
		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
		    funescape = function funescape(_, escaped, escapedWhitespace) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ? escaped : high < 0 ?
			// BMP codepoint
			String.fromCharCode(high + 0x10000) :
			// Supplemental Plane codepoint (surrogate pair)
			String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
		},


		// CSS string/identifier serialization
		// https://drafts.csswg.org/cssom/#common-serializing-idioms
		rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
		    fcssescape = function fcssescape(ch, asCodePoint) {
			if (asCodePoint) {

				// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
				if (ch === "\0") {
					return "\uFFFD";
				}

				// Control characters and (dependent upon position) numbers get escaped as code points
				return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
			}

			// Other potentially-special ASCII characters get backslash-escaped
			return "\\" + ch;
		},


		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function unloadHandler() {
			setDocument();
		},
		    disabledAncestor = addCombinator(function (elem) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		}, { dir: "parentNode", next: "legend" });

		// Optimize for push.apply( _, NodeList )
		try {
			push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
			// Support: Android<4.0
			// Detect silently failing push.apply
			arr[preferredDoc.childNodes.length].nodeType;
		} catch (e) {
			push = { apply: arr.length ?

				// Leverage slice if possible
				function (target, els) {
					push_native.apply(target, slice.call(els));
				} :

				// Support: IE<9
				// Otherwise append directly
				function (target, els) {
					var j = target.length,
					    i = 0;
					// Can't trust NodeList.length
					while (target[j++] = els[i++]) {}
					target.length = j - 1;
				}
			};
		}

		function Sizzle(selector, context, results, seed) {
			var m,
			    i,
			    elem,
			    nid,
			    match,
			    groups,
			    newSelector,
			    newContext = context && context.ownerDocument,


			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;

			results = results || [];

			// Return early from calls with invalid selector or context
			if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

				return results;
			}

			// Try to shortcut find operations (as opposed to filters) in HTML documents
			if (!seed) {

				if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
					setDocument(context);
				}
				context = context || document;

				if (documentIsHTML) {

					// If the selector is sufficiently simple, try using a "get*By*" DOM method
					// (excepting DocumentFragment context, where the methods don't exist)
					if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

						// ID selector
						if (m = match[1]) {

							// Document context
							if (nodeType === 9) {
								if (elem = context.getElementById(m)) {

									// Support: IE, Opera, Webkit
									// TODO: identify versions
									// getElementById can match elements by name instead of ID
									if (elem.id === m) {
										results.push(elem);
										return results;
									}
								} else {
									return results;
								}

								// Element context
							} else {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {

									results.push(elem);
									return results;
								}
							}

							// Type selector
						} else if (match[2]) {
							push.apply(results, context.getElementsByTagName(selector));
							return results;

							// Class selector
						} else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {

							push.apply(results, context.getElementsByClassName(m));
							return results;
						}
					}

					// Take advantage of querySelectorAll
					if (support.qsa && !compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {

						if (nodeType !== 1) {
							newContext = context;
							newSelector = selector;

							// qSA looks outside Element context, which is not what we want
							// Thanks to Andrew Dupont for this workaround technique
							// Support: IE <=8
							// Exclude object elements
						} else if (context.nodeName.toLowerCase() !== "object") {

							// Capture the context ID, setting it first if necessary
							if (nid = context.getAttribute("id")) {
								nid = nid.replace(rcssescape, fcssescape);
							} else {
								context.setAttribute("id", nid = expando);
							}

							// Prefix every selector in the list
							groups = tokenize(selector);
							i = groups.length;
							while (i--) {
								groups[i] = "#" + nid + " " + toSelector(groups[i]);
							}
							newSelector = groups.join(",");

							// Expand context for sibling selectors
							newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
						}

						if (newSelector) {
							try {
								push.apply(results, newContext.querySelectorAll(newSelector));
								return results;
							} catch (qsaError) {} finally {
								if (nid === expando) {
									context.removeAttribute("id");
								}
							}
						}
					}
				}
			}

			// All others
			return select(selector.replace(rtrim, "$1"), context, results, seed);
		}

		/**
   * Create key-value caches of limited size
   * @returns {function(string, object)} Returns the Object data after storing it on itself with
   *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
   *	deleting the oldest entry
   */
		function createCache() {
			var keys = [];

			function cache(key, value) {
				// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
				if (keys.push(key + " ") > Expr.cacheLength) {
					// Only keep the most recent entries
					delete cache[keys.shift()];
				}
				return cache[key + " "] = value;
			}
			return cache;
		}

		/**
   * Mark a function for special use by Sizzle
   * @param {Function} fn The function to mark
   */
		function markFunction(fn) {
			fn[expando] = true;
			return fn;
		}

		/**
   * Support testing using an element
   * @param {Function} fn Passed the created element and returns a boolean result
   */
		function assert(fn) {
			var el = document.createElement("fieldset");

			try {
				return !!fn(el);
			} catch (e) {
				return false;
			} finally {
				// Remove from its parent by default
				if (el.parentNode) {
					el.parentNode.removeChild(el);
				}
				// release memory in IE
				el = null;
			}
		}

		/**
   * Adds the same handler for all of the specified attrs
   * @param {String} attrs Pipe-separated list of attributes
   * @param {Function} handler The method that will be applied
   */
		function addHandle(attrs, handler) {
			var arr = attrs.split("|"),
			    i = arr.length;

			while (i--) {
				Expr.attrHandle[arr[i]] = handler;
			}
		}

		/**
   * Checks document order of two siblings
   * @param {Element} a
   * @param {Element} b
   * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
   */
		function siblingCheck(a, b) {
			var cur = b && a,
			    diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;

			// Use IE sourceIndex if available on both nodes
			if (diff) {
				return diff;
			}

			// Check if b follows a
			if (cur) {
				while (cur = cur.nextSibling) {
					if (cur === b) {
						return -1;
					}
				}
			}

			return a ? 1 : -1;
		}

		/**
   * Returns a function to use in pseudos for input types
   * @param {String} type
   */
		function createInputPseudo(type) {
			return function (elem) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === type;
			};
		}

		/**
   * Returns a function to use in pseudos for buttons
   * @param {String} type
   */
		function createButtonPseudo(type) {
			return function (elem) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && elem.type === type;
			};
		}

		/**
   * Returns a function to use in pseudos for :enabled/:disabled
   * @param {Boolean} disabled true for :disabled; false for :enabled
   */
		function createDisabledPseudo(disabled) {

			// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
			return function (elem) {

				// Only certain elements can match :enabled or :disabled
				// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
				// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
				if ("form" in elem) {

					// Check for inherited disabledness on relevant non-disabled elements:
					// * listed form-associated elements in a disabled fieldset
					//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
					//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
					// * option elements in a disabled optgroup
					//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
					// All such elements have a "form" property.
					if (elem.parentNode && elem.disabled === false) {

						// Option elements defer to a parent optgroup if present
						if ("label" in elem) {
							if ("label" in elem.parentNode) {
								return elem.parentNode.disabled === disabled;
							} else {
								return elem.disabled === disabled;
							}
						}

						// Support: IE 6 - 11
						// Use the isDisabled shortcut property to check for disabled fieldset ancestors
						return elem.isDisabled === disabled ||

						// Where there is no isDisabled, check manually
						/* jshint -W018 */
						elem.isDisabled !== !disabled && disabledAncestor(elem) === disabled;
					}

					return elem.disabled === disabled;

					// Try to winnow out elements that can't be disabled before trusting the disabled property.
					// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
					// even exist on them, let alone have a boolean value.
				} else if ("label" in elem) {
					return elem.disabled === disabled;
				}

				// Remaining elements are neither :enabled nor :disabled
				return false;
			};
		}

		/**
   * Returns a function to use in pseudos for positionals
   * @param {Function} fn
   */
		function createPositionalPseudo(fn) {
			return markFunction(function (argument) {
				argument = +argument;
				return markFunction(function (seed, matches) {
					var j,
					    matchIndexes = fn([], seed.length, argument),
					    i = matchIndexes.length;

					// Match elements found at the specified indexes
					while (i--) {
						if (seed[j = matchIndexes[i]]) {
							seed[j] = !(matches[j] = seed[j]);
						}
					}
				});
			});
		}

		/**
   * Checks a node for validity as a Sizzle context
   * @param {Element|Object=} context
   * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
   */
		function testContext(context) {
			return context && typeof context.getElementsByTagName !== "undefined" && context;
		}

		// Expose support vars for convenience
		support = Sizzle.support = {};

		/**
   * Detects XML nodes
   * @param {Element|Object} elem An element or a document
   * @returns {Boolean} True iff elem is a non-HTML XML node
   */
		isXML = Sizzle.isXML = function (elem) {
			// documentElement is verified for cases where it doesn't yet exist
			// (such as loading iframes in IE - #4833)
			var documentElement = elem && (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false;
		};

		/**
   * Sets document-related variables once based on the current document
   * @param {Element|Object} [doc] An element or document object to use to set the document
   * @returns {Object} Returns the current document
   */
		setDocument = Sizzle.setDocument = function (node) {
			var hasCompare,
			    subWindow,
			    doc = node ? node.ownerDocument || node : preferredDoc;

			// Return early if doc is invalid or already selected
			if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
				return document;
			}

			// Update global variables
			document = doc;
			docElem = document.documentElement;
			documentIsHTML = !isXML(document);

			// Support: IE 9-11, Edge
			// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
			if (preferredDoc !== document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {

				// Support: IE 11, Edge
				if (subWindow.addEventListener) {
					subWindow.addEventListener("unload", unloadHandler, false);

					// Support: IE 9 - 10 only
				} else if (subWindow.attachEvent) {
					subWindow.attachEvent("onunload", unloadHandler);
				}
			}

			/* Attributes
   ---------------------------------------------------------------------- */

			// Support: IE<8
			// Verify that getAttribute really returns attributes and not properties
			// (excepting IE8 booleans)
			support.attributes = assert(function (el) {
				el.className = "i";
				return !el.getAttribute("className");
			});

			/* getElement(s)By*
   ---------------------------------------------------------------------- */

			// Check if getElementsByTagName("*") returns only elements
			support.getElementsByTagName = assert(function (el) {
				el.appendChild(document.createComment(""));
				return !el.getElementsByTagName("*").length;
			});

			// Support: IE<9
			support.getElementsByClassName = rnative.test(document.getElementsByClassName);

			// Support: IE<10
			// Check if getElementById returns elements by name
			// The broken getElementById methods don't pick up programmatically-set names,
			// so use a roundabout getElementsByName test
			support.getById = assert(function (el) {
				docElem.appendChild(el).id = expando;
				return !document.getElementsByName || !document.getElementsByName(expando).length;
			});

			// ID filter and find
			if (support.getById) {
				Expr.filter["ID"] = function (id) {
					var attrId = id.replace(runescape, funescape);
					return function (elem) {
						return elem.getAttribute("id") === attrId;
					};
				};
				Expr.find["ID"] = function (id, context) {
					if (typeof context.getElementById !== "undefined" && documentIsHTML) {
						var elem = context.getElementById(id);
						return elem ? [elem] : [];
					}
				};
			} else {
				Expr.filter["ID"] = function (id) {
					var attrId = id.replace(runescape, funescape);
					return function (elem) {
						var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
						return node && node.value === attrId;
					};
				};

				// Support: IE 6 - 7 only
				// getElementById is not reliable as a find shortcut
				Expr.find["ID"] = function (id, context) {
					if (typeof context.getElementById !== "undefined" && documentIsHTML) {
						var node,
						    i,
						    elems,
						    elem = context.getElementById(id);

						if (elem) {

							// Verify the id attribute
							node = elem.getAttributeNode("id");
							if (node && node.value === id) {
								return [elem];
							}

							// Fall back on getElementsByName
							elems = context.getElementsByName(id);
							i = 0;
							while (elem = elems[i++]) {
								node = elem.getAttributeNode("id");
								if (node && node.value === id) {
									return [elem];
								}
							}
						}

						return [];
					}
				};
			}

			// Tag
			Expr.find["TAG"] = support.getElementsByTagName ? function (tag, context) {
				if (typeof context.getElementsByTagName !== "undefined") {
					return context.getElementsByTagName(tag);

					// DocumentFragment nodes don't have gEBTN
				} else if (support.qsa) {
					return context.querySelectorAll(tag);
				}
			} : function (tag, context) {
				var elem,
				    tmp = [],
				    i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName(tag);

				// Filter out possible comments
				if (tag === "*") {
					while (elem = results[i++]) {
						if (elem.nodeType === 1) {
							tmp.push(elem);
						}
					}

					return tmp;
				}
				return results;
			};

			// Class
			Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
				if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
					return context.getElementsByClassName(className);
				}
			};

			/* QSA/matchesSelector
   ---------------------------------------------------------------------- */

			// QSA and matchesSelector support

			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			rbuggyMatches = [];

			// qSa(:focus) reports false when true (Chrome 21)
			// We allow this because of a bug in IE8/9 that throws an error
			// whenever `document.activeElement` is accessed on an iframe
			// So, we allow :focus to pass through QSA all the time to avoid the IE error
			// See https://bugs.jquery.com/ticket/13378
			rbuggyQSA = [];

			if (support.qsa = rnative.test(document.querySelectorAll)) {
				// Build QSA regex
				// Regex strategy adopted from Diego Perini
				assert(function (el) {
					// Select is set to empty string on purpose
					// This is to test IE's treatment of not explicitly
					// setting a boolean content attribute,
					// since its presence should be enough
					// https://bugs.jquery.com/ticket/12359
					docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>";

					// Support: IE8, Opera 11-12.16
					// Nothing should be selected when empty strings follow ^= or $= or *=
					// The test attribute must be unknown in Opera but "safe" for WinRT
					// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
					if (el.querySelectorAll("[msallowcapture^='']").length) {
						rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
					}

					// Support: IE8
					// Boolean attributes and "value" are not treated correctly
					if (!el.querySelectorAll("[selected]").length) {
						rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
					}

					// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
					if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
						rbuggyQSA.push("~=");
					}

					// Webkit/Opera - :checked should return selected option elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					// IE8 throws error here and will not see later tests
					if (!el.querySelectorAll(":checked").length) {
						rbuggyQSA.push(":checked");
					}

					// Support: Safari 8+, iOS 8+
					// https://bugs.webkit.org/show_bug.cgi?id=136851
					// In-page `selector#id sibling-combinator selector` fails
					if (!el.querySelectorAll("a#" + expando + "+*").length) {
						rbuggyQSA.push(".#.+[+~]");
					}
				});

				assert(function (el) {
					el.innerHTML = "<a href='' disabled='disabled'></a>" + "<select disabled='disabled'><option/></select>";

					// Support: Windows 8 Native Apps
					// The type and name attributes are restricted during .innerHTML assignment
					var input = document.createElement("input");
					input.setAttribute("type", "hidden");
					el.appendChild(input).setAttribute("name", "D");

					// Support: IE8
					// Enforce case-sensitivity of name attribute
					if (el.querySelectorAll("[name=d]").length) {
						rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
					}

					// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
					// IE8 throws error here and will not see later tests
					if (el.querySelectorAll(":enabled").length !== 2) {
						rbuggyQSA.push(":enabled", ":disabled");
					}

					// Support: IE9-11+
					// IE's :disabled selector does not pick up the children of disabled fieldsets
					docElem.appendChild(el).disabled = true;
					if (el.querySelectorAll(":disabled").length !== 2) {
						rbuggyQSA.push(":enabled", ":disabled");
					}

					// Opera 10-11 does not throw on post-comma invalid pseudos
					el.querySelectorAll("*,:x");
					rbuggyQSA.push(",.*:");
				});
			}

			if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {

				assert(function (el) {
					// Check to see if it's possible to do matchesSelector
					// on a disconnected node (IE 9)
					support.disconnectedMatch = matches.call(el, "*");

					// This should fail with an exception
					// Gecko does not error, returns false instead
					matches.call(el, "[s!='']:x");
					rbuggyMatches.push("!=", pseudos);
				});
			}

			rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
			rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

			/* Contains
   ---------------------------------------------------------------------- */
			hasCompare = rnative.test(docElem.compareDocumentPosition);

			// Element contains another
			// Purposefully self-exclusive
			// As in, an element does not contain itself
			contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
				    bup = b && b.parentNode;
				return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
			} : function (a, b) {
				if (b) {
					while (b = b.parentNode) {
						if (b === a) {
							return true;
						}
					}
				}
				return false;
			};

			/* Sorting
   ---------------------------------------------------------------------- */

			// Document order sorting
			sortOrder = hasCompare ? function (a, b) {

				// Flag for duplicate removal
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				// Sort on method existence if only one input has compareDocumentPosition
				var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
				if (compare) {
					return compare;
				}

				// Calculate position if both inputs belong to the same document
				compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) :

				// Otherwise we know they are disconnected
				1;

				// Disconnected nodes
				if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {

					// Choose the first element that is related to our preferred document
					if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
						return -1;
					}
					if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
						return 1;
					}

					// Maintain original order
					return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
				}

				return compare & 4 ? -1 : 1;
			} : function (a, b) {
				// Exit early if the nodes are identical
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				var cur,
				    i = 0,
				    aup = a.parentNode,
				    bup = b.parentNode,
				    ap = [a],
				    bp = [b];

				// Parentless nodes are either documents or disconnected
				if (!aup || !bup) {
					return a === document ? -1 : b === document ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;

					// If the nodes are siblings, we can do a quick check
				} else if (aup === bup) {
					return siblingCheck(a, b);
				}

				// Otherwise we need full lists of their ancestors for comparison
				cur = a;
				while (cur = cur.parentNode) {
					ap.unshift(cur);
				}
				cur = b;
				while (cur = cur.parentNode) {
					bp.unshift(cur);
				}

				// Walk down the tree looking for a discrepancy
				while (ap[i] === bp[i]) {
					i++;
				}

				return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck(ap[i], bp[i]) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
			};

			return document;
		};

		Sizzle.matches = function (expr, elements) {
			return Sizzle(expr, null, null, elements);
		};

		Sizzle.matchesSelector = function (elem, expr) {
			// Set document vars if needed
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			// Make sure that attribute selectors are quoted
			expr = expr.replace(rattributeQuotes, "='$1']");

			if (support.matchesSelector && documentIsHTML && !compilerCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {

				try {
					var ret = matches.call(elem, expr);

					// IE 9's matchesSelector returns false on disconnected nodes
					if (ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11) {
						return ret;
					}
				} catch (e) {}
			}

			return Sizzle(expr, document, null, [elem]).length > 0;
		};

		Sizzle.contains = function (context, elem) {
			// Set document vars if needed
			if ((context.ownerDocument || context) !== document) {
				setDocument(context);
			}
			return contains(context, elem);
		};

		Sizzle.attr = function (elem, name) {
			// Set document vars if needed
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			var fn = Expr.attrHandle[name.toLowerCase()],

			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;

			return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
		};

		Sizzle.escape = function (sel) {
			return (sel + "").replace(rcssescape, fcssescape);
		};

		Sizzle.error = function (msg) {
			throw new Error("Syntax error, unrecognized expression: " + msg);
		};

		/**
   * Document sorting and removing duplicates
   * @param {ArrayLike} results
   */
		Sizzle.uniqueSort = function (results) {
			var elem,
			    duplicates = [],
			    j = 0,
			    i = 0;

			// Unless we *know* we can detect duplicates, assume their presence
			hasDuplicate = !support.detectDuplicates;
			sortInput = !support.sortStable && results.slice(0);
			results.sort(sortOrder);

			if (hasDuplicate) {
				while (elem = results[i++]) {
					if (elem === results[i]) {
						j = duplicates.push(i);
					}
				}
				while (j--) {
					results.splice(duplicates[j], 1);
				}
			}

			// Clear input after sorting to release objects
			// See https://github.com/jquery/sizzle/pull/225
			sortInput = null;

			return results;
		};

		/**
   * Utility function for retrieving the text value of an array of DOM nodes
   * @param {Array|Element} elem
   */
		getText = Sizzle.getText = function (elem) {
			var node,
			    ret = "",
			    i = 0,
			    nodeType = elem.nodeType;

			if (!nodeType) {
				// If no nodeType, this is expected to be an array
				while (node = elem[i++]) {
					// Do not traverse comment nodes
					ret += getText(node);
				}
			} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				// Use textContent for elements
				// innerText usage removed for consistency of new lines (jQuery #11153)
				if (typeof elem.textContent === "string") {
					return elem.textContent;
				} else {
					// Traverse its children
					for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
						ret += getText(elem);
					}
				}
			} else if (nodeType === 3 || nodeType === 4) {
				return elem.nodeValue;
			}
			// Do not include comment or processing instruction nodes

			return ret;
		};

		Expr = Sizzle.selectors = {

			// Can be adjusted by the user
			cacheLength: 50,

			createPseudo: markFunction,

			match: matchExpr,

			attrHandle: {},

			find: {},

			relative: {
				">": { dir: "parentNode", first: true },
				" ": { dir: "parentNode" },
				"+": { dir: "previousSibling", first: true },
				"~": { dir: "previousSibling" }
			},

			preFilter: {
				"ATTR": function ATTR(match) {
					match[1] = match[1].replace(runescape, funescape);

					// Move the given value to match[3] whether quoted or unquoted
					match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

					if (match[2] === "~=") {
						match[3] = " " + match[3] + " ";
					}

					return match.slice(0, 4);
				},

				"CHILD": function CHILD(match) {
					/* matches from matchExpr["CHILD"]
     	1 type (only|nth|...)
     	2 what (child|of-type)
     	3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
     	4 xn-component of xn+y argument ([+-]?\d*n|)
     	5 sign of xn-component
     	6 x of xn-component
     	7 sign of y-component
     	8 y of y-component
     */
					match[1] = match[1].toLowerCase();

					if (match[1].slice(0, 3) === "nth") {
						// nth-* requires argument
						if (!match[3]) {
							Sizzle.error(match[0]);
						}

						// numeric x and y parameters for Expr.filter.CHILD
						// remember that false/true cast respectively to 0/1
						match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
						match[5] = +(match[7] + match[8] || match[3] === "odd");

						// other types prohibit arguments
					} else if (match[3]) {
						Sizzle.error(match[0]);
					}

					return match;
				},

				"PSEUDO": function PSEUDO(match) {
					var excess,
					    unquoted = !match[6] && match[2];

					if (matchExpr["CHILD"].test(match[0])) {
						return null;
					}

					// Accept quoted arguments as-is
					if (match[3]) {
						match[2] = match[4] || match[5] || "";

						// Strip excess characters from unquoted arguments
					} else if (unquoted && rpseudo.test(unquoted) && (
					// Get excess from tokenize (recursively)
					excess = tokenize(unquoted, true)) && (
					// advance to the next closing parenthesis
					excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

						// excess is a negative index
						match[0] = match[0].slice(0, excess);
						match[2] = unquoted.slice(0, excess);
					}

					// Return only captures needed by the pseudo filter method (type and argument)
					return match.slice(0, 3);
				}
			},

			filter: {

				"TAG": function TAG(nodeNameSelector) {
					var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
					return nodeNameSelector === "*" ? function () {
						return true;
					} : function (elem) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
				},

				"CLASS": function CLASS(className) {
					var pattern = classCache[className + " "];

					return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function (elem) {
						return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
					});
				},

				"ATTR": function ATTR(name, operator, check) {
					return function (elem) {
						var result = Sizzle.attr(elem, name);

						if (result == null) {
							return operator === "!=";
						}
						if (!operator) {
							return true;
						}

						result += "";

						return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
					};
				},

				"CHILD": function CHILD(type, what, argument, first, last) {
					var simple = type.slice(0, 3) !== "nth",
					    forward = type.slice(-4) !== "last",
					    ofType = what === "of-type";

					return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function (elem) {
						return !!elem.parentNode;
					} : function (elem, context, xml) {
						var cache,
						    uniqueCache,
						    outerCache,
						    node,
						    nodeIndex,
						    start,
						    dir = simple !== forward ? "nextSibling" : "previousSibling",
						    parent = elem.parentNode,
						    name = ofType && elem.nodeName.toLowerCase(),
						    useCache = !xml && !ofType,
						    diff = false;

						if (parent) {

							// :(first|last|only)-(child|of-type)
							if (simple) {
								while (dir) {
									node = elem;
									while (node = node[dir]) {
										if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {

											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [forward ? parent.firstChild : parent.lastChild];

							// non-xml :nth-child(...) stores cache data on `parent`
							if (forward && useCache) {

								// Seek `elem` from a previously-cached index

								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[expando] || (node[expando] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

								cache = uniqueCache[type] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = nodeIndex && cache[2];
								node = nodeIndex && parent.childNodes[nodeIndex];

								while (node = ++nodeIndex && node && node[dir] || (

								// Fallback to seeking `elem` from the start
								diff = nodeIndex = 0) || start.pop()) {

									// When found, cache indexes on `parent` and break
									if (node.nodeType === 1 && ++diff && node === elem) {
										uniqueCache[type] = [dirruns, nodeIndex, diff];
										break;
									}
								}
							} else {
								// Use previously-cached element index if available
								if (useCache) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[expando] || (node[expando] = {});

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

									cache = uniqueCache[type] || [];
									nodeIndex = cache[0] === dirruns && cache[1];
									diff = nodeIndex;
								}

								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if (diff === false) {
									// Use the same loop as above to seek `elem` from the start
									while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {

										if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {

											// Cache the index of each encountered element
											if (useCache) {
												outerCache = node[expando] || (node[expando] = {});

												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

												uniqueCache[type] = [dirruns, diff];
											}

											if (node === elem) {
												break;
											}
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || diff % first === 0 && diff / first >= 0;
						}
					};
				},

				"PSEUDO": function PSEUDO(pseudo, argument) {
					// pseudo-class names are case-insensitive
					// http://www.w3.org/TR/selectors/#pseudo-classes
					// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
					// Remember that setFilters inherits from pseudos
					var args,
					    fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);

					// The user may use createPseudo to indicate that
					// arguments are needed to create the filter function
					// just as Sizzle does
					if (fn[expando]) {
						return fn(argument);
					}

					// But maintain support for old signatures
					if (fn.length > 1) {
						args = [pseudo, pseudo, "", argument];
						return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
							var idx,
							    matched = fn(seed, argument),
							    i = matched.length;
							while (i--) {
								idx = indexOf(seed, matched[i]);
								seed[idx] = !(matches[idx] = matched[i]);
							}
						}) : function (elem) {
							return fn(elem, 0, args);
						};
					}

					return fn;
				}
			},

			pseudos: {
				// Potentially complex pseudos
				"not": markFunction(function (selector) {
					// Trim the selector passed to compile
					// to avoid treating leading and trailing
					// spaces as combinators
					var input = [],
					    results = [],
					    matcher = compile(selector.replace(rtrim, "$1"));

					return matcher[expando] ? markFunction(function (seed, matches, context, xml) {
						var elem,
						    unmatched = matcher(seed, null, xml, []),
						    i = seed.length;

						// Match elements unmatched by `matcher`
						while (i--) {
							if (elem = unmatched[i]) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) : function (elem, context, xml) {
						input[0] = elem;
						matcher(input, null, xml, results);
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
				}),

				"has": markFunction(function (selector) {
					return function (elem) {
						return Sizzle(selector, elem).length > 0;
					};
				}),

				"contains": markFunction(function (text) {
					text = text.replace(runescape, funescape);
					return function (elem) {
						return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
					};
				}),

				// "Whether an element is represented by a :lang() selector
				// is based solely on the element's language value
				// being equal to the identifier C,
				// or beginning with the identifier C immediately followed by "-".
				// The matching of C against the element's language value is performed case-insensitively.
				// The identifier C does not have to be a valid language name."
				// http://www.w3.org/TR/selectors/#lang-pseudo
				"lang": markFunction(function (lang) {
					// lang value must be a valid identifier
					if (!ridentifier.test(lang || "")) {
						Sizzle.error("unsupported lang: " + lang);
					}
					lang = lang.replace(runescape, funescape).toLowerCase();
					return function (elem) {
						var elemLang;
						do {
							if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {

								elemLang = elemLang.toLowerCase();
								return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
							}
						} while ((elem = elem.parentNode) && elem.nodeType === 1);
						return false;
					};
				}),

				// Miscellaneous
				"target": function target(elem) {
					var hash = window.location && window.location.hash;
					return hash && hash.slice(1) === elem.id;
				},

				"root": function root(elem) {
					return elem === docElem;
				},

				"focus": function focus(elem) {
					return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
				},

				// Boolean properties
				"enabled": createDisabledPseudo(false),
				"disabled": createDisabledPseudo(true),

				"checked": function checked(elem) {
					// In CSS3, :checked should return both checked and selected elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					var nodeName = elem.nodeName.toLowerCase();
					return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
				},

				"selected": function selected(elem) {
					// Accessing this property makes selected-by-default
					// options in Safari work properly
					if (elem.parentNode) {
						elem.parentNode.selectedIndex;
					}

					return elem.selected === true;
				},

				// Contents
				"empty": function empty(elem) {
					// http://www.w3.org/TR/selectors/#empty-pseudo
					// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
					//   but not by others (comment: 8; processing instruction: 7; etc.)
					// nodeType < 6 works because attributes (2) do not appear as children
					for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
						if (elem.nodeType < 6) {
							return false;
						}
					}
					return true;
				},

				"parent": function parent(elem) {
					return !Expr.pseudos["empty"](elem);
				},

				// Element/input types
				"header": function header(elem) {
					return rheader.test(elem.nodeName);
				},

				"input": function input(elem) {
					return rinputs.test(elem.nodeName);
				},

				"button": function button(elem) {
					var name = elem.nodeName.toLowerCase();
					return name === "input" && elem.type === "button" || name === "button";
				},

				"text": function text(elem) {
					var attr;
					return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && (

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					(attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
				},

				// Position-in-collection
				"first": createPositionalPseudo(function () {
					return [0];
				}),

				"last": createPositionalPseudo(function (matchIndexes, length) {
					return [length - 1];
				}),

				"eq": createPositionalPseudo(function (matchIndexes, length, argument) {
					return [argument < 0 ? argument + length : argument];
				}),

				"even": createPositionalPseudo(function (matchIndexes, length) {
					var i = 0;
					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"odd": createPositionalPseudo(function (matchIndexes, length) {
					var i = 1;
					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"lt": createPositionalPseudo(function (matchIndexes, length, argument) {
					var i = argument < 0 ? argument + length : argument;
					for (; --i >= 0;) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"gt": createPositionalPseudo(function (matchIndexes, length, argument) {
					var i = argument < 0 ? argument + length : argument;
					for (; ++i < length;) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				})
			}
		};

		Expr.pseudos["nth"] = Expr.pseudos["eq"];

		// Add button/input type pseudos
		for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
			Expr.pseudos[i] = createInputPseudo(i);
		}
		for (i in { submit: true, reset: true }) {
			Expr.pseudos[i] = createButtonPseudo(i);
		}

		// Easy API for creating new setFilters
		function setFilters() {}
		setFilters.prototype = Expr.filters = Expr.pseudos;
		Expr.setFilters = new setFilters();

		tokenize = Sizzle.tokenize = function (selector, parseOnly) {
			var matched,
			    match,
			    tokens,
			    type,
			    soFar,
			    groups,
			    preFilters,
			    cached = tokenCache[selector + " "];

			if (cached) {
				return parseOnly ? 0 : cached.slice(0);
			}

			soFar = selector;
			groups = [];
			preFilters = Expr.preFilter;

			while (soFar) {

				// Comma and first run
				if (!matched || (match = rcomma.exec(soFar))) {
					if (match) {
						// Don't consume trailing commas as valid
						soFar = soFar.slice(match[0].length) || soFar;
					}
					groups.push(tokens = []);
				}

				matched = false;

				// Combinators
				if (match = rcombinators.exec(soFar)) {
					matched = match.shift();
					tokens.push({
						value: matched,
						// Cast descendant combinators to space
						type: match[0].replace(rtrim, " ")
					});
					soFar = soFar.slice(matched.length);
				}

				// Filters
				for (type in Expr.filter) {
					if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
						matched = match.shift();
						tokens.push({
							value: matched,
							type: type,
							matches: match
						});
						soFar = soFar.slice(matched.length);
					}
				}

				if (!matched) {
					break;
				}
			}

			// Return the length of the invalid excess
			// if we're just parsing
			// Otherwise, throw an error or return tokens
			return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) :
			// Cache the tokens
			tokenCache(selector, groups).slice(0);
		};

		function toSelector(tokens) {
			var i = 0,
			    len = tokens.length,
			    selector = "";
			for (; i < len; i++) {
				selector += tokens[i].value;
			}
			return selector;
		}

		function addCombinator(matcher, combinator, base) {
			var dir = combinator.dir,
			    skip = combinator.next,
			    key = skip || dir,
			    checkNonElements = base && key === "parentNode",
			    doneName = done++;

			return combinator.first ?
			// Check against closest ancestor/preceding element
			function (elem, context, xml) {
				while (elem = elem[dir]) {
					if (elem.nodeType === 1 || checkNonElements) {
						return matcher(elem, context, xml);
					}
				}
				return false;
			} :

			// Check against all ancestor/preceding elements
			function (elem, context, xml) {
				var oldCache,
				    uniqueCache,
				    outerCache,
				    newCache = [dirruns, doneName];

				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if (xml) {
					while (elem = elem[dir]) {
						if (elem.nodeType === 1 || checkNonElements) {
							if (matcher(elem, context, xml)) {
								return true;
							}
						}
					}
				} else {
					while (elem = elem[dir]) {
						if (elem.nodeType === 1 || checkNonElements) {
							outerCache = elem[expando] || (elem[expando] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

							if (skip && skip === elem.nodeName.toLowerCase()) {
								elem = elem[dir] || elem;
							} else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {

								// Assign to newCache so results back-propagate to previous elements
								return newCache[2] = oldCache[2];
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[key] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if (newCache[2] = matcher(elem, context, xml)) {
									return true;
								}
							}
						}
					}
				}
				return false;
			};
		}

		function elementMatcher(matchers) {
			return matchers.length > 1 ? function (elem, context, xml) {
				var i = matchers.length;
				while (i--) {
					if (!matchers[i](elem, context, xml)) {
						return false;
					}
				}
				return true;
			} : matchers[0];
		}

		function multipleContexts(selector, contexts, results) {
			var i = 0,
			    len = contexts.length;
			for (; i < len; i++) {
				Sizzle(selector, contexts[i], results);
			}
			return results;
		}

		function condense(unmatched, map, filter, context, xml) {
			var elem,
			    newUnmatched = [],
			    i = 0,
			    len = unmatched.length,
			    mapped = map != null;

			for (; i < len; i++) {
				if (elem = unmatched[i]) {
					if (!filter || filter(elem, context, xml)) {
						newUnmatched.push(elem);
						if (mapped) {
							map.push(i);
						}
					}
				}
			}

			return newUnmatched;
		}

		function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
			if (postFilter && !postFilter[expando]) {
				postFilter = setMatcher(postFilter);
			}
			if (postFinder && !postFinder[expando]) {
				postFinder = setMatcher(postFinder, postSelector);
			}
			return markFunction(function (seed, results, context, xml) {
				var temp,
				    i,
				    elem,
				    preMap = [],
				    postMap = [],
				    preexisting = results.length,


				// Get initial elements from seed or context
				elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),


				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
				    matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || (seed ? preFilter : preexisting || postFilter) ?

				// ...intermediate processing is necessary
				[] :

				// ...otherwise use results directly
				results : matcherIn;

				// Find primary matches
				if (matcher) {
					matcher(matcherIn, matcherOut, context, xml);
				}

				// Apply postFilter
				if (postFilter) {
					temp = condense(matcherOut, postMap);
					postFilter(temp, [], context, xml);

					// Un-match failing elements by moving them back to matcherIn
					i = temp.length;
					while (i--) {
						if (elem = temp[i]) {
							matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
						}
					}
				}

				if (seed) {
					if (postFinder || preFilter) {
						if (postFinder) {
							// Get the final matcherOut by condensing this intermediate into postFinder contexts
							temp = [];
							i = matcherOut.length;
							while (i--) {
								if (elem = matcherOut[i]) {
									// Restore matcherIn since elem is not yet a final match
									temp.push(matcherIn[i] = elem);
								}
							}
							postFinder(null, matcherOut = [], temp, xml);
						}

						// Move matched elements from seed to results to keep them synchronized
						i = matcherOut.length;
						while (i--) {
							if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

								seed[temp] = !(results[temp] = elem);
							}
						}
					}

					// Add elements to results, through postFinder if defined
				} else {
					matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
					if (postFinder) {
						postFinder(null, results, matcherOut, xml);
					} else {
						push.apply(results, matcherOut);
					}
				}
			});
		}

		function matcherFromTokens(tokens) {
			var checkContext,
			    matcher,
			    j,
			    len = tokens.length,
			    leadingRelative = Expr.relative[tokens[0].type],
			    implicitRelative = leadingRelative || Expr.relative[" "],
			    i = leadingRelative ? 1 : 0,


			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator(function (elem) {
				return elem === checkContext;
			}, implicitRelative, true),
			    matchAnyContext = addCombinator(function (elem) {
				return indexOf(checkContext, elem) > -1;
			}, implicitRelative, true),
			    matchers = [function (elem, context, xml) {
				var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			}];

			for (; i < len; i++) {
				if (matcher = Expr.relative[tokens[i].type]) {
					matchers = [addCombinator(elementMatcher(matchers), matcher)];
				} else {
					matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

					// Return special upon seeing a positional matcher
					if (matcher[expando]) {
						// Find the next relative operator (if any) for proper handling
						j = ++i;
						for (; j < len; j++) {
							if (Expr.relative[tokens[j].type]) {
								break;
							}
						}
						return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
					}
					matchers.push(matcher);
				}
			}

			return elementMatcher(matchers);
		}

		function matcherFromGroupMatchers(elementMatchers, setMatchers) {
			var bySet = setMatchers.length > 0,
			    byElement = elementMatchers.length > 0,
			    superMatcher = function superMatcher(seed, context, xml, results, outermost) {
				var elem,
				    j,
				    matcher,
				    matchedCount = 0,
				    i = "0",
				    unmatched = seed && [],
				    setMatched = [],
				    contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]("*", outermost),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1,
				    len = elems.length;

				if (outermost) {
					outermostContext = context === document || context || outermost;
				}

				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for (; i !== len && (elem = elems[i]) != null; i++) {
					if (byElement && elem) {
						j = 0;
						if (!context && elem.ownerDocument !== document) {
							setDocument(elem);
							xml = !documentIsHTML;
						}
						while (matcher = elementMatchers[j++]) {
							if (matcher(elem, context || document, xml)) {
								results.push(elem);
								break;
							}
						}
						if (outermost) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if (bySet) {
						// They will have gone through all possible matchers
						if (elem = !matcher && elem) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if (seed) {
							unmatched.push(elem);
						}
					}
				}

				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;

				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if (bySet && i !== matchedCount) {
					j = 0;
					while (matcher = setMatchers[j++]) {
						matcher(unmatched, setMatched, context, xml);
					}

					if (seed) {
						// Reintegrate element matches to eliminate the need for sorting
						if (matchedCount > 0) {
							while (i--) {
								if (!(unmatched[i] || setMatched[i])) {
									setMatched[i] = pop.call(results);
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense(setMatched);
					}

					// Add matches to results
					push.apply(results, setMatched);

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {

						Sizzle.uniqueSort(results);
					}
				}

				// Override manipulation of globals by nested matchers
				if (outermost) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

			return bySet ? markFunction(superMatcher) : superMatcher;
		}

		compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
			var i,
			    setMatchers = [],
			    elementMatchers = [],
			    cached = compilerCache[selector + " "];

			if (!cached) {
				// Generate a function of recursive functions that can be used to check each element
				if (!match) {
					match = tokenize(selector);
				}
				i = match.length;
				while (i--) {
					cached = matcherFromTokens(match[i]);
					if (cached[expando]) {
						setMatchers.push(cached);
					} else {
						elementMatchers.push(cached);
					}
				}

				// Cache the compiled function
				cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

				// Save selector and tokenization
				cached.selector = selector;
			}
			return cached;
		};

		/**
   * A low-level selection function that works with Sizzle's compiled
   *  selector functions
   * @param {String|Function} selector A selector or a pre-compiled
   *  selector function built with Sizzle.compile
   * @param {Element} context
   * @param {Array} [results]
   * @param {Array} [seed] A set of elements to match against
   */
		select = Sizzle.select = function (selector, context, results, seed) {
			var i,
			    tokens,
			    token,
			    type,
			    find,
			    compiled = typeof selector === "function" && selector,
			    match = !seed && tokenize(selector = compiled.selector || selector);

			results = results || [];

			// Try to minimize operations if there is only one selector in the list and no seed
			// (the latter of which guarantees us context)
			if (match.length === 1) {

				// Reduce context if the leading compound selector is an ID
				tokens = match[0] = match[0].slice(0);
				if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {

					context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
					if (!context) {
						return results;

						// Precompiled matchers will still verify ancestry, so step up a level
					} else if (compiled) {
						context = context.parentNode;
					}

					selector = selector.slice(tokens.shift().value.length);
				}

				// Fetch a seed set for right-to-left matching
				i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
				while (i--) {
					token = tokens[i];

					// Abort if we hit a combinator
					if (Expr.relative[type = token.type]) {
						break;
					}
					if (find = Expr.find[type]) {
						// Search, expanding context for leading sibling combinators
						if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {

							// If seed is empty or no tokens remain, we can return early
							tokens.splice(i, 1);
							selector = seed.length && toSelector(tokens);
							if (!selector) {
								push.apply(results, seed);
								return results;
							}

							break;
						}
					}
				}
			}

			// Compile and execute a filtering function if one is not provided
			// Provide `match` to avoid retokenization if we modified the selector above
			(compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
			return results;
		};

		// One-time assignments

		// Sort stability
		support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

		// Support: Chrome 14-35+
		// Always assume duplicates if they aren't passed to the comparison function
		support.detectDuplicates = !!hasDuplicate;

		// Initialize against the default document
		setDocument();

		// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
		// Detached nodes confoundingly follow *each other*
		support.sortDetached = assert(function (el) {
			// Should return 1, but returns 4 (following)
			return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
		});

		// Support: IE<8
		// Prevent attribute/property "interpolation"
		// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
		if (!assert(function (el) {
			el.innerHTML = "<a href='#'></a>";
			return el.firstChild.getAttribute("href") === "#";
		})) {
			addHandle("type|href|height|width", function (elem, name, isXML) {
				if (!isXML) {
					return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
				}
			});
		}

		// Support: IE<9
		// Use defaultValue in place of getAttribute("value")
		if (!support.attributes || !assert(function (el) {
			el.innerHTML = "<input/>";
			el.firstChild.setAttribute("value", "");
			return el.firstChild.getAttribute("value") === "";
		})) {
			addHandle("value", function (elem, name, isXML) {
				if (!isXML && elem.nodeName.toLowerCase() === "input") {
					return elem.defaultValue;
				}
			});
		}

		// Support: IE<9
		// Use getAttributeNode to fetch booleans when getAttribute lies
		if (!assert(function (el) {
			return el.getAttribute("disabled") == null;
		})) {
			addHandle(booleans, function (elem, name, isXML) {
				var val;
				if (!isXML) {
					return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
				}
			});
		}

		return Sizzle;
	}(window);

	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;

	// Deprecated
	jQuery.expr[":"] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	jQuery.escapeSelector = Sizzle.escape;

	var dir = function dir(elem, _dir, until) {
		var matched = [],
		    truncate = until !== undefined;

		while ((elem = elem[_dir]) && elem.nodeType !== 9) {
			if (elem.nodeType === 1) {
				if (truncate && jQuery(elem).is(until)) {
					break;
				}
				matched.push(elem);
			}
		}
		return matched;
	};

	var _siblings = function _siblings(n, elem) {
		var matched = [];

		for (; n; n = n.nextSibling) {
			if (n.nodeType === 1 && n !== elem) {
				matched.push(n);
			}
		}

		return matched;
	};

	var rneedsContext = jQuery.expr.match.needsContext;

	function nodeName(elem, name) {

		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	};
	var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow(elements, qualifier, not) {
		if (jQuery.isFunction(qualifier)) {
			return jQuery.grep(elements, function (elem, i) {
				return !!qualifier.call(elem, i, elem) !== not;
			});
		}

		// Single element
		if (qualifier.nodeType) {
			return jQuery.grep(elements, function (elem) {
				return elem === qualifier !== not;
			});
		}

		// Arraylike of elements (jQuery, arguments, Array)
		if (typeof qualifier !== "string") {
			return jQuery.grep(elements, function (elem) {
				return indexOf.call(qualifier, elem) > -1 !== not;
			});
		}

		// Simple selector that can be filtered directly, removing non-Elements
		if (risSimple.test(qualifier)) {
			return jQuery.filter(qualifier, elements, not);
		}

		// Complex selector, compare the two sets, removing non-Elements
		qualifier = jQuery.filter(qualifier, elements);
		return jQuery.grep(elements, function (elem) {
			return indexOf.call(qualifier, elem) > -1 !== not && elem.nodeType === 1;
		});
	}

	jQuery.filter = function (expr, elems, not) {
		var elem = elems[0];

		if (not) {
			expr = ":not(" + expr + ")";
		}

		if (elems.length === 1 && elem.nodeType === 1) {
			return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
		}

		return jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
			return elem.nodeType === 1;
		}));
	};

	jQuery.fn.extend({
		find: function find(selector) {
			var i,
			    ret,
			    len = this.length,
			    self = this;

			if (typeof selector !== "string") {
				return this.pushStack(jQuery(selector).filter(function () {
					for (i = 0; i < len; i++) {
						if (jQuery.contains(self[i], this)) {
							return true;
						}
					}
				}));
			}

			ret = this.pushStack([]);

			for (i = 0; i < len; i++) {
				jQuery.find(selector, self[i], ret);
			}

			return len > 1 ? jQuery.uniqueSort(ret) : ret;
		},
		filter: function filter(selector) {
			return this.pushStack(winnow(this, selector || [], false));
		},
		not: function not(selector) {
			return this.pushStack(winnow(this, selector || [], true));
		},
		is: function is(selector) {
			return !!winnow(this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
		}
	});

	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,


	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
	    init = jQuery.fn.init = function (selector, context, root) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if (!selector) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if (typeof selector === "string") {
			if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [null, selector, null];
			} else {
				match = rquickExpr.exec(selector);
			}

			// Match html or make sure no context is specified for #id
			if (match && (match[1] || !context)) {

				// HANDLE: $(html) -> $(array)
				if (match[1]) {
					context = context instanceof jQuery ? context[0] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));

					// HANDLE: $(html, props)
					if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
						for (match in context) {

							// Properties of context are called as methods if possible
							if (jQuery.isFunction(this[match])) {
								this[match](context[match]);

								// ...and otherwise set as attributes
							} else {
								this.attr(match, context[match]);
							}
						}
					}

					return this;

					// HANDLE: $(#id)
				} else {
					elem = document.getElementById(match[2]);

					if (elem) {

						// Inject the element directly into the jQuery object
						this[0] = elem;
						this.length = 1;
					}
					return this;
				}

				// HANDLE: $(expr, $(...))
			} else if (!context || context.jquery) {
				return (context || root).find(selector);

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor(context).find(selector);
			}

			// HANDLE: $(DOMElement)
		} else if (selector.nodeType) {
			this[0] = selector;
			this.length = 1;
			return this;

			// HANDLE: $(function)
			// Shortcut for document ready
		} else if (jQuery.isFunction(selector)) {
			return root.ready !== undefined ? root.ready(selector) :

			// Execute immediately if ready is not present
			selector(jQuery);
		}

		return jQuery.makeArray(selector, this);
	};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery(document);

	var rparentsprev = /^(?:parents|prev(?:Until|All))/,


	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

	jQuery.fn.extend({
		has: function has(target) {
			var targets = jQuery(target, this),
			    l = targets.length;

			return this.filter(function () {
				var i = 0;
				for (; i < l; i++) {
					if (jQuery.contains(this, targets[i])) {
						return true;
					}
				}
			});
		},

		closest: function closest(selectors, context) {
			var cur,
			    i = 0,
			    l = this.length,
			    matched = [],
			    targets = typeof selectors !== "string" && jQuery(selectors);

			// Positional selectors never match, since there's no _selection_ context
			if (!rneedsContext.test(selectors)) {
				for (; i < l; i++) {
					for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {

						// Always skip document fragments
						if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {

							matched.push(cur);
							break;
						}
					}
				}
			}

			return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
		},

		// Determine the position of an element within the set
		index: function index(elem) {

			// No argument, return index in parent
			if (!elem) {
				return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if (typeof elem === "string") {
				return indexOf.call(jQuery(elem), this[0]);
			}

			// Locate the position of the desired element
			return indexOf.call(this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem);
		},

		add: function add(selector, context) {
			return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
		},

		addBack: function addBack(selector) {
			return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
		}
	});

	function sibling(cur, dir) {
		while ((cur = cur[dir]) && cur.nodeType !== 1) {}
		return cur;
	}

	jQuery.each({
		parent: function parent(elem) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function parents(elem) {
			return dir(elem, "parentNode");
		},
		parentsUntil: function parentsUntil(elem, i, until) {
			return dir(elem, "parentNode", until);
		},
		next: function next(elem) {
			return sibling(elem, "nextSibling");
		},
		prev: function prev(elem) {
			return sibling(elem, "previousSibling");
		},
		nextAll: function nextAll(elem) {
			return dir(elem, "nextSibling");
		},
		prevAll: function prevAll(elem) {
			return dir(elem, "previousSibling");
		},
		nextUntil: function nextUntil(elem, i, until) {
			return dir(elem, "nextSibling", until);
		},
		prevUntil: function prevUntil(elem, i, until) {
			return dir(elem, "previousSibling", until);
		},
		siblings: function siblings(elem) {
			return _siblings((elem.parentNode || {}).firstChild, elem);
		},
		children: function children(elem) {
			return _siblings(elem.firstChild);
		},
		contents: function contents(elem) {
			if (nodeName(elem, "iframe")) {
				return elem.contentDocument;
			}

			// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
			// Treat the template element as a regular one in browsers that
			// don't support it.
			if (nodeName(elem, "template")) {
				elem = elem.content || elem;
			}

			return jQuery.merge([], elem.childNodes);
		}
	}, function (name, fn) {
		jQuery.fn[name] = function (until, selector) {
			var matched = jQuery.map(this, fn, until);

			if (name.slice(-5) !== "Until") {
				selector = until;
			}

			if (selector && typeof selector === "string") {
				matched = jQuery.filter(selector, matched);
			}

			if (this.length > 1) {

				// Remove duplicates
				if (!guaranteedUnique[name]) {
					jQuery.uniqueSort(matched);
				}

				// Reverse order for parents* and prev-derivatives
				if (rparentsprev.test(name)) {
					matched.reverse();
				}
			}

			return this.pushStack(matched);
		};
	});
	var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

	// Convert String-formatted options into Object-formatted ones
	function createOptions(options) {
		var object = {};
		jQuery.each(options.match(rnothtmlwhite) || [], function (_, flag) {
			object[flag] = true;
		});
		return object;
	}

	/*
  * Create a callback list using the following parameters:
  *
  *	options: an optional list of space-separated options that will change how
  *			the callback list behaves or a more traditional option object
  *
  * By default a callback list will act like an event callback list and can be
  * "fired" multiple times.
  *
  * Possible options:
  *
  *	once:			will ensure the callback list can only be fired once (like a Deferred)
  *
  *	memory:			will keep track of previous values and will call any callback added
  *					after the list has been fired right away with the latest "memorized"
  *					values (like a Deferred)
  *
  *	unique:			will ensure a callback can only be added once (no duplicate in the list)
  *
  *	stopOnFalse:	interrupt callings when a callback returns false
  *
  */
	jQuery.Callbacks = function (options) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);

		var // Flag to know if list is currently firing
		firing,


		// Last fire value for non-forgettable lists
		memory,


		// Flag to know if list was already fired
		_fired,


		// Flag to prevent firing
		_locked,


		// Actual callback list
		list = [],


		// Queue of execution data for repeatable lists
		queue = [],


		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,


		// Fire callbacks
		fire = function fire() {

			// Enforce single-firing
			_locked = _locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			_fired = firing = true;
			for (; queue.length; firingIndex = -1) {
				memory = queue.shift();
				while (++firingIndex < list.length) {

					// Run callback and check for early termination
					if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if (!options.memory) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if (_locked) {

				// Keep an empty list if we have data for future add calls
				if (memory) {
					list = [];

					// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},


		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function add() {
				if (list) {

					// If we have memory from a past run, we should fire after adding
					if (memory && !firing) {
						firingIndex = list.length - 1;
						queue.push(memory);
					}

					(function add(args) {
						jQuery.each(args, function (_, arg) {
							if (jQuery.isFunction(arg)) {
								if (!options.unique || !self.has(arg)) {
									list.push(arg);
								}
							} else if (arg && arg.length && jQuery.type(arg) !== "string") {

								// Inspect recursively
								add(arg);
							}
						});
					})(arguments);

					if (memory && !firing) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function remove() {
				jQuery.each(arguments, function (_, arg) {
					var index;
					while ((index = jQuery.inArray(arg, list, index)) > -1) {
						list.splice(index, 1);

						// Handle firing indexes
						if (index <= firingIndex) {
							firingIndex--;
						}
					}
				});
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function has(fn) {
				return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function empty() {
				if (list) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function disable() {
				_locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function disabled() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function lock() {
				_locked = queue = [];
				if (!memory && !firing) {
					list = memory = "";
				}
				return this;
			},
			locked: function locked() {
				return !!_locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function fireWith(context, args) {
				if (!_locked) {
					args = args || [];
					args = [context, args.slice ? args.slice() : args];
					queue.push(args);
					if (!firing) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function fire() {
				self.fireWith(this, arguments);
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function fired() {
				return !!_fired;
			}
		};

		return self;
	};

	function Identity(v) {
		return v;
	}
	function Thrower(ex) {
		throw ex;
	}

	function adoptValue(value, resolve, reject, noValue) {
		var method;

		try {

			// Check for promise aspect first to privilege synchronous behavior
			if (value && jQuery.isFunction(method = value.promise)) {
				method.call(value).done(resolve).fail(reject);

				// Other thenables
			} else if (value && jQuery.isFunction(method = value.then)) {
				method.call(value, resolve, reject);

				// Other non-thenables
			} else {

				// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
				// * false: [ value ].slice( 0 ) => resolve( value )
				// * true: [ value ].slice( 1 ) => resolve()
				resolve.apply(undefined, [value].slice(noValue));
			}

			// For Promises/A+, convert exceptions into rejections
			// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
			// Deferred#then to conditionally suppress rejection.
		} catch (value) {

			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			reject.apply(undefined, [value]);
		}
	}

	jQuery.extend({

		Deferred: function Deferred(func) {
			var tuples = [

			// action, add listener, callbacks,
			// ... .then handlers, argument index, [final state]
			["notify", "progress", jQuery.Callbacks("memory"), jQuery.Callbacks("memory"), 2], ["resolve", "done", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 1, "rejected"]],
			    _state = "pending",
			    _promise = {
				state: function state() {
					return _state;
				},
				always: function always() {
					deferred.done(arguments).fail(arguments);
					return this;
				},
				"catch": function _catch(fn) {
					return _promise.then(null, fn);
				},

				// Keep pipe for back-compat
				pipe: function pipe() /* fnDone, fnFail, fnProgress */{
					var fns = arguments;

					return jQuery.Deferred(function (newDefer) {
						jQuery.each(tuples, function (i, tuple) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction(fns[tuple[4]]) && fns[tuple[4]];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[tuple[1]](function () {
								var returned = fn && fn.apply(this, arguments);
								if (returned && jQuery.isFunction(returned.promise)) {
									returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
								} else {
									newDefer[tuple[0] + "With"](this, fn ? [returned] : arguments);
								}
							});
						});
						fns = null;
					}).promise();
				},
				then: function then(onFulfilled, onRejected, onProgress) {
					var maxDepth = 0;
					function resolve(depth, deferred, handler, special) {
						return function () {
							var that = this,
							    args = arguments,
							    mightThrow = function mightThrow() {
								var returned, then;

								// Support: Promises/A+ section 2.3.3.3.3
								// https://promisesaplus.com/#point-59
								// Ignore double-resolution attempts
								if (depth < maxDepth) {
									return;
								}

								returned = handler.apply(that, args);

								// Support: Promises/A+ section 2.3.1
								// https://promisesaplus.com/#point-48
								if (returned === deferred.promise()) {
									throw new TypeError("Thenable self-resolution");
								}

								// Support: Promises/A+ sections 2.3.3.1, 3.5
								// https://promisesaplus.com/#point-54
								// https://promisesaplus.com/#point-75
								// Retrieve `then` only once
								then = returned && (

								// Support: Promises/A+ section 2.3.4
								// https://promisesaplus.com/#point-64
								// Only check objects and functions for thenability
								(typeof returned === "undefined" ? "undefined" : _typeof(returned)) === "object" || typeof returned === "function") && returned.then;

								// Handle a returned thenable
								if (jQuery.isFunction(then)) {

									// Special processors (notify) just wait for resolution
									if (special) {
										then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special));

										// Normal processors (resolve) also hook into progress
									} else {

										// ...and disregard older resolution values
										maxDepth++;

										then.call(returned, resolve(maxDepth, deferred, Identity, special), resolve(maxDepth, deferred, Thrower, special), resolve(maxDepth, deferred, Identity, deferred.notifyWith));
									}

									// Handle all other returned values
								} else {

									// Only substitute handlers pass on context
									// and multiple values (non-spec behavior)
									if (handler !== Identity) {
										that = undefined;
										args = [returned];
									}

									// Process the value(s)
									// Default process is resolve
									(special || deferred.resolveWith)(that, args);
								}
							},


							// Only normal processors (resolve) catch and reject exceptions
							process = special ? mightThrow : function () {
								try {
									mightThrow();
								} catch (e) {

									if (jQuery.Deferred.exceptionHook) {
										jQuery.Deferred.exceptionHook(e, process.stackTrace);
									}

									// Support: Promises/A+ section 2.3.3.3.4.1
									// https://promisesaplus.com/#point-61
									// Ignore post-resolution exceptions
									if (depth + 1 >= maxDepth) {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if (handler !== Thrower) {
											that = undefined;
											args = [e];
										}

										deferred.rejectWith(that, args);
									}
								}
							};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if (depth) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if (jQuery.Deferred.getStackHook) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout(process);
							}
						};
					}

					return jQuery.Deferred(function (newDefer) {

						// progress_handlers.add( ... )
						tuples[0][3].add(resolve(0, newDefer, jQuery.isFunction(onProgress) ? onProgress : Identity, newDefer.notifyWith));

						// fulfilled_handlers.add( ... )
						tuples[1][3].add(resolve(0, newDefer, jQuery.isFunction(onFulfilled) ? onFulfilled : Identity));

						// rejected_handlers.add( ... )
						tuples[2][3].add(resolve(0, newDefer, jQuery.isFunction(onRejected) ? onRejected : Thrower));
					}).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function promise(obj) {
					return obj != null ? jQuery.extend(obj, _promise) : _promise;
				}
			},
			    deferred = {};

			// Add list-specific methods
			jQuery.each(tuples, function (i, tuple) {
				var list = tuple[2],
				    stateString = tuple[5];

				// promise.progress = list.add
				// promise.done = list.add
				// promise.fail = list.add
				_promise[tuple[1]] = list.add;

				// Handle state
				if (stateString) {
					list.add(function () {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						_state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[3 - i][2].disable,

					// progress_callbacks.lock
					tuples[0][2].lock);
				}

				// progress_handlers.fire
				// fulfilled_handlers.fire
				// rejected_handlers.fire
				list.add(tuple[3].fire);

				// deferred.notify = function() { deferred.notifyWith(...) }
				// deferred.resolve = function() { deferred.resolveWith(...) }
				// deferred.reject = function() { deferred.rejectWith(...) }
				deferred[tuple[0]] = function () {
					deferred[tuple[0] + "With"](this === deferred ? undefined : this, arguments);
					return this;
				};

				// deferred.notifyWith = list.fireWith
				// deferred.resolveWith = list.fireWith
				// deferred.rejectWith = list.fireWith
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			_promise.promise(deferred);

			// Call given func if any
			if (func) {
				func.call(deferred, deferred);
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function when(singleValue) {
			var

			// count of uncompleted subordinates
			remaining = arguments.length,


			// count of unprocessed arguments
			i = remaining,


			// subordinate fulfillment data
			resolveContexts = Array(i),
			    resolveValues = _slice.call(arguments),


			// the master Deferred
			master = jQuery.Deferred(),


			// subordinate callback factory
			updateFunc = function updateFunc(i) {
				return function (value) {
					resolveContexts[i] = this;
					resolveValues[i] = arguments.length > 1 ? _slice.call(arguments) : value;
					if (! --remaining) {
						master.resolveWith(resolveContexts, resolveValues);
					}
				};
			};

			// Single- and empty arguments are adopted like Promise.resolve
			if (remaining <= 1) {
				adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.reject, !remaining);

				// Use .then() to unwrap secondary thenables (cf. gh-3000)
				if (master.state() === "pending" || jQuery.isFunction(resolveValues[i] && resolveValues[i].then)) {

					return master.then();
				}
			}

			// Multiple arguments are aggregated like Promise.all array elements
			while (i--) {
				adoptValue(resolveValues[i], updateFunc(i), master.reject);
			}

			return master.promise();
		}
	});

	// These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

	jQuery.Deferred.exceptionHook = function (error, stack) {

		// Support: IE 8 - 9 only
		// Console exists when dev tools are open, which can happen at any time
		if (window.console && window.console.warn && error && rerrorNames.test(error.name)) {
			window.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
		}
	};

	jQuery.readyException = function (error) {
		window.setTimeout(function () {
			throw error;
		});
	};

	// The deferred used on DOM ready
	var readyList = jQuery.Deferred();

	jQuery.fn.ready = function (fn) {

		readyList.then(fn

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		).catch(function (error) {
			jQuery.readyException(error);
		});

		return this;
	};

	jQuery.extend({

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Handle when the DOM is ready
		ready: function ready(wait) {

			// Abort if there are pending holds or we're already ready
			if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if (wait !== true && --jQuery.readyWait > 0) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith(document, [jQuery]);
		}
	});

	jQuery.ready.then = readyList.then;

	// The ready event handler and self cleanup method
	function completed() {
		document.removeEventListener("DOMContentLoaded", completed);
		window.removeEventListener("load", completed);
		jQuery.ready();
	}

	// Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) {

		// Handle it asynchronously to allow scripts the opportunity to delay ready
		window.setTimeout(jQuery.ready);
	} else {

		// Use the handy event callback
		document.addEventListener("DOMContentLoaded", completed);

		// A fallback to window.onload, that will always work
		window.addEventListener("load", completed);
	}

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function access(elems, fn, key, value, chainable, emptyGet, raw) {
		var i = 0,
		    len = elems.length,
		    bulk = key == null;

		// Sets many values
		if (jQuery.type(key) === "object") {
			chainable = true;
			for (i in key) {
				access(elems, fn, i, key[i], true, emptyGet, raw);
			}

			// Sets one value
		} else if (value !== undefined) {
			chainable = true;

			if (!jQuery.isFunction(value)) {
				raw = true;
			}

			if (bulk) {

				// Bulk operations run against the entire set
				if (raw) {
					fn.call(elems, value);
					fn = null;

					// ...except when executing function values
				} else {
					bulk = fn;
					fn = function fn(elem, key, value) {
						return bulk.call(jQuery(elem), value);
					};
				}
			}

			if (fn) {
				for (; i < len; i++) {
					fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
				}
			}
		}

		if (chainable) {
			return elems;
		}

		// Gets
		if (bulk) {
			return fn.call(elems);
		}

		return len ? fn(elems[0], key) : emptyGet;
	};
	var acceptData = function acceptData(owner) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
	};

	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		cache: function cache(owner) {

			// Check if the owner object already has a cache
			var value = owner[this.expando];

			// If not, create one
			if (!value) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if (acceptData(owner)) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if (owner.nodeType) {
						owner[this.expando] = value;

						// Otherwise secure it in a non-enumerable property
						// configurable must be true to allow the property to be
						// deleted when data is removed
					} else {
						Object.defineProperty(owner, this.expando, {
							value: value,
							configurable: true
						});
					}
				}
			}

			return value;
		},
		set: function set(owner, data, value) {
			var prop,
			    cache = this.cache(owner);

			// Handle: [ owner, key, value ] args
			// Always use camelCase key (gh-2257)
			if (typeof data === "string") {
				cache[jQuery.camelCase(data)] = value;

				// Handle: [ owner, { properties } ] args
			} else {

				// Copy the properties one-by-one to the cache object
				for (prop in data) {
					cache[jQuery.camelCase(prop)] = data[prop];
				}
			}
			return cache;
		},
		get: function get(owner, key) {
			return key === undefined ? this.cache(owner) :

			// Always use camelCase key (gh-2257)
			owner[this.expando] && owner[this.expando][jQuery.camelCase(key)];
		},
		access: function access(owner, key, value) {

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if (key === undefined || key && typeof key === "string" && value === undefined) {

				return this.get(owner, key);
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set(owner, key, value);

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function remove(owner, key) {
			var i,
			    cache = owner[this.expando];

			if (cache === undefined) {
				return;
			}

			if (key !== undefined) {

				// Support array or space separated string of keys
				if (Array.isArray(key)) {

					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map(jQuery.camelCase);
				} else {
					key = jQuery.camelCase(key);

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
				}

				i = key.length;

				while (i--) {
					delete cache[key[i]];
				}
			}

			// Remove the expando if there's no more data
			if (key === undefined || jQuery.isEmptyObject(cache)) {

				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if (owner.nodeType) {
					owner[this.expando] = undefined;
				} else {
					delete owner[this.expando];
				}
			}
		},
		hasData: function hasData(owner) {
			var cache = owner[this.expando];
			return cache !== undefined && !jQuery.isEmptyObject(cache);
		}
	};
	var dataPriv = new Data();

	var dataUser = new Data();

	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	    rmultiDash = /[A-Z]/g;

	function getData(data) {
		if (data === "true") {
			return true;
		}

		if (data === "false") {
			return false;
		}

		if (data === "null") {
			return null;
		}

		// Only convert to a number if it doesn't change the string
		if (data === +data + "") {
			return +data;
		}

		if (rbrace.test(data)) {
			return JSON.parse(data);
		}

		return data;
	}

	function dataAttr(elem, key, data) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if (data === undefined && elem.nodeType === 1) {
			name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
			data = elem.getAttribute(name);

			if (typeof data === "string") {
				try {
					data = getData(data);
				} catch (e) {}

				// Make sure we set the data so it isn't changed later
				dataUser.set(elem, key, data);
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend({
		hasData: function hasData(elem) {
			return dataUser.hasData(elem) || dataPriv.hasData(elem);
		},

		data: function data(elem, name, _data) {
			return dataUser.access(elem, name, _data);
		},

		removeData: function removeData(elem, name) {
			dataUser.remove(elem, name);
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function _data(elem, name, data) {
			return dataPriv.access(elem, name, data);
		},

		_removeData: function _removeData(elem, name) {
			dataPriv.remove(elem, name);
		}
	});

	jQuery.fn.extend({
		data: function data(key, value) {
			var i,
			    name,
			    data,
			    elem = this[0],
			    attrs = elem && elem.attributes;

			// Gets all values
			if (key === undefined) {
				if (this.length) {
					data = dataUser.get(elem);

					if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
						i = attrs.length;
						while (i--) {

							// Support: IE 11 only
							// The attrs elements can be null (#14894)
							if (attrs[i]) {
								name = attrs[i].name;
								if (name.indexOf("data-") === 0) {
									name = jQuery.camelCase(name.slice(5));
									dataAttr(elem, name, data[name]);
								}
							}
						}
						dataPriv.set(elem, "hasDataAttrs", true);
					}
				}

				return data;
			}

			// Sets multiple values
			if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === "object") {
				return this.each(function () {
					dataUser.set(this, key);
				});
			}

			return access(this, function (value) {
				var data;

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if (elem && value === undefined) {

					// Attempt to get data from the cache
					// The key will always be camelCased in Data
					data = dataUser.get(elem, key);
					if (data !== undefined) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr(elem, key);
					if (data !== undefined) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				this.each(function () {

					// We always store the camelCased key
					dataUser.set(this, key, value);
				});
			}, null, value, arguments.length > 1, null, true);
		},

		removeData: function removeData(key) {
			return this.each(function () {
				dataUser.remove(this, key);
			});
		}
	});

	jQuery.extend({
		queue: function queue(elem, type, data) {
			var queue;

			if (elem) {
				type = (type || "fx") + "queue";
				queue = dataPriv.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || Array.isArray(data)) {
						queue = dataPriv.access(elem, type, jQuery.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function dequeue(elem, type) {
			type = type || "fx";

			var queue = jQuery.queue(elem, type),
			    startLength = queue.length,
			    fn = queue.shift(),
			    hooks = jQuery._queueHooks(elem, type),
			    next = function next() {
				jQuery.dequeue(elem, type);
			};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === "inprogress") {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === "fx") {
					queue.unshift("inprogress");
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function _queueHooks(elem, type) {
			var key = type + "queueHooks";
			return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
				empty: jQuery.Callbacks("once memory").add(function () {
					dataPriv.remove(elem, [type + "queue", key]);
				})
			});
		}
	});

	jQuery.fn.extend({
		queue: function queue(type, data) {
			var setter = 2;

			if (typeof type !== "string") {
				data = type;
				type = "fx";
				setter--;
			}

			if (arguments.length < setter) {
				return jQuery.queue(this[0], type);
			}

			return data === undefined ? this : this.each(function () {
				var queue = jQuery.queue(this, type, data);

				// Ensure a hooks for this queue
				jQuery._queueHooks(this, type);

				if (type === "fx" && queue[0] !== "inprogress") {
					jQuery.dequeue(this, type);
				}
			});
		},
		dequeue: function dequeue(type) {
			return this.each(function () {
				jQuery.dequeue(this, type);
			});
		},
		clearQueue: function clearQueue(type) {
			return this.queue(type || "fx", []);
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function promise(type, obj) {
			var tmp,
			    count = 1,
			    defer = jQuery.Deferred(),
			    elements = this,
			    i = this.length,
			    resolve = function resolve() {
				if (! --count) {
					defer.resolveWith(elements, [elements]);
				}
			};

			if (typeof type !== "string") {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while (i--) {
				tmp = dataPriv.get(elements[i], type + "queueHooks");
				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}
			resolve();
			return defer.promise(obj);
		}
	});
	var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;

	var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");

	var cssExpand = ["Top", "Right", "Bottom", "Left"];

	var isHiddenWithinTree = function isHiddenWithinTree(elem, el) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" || elem.style.display === "" &&

		// Otherwise, check computed style
		// Support: Firefox <=43 - 45
		// Disconnected elements can have computed display: none, so first confirm that elem is
		// in the document.
		jQuery.contains(elem.ownerDocument, elem) && jQuery.css(elem, "display") === "none";
	};

	var swap = function swap(elem, options, callback, args) {
		var ret,
		    name,
		    old = {};

		// Remember the old values, and insert the new ones
		for (name in options) {
			old[name] = elem.style[name];
			elem.style[name] = options[name];
		}

		ret = callback.apply(elem, args || []);

		// Revert the old values
		for (name in options) {
			elem.style[name] = old[name];
		}

		return ret;
	};

	function adjustCSS(elem, prop, valueParts, tween) {
		var adjusted,
		    scale = 1,
		    maxIterations = 20,
		    currentValue = tween ? function () {
			return tween.cur();
		} : function () {
			return jQuery.css(elem, prop, "");
		},
		    initial = currentValue(),
		    unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),


		// Starting value computation is required for potential unit mismatches
		initialInUnit = (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));

		if (initialInUnit && initialInUnit[3] !== unit) {

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[3];

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			do {

				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";

				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style(elem, prop, initialInUnit + unit);

				// Update scale, tolerating zero or NaN from tween.cur()
				// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations);
		}

		if (valueParts) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
			if (tween) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}

	var defaultDisplayMap = {};

	function getDefaultDisplay(elem) {
		var temp,
		    doc = elem.ownerDocument,
		    nodeName = elem.nodeName,
		    display = defaultDisplayMap[nodeName];

		if (display) {
			return display;
		}

		temp = doc.body.appendChild(doc.createElement(nodeName));
		display = jQuery.css(temp, "display");

		temp.parentNode.removeChild(temp);

		if (display === "none") {
			display = "block";
		}
		defaultDisplayMap[nodeName] = display;

		return display;
	}

	function showHide(elements, show) {
		var display,
		    elem,
		    values = [],
		    index = 0,
		    length = elements.length;

		// Determine new display value for elements that need to change
		for (; index < length; index++) {
			elem = elements[index];
			if (!elem.style) {
				continue;
			}

			display = elem.style.display;
			if (show) {

				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
				// check is required in this first loop unless we have a nonempty display value (either
				// inline or about-to-be-restored)
				if (display === "none") {
					values[index] = dataPriv.get(elem, "display") || null;
					if (!values[index]) {
						elem.style.display = "";
					}
				}
				if (elem.style.display === "" && isHiddenWithinTree(elem)) {
					values[index] = getDefaultDisplay(elem);
				}
			} else {
				if (display !== "none") {
					values[index] = "none";

					// Remember what we're overwriting
					dataPriv.set(elem, "display", display);
				}
			}
		}

		// Set the display of the elements in a second loop to avoid constant reflow
		for (index = 0; index < length; index++) {
			if (values[index] != null) {
				elements[index].style.display = values[index];
			}
		}

		return elements;
	}

	jQuery.fn.extend({
		show: function show() {
			return showHide(this, true);
		},
		hide: function hide() {
			return showHide(this);
		},
		toggle: function toggle(state) {
			if (typeof state === "boolean") {
				return state ? this.show() : this.hide();
			}

			return this.each(function () {
				if (isHiddenWithinTree(this)) {
					jQuery(this).show();
				} else {
					jQuery(this).hide();
				}
			});
		}
	});
	var rcheckableType = /^(?:checkbox|radio)$/i;

	var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i;

	var rscriptType = /^$|\/(?:java|ecma)script/i;

	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {

		// Support: IE <=9 only
		option: [1, "<select multiple='multiple'>", "</select>"],

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

		_default: [0, "", ""]
	};

	// Support: IE <=9 only
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	function getAll(context, tag) {

		// Support: IE <=9 - 11 only
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret;

		if (typeof context.getElementsByTagName !== "undefined") {
			ret = context.getElementsByTagName(tag || "*");
		} else if (typeof context.querySelectorAll !== "undefined") {
			ret = context.querySelectorAll(tag || "*");
		} else {
			ret = [];
		}

		if (tag === undefined || tag && nodeName(context, tag)) {
			return jQuery.merge([context], ret);
		}

		return ret;
	}

	// Mark scripts as having already been evaluated
	function setGlobalEval(elems, refElements) {
		var i = 0,
		    l = elems.length;

		for (; i < l; i++) {
			dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
		}
	}

	var rhtml = /<|&#?\w+;/;

	function buildFragment(elems, context, scripts, selection, ignored) {
		var elem,
		    tmp,
		    tag,
		    wrap,
		    contains,
		    j,
		    fragment = context.createDocumentFragment(),
		    nodes = [],
		    i = 0,
		    l = elems.length;

		for (; i < l; i++) {
			elem = elems[i];

			if (elem || elem === 0) {

				// Add nodes directly
				if (jQuery.type(elem) === "object") {

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

					// Convert non-html into a text node
				} else if (!rhtml.test(elem)) {
					nodes.push(context.createTextNode(elem));

					// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild(context.createElement("div"));

					// Deserialize a standard representation
					tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
					wrap = wrapMap[tag] || wrapMap._default;
					tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while (j--) {
						tmp = tmp.lastChild;
					}

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge(nodes, tmp.childNodes);

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while (elem = nodes[i++]) {

			// Skip elements already in the context collection (trac-4087)
			if (selection && jQuery.inArray(elem, selection) > -1) {
				if (ignored) {
					ignored.push(elem);
				}
				continue;
			}

			contains = jQuery.contains(elem.ownerDocument, elem);

			// Append to fragment
			tmp = getAll(fragment.appendChild(elem), "script");

			// Preserve script evaluation history
			if (contains) {
				setGlobalEval(tmp);
			}

			// Capture executables
			if (scripts) {
				j = 0;
				while (elem = tmp[j++]) {
					if (rscriptType.test(elem.type || "")) {
						scripts.push(elem);
					}
				}
			}
		}

		return fragment;
	}

	(function () {
		var fragment = document.createDocumentFragment(),
		    div = fragment.appendChild(document.createElement("div")),
		    input = document.createElement("input");

		// Support: Android 4.0 - 4.3 only
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute("type", "radio");
		input.setAttribute("checked", "checked");
		input.setAttribute("name", "t");

		div.appendChild(input);

		// Support: Android <=4.1 only
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

		// Support: IE <=11 only
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
	})();
	var documentElement = document.documentElement;

	var rkeyEvent = /^key/,
	    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	    rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE <=9 only
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) {}
	}

	function _on(elem, types, selector, data, fn, one) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {

			// ( types-Object, selector, data )
			if (typeof selector !== "string") {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for (type in types) {
				_on(elem, type, selector, data, types[type], one);
			}
			return elem;
		}

		if (data == null && fn == null) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if (fn == null) {
			if (typeof selector === "string") {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if (fn === false) {
			fn = returnFalse;
		} else if (!fn) {
			return elem;
		}

		if (one === 1) {
			origFn = fn;
			fn = function fn(event) {

				// Can use an empty set, since event contains the info
				jQuery().off(event);
				return origFn.apply(this, arguments);
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
		}
		return elem.each(function () {
			jQuery.event.add(this, types, fn, data, selector);
		});
	}

	/*
  * Helper functions for managing events -- not part of the public interface.
  * Props to Dean Edwards' addEvent library for many of the ideas.
  */
	jQuery.event = {

		global: {},

		add: function add(elem, types, handler, data, selector) {

			var handleObjIn,
			    eventHandle,
			    tmp,
			    events,
			    t,
			    handleObj,
			    special,
			    handlers,
			    type,
			    namespaces,
			    origType,
			    elemData = dataPriv.get(elem);

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if (!elemData) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Ensure that invalid selectors throw exceptions at attach time
			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
			if (selector) {
				jQuery.find.matchesSelector(documentElement, selector);
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if (!handler.guid) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}
			if (!(eventHandle = elemData.handle)) {
				eventHandle = elemData.handle = function (e) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = (types || "").match(rnothtmlwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// There *must* be a type, no attaching namespace-only handlers
				if (!type) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[type] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = (selector ? special.delegateType : special.bindType) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[type] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test(selector),
					namespace: namespaces.join(".")
				}, handleObjIn);

				// Init the event handler queue if we're the first
				if (!(handlers = events[type])) {
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {

						if (elem.addEventListener) {
							elem.addEventListener(type, eventHandle);
						}
					}
				}

				if (special.add) {
					special.add.call(elem, handleObj);

					if (!handleObj.handler.guid) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if (selector) {
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else {
					handlers.push(handleObj);
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[type] = true;
			}
		},

		// Detach an event or set of events from an element
		remove: function remove(elem, types, handler, selector, mappedTypes) {

			var j,
			    origCount,
			    tmp,
			    events,
			    t,
			    handleObj,
			    special,
			    handlers,
			    type,
			    namespaces,
			    origType,
			    elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

			if (!elemData || !(events = elemData.events)) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = (types || "").match(rnothtmlwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// Unbind all events (on this namespace, if provided) for the element
				if (!type) {
					for (type in events) {
						jQuery.event.remove(elem, type + types[t], handler, selector, true);
					}
					continue;
				}

				special = jQuery.event.special[type] || {};
				type = (selector ? special.delegateType : special.bindType) || type;
				handlers = events[type] || [];
				tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

				// Remove matching events
				origCount = j = handlers.length;
				while (j--) {
					handleObj = handlers[j];

					if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
						handlers.splice(j, 1);

						if (handleObj.selector) {
							handlers.delegateCount--;
						}
						if (special.remove) {
							special.remove.call(elem, handleObj);
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if (origCount && !handlers.length) {
					if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {

						jQuery.removeEvent(elem, type, elemData.handle);
					}

					delete events[type];
				}
			}

			// Remove data and the expando if it's no longer used
			if (jQuery.isEmptyObject(events)) {
				dataPriv.remove(elem, "handle events");
			}
		},

		dispatch: function dispatch(nativeEvent) {

			// Make a writable jQuery.Event from the native event object
			var event = jQuery.event.fix(nativeEvent);

			var i,
			    j,
			    ret,
			    matched,
			    handleObj,
			    handlerQueue,
			    args = new Array(arguments.length),
			    handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
			    special = jQuery.event.special[event.type] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;

			for (i = 1; i < arguments.length; i++) {
				args[i] = arguments[i];
			}

			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if (special.preDispatch && special.preDispatch.call(this, event) === false) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call(this, event, handlers);

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
				event.currentTarget = matched.elem;

				j = 0;
				while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);

						if (ret !== undefined) {
							if ((event.result = ret) === false) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if (special.postDispatch) {
				special.postDispatch.call(this, event);
			}

			return event.result;
		},

		handlers: function handlers(event, _handlers) {
			var i,
			    handleObj,
			    sel,
			    matchedHandlers,
			    matchedSelectors,
			    handlerQueue = [],
			    delegateCount = _handlers.delegateCount,
			    cur = event.target;

			// Find delegate handlers
			if (delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!(event.type === "click" && event.button >= 1)) {

				for (; cur !== this; cur = cur.parentNode || this) {

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
						matchedHandlers = [];
						matchedSelectors = {};
						for (i = 0; i < delegateCount; i++) {
							handleObj = _handlers[i];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if (matchedSelectors[sel] === undefined) {
								matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
							}
							if (matchedSelectors[sel]) {
								matchedHandlers.push(handleObj);
							}
						}
						if (matchedHandlers.length) {
							handlerQueue.push({ elem: cur, handlers: matchedHandlers });
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			cur = this;
			if (delegateCount < _handlers.length) {
				handlerQueue.push({ elem: cur, handlers: _handlers.slice(delegateCount) });
			}

			return handlerQueue;
		},

		addProp: function addProp(name, hook) {
			Object.defineProperty(jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,

				get: jQuery.isFunction(hook) ? function () {
					if (this.originalEvent) {
						return hook(this.originalEvent);
					}
				} : function () {
					if (this.originalEvent) {
						return this.originalEvent[name];
					}
				},

				set: function set(value) {
					Object.defineProperty(this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					});
				}
			});
		},

		fix: function fix(originalEvent) {
			return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {

				// Fire native event if possible so blur/focus sequence is correct
				trigger: function trigger() {
					if (this !== safeActiveElement() && this.focus) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function trigger() {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {

				// For checkbox, fire native event so checked state will be right
				trigger: function trigger() {
					if (this.type === "checkbox" && this.click && nodeName(this, "input")) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function _default(event) {
					return nodeName(event.target, "a");
				}
			},

			beforeunload: {
				postDispatch: function postDispatch(event) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if (event.result !== undefined && event.originalEvent) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	jQuery.removeEvent = function (elem, type, handle) {

		// This "if" is needed for plain objects
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handle);
		}
	};

	jQuery.Event = function (src, props) {

		// Allow instantiation without the 'new' keyword
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}

		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined &&

			// Support: Android <=2.3 only
			src.returnValue === false ? returnTrue : returnFalse;

			// Create target properties
			// Support: Safari <=6 - 7 only
			// Target should not be a text node (#504, #13143)
			this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;

			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;

			// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if (props) {
			jQuery.extend(this, props);
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[jQuery.expando] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,

		preventDefault: function preventDefault() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if (e && !this.isSimulated) {
				e.preventDefault();
			}
		},
		stopPropagation: function stopPropagation() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function stopImmediatePropagation() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if (e && !this.isSimulated) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each({
		altKey: true,
		bubbles: true,
		cancelable: true,
		changedTouches: true,
		ctrlKey: true,
		detail: true,
		eventPhase: true,
		metaKey: true,
		pageX: true,
		pageY: true,
		shiftKey: true,
		view: true,
		"char": true,
		charCode: true,
		key: true,
		keyCode: true,
		button: true,
		buttons: true,
		clientX: true,
		clientY: true,
		offsetX: true,
		offsetY: true,
		pointerId: true,
		pointerType: true,
		screenX: true,
		screenY: true,
		targetTouches: true,
		toElement: true,
		touches: true,

		which: function which(event) {
			var button = event.button;

			// Add which for key events
			if (event.which == null && rkeyEvent.test(event.type)) {
				return event.charCode != null ? event.charCode : event.keyCode;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
				if (button & 1) {
					return 1;
				}

				if (button & 2) {
					return 3;
				}

				if (button & 4) {
					return 2;
				}

				return 0;
			}

			return event.which;
		}
	}, jQuery.event.addProp);

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function (orig, fix) {
		jQuery.event.special[orig] = {
			delegateType: fix,
			bindType: fix,

			handle: function handle(event) {
				var ret,
				    target = this,
				    related = event.relatedTarget,
				    handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if (!related || related !== target && !jQuery.contains(target, related)) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply(this, arguments);
					event.type = fix;
				}
				return ret;
			}
		};
	});

	jQuery.fn.extend({

		on: function on(types, selector, data, fn) {
			return _on(this, types, selector, data, fn);
		},
		one: function one(types, selector, data, fn) {
			return _on(this, types, selector, data, fn, 1);
		},
		off: function off(types, selector, fn) {
			var handleObj, type;
			if (types && types.preventDefault && types.handleObj) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
				return this;
			}
			if ((typeof types === "undefined" ? "undefined" : _typeof(types)) === "object") {

				// ( types-object [, selector] )
				for (type in types) {
					this.off(type, selector, types[type]);
				}
				return this;
			}
			if (selector === false || typeof selector === "function") {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if (fn === false) {
				fn = returnFalse;
			}
			return this.each(function () {
				jQuery.event.remove(this, types, fn, selector);
			});
		}
	});

	var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,


	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,


	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	    rscriptTypeMasked = /^true\/(.*)/,
	    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	// Prefer a tbody over its parent table for containing new rows
	function manipulationTarget(elem, content) {
		if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {

			return jQuery(">tbody", elem)[0] || elem;
		}

		return elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript(elem) {
		elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
		return elem;
	}
	function restoreScript(elem) {
		var match = rscriptTypeMasked.exec(elem.type);

		if (match) {
			elem.type = match[1];
		} else {
			elem.removeAttribute("type");
		}

		return elem;
	}

	function cloneCopyEvent(src, dest) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if (dest.nodeType !== 1) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if (dataPriv.hasData(src)) {
			pdataOld = dataPriv.access(src);
			pdataCur = dataPriv.set(dest, pdataOld);
			events = pdataOld.events;

			if (events) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for (type in events) {
					for (i = 0, l = events[type].length; i < l; i++) {
						jQuery.event.add(dest, type, events[type][i]);
					}
				}
			}
		}

		// 2. Copy user data
		if (dataUser.hasData(src)) {
			udataOld = dataUser.access(src);
			udataCur = jQuery.extend({}, udataOld);

			dataUser.set(dest, udataCur);
		}
	}

	// Fix IE bugs, see support tests
	function fixInput(src, dest) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if (nodeName === "input" && rcheckableType.test(src.type)) {
			dest.checked = src.checked;

			// Fails to return the selected option to the default selected state when cloning options
		} else if (nodeName === "input" || nodeName === "textarea") {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip(collection, args, callback, ignored) {

		// Flatten any nested arrays
		args = concat.apply([], args);

		var fragment,
		    first,
		    scripts,
		    hasScripts,
		    node,
		    doc,
		    i = 0,
		    l = collection.length,
		    iNoClone = l - 1,
		    value = args[0],
		    isFunction = jQuery.isFunction(value);

		// We can't cloneNode fragments that contain checked, in WebKit
		if (isFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
			return collection.each(function (index) {
				var self = collection.eq(index);
				if (isFunction) {
					args[0] = value.call(this, index, self.html());
				}
				domManip(self, args, callback, ignored);
			});
		}

		if (l) {
			fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
			first = fragment.firstChild;

			if (fragment.childNodes.length === 1) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if (first || ignored) {
				scripts = jQuery.map(getAll(fragment, "script"), disableScript);
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for (; i < l; i++) {
					node = fragment;

					if (i !== iNoClone) {
						node = jQuery.clone(node, true, true);

						// Keep references to cloned scripts for later restoration
						if (hasScripts) {

							// Support: Android <=4.0 only, PhantomJS 1 only
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge(scripts, getAll(node, "script"));
						}
					}

					callback.call(collection[i], node, i);
				}

				if (hasScripts) {
					doc = scripts[scripts.length - 1].ownerDocument;

					// Reenable scripts
					jQuery.map(scripts, restoreScript);

					// Evaluate executable scripts on first document insertion
					for (i = 0; i < hasScripts; i++) {
						node = scripts[i];
						if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {

							if (node.src) {

								// Optional AJAX dependency, but won't run scripts if not present
								if (jQuery._evalUrl) {
									jQuery._evalUrl(node.src);
								}
							} else {
								DOMEval(node.textContent.replace(rcleanScript, ""), doc);
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function _remove(elem, selector, keepData) {
		var node,
		    nodes = selector ? jQuery.filter(selector, elem) : elem,
		    i = 0;

		for (; (node = nodes[i]) != null; i++) {
			if (!keepData && node.nodeType === 1) {
				jQuery.cleanData(getAll(node));
			}

			if (node.parentNode) {
				if (keepData && jQuery.contains(node.ownerDocument, node)) {
					setGlobalEval(getAll(node, "script"));
				}
				node.parentNode.removeChild(node);
			}
		}

		return elem;
	}

	jQuery.extend({
		htmlPrefilter: function htmlPrefilter(html) {
			return html.replace(rxhtmlTag, "<$1></$2>");
		},

		clone: function clone(elem, dataAndEvents, deepDataAndEvents) {
			var i,
			    l,
			    srcElements,
			    destElements,
			    clone = elem.cloneNode(true),
			    inPage = jQuery.contains(elem.ownerDocument, elem);

			// Fix IE cloning issues
			if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {

				// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
				destElements = getAll(clone);
				srcElements = getAll(elem);

				for (i = 0, l = srcElements.length; i < l; i++) {
					fixInput(srcElements[i], destElements[i]);
				}
			}

			// Copy the events from the original to the clone
			if (dataAndEvents) {
				if (deepDataAndEvents) {
					srcElements = srcElements || getAll(elem);
					destElements = destElements || getAll(clone);

					for (i = 0, l = srcElements.length; i < l; i++) {
						cloneCopyEvent(srcElements[i], destElements[i]);
					}
				} else {
					cloneCopyEvent(elem, clone);
				}
			}

			// Preserve script evaluation history
			destElements = getAll(clone, "script");
			if (destElements.length > 0) {
				setGlobalEval(destElements, !inPage && getAll(elem, "script"));
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function cleanData(elems) {
			var data,
			    elem,
			    type,
			    special = jQuery.event.special,
			    i = 0;

			for (; (elem = elems[i]) !== undefined; i++) {
				if (acceptData(elem)) {
					if (data = elem[dataPriv.expando]) {
						if (data.events) {
							for (type in data.events) {
								if (special[type]) {
									jQuery.event.remove(elem, type);

									// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent(elem, type, data.handle);
								}
							}
						}

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataPriv.expando] = undefined;
					}
					if (elem[dataUser.expando]) {

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataUser.expando] = undefined;
					}
				}
			}
		}
	});

	jQuery.fn.extend({
		detach: function detach(selector) {
			return _remove(this, selector, true);
		},

		remove: function remove(selector) {
			return _remove(this, selector);
		},

		text: function text(value) {
			return access(this, function (value) {
				return value === undefined ? jQuery.text(this) : this.empty().each(function () {
					if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
						this.textContent = value;
					}
				});
			}, null, value, arguments.length);
		},

		append: function append() {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.appendChild(elem);
				}
			});
		},

		prepend: function prepend() {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.insertBefore(elem, target.firstChild);
				}
			});
		},

		before: function before() {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this);
				}
			});
		},

		after: function after() {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this.nextSibling);
				}
			});
		},

		empty: function empty() {
			var elem,
			    i = 0;

			for (; (elem = this[i]) != null; i++) {
				if (elem.nodeType === 1) {

					// Prevent memory leaks
					jQuery.cleanData(getAll(elem, false));

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function clone(dataAndEvents, deepDataAndEvents) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function () {
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},

		html: function html(value) {
			return access(this, function (value) {
				var elem = this[0] || {},
				    i = 0,
				    l = this.length;

				if (value === undefined && elem.nodeType === 1) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if (typeof value === "string" && !rnoInnerhtml.test(value) && !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

					value = jQuery.htmlPrefilter(value);

					try {
						for (; i < l; i++) {
							elem = this[i] || {};

							// Remove element nodes and prevent memory leaks
							if (elem.nodeType === 1) {
								jQuery.cleanData(getAll(elem, false));
								elem.innerHTML = value;
							}
						}

						elem = 0;

						// If using innerHTML throws an exception, use the fallback method
					} catch (e) {}
				}

				if (elem) {
					this.empty().append(value);
				}
			}, null, value, arguments.length);
		},

		replaceWith: function replaceWith() {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip(this, arguments, function (elem) {
				var parent = this.parentNode;

				if (jQuery.inArray(this, ignored) < 0) {
					jQuery.cleanData(getAll(this));
					if (parent) {
						parent.replaceChild(elem, this);
					}
				}

				// Force callback invocation
			}, ignored);
		}
	});

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function (name, original) {
		jQuery.fn[name] = function (selector) {
			var elems,
			    ret = [],
			    insert = jQuery(selector),
			    last = insert.length - 1,
			    i = 0;

			for (; i <= last; i++) {
				elems = i === last ? this : this.clone(true);
				jQuery(insert[i])[original](elems);

				// Support: Android <=4.0 only, PhantomJS 1 only
				// .get() because push.apply(_, arraylike) throws on ancient WebKit
				push.apply(ret, elems.get());
			}

			return this.pushStack(ret);
		};
	});
	var rmargin = /^margin/;

	var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

	var getStyles = function getStyles(elem) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if (!view || !view.opener) {
			view = window;
		}

		return view.getComputedStyle(elem);
	};

	(function () {

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {

			// This is a singleton, we need to execute it only once
			if (!div) {
				return;
			}

			div.style.cssText = "box-sizing:border-box;" + "position:relative;display:block;" + "margin:auto;border:1px;padding:1px;" + "top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild(container);

			var divStyle = window.getComputedStyle(div);
			pixelPositionVal = divStyle.top !== "1%";

			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";

			documentElement.removeChild(container);

			// Nullify the div so it wouldn't be stored in the memory and
			// it will also be a sign that checks already performed
			div = null;
		}

		var pixelPositionVal,
		    boxSizingReliableVal,
		    pixelMarginRightVal,
		    reliableMarginLeftVal,
		    container = document.createElement("div"),
		    div = document.createElement("div");

		// Finish early in limited (non-browser) environments
		if (!div.style) {
			return;
		}

		// Support: IE <=9 - 11 only
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode(true).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" + "padding:0;margin-top:1px;position:absolute";
		container.appendChild(div);

		jQuery.extend(support, {
			pixelPosition: function pixelPosition() {
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function boxSizingReliable() {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelMarginRight: function pixelMarginRight() {
				computeStyleTests();
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function reliableMarginLeft() {
				computeStyleTests();
				return reliableMarginLeftVal;
			}
		});
	})();

	function curCSS(elem, name, computed) {
		var width,
		    minWidth,
		    maxWidth,
		    ret,


		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

		computed = computed || getStyles(elem);

		// getPropertyValue is needed for:
		//   .css('filter') (IE 9 only, #12537)
		//   .css('--customProperty) (#3144)
		if (computed) {
			ret = computed.getPropertyValue(name) || computed[name];

			if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
				ret = jQuery.style(elem, name);
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// https://drafts.csswg.org/cssom/#resolved-values
			if (!support.pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name)) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" : ret;
	}

	function addGetHookIf(conditionFn, hookFn) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function get() {
				if (conditionFn()) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return (this.get = hookFn).apply(this, arguments);
			}
		};
	}

	var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	    rcustomProp = /^--/,
	    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	    cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},
	    cssPrefixes = ["Webkit", "Moz", "ms"],
	    emptyStyle = document.createElement("div").style;

	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName(name) {

		// Shortcut for names that are not vendor prefixed
		if (name in emptyStyle) {
			return name;
		}

		// Check for vendor prefixed names
		var capName = name[0].toUpperCase() + name.slice(1),
		    i = cssPrefixes.length;

		while (i--) {
			name = cssPrefixes[i] + capName;
			if (name in emptyStyle) {
				return name;
			}
		}
	}

	// Return a property mapped along what jQuery.cssProps suggests or to
	// a vendor prefixed property.
	function finalPropName(name) {
		var ret = jQuery.cssProps[name];
		if (!ret) {
			ret = jQuery.cssProps[name] = vendorPropName(name) || name;
		}
		return ret;
	}

	function setPositiveNumber(elem, value, subtract) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec(value);
		return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") : value;
	}

	function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
		var i,
		    val = 0;

		// If we already have the right measurement, avoid augmentation
		if (extra === (isBorderBox ? "border" : "content")) {
			i = 4;

			// Otherwise initialize for horizontal or vertical properties
		} else {
			i = name === "width" ? 1 : 0;
		}

		for (; i < 4; i += 2) {

			// Both box models exclude margin, so add it if we want it
			if (extra === "margin") {
				val += jQuery.css(elem, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {

				// border-box includes padding, so remove it if we want content
				if (extra === "content") {
					val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
				}

				// At this point, extra isn't border nor margin, so remove border
				if (extra !== "margin") {
					val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			} else {

				// At this point, extra isn't content, so add padding
				val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

				// At this point, extra isn't content nor padding, so add border
				if (extra !== "padding") {
					val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			}
		}

		return val;
	}

	function getWidthOrHeight(elem, name, extra) {

		// Start with computed style
		var valueIsBorderBox,
		    styles = getStyles(elem),
		    val = curCSS(elem, name, styles),
		    isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";

		// Computed unit is not pixels. Stop here and return.
		if (rnumnonpx.test(val)) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);

		// Fall back to offsetWidth/Height when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		if (val === "auto") {
			val = elem["offset" + name[0].toUpperCase() + name.slice(1)];
		}

		// Normalize "", auto, and prepare for extra
		val = parseFloat(val) || 0;

		// Use the active box-sizing model to add/subtract irrelevant styles
		return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
	}

	jQuery.extend({

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function get(elem, computed) {
					if (computed) {

						// We should always get a number back from opacity
						var ret = curCSS(elem, "opacity");
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},

		// Get and set the style property on a DOM Node
		style: function style(elem, name, value, extra) {

			// Don't set styles on text and comment nodes
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret,
			    type,
			    hooks,
			    origName = jQuery.camelCase(name),
			    isCustomProp = rcustomProp.test(name),
			    style = elem.style;

			// Make sure that we're working with the right name. We don't
			// want to query the value if it is a CSS custom property
			// since they are user-defined.
			if (!isCustomProp) {
				name = finalPropName(origName);
			}

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// Check if we're setting a value
			if (value !== undefined) {
				type = typeof value === "undefined" ? "undefined" : _typeof(value);

				// Convert "+=" or "-=" to relative numbers (#7345)
				if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
					value = adjustCSS(elem, name, ret);

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if (value == null || value !== value) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				if (type === "number") {
					value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
				}

				// background-* props affect original clone's values
				if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
					style[name] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {

					if (isCustomProp) {
						style.setProperty(name, value);
					} else {
						style[name] = value;
					}
				}
			} else {

				// If a hook was provided get the non-computed value from there
				if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[name];
			}
		},

		css: function css(elem, name, extra, styles) {
			var val,
			    num,
			    hooks,
			    origName = jQuery.camelCase(name),
			    isCustomProp = rcustomProp.test(name);

			// Make sure that we're working with the right name. We don't
			// want to modify the value if it is a CSS custom property
			// since they are user-defined.
			if (!isCustomProp) {
				name = finalPropName(origName);
			}

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// If a hook was provided get the computed value from there
			if (hooks && "get" in hooks) {
				val = hooks.get(elem, true, extra);
			}

			// Otherwise, if a way to get the computed value exists, use that
			if (val === undefined) {
				val = curCSS(elem, name, styles);
			}

			// Convert "normal" to computed value
			if (val === "normal" && name in cssNormalTransform) {
				val = cssNormalTransform[name];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if (extra === "" || extra) {
				num = parseFloat(val);
				return extra === true || isFinite(num) ? num || 0 : val;
			}

			return val;
		}
	});

	jQuery.each(["height", "width"], function (i, name) {
		jQuery.cssHooks[name] = {
			get: function get(elem, computed, extra) {
				if (computed) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test(jQuery.css(elem, "display")) && (

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function () {
						return getWidthOrHeight(elem, name, extra);
					}) : getWidthOrHeight(elem, name, extra);
				}
			},

			set: function set(elem, value, extra) {
				var matches,
				    styles = extra && getStyles(elem),
				    subtract = extra && augmentWidthOrHeight(elem, name, extra, jQuery.css(elem, "boxSizing", false, styles) === "border-box", styles);

				// Convert to pixels if value adjustment is needed
				if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {

					elem.style[name] = value;
					value = jQuery.css(elem, name);
				}

				return setPositiveNumber(elem, value, subtract);
			}
		};
	});

	jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function (elem, computed) {
		if (computed) {
			return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function () {
				return elem.getBoundingClientRect().left;
			})) + "px";
		}
	});

	// These hooks are used by animate to expand properties
	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function (prefix, suffix) {
		jQuery.cssHooks[prefix + suffix] = {
			expand: function expand(value) {
				var i = 0,
				    expanded = {},


				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [value];

				for (; i < 4; i++) {
					expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
				}

				return expanded;
			}
		};

		if (!rmargin.test(prefix)) {
			jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
		}
	});

	jQuery.fn.extend({
		css: function css(name, value) {
			return access(this, function (elem, name, value) {
				var styles,
				    len,
				    map = {},
				    i = 0;

				if (Array.isArray(name)) {
					styles = getStyles(elem);
					len = name.length;

					for (; i < len; i++) {
						map[name[i]] = jQuery.css(elem, name[i], false, styles);
					}

					return map;
				}

				return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
			}, name, value, arguments.length > 1);
		}
	});

	function Tween(elem, options, prop, end, easing) {
		return new Tween.prototype.init(elem, options, prop, end, easing);
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function init(elem, options, prop, end, easing, unit) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
		},
		cur: function cur() {
			var hooks = Tween.propHooks[this.prop];

			return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
		},
		run: function run(percent) {
			var eased,
			    hooks = Tween.propHooks[this.prop];

			if (this.options.duration) {
				this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
			} else {
				this.pos = eased = percent;
			}
			this.now = (this.end - this.start) * eased + this.start;

			if (this.options.step) {
				this.options.step.call(this.elem, this.now, this);
			}

			if (hooks && hooks.set) {
				hooks.set(this);
			} else {
				Tween.propHooks._default.set(this);
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function get(tween) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
					return tween.elem[tween.prop];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css(tween.elem, tween.prop, "");

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function set(tween) {

				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if (jQuery.fx.step[tween.prop]) {
					jQuery.fx.step[tween.prop](tween);
				} else if (tween.elem.nodeType === 1 && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
					jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
				} else {
					tween.elem[tween.prop] = tween.now;
				}
			}
		}
	};

	// Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function set(tween) {
			if (tween.elem.nodeType && tween.elem.parentNode) {
				tween.elem[tween.prop] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function linear(p) {
			return p;
		},
		swing: function swing(p) {
			return 0.5 - Math.cos(p * Math.PI) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back compat <1.8 extension point
	jQuery.fx.step = {};

	var fxNow,
	    inProgress,
	    rfxtypes = /^(?:toggle|show|hide)$/,
	    rrun = /queueHooks$/;

	function schedule() {
		if (inProgress) {
			if (document.hidden === false && window.requestAnimationFrame) {
				window.requestAnimationFrame(schedule);
			} else {
				window.setTimeout(schedule, jQuery.fx.interval);
			}

			jQuery.fx.tick();
		}
	}

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout(function () {
			fxNow = undefined;
		});
		return fxNow = jQuery.now();
	}

	// Generate parameters to create a standard animation
	function genFx(type, includeWidth) {
		var which,
		    i = 0,
		    attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for (; i < 4; i += 2 - includeWidth) {
			which = cssExpand[i];
			attrs["margin" + which] = attrs["padding" + which] = type;
		}

		if (includeWidth) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween(value, prop, animation) {
		var tween,
		    collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
		    index = 0,
		    length = collection.length;
		for (; index < length; index++) {
			if (tween = collection[index].call(animation, prop, value)) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter(elem, props, opts) {
		var prop,
		    value,
		    toggle,
		    hooks,
		    oldfire,
		    propTween,
		    restoreDisplay,
		    display,
		    isBox = "width" in props || "height" in props,
		    anim = this,
		    orig = {},
		    style = elem.style,
		    hidden = elem.nodeType && isHiddenWithinTree(elem),
		    dataShow = dataPriv.get(elem, "fxshow");

		// Queue-skipping animations hijack the fx hooks
		if (!opts.queue) {
			hooks = jQuery._queueHooks(elem, "fx");
			if (hooks.unqueued == null) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function () {
					if (!hooks.unqueued) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always(function () {

				// Ensure the complete handler is called before this completes
				anim.always(function () {
					hooks.unqueued--;
					if (!jQuery.queue(elem, "fx").length) {
						hooks.empty.fire();
					}
				});
			});
		}

		// Detect show/hide animations
		for (prop in props) {
			value = props[prop];
			if (rfxtypes.test(value)) {
				delete props[prop];
				toggle = toggle || value === "toggle";
				if (value === (hidden ? "hide" : "show")) {

					// Pretend to be hidden if this is a "show" and
					// there is still data from a stopped show/hide
					if (value === "show" && dataShow && dataShow[prop] !== undefined) {
						hidden = true;

						// Ignore all other no-op show/hide data
					} else {
						continue;
					}
				}
				orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
			}
		}

		// Bail out if this is a no-op like .hide().hide()
		propTween = !jQuery.isEmptyObject(props);
		if (!propTween && jQuery.isEmptyObject(orig)) {
			return;
		}

		// Restrict "overflow" and "display" styles during box animations
		if (isBox && elem.nodeType === 1) {

			// Support: IE <=9 - 11, Edge 12 - 13
			// Record all 3 overflow attributes because IE does not infer the shorthand
			// from identically-valued overflowX and overflowY
			opts.overflow = [style.overflow, style.overflowX, style.overflowY];

			// Identify a display type, preferring old show/hide data over the CSS cascade
			restoreDisplay = dataShow && dataShow.display;
			if (restoreDisplay == null) {
				restoreDisplay = dataPriv.get(elem, "display");
			}
			display = jQuery.css(elem, "display");
			if (display === "none") {
				if (restoreDisplay) {
					display = restoreDisplay;
				} else {

					// Get nonempty value(s) by temporarily forcing visibility
					showHide([elem], true);
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css(elem, "display");
					showHide([elem]);
				}
			}

			// Animate inline elements as inline-block
			if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
				if (jQuery.css(elem, "float") === "none") {

					// Restore the original display value at the end of pure show/hide animations
					if (!propTween) {
						anim.done(function () {
							style.display = restoreDisplay;
						});
						if (restoreDisplay == null) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}
					style.display = "inline-block";
				}
			}
		}

		if (opts.overflow) {
			style.overflow = "hidden";
			anim.always(function () {
				style.overflow = opts.overflow[0];
				style.overflowX = opts.overflow[1];
				style.overflowY = opts.overflow[2];
			});
		}

		// Implement show/hide animations
		propTween = false;
		for (prop in orig) {

			// General show/hide setup for this element animation
			if (!propTween) {
				if (dataShow) {
					if ("hidden" in dataShow) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
				}

				// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
				if (toggle) {
					dataShow.hidden = !hidden;
				}

				// Show elements before animating them
				if (hidden) {
					showHide([elem], true);
				}

				/* eslint-disable no-loop-func */

				anim.done(function () {

					/* eslint-enable no-loop-func */

					// The final step of a "hide" animation is actually hiding the element
					if (!hidden) {
						showHide([elem]);
					}
					dataPriv.remove(elem, "fxshow");
					for (prop in orig) {
						jQuery.style(elem, prop, orig[prop]);
					}
				});
			}

			// Per-property setup
			propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
			if (!(prop in dataShow)) {
				dataShow[prop] = propTween.start;
				if (hidden) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}

	function propFilter(props, specialEasing) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for (index in props) {
			name = jQuery.camelCase(index);
			easing = specialEasing[name];
			value = props[index];
			if (Array.isArray(value)) {
				easing = value[1];
				value = props[index] = value[0];
			}

			if (index !== name) {
				props[name] = value;
				delete props[index];
			}

			hooks = jQuery.cssHooks[name];
			if (hooks && "expand" in hooks) {
				value = hooks.expand(value);
				delete props[name];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for (index in value) {
					if (!(index in props)) {
						props[index] = value[index];
						specialEasing[index] = easing;
					}
				}
			} else {
				specialEasing[name] = easing;
			}
		}
	}

	function Animation(elem, properties, options) {
		var result,
		    stopped,
		    index = 0,
		    length = Animation.prefilters.length,
		    deferred = jQuery.Deferred().always(function () {

			// Don't match elem in the :animated selector
			delete tick.elem;
		}),
		    tick = function tick() {
			if (stopped) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
			    remaining = Math.max(0, animation.startTime + animation.duration - currentTime),


			// Support: Android 2.3 only
			// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
			temp = remaining / animation.duration || 0,
			    percent = 1 - temp,
			    index = 0,
			    length = animation.tweens.length;

			for (; index < length; index++) {
				animation.tweens[index].run(percent);
			}

			deferred.notifyWith(elem, [animation, percent, remaining]);

			// If there's more to do, yield
			if (percent < 1 && length) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if (!length) {
				deferred.notifyWith(elem, [animation, 1, 0]);
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith(elem, [animation]);
			return false;
		},
		    animation = deferred.promise({
			elem: elem,
			props: jQuery.extend({}, properties),
			opts: jQuery.extend(true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function createTween(prop, end) {
				var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
				animation.tweens.push(tween);
				return tween;
			},
			stop: function stop(gotoEnd) {
				var index = 0,


				// If we are going to the end, we want to run all the tweens
				// otherwise we skip this part
				length = gotoEnd ? animation.tweens.length : 0;
				if (stopped) {
					return this;
				}
				stopped = true;
				for (; index < length; index++) {
					animation.tweens[index].run(1);
				}

				// Resolve when we played the last frame; otherwise, reject
				if (gotoEnd) {
					deferred.notifyWith(elem, [animation, 1, 0]);
					deferred.resolveWith(elem, [animation, gotoEnd]);
				} else {
					deferred.rejectWith(elem, [animation, gotoEnd]);
				}
				return this;
			}
		}),
		    props = animation.props;

		propFilter(props, animation.opts.specialEasing);

		for (; index < length; index++) {
			result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
			if (result) {
				if (jQuery.isFunction(result.stop)) {
					jQuery._queueHooks(animation.elem, animation.opts.queue).stop = jQuery.proxy(result.stop, result);
				}
				return result;
			}
		}

		jQuery.map(props, createTween, animation);

		if (jQuery.isFunction(animation.opts.start)) {
			animation.opts.start.call(elem, animation);
		}

		// Attach callbacks from options
		animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);

		jQuery.fx.timer(jQuery.extend(tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		}));

		return animation;
	}

	jQuery.Animation = jQuery.extend(Animation, {

		tweeners: {
			"*": [function (prop, value) {
				var tween = this.createTween(prop, value);
				adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
				return tween;
			}]
		},

		tweener: function tweener(props, callback) {
			if (jQuery.isFunction(props)) {
				callback = props;
				props = ["*"];
			} else {
				props = props.match(rnothtmlwhite);
			}

			var prop,
			    index = 0,
			    length = props.length;

			for (; index < length; index++) {
				prop = props[index];
				Animation.tweeners[prop] = Animation.tweeners[prop] || [];
				Animation.tweeners[prop].unshift(callback);
			}
		},

		prefilters: [defaultPrefilter],

		prefilter: function prefilter(callback, prepend) {
			if (prepend) {
				Animation.prefilters.unshift(callback);
			} else {
				Animation.prefilters.push(callback);
			}
		}
	});

	jQuery.speed = function (speed, easing, fn) {
		var opt = speed && (typeof speed === "undefined" ? "undefined" : _typeof(speed)) === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		// Go to the end state if fx are off
		if (jQuery.fx.off) {
			opt.duration = 0;
		} else {
			if (typeof opt.duration !== "number") {
				if (opt.duration in jQuery.fx.speeds) {
					opt.duration = jQuery.fx.speeds[opt.duration];
				} else {
					opt.duration = jQuery.fx.speeds._default;
				}
			}
		}

		// Normalize opt.queue - true/undefined/null -> "fx"
		if (opt.queue == null || opt.queue === true) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function () {
			if (jQuery.isFunction(opt.old)) {
				opt.old.call(this);
			}

			if (opt.queue) {
				jQuery.dequeue(this, opt.queue);
			}
		};

		return opt;
	};

	jQuery.fn.extend({
		fadeTo: function fadeTo(speed, to, easing, callback) {

			// Show any hidden elements after setting opacity to 0
			return this.filter(isHiddenWithinTree).css("opacity", 0).show

			// Animate to the value specified
			().end().animate({ opacity: to }, speed, easing, callback);
		},
		animate: function animate(prop, speed, easing, callback) {
			var empty = jQuery.isEmptyObject(prop),
			    optall = jQuery.speed(speed, easing, callback),
			    doAnimation = function doAnimation() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation(this, jQuery.extend({}, prop), optall);

				// Empty animations, or finishing resolves immediately
				if (empty || dataPriv.get(this, "finish")) {
					anim.stop(true);
				}
			};
			doAnimation.finish = doAnimation;

			return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
		},
		stop: function stop(type, clearQueue, gotoEnd) {
			var stopQueue = function stopQueue(hooks) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop(gotoEnd);
			};

			if (typeof type !== "string") {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if (clearQueue && type !== false) {
				this.queue(type || "fx", []);
			}

			return this.each(function () {
				var dequeue = true,
				    index = type != null && type + "queueHooks",
				    timers = jQuery.timers,
				    data = dataPriv.get(this);

				if (index) {
					if (data[index] && data[index].stop) {
						stopQueue(data[index]);
					}
				} else {
					for (index in data) {
						if (data[index] && data[index].stop && rrun.test(index)) {
							stopQueue(data[index]);
						}
					}
				}

				for (index = timers.length; index--;) {
					if (timers[index].elem === this && (type == null || timers[index].queue === type)) {

						timers[index].anim.stop(gotoEnd);
						dequeue = false;
						timers.splice(index, 1);
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if (dequeue || !gotoEnd) {
					jQuery.dequeue(this, type);
				}
			});
		},
		finish: function finish(type) {
			if (type !== false) {
				type = type || "fx";
			}
			return this.each(function () {
				var index,
				    data = dataPriv.get(this),
				    queue = data[type + "queue"],
				    hooks = data[type + "queueHooks"],
				    timers = jQuery.timers,
				    length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue(this, type, []);

				if (hooks && hooks.stop) {
					hooks.stop.call(this, true);
				}

				// Look for any active animations, and finish them
				for (index = timers.length; index--;) {
					if (timers[index].elem === this && timers[index].queue === type) {
						timers[index].anim.stop(true);
						timers.splice(index, 1);
					}
				}

				// Look for any animations in the old queue and finish them
				for (index = 0; index < length; index++) {
					if (queue[index] && queue[index].finish) {
						queue[index].finish.call(this);
					}
				}

				// Turn off finishing flag
				delete data.finish;
			});
		}
	});

	jQuery.each(["toggle", "show", "hide"], function (i, name) {
		var cssFn = jQuery.fn[name];
		jQuery.fn[name] = function (speed, easing, callback) {
			return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
		};
	});

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx("show"),
		slideUp: genFx("hide"),
		slideToggle: genFx("toggle"),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function (name, props) {
		jQuery.fn[name] = function (speed, easing, callback) {
			return this.animate(props, speed, easing, callback);
		};
	});

	jQuery.timers = [];
	jQuery.fx.tick = function () {
		var timer,
		    i = 0,
		    timers = jQuery.timers;

		fxNow = jQuery.now();

		for (; i < timers.length; i++) {
			timer = timers[i];

			// Run the timer and safely remove it when done (allowing for external removal)
			if (!timer() && timers[i] === timer) {
				timers.splice(i--, 1);
			}
		}

		if (!timers.length) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function (timer) {
		jQuery.timers.push(timer);
		jQuery.fx.start();
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function () {
		if (inProgress) {
			return;
		}

		inProgress = true;
		schedule();
	};

	jQuery.fx.stop = function () {
		inProgress = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};

	// Based off of the plugin by Clint Helfers, with permission.
	// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function (time, type) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue(type, function (next, hooks) {
			var timeout = window.setTimeout(next, time);
			hooks.stop = function () {
				window.clearTimeout(timeout);
			};
		});
	};

	(function () {
		var input = document.createElement("input"),
		    select = document.createElement("select"),
		    opt = select.appendChild(document.createElement("option"));

		input.type = "checkbox";

		// Support: Android <=4.3 only
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE <=11 only
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: IE <=11 only
		// An input loses its value after becoming a radio
		input = document.createElement("input");
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	})();

	var boolHook,
	    attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend({
		attr: function attr(name, value) {
			return access(this, jQuery.attr, name, value, arguments.length > 1);
		},

		removeAttr: function removeAttr(name) {
			return this.each(function () {
				jQuery.removeAttr(this, name);
			});
		}
	});

	jQuery.extend({
		attr: function attr(elem, name, value) {
			var ret,
			    hooks,
			    nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if (typeof elem.getAttribute === "undefined") {
				return jQuery.prop(elem, name, value);
			}

			// Attribute hooks are determined by the lowercase version
			// Grab necessary hook if one is defined
			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
				hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : undefined);
			}

			if (value !== undefined) {
				if (value === null) {
					jQuery.removeAttr(elem, name);
					return;
				}

				if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				elem.setAttribute(name, value + "");
				return value;
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			ret = jQuery.find.attr(elem, name);

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function set(elem, value) {
					if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
						var val = elem.value;
						elem.setAttribute("type", value);
						if (val) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		removeAttr: function removeAttr(elem, value) {
			var name,
			    i = 0,


			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match(rnothtmlwhite);

			if (attrNames && elem.nodeType === 1) {
				while (name = attrNames[i++]) {
					elem.removeAttribute(name);
				}
			}
		}
	});

	// Hooks for boolean attributes
	boolHook = {
		set: function set(elem, value, name) {
			if (value === false) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr(elem, name);
			} else {
				elem.setAttribute(name, name);
			}
			return name;
		}
	};

	jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
		var getter = attrHandle[name] || jQuery.find.attr;

		attrHandle[name] = function (elem, name, isXML) {
			var ret,
			    handle,
			    lowercaseName = name.toLowerCase();

			if (!isXML) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[lowercaseName];
				attrHandle[lowercaseName] = ret;
				ret = getter(elem, name, isXML) != null ? lowercaseName : null;
				attrHandle[lowercaseName] = handle;
			}
			return ret;
		};
	});

	var rfocusable = /^(?:input|select|textarea|button)$/i,
	    rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend({
		prop: function prop(name, value) {
			return access(this, jQuery.prop, name, value, arguments.length > 1);
		},

		removeProp: function removeProp(name) {
			return this.each(function () {
				delete this[jQuery.propFix[name] || name];
			});
		}
	});

	jQuery.extend({
		prop: function prop(elem, name, value) {
			var ret,
			    hooks,
			    nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {

				// Fix name and attach hooks
				name = jQuery.propFix[name] || name;
				hooks = jQuery.propHooks[name];
			}

			if (value !== undefined) {
				if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				return elem[name] = value;
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			return elem[name];
		},

		propHooks: {
			tabIndex: {
				get: function get(elem) {

					// Support: IE <=9 - 11 only
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr(elem, "tabindex");

					if (tabindex) {
						return parseInt(tabindex, 10);
					}

					if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
						return 0;
					}

					return -1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	});

	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	// eslint rule "no-unused-expressions" is disabled for this code
	// since it considers such accessions noop
	if (!support.optSelected) {
		jQuery.propHooks.selected = {
			get: function get(elem) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if (parent && parent.parentNode) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function set(elem) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if (parent) {
					parent.selectedIndex;

					if (parent.parentNode) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
		jQuery.propFix[this.toLowerCase()] = this;
	});

	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse(value) {
		var tokens = value.match(rnothtmlwhite) || [];
		return tokens.join(" ");
	}

	function getClass(elem) {
		return elem.getAttribute && elem.getAttribute("class") || "";
	}

	jQuery.fn.extend({
		addClass: function addClass(value) {
			var classes,
			    elem,
			    cur,
			    curValue,
			    clazz,
			    j,
			    finalValue,
			    i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).addClass(value.call(this, j, getClass(this)));
				});
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnothtmlwhite) || [];

				while (elem = this[i++]) {
					curValue = getClass(elem);
					cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

					if (cur) {
						j = 0;
						while (clazz = classes[j++]) {
							if (cur.indexOf(" " + clazz + " ") < 0) {
								cur += clazz + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		removeClass: function removeClass(value) {
			var classes,
			    elem,
			    cur,
			    curValue,
			    clazz,
			    j,
			    finalValue,
			    i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).removeClass(value.call(this, j, getClass(this)));
				});
			}

			if (!arguments.length) {
				return this.attr("class", "");
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnothtmlwhite) || [];

				while (elem = this[i++]) {
					curValue = getClass(elem);

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

					if (cur) {
						j = 0;
						while (clazz = classes[j++]) {

							// Remove *all* instances
							while (cur.indexOf(" " + clazz + " ") > -1) {
								cur = cur.replace(" " + clazz + " ", " ");
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		toggleClass: function toggleClass(value, stateVal) {
			var type = typeof value === "undefined" ? "undefined" : _typeof(value);

			if (typeof stateVal === "boolean" && type === "string") {
				return stateVal ? this.addClass(value) : this.removeClass(value);
			}

			if (jQuery.isFunction(value)) {
				return this.each(function (i) {
					jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
				});
			}

			return this.each(function () {
				var className, i, self, classNames;

				if (type === "string") {

					// Toggle individual class names
					i = 0;
					self = jQuery(this);
					classNames = value.match(rnothtmlwhite) || [];

					while (className = classNames[i++]) {

						// Check each className given, space separated list
						if (self.hasClass(className)) {
							self.removeClass(className);
						} else {
							self.addClass(className);
						}
					}

					// Toggle whole class name
				} else if (value === undefined || type === "boolean") {
					className = getClass(this);
					if (className) {

						// Store className if set
						dataPriv.set(this, "__className__", className);
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if (this.setAttribute) {
						this.setAttribute("class", className || value === false ? "" : dataPriv.get(this, "__className__") || "");
					}
				}
			});
		},

		hasClass: function hasClass(selector) {
			var className,
			    elem,
			    i = 0;

			className = " " + selector + " ";
			while (elem = this[i++]) {
				if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
					return true;
				}
			}

			return false;
		}
	});

	var rreturn = /\r/g;

	jQuery.fn.extend({
		val: function val(value) {
			var hooks,
			    ret,
			    isFunction,
			    elem = this[0];

			if (!arguments.length) {
				if (elem) {
					hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

					if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
						return ret;
					}

					ret = elem.value;

					// Handle most common string cases
					if (typeof ret === "string") {
						return ret.replace(rreturn, "");
					}

					// Handle cases where value is null/undef or number
					return ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction(value);

			return this.each(function (i) {
				var val;

				if (this.nodeType !== 1) {
					return;
				}

				if (isFunction) {
					val = value.call(this, i, jQuery(this).val());
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if (val == null) {
					val = "";
				} else if (typeof val === "number") {
					val += "";
				} else if (Array.isArray(val)) {
					val = jQuery.map(val, function (value) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

				// If set returns undefined, fall back to normal setting
				if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks: {
			option: {
				get: function get(elem) {

					var val = jQuery.find.attr(elem, "value");
					return val != null ? val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse(jQuery.text(elem));
				}
			},
			select: {
				get: function get(elem) {
					var value,
					    option,
					    i,
					    options = elem.options,
					    index = elem.selectedIndex,
					    one = elem.type === "select-one",
					    values = one ? null : [],
					    max = one ? index + 1 : options.length;

					if (index < 0) {
						i = max;
					} else {
						i = one ? index : 0;
					}

					// Loop through all the selected options
					for (; i < max; i++) {
						option = options[i];

						// Support: IE <=9 only
						// IE8-9 doesn't update selected after form reset (#2551)
						if ((option.selected || i === index) &&

						// Don't return options that are disabled or in a disabled optgroup
						!option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if (one) {
								return value;
							}

							// Multi-Selects return an array
							values.push(value);
						}
					}

					return values;
				},

				set: function set(elem, value) {
					var optionSet,
					    option,
					    options = elem.options,
					    values = jQuery.makeArray(value),
					    i = options.length;

					while (i--) {
						option = options[i];

						/* eslint-disable no-cond-assign */

						if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
							optionSet = true;
						}

						/* eslint-enable no-cond-assign */
					}

					// Force browsers to behave consistently when non-matching value is set
					if (!optionSet) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	});

	// Radios and checkboxes getter/setter
	jQuery.each(["radio", "checkbox"], function () {
		jQuery.valHooks[this] = {
			set: function set(elem, value) {
				if (Array.isArray(value)) {
					return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
				}
			}
		};
		if (!support.checkOn) {
			jQuery.valHooks[this].get = function (elem) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			};
		}
	});

	// Return jQuery for attributes-only inclusion


	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

	jQuery.extend(jQuery.event, {

		trigger: function trigger(event, data, elem, onlyHandlers) {

			var i,
			    cur,
			    tmp,
			    bubbleType,
			    ontype,
			    handle,
			    special,
			    eventPath = [elem || document],
			    type = hasOwn.call(event, "type") ? event.type : event,
			    namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if (elem.nodeType === 3 || elem.nodeType === 8) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if (rfocusMorph.test(type + jQuery.event.triggered)) {
				return;
			}

			if (type.indexOf(".") > -1) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf(":") < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[jQuery.expando] ? event : new jQuery.Event(type, (typeof event === "undefined" ? "undefined" : _typeof(event)) === "object" && event);

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if (!event.target) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ? [event] : jQuery.makeArray(data, [event]);

			// Allow special events to draw outside the lines
			special = jQuery.event.special[type] || {};
			if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

				bubbleType = special.delegateType || type;
				if (!rfocusMorph.test(bubbleType + type)) {
					cur = cur.parentNode;
				}
				for (; cur; cur = cur.parentNode) {
					eventPath.push(cur);
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if (tmp === (elem.ownerDocument || document)) {
					eventPath.push(tmp.defaultView || tmp.parentWindow || window);
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

				event.type = i > 1 ? bubbleType : special.bindType || type;

				// jQuery handler
				handle = (dataPriv.get(cur, "events") || {})[event.type] && dataPriv.get(cur, "handle");
				if (handle) {
					handle.apply(cur, data);
				}

				// Native handler
				handle = ontype && cur[ontype];
				if (handle && handle.apply && acceptData(cur)) {
					event.result = handle.apply(cur, data);
					if (event.result === false) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if (!onlyHandlers && !event.isDefaultPrevented()) {

				if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {

					// Call a native DOM method on the target with the same name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem)) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ontype];

						if (tmp) {
							elem[ontype] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[type]();
						jQuery.event.triggered = undefined;

						if (tmp) {
							elem[ontype] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function simulate(type, elem, event) {
			var e = jQuery.extend(new jQuery.Event(), event, {
				type: type,
				isSimulated: true
			});

			jQuery.event.trigger(e, null, elem);
		}

	});

	jQuery.fn.extend({

		trigger: function trigger(type, data) {
			return this.each(function () {
				jQuery.event.trigger(type, data, this);
			});
		},
		triggerHandler: function triggerHandler(type, data) {
			var elem = this[0];
			if (elem) {
				return jQuery.event.trigger(type, data, elem, true);
			}
		}
	});

	jQuery.each(("blur focus focusin focusout resize scroll click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup contextmenu").split(" "), function (i, name) {

		// Handle event binding
		jQuery.fn[name] = function (data, fn) {
			return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
		};
	});

	jQuery.fn.extend({
		hover: function hover(fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		}
	});

	support.focusin = "onfocusin" in window;

	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	if (!support.focusin) {
		jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function handler(event) {
				jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
			};

			jQuery.event.special[fix] = {
				setup: function setup() {
					var doc = this.ownerDocument || this,
					    attaches = dataPriv.access(doc, fix);

					if (!attaches) {
						doc.addEventListener(orig, handler, true);
					}
					dataPriv.access(doc, fix, (attaches || 0) + 1);
				},
				teardown: function teardown() {
					var doc = this.ownerDocument || this,
					    attaches = dataPriv.access(doc, fix) - 1;

					if (!attaches) {
						doc.removeEventListener(orig, handler, true);
						dataPriv.remove(doc, fix);
					} else {
						dataPriv.access(doc, fix, attaches);
					}
				}
			};
		});
	}
	var location = window.location;

	var nonce = jQuery.now();

	var rquery = /\?/;

	// Cross-browser xml parsing
	jQuery.parseXML = function (data) {
		var xml;
		if (!data || typeof data !== "string") {
			return null;
		}

		// Support: IE 9 - 11 only
		// IE throws on parseFromString with invalid input.
		try {
			xml = new window.DOMParser().parseFromString(data, "text/xml");
		} catch (e) {
			xml = undefined;
		}

		if (!xml || xml.getElementsByTagName("parsererror").length) {
			jQuery.error("Invalid XML: " + data);
		}
		return xml;
	};

	var rbracket = /\[\]$/,
	    rCRLF = /\r?\n/g,
	    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	    rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams(prefix, obj, traditional, add) {
		var name;

		if (Array.isArray(obj)) {

			// Serialize array item.
			jQuery.each(obj, function (i, v) {
				if (traditional || rbracket.test(prefix)) {

					// Treat each array item as a scalar.
					add(prefix, v);
				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(prefix + "[" + ((typeof v === "undefined" ? "undefined" : _typeof(v)) === "object" && v != null ? i : "") + "]", v, traditional, add);
				}
			});
		} else if (!traditional && jQuery.type(obj) === "object") {

			// Serialize object item.
			for (name in obj) {
				buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
			}
		} else {

			// Serialize scalar item.
			add(prefix, obj);
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function (a, traditional) {
		var prefix,
		    s = [],
		    add = function add(key, valueOrFunction) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;

			s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
		};

		// If an array was passed in, assume that it is an array of form elements.
		if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {

			// Serialize the form elements
			jQuery.each(a, function () {
				add(this.name, this.value);
			});
		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for (prefix in a) {
				buildParams(prefix, a[prefix], traditional, add);
			}
		}

		// Return the resulting serialization
		return s.join("&");
	};

	jQuery.fn.extend({
		serialize: function serialize() {
			return jQuery.param(this.serializeArray());
		},
		serializeArray: function serializeArray() {
			return this.map(function () {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop(this, "elements");
				return elements ? jQuery.makeArray(elements) : this;
			}).filter(function () {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
			}).map(function (i, elem) {
				var val = jQuery(this).val();

				if (val == null) {
					return null;
				}

				if (Array.isArray(val)) {
					return jQuery.map(val, function (val) {
						return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
					});
				}

				return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
			}).get();
		}
	});

	var r20 = /%20/g,
	    rhash = /#.*$/,
	    rantiCache = /([?&])_=[^&]*/,
	    rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,


	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	    rnoContent = /^(?:GET|HEAD)$/,
	    rprotocol = /^\/\//,


	/* Prefilters
  * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
  * 2) These are called:
  *    - BEFORE asking for a transport
  *    - AFTER param serialization (s.data is a string if s.processData is true)
  * 3) key is the dataType
  * 4) the catchall symbol "*" can be used
  * 5) execution will start with transport dataType and THEN continue down to "*" if needed
  */
	prefilters = {},


	/* Transports bindings
  * 1) key is the dataType
  * 2) the catchall symbol "*" can be used
  * 3) selection will start with transport dataType and THEN go to "*" if needed
  */
	transports = {},


	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*"),


	// Anchor tag for parsing the document origin
	originAnchor = document.createElement("a");
	originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports(structure) {

		// dataTypeExpression is optional and defaults to "*"
		return function (dataTypeExpression, func) {

			if (typeof dataTypeExpression !== "string") {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
			    i = 0,
			    dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];

			if (jQuery.isFunction(func)) {

				// For each dataType in the dataTypeExpression
				while (dataType = dataTypes[i++]) {

					// Prepend if requested
					if (dataType[0] === "+") {
						dataType = dataType.slice(1) || "*";
						(structure[dataType] = structure[dataType] || []).unshift(func);

						// Otherwise append
					} else {
						(structure[dataType] = structure[dataType] || []).push(func);
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

		var inspected = {},
		    seekingTransport = structure === transports;

		function inspect(dataType) {
			var selected;
			inspected[dataType] = true;
			jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
				var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
				if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {

					options.dataTypes.unshift(dataTypeOrTransport);
					inspect(dataTypeOrTransport);
					return false;
				} else if (seekingTransport) {
					return !(selected = dataTypeOrTransport);
				}
			});
			return selected;
		}

		return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend(target, src) {
		var key,
		    deep,
		    flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for (key in src) {
			if (src[key] !== undefined) {
				(flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
			}
		}
		if (deep) {
			jQuery.extend(true, target, deep);
		}

		return target;
	}

	/* Handles responses to an ajax request:
  * - finds the right dataType (mediates between content-type and expected dataType)
  * - returns the corresponding response
  */
	function ajaxHandleResponses(s, jqXHR, responses) {

		var ct,
		    type,
		    finalDataType,
		    firstDataType,
		    contents = s.contents,
		    dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while (dataTypes[0] === "*") {
			dataTypes.shift();
			if (ct === undefined) {
				ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
			}
		}

		// Check if we're dealing with a known content-type
		if (ct) {
			for (type in contents) {
				if (contents[type] && contents[type].test(ct)) {
					dataTypes.unshift(type);
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if (dataTypes[0] in responses) {
			finalDataType = dataTypes[0];
		} else {

			// Try convertible dataTypes
			for (type in responses) {
				if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
					finalDataType = type;
					break;
				}
				if (!firstDataType) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if (finalDataType) {
			if (finalDataType !== dataTypes[0]) {
				dataTypes.unshift(finalDataType);
			}
			return responses[finalDataType];
		}
	}

	/* Chain conversions given the request and the original response
  * Also sets the responseXXX fields on the jqXHR instance
  */
	function ajaxConvert(s, response, jqXHR, isSuccess) {
		var conv2,
		    current,
		    conv,
		    tmp,
		    prev,
		    converters = {},


		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if (dataTypes[1]) {
			for (conv in s.converters) {
				converters[conv.toLowerCase()] = s.converters[conv];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while (current) {

			if (s.responseFields[current]) {
				jqXHR[s.responseFields[current]] = response;
			}

			// Apply the dataFilter if provided
			if (!prev && isSuccess && s.dataFilter) {
				response = s.dataFilter(response, s.dataType);
			}

			prev = current;
			current = dataTypes.shift();

			if (current) {

				// There's only work to do if current dataType is non-auto
				if (current === "*") {

					current = prev;

					// Convert response if prev dataType is non-auto and differs from current
				} else if (prev !== "*" && prev !== current) {

					// Seek a direct converter
					conv = converters[prev + " " + current] || converters["* " + current];

					// If none found, seek a pair
					if (!conv) {
						for (conv2 in converters) {

							// If conv2 outputs current
							tmp = conv2.split(" ");
							if (tmp[1] === current) {

								// If prev can be converted to accepted input
								conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
								if (conv) {

									// Condense equivalence converters
									if (conv === true) {
										conv = converters[conv2];

										// Otherwise, insert the intermediate dataType
									} else if (converters[conv2] !== true) {
										current = tmp[0];
										dataTypes.unshift(tmp[1]);
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if (conv !== true) {

						// Unless errors are allowed to bubble, catch and return them
						if (conv && s.throws) {
							response = conv(response);
						} else {
							try {
								response = conv(response);
							} catch (e) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend({

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test(location.protocol),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",

			/*
   timeout: 0,
   data: null,
   dataType: null,
   username: null,
   password: null,
   cache: null,
   throws: false,
   traditional: false,
   headers: {},
   */

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": JSON.parse,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function ajaxSetup(target, settings) {
			return settings ?

			// Building a settings object
			ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

			// Extending ajaxSettings
			ajaxExtend(jQuery.ajaxSettings, target);
		},

		ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
		ajaxTransport: addToPrefiltersOrTransports(transports),

		// Main method
		ajax: function ajax(url, options) {

			// If url is an object, simulate pre-1.5 signature
			if ((typeof url === "undefined" ? "undefined" : _typeof(url)) === "object") {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,


			// URL without anti-cache param
			cacheURL,


			// Response headers
			responseHeadersString,
			    responseHeaders,


			// timeout handle
			timeoutTimer,


			// Url cleanup var
			urlAnchor,


			// Request state (becomes false upon send and true upon completion)
			completed,


			// To know if global events are to be dispatched
			fireGlobals,


			// Loop variable
			i,


			// uncached part of the url
			uncached,


			// Create the final options object
			s = jQuery.ajaxSetup({}, options),


			// Callbacks context
			callbackContext = s.context || s,


			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event,


			// Deferreds
			deferred = jQuery.Deferred(),
			    completeDeferred = jQuery.Callbacks("once memory"),


			// Status-dependent callbacks
			_statusCode = s.statusCode || {},


			// Headers (they are sent all at once)
			requestHeaders = {},
			    requestHeadersNames = {},


			// Default abort message
			strAbort = "canceled",


			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function getResponseHeader(key) {
					var match;
					if (completed) {
						if (!responseHeaders) {
							responseHeaders = {};
							while (match = rheaders.exec(responseHeadersString)) {
								responseHeaders[match[1].toLowerCase()] = match[2];
							}
						}
						match = responseHeaders[key.toLowerCase()];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function getAllResponseHeaders() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function setRequestHeader(name, value) {
					if (completed == null) {
						name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
						requestHeaders[name] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function overrideMimeType(type) {
					if (completed == null) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function statusCode(map) {
					var code;
					if (map) {
						if (completed) {

							// Execute the appropriate callbacks
							jqXHR.always(map[jqXHR.status]);
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for (code in map) {
								_statusCode[code] = [_statusCode[code], map[code]];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function abort(statusText) {
					var finalText = statusText || strAbort;
					if (transport) {
						transport.abort(finalText);
					}
					done(0, finalText);
					return this;
				}
			};

			// Attach deferreds
			deferred.promise(jqXHR);

			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if (s.crossDomain == null) {
				urlAnchor = document.createElement("a");

				// Support: IE <=8 - 11, Edge 12 - 13
				// IE throws exception on accessing the href property if url is malformed,
				// e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE <=8 - 11 only
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
				} catch (e) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if (s.data && s.processData && typeof s.data !== "string") {
				s.data = jQuery.param(s.data, s.traditional);
			}

			// Apply prefilters
			inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

			// If request was aborted inside a prefilter, stop there
			if (completed) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if (fireGlobals && jQuery.active++ === 0) {
				jQuery.event.trigger("ajaxStart");
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test(s.type);

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			// Remove hash to simplify url manipulation
			cacheURL = s.url.replace(rhash, "");

			// More options handling for requests with no content
			if (!s.hasContent) {

				// Remember the hash so we can put it back
				uncached = s.url.slice(cacheURL.length);

				// If data is available, append data to url
				if (s.data) {
					cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add or update anti-cache param if needed
				if (s.cache === false) {
					cacheURL = cacheURL.replace(rantiCache, "$1");
					uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++ + uncached;
				}

				// Put hash and anti-cache on the URL that will be requested (gh-1732)
				s.url = cacheURL + uncached;

				// Change '%20' to '+' if this is encoded form body content (gh-2658)
			} else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
				s.data = s.data.replace(r20, "+");
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if (s.ifModified) {
				if (jQuery.lastModified[cacheURL]) {
					jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
				}
				if (jQuery.etag[cacheURL]) {
					jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
				}
			}

			// Set the correct header, if data is being sent
			if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
				jqXHR.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);

			// Check for headers option
			for (i in s.headers) {
				jqXHR.setRequestHeader(i, s.headers[i]);
			}

			// Allow custom headers/mimetypes and early abort
			if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed)) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			completeDeferred.add(s.complete);
			jqXHR.done(s.success);
			jqXHR.fail(s.error);

			// Get transport
			transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

			// If no transport, we auto-abort
			if (!transport) {
				done(-1, "No Transport");
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if (fireGlobals) {
					globalEventContext.trigger("ajaxSend", [jqXHR, s]);
				}

				// If request was aborted inside ajaxSend, stop there
				if (completed) {
					return jqXHR;
				}

				// Timeout
				if (s.async && s.timeout > 0) {
					timeoutTimer = window.setTimeout(function () {
						jqXHR.abort("timeout");
					}, s.timeout);
				}

				try {
					completed = false;
					transport.send(requestHeaders, done);
				} catch (e) {

					// Rethrow post-completion exceptions
					if (completed) {
						throw e;
					}

					// Propagate others as results
					done(-1, e);
				}
			}

			// Callback for when everything is done
			function done(status, nativeStatusText, responses, headers) {
				var isSuccess,
				    success,
				    error,
				    response,
				    modified,
				    statusText = nativeStatusText;

				// Ignore repeat invocations
				if (completed) {
					return;
				}

				completed = true;

				// Clear timeout if it exists
				if (timeoutTimer) {
					window.clearTimeout(timeoutTimer);
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if (responses) {
					response = ajaxHandleResponses(s, jqXHR, responses);
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert(s, response, jqXHR, isSuccess);

				// If successful, handle type chaining
				if (isSuccess) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if (s.ifModified) {
						modified = jqXHR.getResponseHeader("Last-Modified");
						if (modified) {
							jQuery.lastModified[cacheURL] = modified;
						}
						modified = jqXHR.getResponseHeader("etag");
						if (modified) {
							jQuery.etag[cacheURL] = modified;
						}
					}

					// if no content
					if (status === 204 || s.type === "HEAD") {
						statusText = "nocontent";

						// if not modified
					} else if (status === 304) {
						statusText = "notmodified";

						// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if (status || !statusText) {
						statusText = "error";
						if (status < 0) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = (nativeStatusText || statusText) + "";

				// Success/Error
				if (isSuccess) {
					deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
				} else {
					deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
				}

				// Status-dependent callbacks
				jqXHR.statusCode(_statusCode);
				_statusCode = undefined;

				if (fireGlobals) {
					globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [jqXHR, s, isSuccess ? success : error]);
				}

				// Complete
				completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

				if (fireGlobals) {
					globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

					// Handle the global AJAX counter
					if (! --jQuery.active) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			return jqXHR;
		},

		getJSON: function getJSON(url, data, callback) {
			return jQuery.get(url, data, callback, "json");
		},

		getScript: function getScript(url, callback) {
			return jQuery.get(url, undefined, callback, "script");
		}
	});

	jQuery.each(["get", "post"], function (i, method) {
		jQuery[method] = function (url, data, callback, type) {

			// Shift arguments if data argument was omitted
			if (jQuery.isFunction(data)) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax(jQuery.extend({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject(url) && url));
		};
	});

	jQuery._evalUrl = function (url) {
		return jQuery.ajax({
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			"throws": true
		});
	};

	jQuery.fn.extend({
		wrapAll: function wrapAll(html) {
			var wrap;

			if (this[0]) {
				if (jQuery.isFunction(html)) {
					html = html.call(this[0]);
				}

				// The elements to wrap the target around
				wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

				if (this[0].parentNode) {
					wrap.insertBefore(this[0]);
				}

				wrap.map(function () {
					var elem = this;

					while (elem.firstElementChild) {
						elem = elem.firstElementChild;
					}

					return elem;
				}).append(this);
			}

			return this;
		},

		wrapInner: function wrapInner(html) {
			if (jQuery.isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapInner(html.call(this, i));
				});
			}

			return this.each(function () {
				var self = jQuery(this),
				    contents = self.contents();

				if (contents.length) {
					contents.wrapAll(html);
				} else {
					self.append(html);
				}
			});
		},

		wrap: function wrap(html) {
			var isFunction = jQuery.isFunction(html);

			return this.each(function (i) {
				jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
			});
		},

		unwrap: function unwrap(selector) {
			this.parent(selector).not("body").each(function () {
				jQuery(this).replaceWith(this.childNodes);
			});
			return this;
		}
	});

	jQuery.expr.pseudos.hidden = function (elem) {
		return !jQuery.expr.pseudos.visible(elem);
	};
	jQuery.expr.pseudos.visible = function (elem) {
		return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
	};

	jQuery.ajaxSettings.xhr = function () {
		try {
			return new window.XMLHttpRequest();
		} catch (e) {}
	};

	var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	    xhrSupported = jQuery.ajaxSettings.xhr();

	support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport(function (options) {
		var _callback, errorCallback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if (support.cors || xhrSupported && !options.crossDomain) {
			return {
				send: function send(headers, complete) {
					var i,
					    xhr = options.xhr();

					xhr.open(options.type, options.url, options.async, options.username, options.password);

					// Apply custom fields if provided
					if (options.xhrFields) {
						for (i in options.xhrFields) {
							xhr[i] = options.xhrFields[i];
						}
					}

					// Override mime type if needed
					if (options.mimeType && xhr.overrideMimeType) {
						xhr.overrideMimeType(options.mimeType);
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if (!options.crossDomain && !headers["X-Requested-With"]) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for (i in headers) {
						xhr.setRequestHeader(i, headers[i]);
					}

					// Callback
					_callback = function callback(type) {
						return function () {
							if (_callback) {
								_callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

								if (type === "abort") {
									xhr.abort();
								} else if (type === "error") {

									// Support: IE <=9 only
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if (typeof xhr.status !== "number") {
										complete(0, "error");
									} else {
										complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status, xhr.statusText);
									}
								} else {
									complete(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									(xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText }, xhr.getAllResponseHeaders());
								}
							}
						};
					};

					// Listen to events
					xhr.onload = _callback();
					errorCallback = xhr.onerror = _callback("error");

					// Support: IE 9 only
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if (xhr.onabort !== undefined) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function () {

							// Check readyState before timeout as it changes
							if (xhr.readyState === 4) {

								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout(function () {
									if (_callback) {
										errorCallback();
									}
								});
							}
						};
					}

					// Create the abort callback
					_callback = _callback("abort");

					try {

						// Do send the request (this may raise an exception)
						xhr.send(options.hasContent && options.data || null);
					} catch (e) {

						// #14683: Only rethrow if this hasn't been notified as an error yet
						if (_callback) {
							throw e;
						}
					}
				},

				abort: function abort() {
					if (_callback) {
						_callback();
					}
				}
			};
		}
	});

	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter(function (s) {
		if (s.crossDomain) {
			s.contents.script = false;
		}
	});

	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function textScript(text) {
				jQuery.globalEval(text);
				return text;
			}
		}
	});

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter("script", function (s) {
		if (s.cache === undefined) {
			s.cache = false;
		}
		if (s.crossDomain) {
			s.type = "GET";
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport("script", function (s) {

		// This transport only deals with cross domain requests
		if (s.crossDomain) {
			var script, _callback2;
			return {
				send: function send(_, complete) {
					script = jQuery("<script>").prop({
						charset: s.scriptCharset,
						src: s.url
					}).on("load error", _callback2 = function callback(evt) {
						script.remove();
						_callback2 = null;
						if (evt) {
							complete(evt.type === "error" ? 404 : 200, evt.type);
						}
					});

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild(script[0]);
				},
				abort: function abort() {
					if (_callback2) {
						_callback2();
					}
				}
			};
		}
	});

	var oldCallbacks = [],
	    rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function jsonpCallback() {
			var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
			this[callback] = true;
			return callback;
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

		var callbackName,
		    overwritten,
		    responseContainer,
		    jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if (jsonProp || s.dataTypes[0] === "jsonp") {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;

			// Insert callback into url or form data
			if (jsonProp) {
				s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
			} else if (s.jsonp !== false) {
				s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function () {
				if (!responseContainer) {
					jQuery.error(callbackName + " was not called");
				}
				return responseContainer[0];
			};

			// Force json dataType
			s.dataTypes[0] = "json";

			// Install callback
			overwritten = window[callbackName];
			window[callbackName] = function () {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always(function () {

				// If previous value didn't exist - remove it
				if (overwritten === undefined) {
					jQuery(window).removeProp(callbackName);

					// Otherwise restore preexisting value
				} else {
					window[callbackName] = overwritten;
				}

				// Save back as free
				if (s[callbackName]) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push(callbackName);
				}

				// Call if it was a function and we have a response
				if (responseContainer && jQuery.isFunction(overwritten)) {
					overwritten(responseContainer[0]);
				}

				responseContainer = overwritten = undefined;
			});

			// Delegate to script
			return "script";
		}
	});

	// Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = function () {
		var body = document.implementation.createHTMLDocument("").body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	}();

	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function (data, context, keepScripts) {
		if (typeof data !== "string") {
			return [];
		}
		if (typeof context === "boolean") {
			keepScripts = context;
			context = false;
		}

		var base, parsed, scripts;

		if (!context) {

			// Stop scripts or inline event handlers from being executed immediately
			// by using document.implementation
			if (support.createHTMLDocument) {
				context = document.implementation.createHTMLDocument("");

				// Set the base href for the created document
				// so any parsed elements with URLs
				// are based on the document's URL (gh-2965)
				base = context.createElement("base");
				base.href = document.location.href;
				context.head.appendChild(base);
			} else {
				context = document;
			}
		}

		parsed = rsingleTag.exec(data);
		scripts = !keepScripts && [];

		// Single tag
		if (parsed) {
			return [context.createElement(parsed[1])];
		}

		parsed = buildFragment([data], context, scripts);

		if (scripts && scripts.length) {
			jQuery(scripts).remove();
		}

		return jQuery.merge([], parsed.childNodes);
	};

	/**
  * Load a url into a page
  */
	jQuery.fn.load = function (url, params, callback) {
		var selector,
		    type,
		    response,
		    self = this,
		    off = url.indexOf(" ");

		if (off > -1) {
			selector = stripAndCollapse(url.slice(off));
			url = url.slice(0, off);
		}

		// If it's a function
		if (jQuery.isFunction(params)) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

			// Otherwise, build a param string
		} else if (params && (typeof params === "undefined" ? "undefined" : _typeof(params)) === "object") {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if (self.length > 0) {
			jQuery.ajax({
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			}).done(function (responseText) {

				// Save response for use in complete callback
				response = arguments;

				self.html(selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

				// Otherwise use the full result
				responseText);

				// If the request succeeds, this function gets "data", "status", "jqXHR"
				// but they are ignored because response was set above.
				// If it fails, this function gets "jqXHR", "status", "error"
			}).always(callback && function (jqXHR, status) {
				self.each(function () {
					callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
				});
			});
		}

		return this;
	};

	// Attach a bunch of functions for handling common AJAX events
	jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (i, type) {
		jQuery.fn[type] = function (fn) {
			return this.on(type, fn);
		};
	});

	jQuery.expr.pseudos.animated = function (elem) {
		return jQuery.grep(jQuery.timers, function (fn) {
			return elem === fn.elem;
		}).length;
	};

	jQuery.offset = {
		setOffset: function setOffset(elem, options, i) {
			var curPosition,
			    curLeft,
			    curCSSTop,
			    curTop,
			    curOffset,
			    curCSSLeft,
			    calculatePosition,
			    position = jQuery.css(elem, "position"),
			    curElem = jQuery(elem),
			    props = {};

			// Set position first, in-case top/left are set even on static elem
			if (position === "static") {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css(elem, "top");
			curCSSLeft = jQuery.css(elem, "left");
			calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if (calculatePosition) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if (jQuery.isFunction(options)) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call(elem, i, jQuery.extend({}, curOffset));
			}

			if (options.top != null) {
				props.top = options.top - curOffset.top + curTop;
			}
			if (options.left != null) {
				props.left = options.left - curOffset.left + curLeft;
			}

			if ("using" in options) {
				options.using.call(elem, props);
			} else {
				curElem.css(props);
			}
		}
	};

	jQuery.fn.extend({
		offset: function offset(options) {

			// Preserve chaining for setter
			if (arguments.length) {
				return options === undefined ? this : this.each(function (i) {
					jQuery.offset.setOffset(this, options, i);
				});
			}

			var doc,
			    docElem,
			    rect,
			    win,
			    elem = this[0];

			if (!elem) {
				return;
			}

			// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
			// Support: IE <=11 only
			// Running getBoundingClientRect on a
			// disconnected node in IE throws an error
			if (!elem.getClientRects().length) {
				return { top: 0, left: 0 };
			}

			rect = elem.getBoundingClientRect();

			doc = elem.ownerDocument;
			docElem = doc.documentElement;
			win = doc.defaultView;

			return {
				top: rect.top + win.pageYOffset - docElem.clientTop,
				left: rect.left + win.pageXOffset - docElem.clientLeft
			};
		},

		position: function position() {
			if (!this[0]) {
				return;
			}

			var offsetParent,
			    offset,
			    elem = this[0],
			    parentOffset = { top: 0, left: 0 };

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if (jQuery.css(elem, "position") === "fixed") {

				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();
			} else {

				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if (!nodeName(offsetParent[0], "html")) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset = {
					top: parentOffset.top + jQuery.css(offsetParent[0], "borderTopWidth", true),
					left: parentOffset.left + jQuery.css(offsetParent[0], "borderLeftWidth", true)
				};
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
				left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function offsetParent() {
			return this.map(function () {
				var offsetParent = this.offsetParent;

				while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			});
		}
	});

	// Create scrollLeft and scrollTop methods
	jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
		var top = "pageYOffset" === prop;

		jQuery.fn[method] = function (val) {
			return access(this, function (elem, method, val) {

				// Coalesce documents and windows
				var win;
				if (jQuery.isWindow(elem)) {
					win = elem;
				} else if (elem.nodeType === 9) {
					win = elem.defaultView;
				}

				if (val === undefined) {
					return win ? win[prop] : elem[method];
				}

				if (win) {
					win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
				} else {
					elem[method] = val;
				}
			}, method, val, arguments.length);
		};
	});

	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each(["top", "left"], function (i, prop) {
		jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
			if (computed) {
				computed = curCSS(elem, prop);

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
			}
		});
	});

	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
		jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function (defaultExtra, funcName) {

			// Margin is only for outerHeight, outerWidth
			jQuery.fn[funcName] = function (margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
				    extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

				return access(this, function (elem, type, value) {
					var doc;

					if (jQuery.isWindow(elem)) {

						// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
						return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
					}

					// Get document width or height
					if (elem.nodeType === 9) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
					}

					return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css(elem, type, extra) :

					// Set width or height on the element
					jQuery.style(elem, type, value, extra);
				}, type, chainable ? margin : undefined, chainable);
			};
		});
	});

	jQuery.fn.extend({

		bind: function bind(types, data, fn) {
			return this.on(types, null, data, fn);
		},
		unbind: function unbind(types, fn) {
			return this.off(types, null, fn);
		},

		delegate: function delegate(selector, types, data, fn) {
			return this.on(types, selector, data, fn);
		},
		undelegate: function undelegate(selector, types, fn) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
		}
	});

	jQuery.holdReady = function (hold) {
		if (hold) {
			jQuery.readyWait++;
		} else {
			jQuery.ready(true);
		}
	};
	jQuery.isArray = Array.isArray;
	jQuery.parseJSON = JSON.parse;
	jQuery.nodeName = nodeName;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

	var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,


	// Map over the $ in case of overwrite
	_$ = window.$;

	jQuery.noConflict = function (deep) {
		if (window.$ === jQuery) {
			window.$ = _$;
		}

		if (deep && window.jQuery === jQuery) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if (!noGlobal) {
		window.jQuery = window.$ = jQuery;
	}

	return jQuery;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*!\n *  Font Awesome 4.7.0 by @davegandy - http://fontawesome.io - @fontawesome\n *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)\n */\n/* FONT PATH\n * -------------------------- */\n@font-face {\n  font-family: 'FontAwesome';\n  src: url(" + __webpack_require__(9) + ");\n  src: url(" + __webpack_require__(8) + "?#iefix&v=4.7.0) format('embedded-opentype'), url(" + __webpack_require__(14) + ") format('woff2'), url(" + __webpack_require__(15) + ") format('woff'), url(" + __webpack_require__(11) + ") format('truetype'), url(" + __webpack_require__(10) + "#fontawesomeregular) format('svg');\n  font-weight: normal;\n  font-style: normal;\n}\n.fa {\n  display: inline-block;\n  font: normal normal normal 14px/1 FontAwesome;\n  font-size: inherit;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n/* makes the font 33% larger relative to the icon container */\n.fa-lg {\n  font-size: 1.33333333em;\n  line-height: 0.75em;\n  vertical-align: -15%;\n}\n.fa-2x {\n  font-size: 2em;\n}\n.fa-3x {\n  font-size: 3em;\n}\n.fa-4x {\n  font-size: 4em;\n}\n.fa-5x {\n  font-size: 5em;\n}\n.fa-fw {\n  width: 1.28571429em;\n  text-align: center;\n}\n.fa-ul {\n  padding-left: 0;\n  margin-left: 2.14285714em;\n  list-style-type: none;\n}\n.fa-ul > li {\n  position: relative;\n}\n.fa-li {\n  position: absolute;\n  left: -2.14285714em;\n  width: 2.14285714em;\n  top: 0.14285714em;\n  text-align: center;\n}\n.fa-li.fa-lg {\n  left: -1.85714286em;\n}\n.fa-border {\n  padding: .2em .25em .15em;\n  border: solid 0.08em #eeeeee;\n  border-radius: .1em;\n}\n.fa-pull-left {\n  float: left;\n}\n.fa-pull-right {\n  float: right;\n}\n.fa.fa-pull-left {\n  margin-right: .3em;\n}\n.fa.fa-pull-right {\n  margin-left: .3em;\n}\n/* Deprecated as of 4.4.0 */\n.pull-right {\n  float: right;\n}\n.pull-left {\n  float: left;\n}\n.fa.pull-left {\n  margin-right: .3em;\n}\n.fa.pull-right {\n  margin-left: .3em;\n}\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n  animation: fa-spin 2s infinite linear;\n}\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n  animation: fa-spin 1s infinite steps(8);\n}\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(359deg);\n    transform: rotate(359deg);\n  }\n}\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n  -ms-transform: rotate(90deg);\n  transform: rotate(90deg);\n}\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg);\n}\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n  -ms-transform: rotate(270deg);\n  transform: rotate(270deg);\n}\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n  -ms-transform: scale(-1, 1);\n  transform: scale(-1, 1);\n}\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n  -ms-transform: scale(1, -1);\n  transform: scale(1, -1);\n}\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  filter: none;\n}\n.fa-stack {\n  position: relative;\n  display: inline-block;\n  width: 2em;\n  height: 2em;\n  line-height: 2em;\n  vertical-align: middle;\n}\n.fa-stack-1x,\n.fa-stack-2x {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  text-align: center;\n}\n.fa-stack-1x {\n  line-height: inherit;\n}\n.fa-stack-2x {\n  font-size: 2em;\n}\n.fa-inverse {\n  color: #ffffff;\n}\n/* Font Awesome uses the Unicode Private Use Area (PUA) to ensure screen\n   readers do not read off random characters that represent icons */\n.fa-glass:before {\n  content: \"\\F000\";\n}\n.fa-music:before {\n  content: \"\\F001\";\n}\n.fa-search:before {\n  content: \"\\F002\";\n}\n.fa-envelope-o:before {\n  content: \"\\F003\";\n}\n.fa-heart:before {\n  content: \"\\F004\";\n}\n.fa-star:before {\n  content: \"\\F005\";\n}\n.fa-star-o:before {\n  content: \"\\F006\";\n}\n.fa-user:before {\n  content: \"\\F007\";\n}\n.fa-film:before {\n  content: \"\\F008\";\n}\n.fa-th-large:before {\n  content: \"\\F009\";\n}\n.fa-th:before {\n  content: \"\\F00A\";\n}\n.fa-th-list:before {\n  content: \"\\F00B\";\n}\n.fa-check:before {\n  content: \"\\F00C\";\n}\n.fa-remove:before,\n.fa-close:before,\n.fa-times:before {\n  content: \"\\F00D\";\n}\n.fa-search-plus:before {\n  content: \"\\F00E\";\n}\n.fa-search-minus:before {\n  content: \"\\F010\";\n}\n.fa-power-off:before {\n  content: \"\\F011\";\n}\n.fa-signal:before {\n  content: \"\\F012\";\n}\n.fa-gear:before,\n.fa-cog:before {\n  content: \"\\F013\";\n}\n.fa-trash-o:before {\n  content: \"\\F014\";\n}\n.fa-home:before {\n  content: \"\\F015\";\n}\n.fa-file-o:before {\n  content: \"\\F016\";\n}\n.fa-clock-o:before {\n  content: \"\\F017\";\n}\n.fa-road:before {\n  content: \"\\F018\";\n}\n.fa-download:before {\n  content: \"\\F019\";\n}\n.fa-arrow-circle-o-down:before {\n  content: \"\\F01A\";\n}\n.fa-arrow-circle-o-up:before {\n  content: \"\\F01B\";\n}\n.fa-inbox:before {\n  content: \"\\F01C\";\n}\n.fa-play-circle-o:before {\n  content: \"\\F01D\";\n}\n.fa-rotate-right:before,\n.fa-repeat:before {\n  content: \"\\F01E\";\n}\n.fa-refresh:before {\n  content: \"\\F021\";\n}\n.fa-list-alt:before {\n  content: \"\\F022\";\n}\n.fa-lock:before {\n  content: \"\\F023\";\n}\n.fa-flag:before {\n  content: \"\\F024\";\n}\n.fa-headphones:before {\n  content: \"\\F025\";\n}\n.fa-volume-off:before {\n  content: \"\\F026\";\n}\n.fa-volume-down:before {\n  content: \"\\F027\";\n}\n.fa-volume-up:before {\n  content: \"\\F028\";\n}\n.fa-qrcode:before {\n  content: \"\\F029\";\n}\n.fa-barcode:before {\n  content: \"\\F02A\";\n}\n.fa-tag:before {\n  content: \"\\F02B\";\n}\n.fa-tags:before {\n  content: \"\\F02C\";\n}\n.fa-book:before {\n  content: \"\\F02D\";\n}\n.fa-bookmark:before {\n  content: \"\\F02E\";\n}\n.fa-print:before {\n  content: \"\\F02F\";\n}\n.fa-camera:before {\n  content: \"\\F030\";\n}\n.fa-font:before {\n  content: \"\\F031\";\n}\n.fa-bold:before {\n  content: \"\\F032\";\n}\n.fa-italic:before {\n  content: \"\\F033\";\n}\n.fa-text-height:before {\n  content: \"\\F034\";\n}\n.fa-text-width:before {\n  content: \"\\F035\";\n}\n.fa-align-left:before {\n  content: \"\\F036\";\n}\n.fa-align-center:before {\n  content: \"\\F037\";\n}\n.fa-align-right:before {\n  content: \"\\F038\";\n}\n.fa-align-justify:before {\n  content: \"\\F039\";\n}\n.fa-list:before {\n  content: \"\\F03A\";\n}\n.fa-dedent:before,\n.fa-outdent:before {\n  content: \"\\F03B\";\n}\n.fa-indent:before {\n  content: \"\\F03C\";\n}\n.fa-video-camera:before {\n  content: \"\\F03D\";\n}\n.fa-photo:before,\n.fa-image:before,\n.fa-picture-o:before {\n  content: \"\\F03E\";\n}\n.fa-pencil:before {\n  content: \"\\F040\";\n}\n.fa-map-marker:before {\n  content: \"\\F041\";\n}\n.fa-adjust:before {\n  content: \"\\F042\";\n}\n.fa-tint:before {\n  content: \"\\F043\";\n}\n.fa-edit:before,\n.fa-pencil-square-o:before {\n  content: \"\\F044\";\n}\n.fa-share-square-o:before {\n  content: \"\\F045\";\n}\n.fa-check-square-o:before {\n  content: \"\\F046\";\n}\n.fa-arrows:before {\n  content: \"\\F047\";\n}\n.fa-step-backward:before {\n  content: \"\\F048\";\n}\n.fa-fast-backward:before {\n  content: \"\\F049\";\n}\n.fa-backward:before {\n  content: \"\\F04A\";\n}\n.fa-play:before {\n  content: \"\\F04B\";\n}\n.fa-pause:before {\n  content: \"\\F04C\";\n}\n.fa-stop:before {\n  content: \"\\F04D\";\n}\n.fa-forward:before {\n  content: \"\\F04E\";\n}\n.fa-fast-forward:before {\n  content: \"\\F050\";\n}\n.fa-step-forward:before {\n  content: \"\\F051\";\n}\n.fa-eject:before {\n  content: \"\\F052\";\n}\n.fa-chevron-left:before {\n  content: \"\\F053\";\n}\n.fa-chevron-right:before {\n  content: \"\\F054\";\n}\n.fa-plus-circle:before {\n  content: \"\\F055\";\n}\n.fa-minus-circle:before {\n  content: \"\\F056\";\n}\n.fa-times-circle:before {\n  content: \"\\F057\";\n}\n.fa-check-circle:before {\n  content: \"\\F058\";\n}\n.fa-question-circle:before {\n  content: \"\\F059\";\n}\n.fa-info-circle:before {\n  content: \"\\F05A\";\n}\n.fa-crosshairs:before {\n  content: \"\\F05B\";\n}\n.fa-times-circle-o:before {\n  content: \"\\F05C\";\n}\n.fa-check-circle-o:before {\n  content: \"\\F05D\";\n}\n.fa-ban:before {\n  content: \"\\F05E\";\n}\n.fa-arrow-left:before {\n  content: \"\\F060\";\n}\n.fa-arrow-right:before {\n  content: \"\\F061\";\n}\n.fa-arrow-up:before {\n  content: \"\\F062\";\n}\n.fa-arrow-down:before {\n  content: \"\\F063\";\n}\n.fa-mail-forward:before,\n.fa-share:before {\n  content: \"\\F064\";\n}\n.fa-expand:before {\n  content: \"\\F065\";\n}\n.fa-compress:before {\n  content: \"\\F066\";\n}\n.fa-plus:before {\n  content: \"\\F067\";\n}\n.fa-minus:before {\n  content: \"\\F068\";\n}\n.fa-asterisk:before {\n  content: \"\\F069\";\n}\n.fa-exclamation-circle:before {\n  content: \"\\F06A\";\n}\n.fa-gift:before {\n  content: \"\\F06B\";\n}\n.fa-leaf:before {\n  content: \"\\F06C\";\n}\n.fa-fire:before {\n  content: \"\\F06D\";\n}\n.fa-eye:before {\n  content: \"\\F06E\";\n}\n.fa-eye-slash:before {\n  content: \"\\F070\";\n}\n.fa-warning:before,\n.fa-exclamation-triangle:before {\n  content: \"\\F071\";\n}\n.fa-plane:before {\n  content: \"\\F072\";\n}\n.fa-calendar:before {\n  content: \"\\F073\";\n}\n.fa-random:before {\n  content: \"\\F074\";\n}\n.fa-comment:before {\n  content: \"\\F075\";\n}\n.fa-magnet:before {\n  content: \"\\F076\";\n}\n.fa-chevron-up:before {\n  content: \"\\F077\";\n}\n.fa-chevron-down:before {\n  content: \"\\F078\";\n}\n.fa-retweet:before {\n  content: \"\\F079\";\n}\n.fa-shopping-cart:before {\n  content: \"\\F07A\";\n}\n.fa-folder:before {\n  content: \"\\F07B\";\n}\n.fa-folder-open:before {\n  content: \"\\F07C\";\n}\n.fa-arrows-v:before {\n  content: \"\\F07D\";\n}\n.fa-arrows-h:before {\n  content: \"\\F07E\";\n}\n.fa-bar-chart-o:before,\n.fa-bar-chart:before {\n  content: \"\\F080\";\n}\n.fa-twitter-square:before {\n  content: \"\\F081\";\n}\n.fa-facebook-square:before {\n  content: \"\\F082\";\n}\n.fa-camera-retro:before {\n  content: \"\\F083\";\n}\n.fa-key:before {\n  content: \"\\F084\";\n}\n.fa-gears:before,\n.fa-cogs:before {\n  content: \"\\F085\";\n}\n.fa-comments:before {\n  content: \"\\F086\";\n}\n.fa-thumbs-o-up:before {\n  content: \"\\F087\";\n}\n.fa-thumbs-o-down:before {\n  content: \"\\F088\";\n}\n.fa-star-half:before {\n  content: \"\\F089\";\n}\n.fa-heart-o:before {\n  content: \"\\F08A\";\n}\n.fa-sign-out:before {\n  content: \"\\F08B\";\n}\n.fa-linkedin-square:before {\n  content: \"\\F08C\";\n}\n.fa-thumb-tack:before {\n  content: \"\\F08D\";\n}\n.fa-external-link:before {\n  content: \"\\F08E\";\n}\n.fa-sign-in:before {\n  content: \"\\F090\";\n}\n.fa-trophy:before {\n  content: \"\\F091\";\n}\n.fa-github-square:before {\n  content: \"\\F092\";\n}\n.fa-upload:before {\n  content: \"\\F093\";\n}\n.fa-lemon-o:before {\n  content: \"\\F094\";\n}\n.fa-phone:before {\n  content: \"\\F095\";\n}\n.fa-square-o:before {\n  content: \"\\F096\";\n}\n.fa-bookmark-o:before {\n  content: \"\\F097\";\n}\n.fa-phone-square:before {\n  content: \"\\F098\";\n}\n.fa-twitter:before {\n  content: \"\\F099\";\n}\n.fa-facebook-f:before,\n.fa-facebook:before {\n  content: \"\\F09A\";\n}\n.fa-github:before {\n  content: \"\\F09B\";\n}\n.fa-unlock:before {\n  content: \"\\F09C\";\n}\n.fa-credit-card:before {\n  content: \"\\F09D\";\n}\n.fa-feed:before,\n.fa-rss:before {\n  content: \"\\F09E\";\n}\n.fa-hdd-o:before {\n  content: \"\\F0A0\";\n}\n.fa-bullhorn:before {\n  content: \"\\F0A1\";\n}\n.fa-bell:before {\n  content: \"\\F0F3\";\n}\n.fa-certificate:before {\n  content: \"\\F0A3\";\n}\n.fa-hand-o-right:before {\n  content: \"\\F0A4\";\n}\n.fa-hand-o-left:before {\n  content: \"\\F0A5\";\n}\n.fa-hand-o-up:before {\n  content: \"\\F0A6\";\n}\n.fa-hand-o-down:before {\n  content: \"\\F0A7\";\n}\n.fa-arrow-circle-left:before {\n  content: \"\\F0A8\";\n}\n.fa-arrow-circle-right:before {\n  content: \"\\F0A9\";\n}\n.fa-arrow-circle-up:before {\n  content: \"\\F0AA\";\n}\n.fa-arrow-circle-down:before {\n  content: \"\\F0AB\";\n}\n.fa-globe:before {\n  content: \"\\F0AC\";\n}\n.fa-wrench:before {\n  content: \"\\F0AD\";\n}\n.fa-tasks:before {\n  content: \"\\F0AE\";\n}\n.fa-filter:before {\n  content: \"\\F0B0\";\n}\n.fa-briefcase:before {\n  content: \"\\F0B1\";\n}\n.fa-arrows-alt:before {\n  content: \"\\F0B2\";\n}\n.fa-group:before,\n.fa-users:before {\n  content: \"\\F0C0\";\n}\n.fa-chain:before,\n.fa-link:before {\n  content: \"\\F0C1\";\n}\n.fa-cloud:before {\n  content: \"\\F0C2\";\n}\n.fa-flask:before {\n  content: \"\\F0C3\";\n}\n.fa-cut:before,\n.fa-scissors:before {\n  content: \"\\F0C4\";\n}\n.fa-copy:before,\n.fa-files-o:before {\n  content: \"\\F0C5\";\n}\n.fa-paperclip:before {\n  content: \"\\F0C6\";\n}\n.fa-save:before,\n.fa-floppy-o:before {\n  content: \"\\F0C7\";\n}\n.fa-square:before {\n  content: \"\\F0C8\";\n}\n.fa-navicon:before,\n.fa-reorder:before,\n.fa-bars:before {\n  content: \"\\F0C9\";\n}\n.fa-list-ul:before {\n  content: \"\\F0CA\";\n}\n.fa-list-ol:before {\n  content: \"\\F0CB\";\n}\n.fa-strikethrough:before {\n  content: \"\\F0CC\";\n}\n.fa-underline:before {\n  content: \"\\F0CD\";\n}\n.fa-table:before {\n  content: \"\\F0CE\";\n}\n.fa-magic:before {\n  content: \"\\F0D0\";\n}\n.fa-truck:before {\n  content: \"\\F0D1\";\n}\n.fa-pinterest:before {\n  content: \"\\F0D2\";\n}\n.fa-pinterest-square:before {\n  content: \"\\F0D3\";\n}\n.fa-google-plus-square:before {\n  content: \"\\F0D4\";\n}\n.fa-google-plus:before {\n  content: \"\\F0D5\";\n}\n.fa-money:before {\n  content: \"\\F0D6\";\n}\n.fa-caret-down:before {\n  content: \"\\F0D7\";\n}\n.fa-caret-up:before {\n  content: \"\\F0D8\";\n}\n.fa-caret-left:before {\n  content: \"\\F0D9\";\n}\n.fa-caret-right:before {\n  content: \"\\F0DA\";\n}\n.fa-columns:before {\n  content: \"\\F0DB\";\n}\n.fa-unsorted:before,\n.fa-sort:before {\n  content: \"\\F0DC\";\n}\n.fa-sort-down:before,\n.fa-sort-desc:before {\n  content: \"\\F0DD\";\n}\n.fa-sort-up:before,\n.fa-sort-asc:before {\n  content: \"\\F0DE\";\n}\n.fa-envelope:before {\n  content: \"\\F0E0\";\n}\n.fa-linkedin:before {\n  content: \"\\F0E1\";\n}\n.fa-rotate-left:before,\n.fa-undo:before {\n  content: \"\\F0E2\";\n}\n.fa-legal:before,\n.fa-gavel:before {\n  content: \"\\F0E3\";\n}\n.fa-dashboard:before,\n.fa-tachometer:before {\n  content: \"\\F0E4\";\n}\n.fa-comment-o:before {\n  content: \"\\F0E5\";\n}\n.fa-comments-o:before {\n  content: \"\\F0E6\";\n}\n.fa-flash:before,\n.fa-bolt:before {\n  content: \"\\F0E7\";\n}\n.fa-sitemap:before {\n  content: \"\\F0E8\";\n}\n.fa-umbrella:before {\n  content: \"\\F0E9\";\n}\n.fa-paste:before,\n.fa-clipboard:before {\n  content: \"\\F0EA\";\n}\n.fa-lightbulb-o:before {\n  content: \"\\F0EB\";\n}\n.fa-exchange:before {\n  content: \"\\F0EC\";\n}\n.fa-cloud-download:before {\n  content: \"\\F0ED\";\n}\n.fa-cloud-upload:before {\n  content: \"\\F0EE\";\n}\n.fa-user-md:before {\n  content: \"\\F0F0\";\n}\n.fa-stethoscope:before {\n  content: \"\\F0F1\";\n}\n.fa-suitcase:before {\n  content: \"\\F0F2\";\n}\n.fa-bell-o:before {\n  content: \"\\F0A2\";\n}\n.fa-coffee:before {\n  content: \"\\F0F4\";\n}\n.fa-cutlery:before {\n  content: \"\\F0F5\";\n}\n.fa-file-text-o:before {\n  content: \"\\F0F6\";\n}\n.fa-building-o:before {\n  content: \"\\F0F7\";\n}\n.fa-hospital-o:before {\n  content: \"\\F0F8\";\n}\n.fa-ambulance:before {\n  content: \"\\F0F9\";\n}\n.fa-medkit:before {\n  content: \"\\F0FA\";\n}\n.fa-fighter-jet:before {\n  content: \"\\F0FB\";\n}\n.fa-beer:before {\n  content: \"\\F0FC\";\n}\n.fa-h-square:before {\n  content: \"\\F0FD\";\n}\n.fa-plus-square:before {\n  content: \"\\F0FE\";\n}\n.fa-angle-double-left:before {\n  content: \"\\F100\";\n}\n.fa-angle-double-right:before {\n  content: \"\\F101\";\n}\n.fa-angle-double-up:before {\n  content: \"\\F102\";\n}\n.fa-angle-double-down:before {\n  content: \"\\F103\";\n}\n.fa-angle-left:before {\n  content: \"\\F104\";\n}\n.fa-angle-right:before {\n  content: \"\\F105\";\n}\n.fa-angle-up:before {\n  content: \"\\F106\";\n}\n.fa-angle-down:before {\n  content: \"\\F107\";\n}\n.fa-desktop:before {\n  content: \"\\F108\";\n}\n.fa-laptop:before {\n  content: \"\\F109\";\n}\n.fa-tablet:before {\n  content: \"\\F10A\";\n}\n.fa-mobile-phone:before,\n.fa-mobile:before {\n  content: \"\\F10B\";\n}\n.fa-circle-o:before {\n  content: \"\\F10C\";\n}\n.fa-quote-left:before {\n  content: \"\\F10D\";\n}\n.fa-quote-right:before {\n  content: \"\\F10E\";\n}\n.fa-spinner:before {\n  content: \"\\F110\";\n}\n.fa-circle:before {\n  content: \"\\F111\";\n}\n.fa-mail-reply:before,\n.fa-reply:before {\n  content: \"\\F112\";\n}\n.fa-github-alt:before {\n  content: \"\\F113\";\n}\n.fa-folder-o:before {\n  content: \"\\F114\";\n}\n.fa-folder-open-o:before {\n  content: \"\\F115\";\n}\n.fa-smile-o:before {\n  content: \"\\F118\";\n}\n.fa-frown-o:before {\n  content: \"\\F119\";\n}\n.fa-meh-o:before {\n  content: \"\\F11A\";\n}\n.fa-gamepad:before {\n  content: \"\\F11B\";\n}\n.fa-keyboard-o:before {\n  content: \"\\F11C\";\n}\n.fa-flag-o:before {\n  content: \"\\F11D\";\n}\n.fa-flag-checkered:before {\n  content: \"\\F11E\";\n}\n.fa-terminal:before {\n  content: \"\\F120\";\n}\n.fa-code:before {\n  content: \"\\F121\";\n}\n.fa-mail-reply-all:before,\n.fa-reply-all:before {\n  content: \"\\F122\";\n}\n.fa-star-half-empty:before,\n.fa-star-half-full:before,\n.fa-star-half-o:before {\n  content: \"\\F123\";\n}\n.fa-location-arrow:before {\n  content: \"\\F124\";\n}\n.fa-crop:before {\n  content: \"\\F125\";\n}\n.fa-code-fork:before {\n  content: \"\\F126\";\n}\n.fa-unlink:before,\n.fa-chain-broken:before {\n  content: \"\\F127\";\n}\n.fa-question:before {\n  content: \"\\F128\";\n}\n.fa-info:before {\n  content: \"\\F129\";\n}\n.fa-exclamation:before {\n  content: \"\\F12A\";\n}\n.fa-superscript:before {\n  content: \"\\F12B\";\n}\n.fa-subscript:before {\n  content: \"\\F12C\";\n}\n.fa-eraser:before {\n  content: \"\\F12D\";\n}\n.fa-puzzle-piece:before {\n  content: \"\\F12E\";\n}\n.fa-microphone:before {\n  content: \"\\F130\";\n}\n.fa-microphone-slash:before {\n  content: \"\\F131\";\n}\n.fa-shield:before {\n  content: \"\\F132\";\n}\n.fa-calendar-o:before {\n  content: \"\\F133\";\n}\n.fa-fire-extinguisher:before {\n  content: \"\\F134\";\n}\n.fa-rocket:before {\n  content: \"\\F135\";\n}\n.fa-maxcdn:before {\n  content: \"\\F136\";\n}\n.fa-chevron-circle-left:before {\n  content: \"\\F137\";\n}\n.fa-chevron-circle-right:before {\n  content: \"\\F138\";\n}\n.fa-chevron-circle-up:before {\n  content: \"\\F139\";\n}\n.fa-chevron-circle-down:before {\n  content: \"\\F13A\";\n}\n.fa-html5:before {\n  content: \"\\F13B\";\n}\n.fa-css3:before {\n  content: \"\\F13C\";\n}\n.fa-anchor:before {\n  content: \"\\F13D\";\n}\n.fa-unlock-alt:before {\n  content: \"\\F13E\";\n}\n.fa-bullseye:before {\n  content: \"\\F140\";\n}\n.fa-ellipsis-h:before {\n  content: \"\\F141\";\n}\n.fa-ellipsis-v:before {\n  content: \"\\F142\";\n}\n.fa-rss-square:before {\n  content: \"\\F143\";\n}\n.fa-play-circle:before {\n  content: \"\\F144\";\n}\n.fa-ticket:before {\n  content: \"\\F145\";\n}\n.fa-minus-square:before {\n  content: \"\\F146\";\n}\n.fa-minus-square-o:before {\n  content: \"\\F147\";\n}\n.fa-level-up:before {\n  content: \"\\F148\";\n}\n.fa-level-down:before {\n  content: \"\\F149\";\n}\n.fa-check-square:before {\n  content: \"\\F14A\";\n}\n.fa-pencil-square:before {\n  content: \"\\F14B\";\n}\n.fa-external-link-square:before {\n  content: \"\\F14C\";\n}\n.fa-share-square:before {\n  content: \"\\F14D\";\n}\n.fa-compass:before {\n  content: \"\\F14E\";\n}\n.fa-toggle-down:before,\n.fa-caret-square-o-down:before {\n  content: \"\\F150\";\n}\n.fa-toggle-up:before,\n.fa-caret-square-o-up:before {\n  content: \"\\F151\";\n}\n.fa-toggle-right:before,\n.fa-caret-square-o-right:before {\n  content: \"\\F152\";\n}\n.fa-euro:before,\n.fa-eur:before {\n  content: \"\\F153\";\n}\n.fa-gbp:before {\n  content: \"\\F154\";\n}\n.fa-dollar:before,\n.fa-usd:before {\n  content: \"\\F155\";\n}\n.fa-rupee:before,\n.fa-inr:before {\n  content: \"\\F156\";\n}\n.fa-cny:before,\n.fa-rmb:before,\n.fa-yen:before,\n.fa-jpy:before {\n  content: \"\\F157\";\n}\n.fa-ruble:before,\n.fa-rouble:before,\n.fa-rub:before {\n  content: \"\\F158\";\n}\n.fa-won:before,\n.fa-krw:before {\n  content: \"\\F159\";\n}\n.fa-bitcoin:before,\n.fa-btc:before {\n  content: \"\\F15A\";\n}\n.fa-file:before {\n  content: \"\\F15B\";\n}\n.fa-file-text:before {\n  content: \"\\F15C\";\n}\n.fa-sort-alpha-asc:before {\n  content: \"\\F15D\";\n}\n.fa-sort-alpha-desc:before {\n  content: \"\\F15E\";\n}\n.fa-sort-amount-asc:before {\n  content: \"\\F160\";\n}\n.fa-sort-amount-desc:before {\n  content: \"\\F161\";\n}\n.fa-sort-numeric-asc:before {\n  content: \"\\F162\";\n}\n.fa-sort-numeric-desc:before {\n  content: \"\\F163\";\n}\n.fa-thumbs-up:before {\n  content: \"\\F164\";\n}\n.fa-thumbs-down:before {\n  content: \"\\F165\";\n}\n.fa-youtube-square:before {\n  content: \"\\F166\";\n}\n.fa-youtube:before {\n  content: \"\\F167\";\n}\n.fa-xing:before {\n  content: \"\\F168\";\n}\n.fa-xing-square:before {\n  content: \"\\F169\";\n}\n.fa-youtube-play:before {\n  content: \"\\F16A\";\n}\n.fa-dropbox:before {\n  content: \"\\F16B\";\n}\n.fa-stack-overflow:before {\n  content: \"\\F16C\";\n}\n.fa-instagram:before {\n  content: \"\\F16D\";\n}\n.fa-flickr:before {\n  content: \"\\F16E\";\n}\n.fa-adn:before {\n  content: \"\\F170\";\n}\n.fa-bitbucket:before {\n  content: \"\\F171\";\n}\n.fa-bitbucket-square:before {\n  content: \"\\F172\";\n}\n.fa-tumblr:before {\n  content: \"\\F173\";\n}\n.fa-tumblr-square:before {\n  content: \"\\F174\";\n}\n.fa-long-arrow-down:before {\n  content: \"\\F175\";\n}\n.fa-long-arrow-up:before {\n  content: \"\\F176\";\n}\n.fa-long-arrow-left:before {\n  content: \"\\F177\";\n}\n.fa-long-arrow-right:before {\n  content: \"\\F178\";\n}\n.fa-apple:before {\n  content: \"\\F179\";\n}\n.fa-windows:before {\n  content: \"\\F17A\";\n}\n.fa-android:before {\n  content: \"\\F17B\";\n}\n.fa-linux:before {\n  content: \"\\F17C\";\n}\n.fa-dribbble:before {\n  content: \"\\F17D\";\n}\n.fa-skype:before {\n  content: \"\\F17E\";\n}\n.fa-foursquare:before {\n  content: \"\\F180\";\n}\n.fa-trello:before {\n  content: \"\\F181\";\n}\n.fa-female:before {\n  content: \"\\F182\";\n}\n.fa-male:before {\n  content: \"\\F183\";\n}\n.fa-gittip:before,\n.fa-gratipay:before {\n  content: \"\\F184\";\n}\n.fa-sun-o:before {\n  content: \"\\F185\";\n}\n.fa-moon-o:before {\n  content: \"\\F186\";\n}\n.fa-archive:before {\n  content: \"\\F187\";\n}\n.fa-bug:before {\n  content: \"\\F188\";\n}\n.fa-vk:before {\n  content: \"\\F189\";\n}\n.fa-weibo:before {\n  content: \"\\F18A\";\n}\n.fa-renren:before {\n  content: \"\\F18B\";\n}\n.fa-pagelines:before {\n  content: \"\\F18C\";\n}\n.fa-stack-exchange:before {\n  content: \"\\F18D\";\n}\n.fa-arrow-circle-o-right:before {\n  content: \"\\F18E\";\n}\n.fa-arrow-circle-o-left:before {\n  content: \"\\F190\";\n}\n.fa-toggle-left:before,\n.fa-caret-square-o-left:before {\n  content: \"\\F191\";\n}\n.fa-dot-circle-o:before {\n  content: \"\\F192\";\n}\n.fa-wheelchair:before {\n  content: \"\\F193\";\n}\n.fa-vimeo-square:before {\n  content: \"\\F194\";\n}\n.fa-turkish-lira:before,\n.fa-try:before {\n  content: \"\\F195\";\n}\n.fa-plus-square-o:before {\n  content: \"\\F196\";\n}\n.fa-space-shuttle:before {\n  content: \"\\F197\";\n}\n.fa-slack:before {\n  content: \"\\F198\";\n}\n.fa-envelope-square:before {\n  content: \"\\F199\";\n}\n.fa-wordpress:before {\n  content: \"\\F19A\";\n}\n.fa-openid:before {\n  content: \"\\F19B\";\n}\n.fa-institution:before,\n.fa-bank:before,\n.fa-university:before {\n  content: \"\\F19C\";\n}\n.fa-mortar-board:before,\n.fa-graduation-cap:before {\n  content: \"\\F19D\";\n}\n.fa-yahoo:before {\n  content: \"\\F19E\";\n}\n.fa-google:before {\n  content: \"\\F1A0\";\n}\n.fa-reddit:before {\n  content: \"\\F1A1\";\n}\n.fa-reddit-square:before {\n  content: \"\\F1A2\";\n}\n.fa-stumbleupon-circle:before {\n  content: \"\\F1A3\";\n}\n.fa-stumbleupon:before {\n  content: \"\\F1A4\";\n}\n.fa-delicious:before {\n  content: \"\\F1A5\";\n}\n.fa-digg:before {\n  content: \"\\F1A6\";\n}\n.fa-pied-piper-pp:before {\n  content: \"\\F1A7\";\n}\n.fa-pied-piper-alt:before {\n  content: \"\\F1A8\";\n}\n.fa-drupal:before {\n  content: \"\\F1A9\";\n}\n.fa-joomla:before {\n  content: \"\\F1AA\";\n}\n.fa-language:before {\n  content: \"\\F1AB\";\n}\n.fa-fax:before {\n  content: \"\\F1AC\";\n}\n.fa-building:before {\n  content: \"\\F1AD\";\n}\n.fa-child:before {\n  content: \"\\F1AE\";\n}\n.fa-paw:before {\n  content: \"\\F1B0\";\n}\n.fa-spoon:before {\n  content: \"\\F1B1\";\n}\n.fa-cube:before {\n  content: \"\\F1B2\";\n}\n.fa-cubes:before {\n  content: \"\\F1B3\";\n}\n.fa-behance:before {\n  content: \"\\F1B4\";\n}\n.fa-behance-square:before {\n  content: \"\\F1B5\";\n}\n.fa-steam:before {\n  content: \"\\F1B6\";\n}\n.fa-steam-square:before {\n  content: \"\\F1B7\";\n}\n.fa-recycle:before {\n  content: \"\\F1B8\";\n}\n.fa-automobile:before,\n.fa-car:before {\n  content: \"\\F1B9\";\n}\n.fa-cab:before,\n.fa-taxi:before {\n  content: \"\\F1BA\";\n}\n.fa-tree:before {\n  content: \"\\F1BB\";\n}\n.fa-spotify:before {\n  content: \"\\F1BC\";\n}\n.fa-deviantart:before {\n  content: \"\\F1BD\";\n}\n.fa-soundcloud:before {\n  content: \"\\F1BE\";\n}\n.fa-database:before {\n  content: \"\\F1C0\";\n}\n.fa-file-pdf-o:before {\n  content: \"\\F1C1\";\n}\n.fa-file-word-o:before {\n  content: \"\\F1C2\";\n}\n.fa-file-excel-o:before {\n  content: \"\\F1C3\";\n}\n.fa-file-powerpoint-o:before {\n  content: \"\\F1C4\";\n}\n.fa-file-photo-o:before,\n.fa-file-picture-o:before,\n.fa-file-image-o:before {\n  content: \"\\F1C5\";\n}\n.fa-file-zip-o:before,\n.fa-file-archive-o:before {\n  content: \"\\F1C6\";\n}\n.fa-file-sound-o:before,\n.fa-file-audio-o:before {\n  content: \"\\F1C7\";\n}\n.fa-file-movie-o:before,\n.fa-file-video-o:before {\n  content: \"\\F1C8\";\n}\n.fa-file-code-o:before {\n  content: \"\\F1C9\";\n}\n.fa-vine:before {\n  content: \"\\F1CA\";\n}\n.fa-codepen:before {\n  content: \"\\F1CB\";\n}\n.fa-jsfiddle:before {\n  content: \"\\F1CC\";\n}\n.fa-life-bouy:before,\n.fa-life-buoy:before,\n.fa-life-saver:before,\n.fa-support:before,\n.fa-life-ring:before {\n  content: \"\\F1CD\";\n}\n.fa-circle-o-notch:before {\n  content: \"\\F1CE\";\n}\n.fa-ra:before,\n.fa-resistance:before,\n.fa-rebel:before {\n  content: \"\\F1D0\";\n}\n.fa-ge:before,\n.fa-empire:before {\n  content: \"\\F1D1\";\n}\n.fa-git-square:before {\n  content: \"\\F1D2\";\n}\n.fa-git:before {\n  content: \"\\F1D3\";\n}\n.fa-y-combinator-square:before,\n.fa-yc-square:before,\n.fa-hacker-news:before {\n  content: \"\\F1D4\";\n}\n.fa-tencent-weibo:before {\n  content: \"\\F1D5\";\n}\n.fa-qq:before {\n  content: \"\\F1D6\";\n}\n.fa-wechat:before,\n.fa-weixin:before {\n  content: \"\\F1D7\";\n}\n.fa-send:before,\n.fa-paper-plane:before {\n  content: \"\\F1D8\";\n}\n.fa-send-o:before,\n.fa-paper-plane-o:before {\n  content: \"\\F1D9\";\n}\n.fa-history:before {\n  content: \"\\F1DA\";\n}\n.fa-circle-thin:before {\n  content: \"\\F1DB\";\n}\n.fa-header:before {\n  content: \"\\F1DC\";\n}\n.fa-paragraph:before {\n  content: \"\\F1DD\";\n}\n.fa-sliders:before {\n  content: \"\\F1DE\";\n}\n.fa-share-alt:before {\n  content: \"\\F1E0\";\n}\n.fa-share-alt-square:before {\n  content: \"\\F1E1\";\n}\n.fa-bomb:before {\n  content: \"\\F1E2\";\n}\n.fa-soccer-ball-o:before,\n.fa-futbol-o:before {\n  content: \"\\F1E3\";\n}\n.fa-tty:before {\n  content: \"\\F1E4\";\n}\n.fa-binoculars:before {\n  content: \"\\F1E5\";\n}\n.fa-plug:before {\n  content: \"\\F1E6\";\n}\n.fa-slideshare:before {\n  content: \"\\F1E7\";\n}\n.fa-twitch:before {\n  content: \"\\F1E8\";\n}\n.fa-yelp:before {\n  content: \"\\F1E9\";\n}\n.fa-newspaper-o:before {\n  content: \"\\F1EA\";\n}\n.fa-wifi:before {\n  content: \"\\F1EB\";\n}\n.fa-calculator:before {\n  content: \"\\F1EC\";\n}\n.fa-paypal:before {\n  content: \"\\F1ED\";\n}\n.fa-google-wallet:before {\n  content: \"\\F1EE\";\n}\n.fa-cc-visa:before {\n  content: \"\\F1F0\";\n}\n.fa-cc-mastercard:before {\n  content: \"\\F1F1\";\n}\n.fa-cc-discover:before {\n  content: \"\\F1F2\";\n}\n.fa-cc-amex:before {\n  content: \"\\F1F3\";\n}\n.fa-cc-paypal:before {\n  content: \"\\F1F4\";\n}\n.fa-cc-stripe:before {\n  content: \"\\F1F5\";\n}\n.fa-bell-slash:before {\n  content: \"\\F1F6\";\n}\n.fa-bell-slash-o:before {\n  content: \"\\F1F7\";\n}\n.fa-trash:before {\n  content: \"\\F1F8\";\n}\n.fa-copyright:before {\n  content: \"\\F1F9\";\n}\n.fa-at:before {\n  content: \"\\F1FA\";\n}\n.fa-eyedropper:before {\n  content: \"\\F1FB\";\n}\n.fa-paint-brush:before {\n  content: \"\\F1FC\";\n}\n.fa-birthday-cake:before {\n  content: \"\\F1FD\";\n}\n.fa-area-chart:before {\n  content: \"\\F1FE\";\n}\n.fa-pie-chart:before {\n  content: \"\\F200\";\n}\n.fa-line-chart:before {\n  content: \"\\F201\";\n}\n.fa-lastfm:before {\n  content: \"\\F202\";\n}\n.fa-lastfm-square:before {\n  content: \"\\F203\";\n}\n.fa-toggle-off:before {\n  content: \"\\F204\";\n}\n.fa-toggle-on:before {\n  content: \"\\F205\";\n}\n.fa-bicycle:before {\n  content: \"\\F206\";\n}\n.fa-bus:before {\n  content: \"\\F207\";\n}\n.fa-ioxhost:before {\n  content: \"\\F208\";\n}\n.fa-angellist:before {\n  content: \"\\F209\";\n}\n.fa-cc:before {\n  content: \"\\F20A\";\n}\n.fa-shekel:before,\n.fa-sheqel:before,\n.fa-ils:before {\n  content: \"\\F20B\";\n}\n.fa-meanpath:before {\n  content: \"\\F20C\";\n}\n.fa-buysellads:before {\n  content: \"\\F20D\";\n}\n.fa-connectdevelop:before {\n  content: \"\\F20E\";\n}\n.fa-dashcube:before {\n  content: \"\\F210\";\n}\n.fa-forumbee:before {\n  content: \"\\F211\";\n}\n.fa-leanpub:before {\n  content: \"\\F212\";\n}\n.fa-sellsy:before {\n  content: \"\\F213\";\n}\n.fa-shirtsinbulk:before {\n  content: \"\\F214\";\n}\n.fa-simplybuilt:before {\n  content: \"\\F215\";\n}\n.fa-skyatlas:before {\n  content: \"\\F216\";\n}\n.fa-cart-plus:before {\n  content: \"\\F217\";\n}\n.fa-cart-arrow-down:before {\n  content: \"\\F218\";\n}\n.fa-diamond:before {\n  content: \"\\F219\";\n}\n.fa-ship:before {\n  content: \"\\F21A\";\n}\n.fa-user-secret:before {\n  content: \"\\F21B\";\n}\n.fa-motorcycle:before {\n  content: \"\\F21C\";\n}\n.fa-street-view:before {\n  content: \"\\F21D\";\n}\n.fa-heartbeat:before {\n  content: \"\\F21E\";\n}\n.fa-venus:before {\n  content: \"\\F221\";\n}\n.fa-mars:before {\n  content: \"\\F222\";\n}\n.fa-mercury:before {\n  content: \"\\F223\";\n}\n.fa-intersex:before,\n.fa-transgender:before {\n  content: \"\\F224\";\n}\n.fa-transgender-alt:before {\n  content: \"\\F225\";\n}\n.fa-venus-double:before {\n  content: \"\\F226\";\n}\n.fa-mars-double:before {\n  content: \"\\F227\";\n}\n.fa-venus-mars:before {\n  content: \"\\F228\";\n}\n.fa-mars-stroke:before {\n  content: \"\\F229\";\n}\n.fa-mars-stroke-v:before {\n  content: \"\\F22A\";\n}\n.fa-mars-stroke-h:before {\n  content: \"\\F22B\";\n}\n.fa-neuter:before {\n  content: \"\\F22C\";\n}\n.fa-genderless:before {\n  content: \"\\F22D\";\n}\n.fa-facebook-official:before {\n  content: \"\\F230\";\n}\n.fa-pinterest-p:before {\n  content: \"\\F231\";\n}\n.fa-whatsapp:before {\n  content: \"\\F232\";\n}\n.fa-server:before {\n  content: \"\\F233\";\n}\n.fa-user-plus:before {\n  content: \"\\F234\";\n}\n.fa-user-times:before {\n  content: \"\\F235\";\n}\n.fa-hotel:before,\n.fa-bed:before {\n  content: \"\\F236\";\n}\n.fa-viacoin:before {\n  content: \"\\F237\";\n}\n.fa-train:before {\n  content: \"\\F238\";\n}\n.fa-subway:before {\n  content: \"\\F239\";\n}\n.fa-medium:before {\n  content: \"\\F23A\";\n}\n.fa-yc:before,\n.fa-y-combinator:before {\n  content: \"\\F23B\";\n}\n.fa-optin-monster:before {\n  content: \"\\F23C\";\n}\n.fa-opencart:before {\n  content: \"\\F23D\";\n}\n.fa-expeditedssl:before {\n  content: \"\\F23E\";\n}\n.fa-battery-4:before,\n.fa-battery:before,\n.fa-battery-full:before {\n  content: \"\\F240\";\n}\n.fa-battery-3:before,\n.fa-battery-three-quarters:before {\n  content: \"\\F241\";\n}\n.fa-battery-2:before,\n.fa-battery-half:before {\n  content: \"\\F242\";\n}\n.fa-battery-1:before,\n.fa-battery-quarter:before {\n  content: \"\\F243\";\n}\n.fa-battery-0:before,\n.fa-battery-empty:before {\n  content: \"\\F244\";\n}\n.fa-mouse-pointer:before {\n  content: \"\\F245\";\n}\n.fa-i-cursor:before {\n  content: \"\\F246\";\n}\n.fa-object-group:before {\n  content: \"\\F247\";\n}\n.fa-object-ungroup:before {\n  content: \"\\F248\";\n}\n.fa-sticky-note:before {\n  content: \"\\F249\";\n}\n.fa-sticky-note-o:before {\n  content: \"\\F24A\";\n}\n.fa-cc-jcb:before {\n  content: \"\\F24B\";\n}\n.fa-cc-diners-club:before {\n  content: \"\\F24C\";\n}\n.fa-clone:before {\n  content: \"\\F24D\";\n}\n.fa-balance-scale:before {\n  content: \"\\F24E\";\n}\n.fa-hourglass-o:before {\n  content: \"\\F250\";\n}\n.fa-hourglass-1:before,\n.fa-hourglass-start:before {\n  content: \"\\F251\";\n}\n.fa-hourglass-2:before,\n.fa-hourglass-half:before {\n  content: \"\\F252\";\n}\n.fa-hourglass-3:before,\n.fa-hourglass-end:before {\n  content: \"\\F253\";\n}\n.fa-hourglass:before {\n  content: \"\\F254\";\n}\n.fa-hand-grab-o:before,\n.fa-hand-rock-o:before {\n  content: \"\\F255\";\n}\n.fa-hand-stop-o:before,\n.fa-hand-paper-o:before {\n  content: \"\\F256\";\n}\n.fa-hand-scissors-o:before {\n  content: \"\\F257\";\n}\n.fa-hand-lizard-o:before {\n  content: \"\\F258\";\n}\n.fa-hand-spock-o:before {\n  content: \"\\F259\";\n}\n.fa-hand-pointer-o:before {\n  content: \"\\F25A\";\n}\n.fa-hand-peace-o:before {\n  content: \"\\F25B\";\n}\n.fa-trademark:before {\n  content: \"\\F25C\";\n}\n.fa-registered:before {\n  content: \"\\F25D\";\n}\n.fa-creative-commons:before {\n  content: \"\\F25E\";\n}\n.fa-gg:before {\n  content: \"\\F260\";\n}\n.fa-gg-circle:before {\n  content: \"\\F261\";\n}\n.fa-tripadvisor:before {\n  content: \"\\F262\";\n}\n.fa-odnoklassniki:before {\n  content: \"\\F263\";\n}\n.fa-odnoklassniki-square:before {\n  content: \"\\F264\";\n}\n.fa-get-pocket:before {\n  content: \"\\F265\";\n}\n.fa-wikipedia-w:before {\n  content: \"\\F266\";\n}\n.fa-safari:before {\n  content: \"\\F267\";\n}\n.fa-chrome:before {\n  content: \"\\F268\";\n}\n.fa-firefox:before {\n  content: \"\\F269\";\n}\n.fa-opera:before {\n  content: \"\\F26A\";\n}\n.fa-internet-explorer:before {\n  content: \"\\F26B\";\n}\n.fa-tv:before,\n.fa-television:before {\n  content: \"\\F26C\";\n}\n.fa-contao:before {\n  content: \"\\F26D\";\n}\n.fa-500px:before {\n  content: \"\\F26E\";\n}\n.fa-amazon:before {\n  content: \"\\F270\";\n}\n.fa-calendar-plus-o:before {\n  content: \"\\F271\";\n}\n.fa-calendar-minus-o:before {\n  content: \"\\F272\";\n}\n.fa-calendar-times-o:before {\n  content: \"\\F273\";\n}\n.fa-calendar-check-o:before {\n  content: \"\\F274\";\n}\n.fa-industry:before {\n  content: \"\\F275\";\n}\n.fa-map-pin:before {\n  content: \"\\F276\";\n}\n.fa-map-signs:before {\n  content: \"\\F277\";\n}\n.fa-map-o:before {\n  content: \"\\F278\";\n}\n.fa-map:before {\n  content: \"\\F279\";\n}\n.fa-commenting:before {\n  content: \"\\F27A\";\n}\n.fa-commenting-o:before {\n  content: \"\\F27B\";\n}\n.fa-houzz:before {\n  content: \"\\F27C\";\n}\n.fa-vimeo:before {\n  content: \"\\F27D\";\n}\n.fa-black-tie:before {\n  content: \"\\F27E\";\n}\n.fa-fonticons:before {\n  content: \"\\F280\";\n}\n.fa-reddit-alien:before {\n  content: \"\\F281\";\n}\n.fa-edge:before {\n  content: \"\\F282\";\n}\n.fa-credit-card-alt:before {\n  content: \"\\F283\";\n}\n.fa-codiepie:before {\n  content: \"\\F284\";\n}\n.fa-modx:before {\n  content: \"\\F285\";\n}\n.fa-fort-awesome:before {\n  content: \"\\F286\";\n}\n.fa-usb:before {\n  content: \"\\F287\";\n}\n.fa-product-hunt:before {\n  content: \"\\F288\";\n}\n.fa-mixcloud:before {\n  content: \"\\F289\";\n}\n.fa-scribd:before {\n  content: \"\\F28A\";\n}\n.fa-pause-circle:before {\n  content: \"\\F28B\";\n}\n.fa-pause-circle-o:before {\n  content: \"\\F28C\";\n}\n.fa-stop-circle:before {\n  content: \"\\F28D\";\n}\n.fa-stop-circle-o:before {\n  content: \"\\F28E\";\n}\n.fa-shopping-bag:before {\n  content: \"\\F290\";\n}\n.fa-shopping-basket:before {\n  content: \"\\F291\";\n}\n.fa-hashtag:before {\n  content: \"\\F292\";\n}\n.fa-bluetooth:before {\n  content: \"\\F293\";\n}\n.fa-bluetooth-b:before {\n  content: \"\\F294\";\n}\n.fa-percent:before {\n  content: \"\\F295\";\n}\n.fa-gitlab:before {\n  content: \"\\F296\";\n}\n.fa-wpbeginner:before {\n  content: \"\\F297\";\n}\n.fa-wpforms:before {\n  content: \"\\F298\";\n}\n.fa-envira:before {\n  content: \"\\F299\";\n}\n.fa-universal-access:before {\n  content: \"\\F29A\";\n}\n.fa-wheelchair-alt:before {\n  content: \"\\F29B\";\n}\n.fa-question-circle-o:before {\n  content: \"\\F29C\";\n}\n.fa-blind:before {\n  content: \"\\F29D\";\n}\n.fa-audio-description:before {\n  content: \"\\F29E\";\n}\n.fa-volume-control-phone:before {\n  content: \"\\F2A0\";\n}\n.fa-braille:before {\n  content: \"\\F2A1\";\n}\n.fa-assistive-listening-systems:before {\n  content: \"\\F2A2\";\n}\n.fa-asl-interpreting:before,\n.fa-american-sign-language-interpreting:before {\n  content: \"\\F2A3\";\n}\n.fa-deafness:before,\n.fa-hard-of-hearing:before,\n.fa-deaf:before {\n  content: \"\\F2A4\";\n}\n.fa-glide:before {\n  content: \"\\F2A5\";\n}\n.fa-glide-g:before {\n  content: \"\\F2A6\";\n}\n.fa-signing:before,\n.fa-sign-language:before {\n  content: \"\\F2A7\";\n}\n.fa-low-vision:before {\n  content: \"\\F2A8\";\n}\n.fa-viadeo:before {\n  content: \"\\F2A9\";\n}\n.fa-viadeo-square:before {\n  content: \"\\F2AA\";\n}\n.fa-snapchat:before {\n  content: \"\\F2AB\";\n}\n.fa-snapchat-ghost:before {\n  content: \"\\F2AC\";\n}\n.fa-snapchat-square:before {\n  content: \"\\F2AD\";\n}\n.fa-pied-piper:before {\n  content: \"\\F2AE\";\n}\n.fa-first-order:before {\n  content: \"\\F2B0\";\n}\n.fa-yoast:before {\n  content: \"\\F2B1\";\n}\n.fa-themeisle:before {\n  content: \"\\F2B2\";\n}\n.fa-google-plus-circle:before,\n.fa-google-plus-official:before {\n  content: \"\\F2B3\";\n}\n.fa-fa:before,\n.fa-font-awesome:before {\n  content: \"\\F2B4\";\n}\n.fa-handshake-o:before {\n  content: \"\\F2B5\";\n}\n.fa-envelope-open:before {\n  content: \"\\F2B6\";\n}\n.fa-envelope-open-o:before {\n  content: \"\\F2B7\";\n}\n.fa-linode:before {\n  content: \"\\F2B8\";\n}\n.fa-address-book:before {\n  content: \"\\F2B9\";\n}\n.fa-address-book-o:before {\n  content: \"\\F2BA\";\n}\n.fa-vcard:before,\n.fa-address-card:before {\n  content: \"\\F2BB\";\n}\n.fa-vcard-o:before,\n.fa-address-card-o:before {\n  content: \"\\F2BC\";\n}\n.fa-user-circle:before {\n  content: \"\\F2BD\";\n}\n.fa-user-circle-o:before {\n  content: \"\\F2BE\";\n}\n.fa-user-o:before {\n  content: \"\\F2C0\";\n}\n.fa-id-badge:before {\n  content: \"\\F2C1\";\n}\n.fa-drivers-license:before,\n.fa-id-card:before {\n  content: \"\\F2C2\";\n}\n.fa-drivers-license-o:before,\n.fa-id-card-o:before {\n  content: \"\\F2C3\";\n}\n.fa-quora:before {\n  content: \"\\F2C4\";\n}\n.fa-free-code-camp:before {\n  content: \"\\F2C5\";\n}\n.fa-telegram:before {\n  content: \"\\F2C6\";\n}\n.fa-thermometer-4:before,\n.fa-thermometer:before,\n.fa-thermometer-full:before {\n  content: \"\\F2C7\";\n}\n.fa-thermometer-3:before,\n.fa-thermometer-three-quarters:before {\n  content: \"\\F2C8\";\n}\n.fa-thermometer-2:before,\n.fa-thermometer-half:before {\n  content: \"\\F2C9\";\n}\n.fa-thermometer-1:before,\n.fa-thermometer-quarter:before {\n  content: \"\\F2CA\";\n}\n.fa-thermometer-0:before,\n.fa-thermometer-empty:before {\n  content: \"\\F2CB\";\n}\n.fa-shower:before {\n  content: \"\\F2CC\";\n}\n.fa-bathtub:before,\n.fa-s15:before,\n.fa-bath:before {\n  content: \"\\F2CD\";\n}\n.fa-podcast:before {\n  content: \"\\F2CE\";\n}\n.fa-window-maximize:before {\n  content: \"\\F2D0\";\n}\n.fa-window-minimize:before {\n  content: \"\\F2D1\";\n}\n.fa-window-restore:before {\n  content: \"\\F2D2\";\n}\n.fa-times-rectangle:before,\n.fa-window-close:before {\n  content: \"\\F2D3\";\n}\n.fa-times-rectangle-o:before,\n.fa-window-close-o:before {\n  content: \"\\F2D4\";\n}\n.fa-bandcamp:before {\n  content: \"\\F2D5\";\n}\n.fa-grav:before {\n  content: \"\\F2D6\";\n}\n.fa-etsy:before {\n  content: \"\\F2D7\";\n}\n.fa-imdb:before {\n  content: \"\\F2D8\";\n}\n.fa-ravelry:before {\n  content: \"\\F2D9\";\n}\n.fa-eercast:before {\n  content: \"\\F2DA\";\n}\n.fa-microchip:before {\n  content: \"\\F2DB\";\n}\n.fa-snowflake-o:before {\n  content: \"\\F2DC\";\n}\n.fa-superpowers:before {\n  content: \"\\F2DD\";\n}\n.fa-wpexplorer:before {\n  content: \"\\F2DE\";\n}\n.fa-meetup:before {\n  content: \"\\F2E0\";\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n.sr-only-focusable:active,\n.sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto;\n}\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/* Reset Style */\n/* From _core.reset.scss */\nhtml {\n    -webkit-text-size-adjust: 100%;\n    -ms-text-size-adjust: 100%;\n}\n\nbody {\n    margin: 0;\n    font-size: 1rem;\n    font-family: \"Helvetica Neue\", \"Segoe UI\", Arial, \"Hiragino Sans GB\", \"STXiHei\", \"Microsoft YaHei\", sans-serif;\n}\n\nh1, h2, h3, h4, h5, h6 {\n    margin-top: 0;\n    margin-bottom: 0;\n}\n\nol, ul {\n    margin-top: 0;\n    margin-bottom: 0;\n    padding-left: 0;\n    list-style-type: none;\n}\n\na {\n    outline-width: 0;\n    text-decoration: none;\n}\n\nimg {\n    vertical-align: middle;\n    border-width: 0;\n}\n\nbutton, input, select {\n    font: inherit;\n    margin: 0;\n    outline-width: 0;\n    overflow: visible;\n}\n\ntextarea {\n    font: inherit;\n    margin: 0;\n    outline-width: 0;\n    overflow: auto;\n    resize: none;\n}\n\ntable {\n    border-collapse: collapse;\n    border-spacing: 0;\n}\n\ntemplate {\n    display: none;\n}\n\n\n/* Custom Style */\n@media screen and (min-width: 720px) {\n    #backdrop {\n        position: fixed;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        left: 0;\n        background: url(" + __webpack_require__(17) + ") no-repeat center;\n        background-size: cover;\n        pointer-events: none;\n        z-index: -1;\n    }\n}\n\n#controller {\n    position: fixed;\n    top: 0;\n    left: 0;\n    margin: 1.5em;\n    z-index: 100;\n}\n\n#controller .item {\n    margin-bottom: 0.8em;\n}\n\n.fa-button {\n    display: table;\n    width: 3.6em;\n    height: 3.6em;\n    border-radius: 50%;\n    color: #fff;\n    background-color: rgba(0, 0, 0, 0.5);\n    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3);\n    transition: background-color 0.3s;\n    cursor: pointer;\n}\n\n.fa-button:hover {\n    background-color: rgba(0, 0, 0, 0.6);\n}\n\n.fa-button .fa {\n    display: table-cell;\n    vertical-align: middle;\n    font-size: 1.3em;\n    text-align: center;\n}\n\n#showcase {\n    margin: 0.5em;\n    padding-top: 5%;\n}\n\n#surface {\n    position: relative;\n    margin-left: auto;\n    margin-right: auto;\n    width: 20em;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n}\n\n#surface .cover {\n    padding-bottom: 100%;\n    max-width: 100%;\n    width: 100%;\n    height: 0;\n}\n\n#surface .album {\n    width: 100%;\n    border-radius: 50%;\n    background-color: #fff;\n    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);\n}\n\n#surface .magic {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    text-align: center;\n    border-radius: 50%;\n    background-color: rgba(0, 0, 0, 0.6);\n    box-shadow: inset 0 0 16px 2px rgba(0, 0, 0, 0.8);\n    cursor: pointer;\n    opacity: 0;\n    transition: opacity 0.5s;\n    z-index: 10;\n}\n\n#surface .magic:hover {\n    opacity: 1;\n}\n\n#surface .magic::after {\n    content: \"\";\n    display: inline-block;\n    vertical-align: middle;\n    min-height: 100%;\n}\n\n#surface .magic .fa {\n    display: inline-block;\n    vertical-align: middle;\n    font-size: 3.5rem;\n    color: rgba(255, 255, 255, 0.8);\n}\n\n#thread {\n    margin-top: 2em;\n    margin-left: auto;\n    margin-right: auto;\n    width: 20em;\n    height: 3px;\n    background-color: #e5e9ef;\n}\n\n#thread .buffered {\n    width: 0;\n    height: 100%;\n    background-color: #d2d2d2;\n    transition: all ease 0.5s;\n}\n\n#thread .elapsed {\n    margin-top: -3px;\n    width: 0;\n    height: 100%;\n    background-color: #666;\n    transition: all ease 0.5s;\n}\n\n#detail {\n    margin-top: 1em;\n    margin-bottom: 1em;\n    text-align: center;\n    text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);\n}\n\n#detail .name {\n    margin-bottom: 0.1em;\n    font-size: 1em;\n    color: #555;\n}\n\n#detail .artists {\n    margin-bottom: 0.2em;\n    font-size: 0.8em;\n    color: #666;\n}\n\n#detail .name::before { content: \"\\300C\"; }\n#detail .name::after { content: \"\\300D\"; }\n\n#lyric {\n  text-align: center;\n  text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);\n}\n\n#lyric .lrc {\n    font-size: 1.15em;\n    color: #444;\n}\n#lyric .tlrc {\n    font-size: 1em;\n    color: #444;\n}\n\n/* Global Media Queries */\n@media only screen and (min-width: 1440px) {\n    html { font-size: 110%; }\n}\n\n@media only screen and (min-width: 1280px) and (min-resolution: 2dppx) {\n    html { font-size: 120%; }\n}\n\n@media only screen and (max-width: 479px) {\n    html { font-size: 90%; }\n}\n\n@media only screen and (max-width: 359px) {\n    html { font-size: 80%; }\n}\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "674f50d287a8c48dc19ba404d20fe713.eot";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "674f50d287a8c48dc19ba404d20fe713.eot";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "912ec66d7572ff821749319396470bde.svg";

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "b06871f281fee6b241d60582ae9369b9.ttf";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!./font-awesome.css", function() {
			var newContent = require("!!../../css-loader/index.js!./font-awesome.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./app.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./app.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "af7ae505a9eed503f8b8e6982036873e.woff2";

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fee66e712a8a08eef5805a46892932ad.woff";

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "data:image/jpg;base64,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AAABAAI4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAB44QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAI4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQAAAAAAAACAAE4QklNBAIAAAAAAAQAAAAAOEJJTQQwAAAAAAACAQE4QklNBC0AAAAAAAYAAQAAAAI4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADbwAAAAYAAAAAAAAAAAAAAUAAAAFAAAAAHQBSAHkATwBRAFYAbQBwAGkAeQBaAEIATwA5ADMANwBZAEoAYQByAEoAVgBtADUAOQA0AHgANAAwADAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAUAAAAFAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAFAAAAAAFJnaHRsb25nAAABQAAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAAAAxFU2xpY2VPcmlnaW4AAAANYXV0b0dlbmVyYXRlZAAAAABUeXBlZW51bQAAAApFU2xpY2VUeXBlAAAAAEltZyAAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAA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SSUpJJJJSkmwXAEwJ1Pkkkkp1vrcbP8AnT1YPkbcu5rAe1bXuZQG/wDB+iK/T/4NZK2etEZvTOmdWP8APPY/AyTB9z8JtIpumfzun5OFT/xmNZZ+esZJSkkkklKSSSSU/wD/2QA4QklNBCEAAAAAAF0AAAABAQAAAA8AQQBkAG8AYgBlACAAUABoAG8AdABvAHMAaABvAHAAAAAXAEEAZABvAGIAZQAgAFAAaABvAHQAbwBzAGgAbwBwACAAQwBDACAAMgAwADEANwAAAAEAOEJJTQQGAAAAAAAHAAgAAAABAQD/4Q3XaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MTQxYTI4ODQtOTFhNi0xMTdhLTkxZjgtY2RiNzQ2ZDk2OTgxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmU3ODY1YjgxLTE1ZDctNGJkOC1hZDE3LWQ0OTc3MzdkMmJlYSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSI2QTQxOEE2N0Q5OTQ1RjU3NUVDQUEwNzU4MzkzNDg3MyIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iQWRvYmUgUkdCICgxOTk4KSIgeG1wOkNyZWF0ZURhdGU9IjIwMTctMDYtMTVUMDk6NDM6NTYrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE3LTA2LTE1VDA5OjQ2OjM0KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE3LTA2LTE1VDA5OjQ2OjM0KzA4OjAwIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDFmMzlhNzMtZDg0Yy00N2ZmLTgwMDYtMzFlNDE0NzgyNTA5IiBzdEV2dDp3aGVuPSIyMDE3LTA2LTE1VDA5OjQ0OjQxKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTc4NjViODEtMTVkNy00YmQ4LWFkMTctZDQ5NzczN2QyYmVhIiBzdEV2dDp3aGVuPSIyMDE3LTA2LTE1VDA5OjQ2OjM0KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iAkBJQ0NfUFJPRklMRQABAQAAAjBBREJFAhAAAG1udHJSR0IgWFlaIAfPAAYAAwAAAAAAAGFjc3BBUFBMAAAAAG5vbmUAAAAAAAAAAAAAAAAAAAAAAAD21gABAAAAANMtQURCRQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACmNwcnQAAAD8AAAAMmRlc2MAAAEwAAAAa3d0cHQAAAGcAAAAFGJrcHQAAAGwAAAAFHJUUkMAAAHEAAAADmdUUkMAAAHUAAAADmJUUkMAAAHkAAAADnJYWVoAAAH0AAAAFGdYWVoAAAIIAAAAFGJYWVoAAAIcAAAAFHRleHQAAAAAQ29weXJpZ2h0IDE5OTkgQWRvYmUgU3lzdGVtcyBJbmNvcnBvcmF0ZWQAAABkZXNjAAAAAAAAABFBZG9iZSBSR0IgKDE5OTgpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYWVogAAAAAAAA81EAAQAAAAEWzFhZWiAAAAAAAAAAAAAAAAAAAAAAY3VydgAAAAAAAAABAjMAAGN1cnYAAAAAAAAAAQIzAABjdXJ2AAAAAAAAAAECMwAAWFlaIAAAAAAAAJwYAABPpQAABPxYWVogAAAAAAAANI0AAKAsAAAPlVhZWiAAAAAAAAAmMQAAEC8AAL6c/+4ADkFkb2JlAGRAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQEBAQEBAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgBQAFAAwERAAIRAQMRAf/dAAQAKP/EAaIAAAAGAgMBAAAAAAAAAAAAAAcIBgUECQMKAgEACwEAAAYDAQEBAAAAAAAAAAAABgUEAwcCCAEJAAoLEAACAQMEAQMDAgMDAwIGCXUBAgMEEQUSBiEHEyIACDEUQTIjFQlRQhZhJDMXUnGBGGKRJUOhsfAmNHIKGcHRNSfhUzaC8ZKiRFRzRUY3R2MoVVZXGrLC0uLyZIN0k4Rlo7PD0+MpOGbzdSo5OkhJSlhZWmdoaWp2d3h5eoWGh4iJipSVlpeYmZqkpaanqKmqtLW2t7i5usTFxsfIycrU1dbX2Nna5OXm5+jp6vT19vf4+foRAAIBAwIEBAMFBAQEBgYFbQECAxEEIRIFMQYAIhNBUQcyYRRxCEKBI5EVUqFiFjMJsSTB0UNy8BfhgjQlklMYY0TxorImNRlUNkVkJwpzg5NGdMLS4vJVZXVWN4SFo7PD0+PzKRqUpLTE1OT0laW1xdXl9ShHV2Y4doaWprbG1ub2Z3eHl6e3x9fn90hYaHiImKi4yNjo+DlJWWl5iZmpucnZ6fkqOkpaanqKmqq6ytrq+v/aAAwDAQACEQMRAD8A+f8A+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6//0Pn/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv/9H5/wD7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r//S+f8A+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6//0/n/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XupFLGssyowuGDWW4Gp9JKILyxcu1gOb88A/T37r3TtRYaoyVdDQY2jqslXyyBUx2Pgq62smcj1U0FFDTCskmT829J+gJPHv3XujudR/wAsT+YF31SrkOnPhR8n+wcROyRx53CdKb9OCh18CV8vUY+ChEZJ+ruFOk2JHv3Xuj87S/4TL/zpN6QQVOL+E24sVBMHcNvLtvorY9SEsmkzUW6ex8ZkoHN+I2pVYci5t7917p5z3/CXX+dnhlSRfhz9/FwHfFd8/HTNP/tRSnx3aL1GkfjUoJ/p7917ovW9f5CP83fYcFZNmP5f3yKyKY+My1TbM2xTb8ZiePFTJs6vzrVSx2LFqcVQIH1Hv3Xuq4Ox+he3+nshV4jtrqPs3rKvoKiWmq4t9bJ3TtiSnqY0J+1mbL4emQVCvwVCCx+rDm3uvdBqlDSNNKlyyWV42Rk0WZRdRJHU1KsVY8jkj82+nv3XuoeQpoafxeIMNevUGbV+kR2t/Tlj7917pt9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/1Pn/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6UkFPS/bQySRRA+NGkZ+AbgG7MSALj37r3V13wC/4T8fzHv5hdHjd59bdL0nV3S+WkjSl7o74rqzrnZ1dSmKdUyO2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/de697917r3v3Xuve/de697917r/0vn/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de65Jw6kC51LYXtfkcX/Hv3Xutv8A/wCEifwLj+RHzp3L8s98Yg1fW3w0wlPk9tLWUqmjyXfO/wCOvw+y4CzqyVM2x9u0ORy14zrpq0UEpOiYA+6919O+W0URZLIVHpuCy8C9iB6ip082uf6c+/de613/APhRb/Nqb+Wx8QH2p1TuCnpflj8lYNxbG6a+2mphkuv9u01NFRb+7iaOaRo4KvZ1PkVpsQZh4pM1UQuVkSmlU+6918lPN5PJyV09RU11XUVldPUZCuq6ioqaiqra2snlqJ6ysqa1nrpqyWoleVjKzOsrlgSxLH3Xuk88jyMXdizH6k2/3oWHv3XuuHv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xup0NbVB4lE7qAyLqQIJQOVushAbXpb6k/hbn0rb3Xuvom/8JMv5v1bvrARfyvvkXud6jd+xMRkMz8TN1Zqq8tVndi4iFancfRlRVS6mmyGxoIJMlgGDOkmH+4ow4FDTRye691vOcED62/17fX+tvfuvdVFfzwfgBjP5iv8ALq7y6VoMXS1Xau18LUdtdE10i2qqTtTYNJU5TG4anqNQNPSb7wy1uAqb6kjjyfnCNJBHb3XuvjKZqjkoK16OaCamnptcFRT1MMkFTT1EMrxzU1VFMqTRVlNIhjnRh+3KrKOB7917po9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/0/n/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6yKjXDFGKizsSjFQmrTqNreknj6+/de6+v5/wAJqfiPT/E7+U38fP4jiExW/fkH/E/kZv4zUklDkZazsNIjs+kq45Wd3OK65xmJp0/SPGpYC5ufde6vU3fujbmytqbk3pu3M0G39p7QwWW3RubcGTnFNjcFt/AY+oy2YzFfUciCkxuOpZJpH50Ihaxt7917r4vf84v+YXur+ZX85u2PkZX1eTp+vXyEuxOitr1kiqm0+lNqVlZS7RoGp0YiDJ7gaefNZI3YPkMlKoJSKML7r3VWTSSPbW7va9tTFrX+trk2vb37r3XD37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3XvfuvddglSGUkEEEEGxBHIII5BB9+690J/S/bfYXRfbfXHc/Vm5shtPsfq/eOB3xsrcdBqkqsXuHbmQiyeOmEBkRKunkni8c0Eh8VRDI8cgKOwPuvdfae/lffPXZH8yT4ZdO/KfZqUuNyW68GMJ2ltCGqM0vX3b+3Egot97Pkje0opIMlItVj5ZLSVOKq6SYohk0j3XurA5GU6Ler1E+k8+j6EActaUAW/r/AIX9+6918hT/AIUjfBdPhF/NB7gpNv4eTEdV/IqUfI3qySnpooMfRxb+r69t84GKNXlYU+3uwKLJIi+kx08kR0gMt/de61/plZJGR1VXjPjYLyNSelmvc3LEX/pz7917rF7917r3v3Xuve/de697917r3v3Xuve/de697917r//U+f8A+/de697917r3v3Xuve/de697917r3v3Xuve/de697917oyPxi6WzvyM7+6J+P2243q893R251p1liYFWRooK3fW58dgEeaYaikECZIym7BEYXYqAbe6919zjZOzcH17s3amw9sUv8P2vsfa+A2ft2gVlK0mC2xiaPC4WmVtK80+OokjNrDge/de61Q/+Fb/8w5fjR8KsD8Pdi5xcb2p8yKquod0NT1BgrMH0FtOox1RvSSRKYPVU6b6z9VR4eJNS/cUf8RCsVidR7r3XzCcnJC+nxVCzfuSNx6nALv8A5xyiDUn0GgCNk0kKpv7917po9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691mp9ImjLMEUNcuWdQtubkxgycf7TyfoLe/de622v+Enf8yiP4tfNiq+IG/NwpS9K/M2px+3sElfWuuO238gsfT1C7Cr6UzurU69g0sjYGY/52bITUMdjoDD3XuvqJRMt2VWBA9QAI+jE3Om2pfUCOfyD7917rTe/wCFmnxdh7D+E/Q/ylx2LE2a+OXczbQ3PkoVjSem607zx8WCqJpXGmWrNF2Ft7Ax08TMI0FdOeC5Pv3XuvmcViLHOVVSo0REg8XZokLkcn0sxJFuLfTj37r3UX37r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//V+f8A+/de697917r3v3Xuve/de697917r3v3Xuve/de697917rZu/4Sj/AByHe383LqveGSohVbf+NXW3YPeGQWojaWkbcFPiY9gbMglaK8cdXFuHfsGTpdZHqxJYepSPfuvdfWClnigiZ5pFiijjd5ZpGEcUccS65XlkeyRJHGCxLWFvfuvdfGm/nu/Oqb+YH/Mf+QncWPyMlf1xs3Ox9J9JxGRpqam6s6wr8piaHIUaFnSBN3blmyWekKEqtTl50VnTTp917qmj37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+690pdoZ/MbT3Hh91bdylZhNwbYyOP3Fgszjql6TIYrNYOvpcnicjQVMREsFbRZCljkhkT1xyKHWxUMPde6+1d/KT+cuJ/mI/AfoH5ORT0w3nuDa0W0+4sVShVXBdz7H0bf7DpDDFFHFTU2TzFN/FKNBq00FfBze/v3XunT+a/8bqb5dfy5vmH0I1JDU5TeXRu9anayz0n3pp97bRx7b02XWQ08ZMktVBuPA0xh0G4dv8ffuvdfEkr4Z6esnp6mJoKmnbwVFO+sSU88IEc0Eiv6o5IZFKsv9gi349+691D9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//1vn/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6+il/wif+PP8J6d+YnymrqOqhk3xvTYnSO2amogjWmlxHX2KrN5bkaimUeV5Jc9vKnScX5EEZ/sj37r3V9f/Cgn5ut8FP5W/wAhewcJmDieze0sWnx/6kaKWKHINvTtOlyeLrcvj3aOWKar2lsekyuW+h0igtqDsvv3XuvjqVFes0LQrHIissAGqcyWNO0wjUXUHxCGW2n/AFY1X59+6902+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xus0EzQO0iEh/HLGpGm1pkaKQMGBurROw/B59+691utf8I4Pn+et/kp2r8Bd4ZY0W0vkZiavsnqKCrqFFLSdy9f4Wtq9y4eiV0stTvTragkqShdIi+3tKgyzKD7r3X0jwAylb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jLrtpDPGb3KD37r3W6cv6Vt9LC1r/wBP8effuvdd+/de697917rHJb03APIFza3JA0m/Nm/3se/de6+ZZ/wtA2VjsD/MS6I3dSRFK3fnxHxEuTm401Em2uxt74WkA4BJipAoseRf/H37r3Wm97917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XuuxYkXNhfk/Ww/rb/D37r3WyT/AMJZNj/3v/nQfHKpnoxX0+ztm927yqXqV8bUMmI66z9FQ5EqgYLUjLZhY0T/AFDAn6n37r3X1rQoBJAAJ+pAAJte1z+bXPv3Xuu/fuvde9+6910Rwf8AW9+6918tr/hYP00Ouf5p2H7Mo8elDjO+Pjt19uieqSNnNfuTZWS3BsbM1LogAMX8Lx2NRy9yQjj6EX917rUt9+691737r3Xvfuvde9+691737r3Xvfuvdf/S+f8A+/de697917r3v3Xuve/de697917r3v3XunTHJqDqrrqeSKMISyyIx1PHNC6sCGLp4/8AXkH9ffuvdfXU/wCEvfVlN1l/Jb+LdbDTimr+z8r3D2rmIVDMHmz3bW7MJiHSUk+VG2ltnHgN9GFvoPfuvdbB4+g5vwOf6/4+/de679+691737r3XvfuvdfOV/wCFtlF4vlL8HsmkcbS1PQ2/6IMSdb/YdlUM6xCxHpH8RY/7A+/de60eKkMJmUknTZVuP7Ci0enk3TRax/I9+691g9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+6912ASQBySbAf4n37r3W3V/wjh2Y25v5oe9t1iKWb/R58WuwsxLLEWaGlk3LunZu2GWZQLIWORVBc31Ee/de6+ob7917r3v3Xuve/de697917rQW/4W5dZwLB8B+61jaSYVndfU9Z4gdbQz0u0t1UUEgGlSJG8xUE3sG9+6918/D37r3Xvfuvde9+691737r3Xvfuvde9+691/9P5/wD7917r3v3Xuve/de697917r3v3Xuve/de6cqBVsWPN5ooXS7DVFIHdnuGHriaEFbWNz7917r7S38kLDQ4P+UT/AC66OnjSNKn4ndTZpwihA1TuXb0G4qqQgADXLVZR2Y/liT7917q08fQf6w9+69137917r3v3XuuiOVP9L3/23v3Xuvnw/wDC3Ta86dgfAjd72ipMjsrvHbMM7xPpWsw2a2PnH0TorEOkOUW6fkOOD7917rQwrFKzsrFjIFTy6gBaTQNQAAFgPx7917qL7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917rkpAZSwJUMCwH1IvyB/iR7917re0/wCESXX0mQ7t+c3bCRCKPbXVHUnXtSGJSZpd87uzm5aWRIQLCF6fr11JWwJTkc+/de6+iF7917r3v3Xuve/de697917rSv8A+FrWNiqvh38PcmY1Z8f8mNw0R1gcQ5TrHLCZgxNlv9mnPv3Xuvmr+/de697917r3v3Xuve/de697917r3v3Xuv/U+f8A+/de697917r3v3Xuve/de697917r3v3XuptLKsaThmVQELILesyt+2pU/wBoIGLWP9Pfuvdfa7/kyyrN/Ka/lxutvT8Mvj3E1rAeSDrfAwSiy8XEkZv/AI+/de6sw9+691737r3Xvfuvde9+691oxf8AC3bBpUdM/wAv3cemQSYntPvjCiWKIyFYNwbO6+rJ1ILCLW393wVLfSxt+b+691866r/z2qxvIkcrFjdmaRQzM34DMxvYWA9+691F9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+6912LXF/pcX/1vz9OffuvdfRv/AOESmzYKD4//ADr7BFHURVe5+5+n9mS1LRMtK8WxNg7ny0VJTTG/lNMN+vI/0t5k/wAL+691vEe/de697917r3v3Xuve/de60rP+Fr2Tjpvh18PsS7hf4r8ktyVEygep6XGdcZCSpKBfVqRahbn8X9+69181r37r3Xvfuvde9+691737r3Xvfuvde9+691//1fn/APv3Xuve/de697917r3v3Xuve/de697917qdSCK0jSxGUAhWC8yJHJHKpljUkBmjfSf8Db37r3X2e/5Dm4E3L/J7/l9ZCNgy0vx421t4kNqs+0shl9qyIxuQHjkwxVgOFYEDge/de6tv9+691737r3Xvfuvde9+691pkf8LVsEk3wW+K+7WB14H5TyYSMNDFLE395urd31Dh3b1xMY9uErYi4Bv9B7917r5o9UqJKBHp0mOMjT9OVHP1PLfU/wCJ9+691G9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691zjF5IwLXLqORqHLD6r/aH+H59+6919SX/AIRu7SpsB/Kx39noj5KjfHzB7WzE82vVePD7D6m2nBGBw6QoNvFkDXt5D/X37r3W2h7917r3v3Xuve/de697917rRb/4W67go16c+Am1lrYRkqrtLuvNPjGkCyvQU+0do4la51tdaZZa94y341G3Pv3XuvnV+/de697917r3v3Xuve/de697917r3v3Xuv/W+f8A+/de697917r3v3Xuve/de697917r3v3XupFNK8ciKlhrcKxsCSrFQQSfxb37r3X15f8AhLzvim3d/JW+KeOiqPuavYGU7u2LkrMHkjqKLu3fu4aKnltcq8OC3NRgA8lbH8+/de62Cx/t/wDH+vv3Xuve/de697917r3v3XutR7/hZrFC38rfqCeSlmnlp/m91YIZYlVhB5emPkIZSxJBAcQqD/sPfuvdfLun4kIuCFsq2JbSo4Ckn8qOPfuvdYffuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3XvfuvdZIQTNEFOljIgDWvYlhY2sb2Pv3Xuvrd/8JU9kUu0f5MPx5y8USw1XYe/e/N8V3AEjGo7e3PtvGGRrHW7YTbFIT9LX/wALn3Xutjn37r3Xvfuvde9+691737r3Xzl/+Fs2+KLI/J34UddUlas1dtLortDdmbo9er7Ol3nvPGY3Hu8eoAS1UO06hUJ+gsRz7917rRv9+691737r3Xvfuvde9+691737r3Xvfuvdf//X+f8A+/de697917r3v3Xuve/de697917r3v3XuskP+di/5aJ/0MPfuvdfTb/4Rjdvf3o+AvyJ6blmMtZ1J8m6jcgIdi9Phe19g7eloYCHYhY0ymya5wAANUhvzf37r3W153f3BtPoPqnfvc+/6jIUexOtMDPu3euSxtOtbLgtpYmSGfcW4JKU6Wnx2AxImrKvx3kWmgkKAuF9+690JFDXwZCnpKuiqoa6jrIoKylrqaaKalrKKojjkgqaSenllp6iCdJUkSRDokje68e/de6dffuvde9+691qG/8ACzrO09D/ACzOksJLC8kuY+aGwK2J0JHjXD9Q91wvqN7BWbMr/jx7917r5gVZ/wACJLfT02/5IX/AfU+/de6je/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6ywXE8JUaiJY7D+p1iw/2J9+6919iX/hNvio8R/Ja+D1PCzMtVs3fOVe6hRryna29shICPrdHqLf48+/de6vO9+691737r3Qbdh9qbG6zqdg0W8twxYWv7N39hesth44RT1VfujeeepclkKXDY+kp4pZXanxGGrK6olsI6Wjo5ppSsaMffuvdCJG2qIOpZgyllLXBsbkfVVYf7EX9+6918oT/hWd21Tdk/zh+ztuUU9TJF0l05011TU05IaKLKVG3K/sysmKozOoWLsCBvp6ioJI0+/de61h/fuvde9+691737r3Xvfuvde9+691737r3X//0Pn/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xut3L/AIRRd2tt75S/LH4/V2VEFH2b0ltvsrB4lpgPvM/1pvE4quqVQ2kuuE3ewcrdVRBexb37r3W2z/P3+bOD+C/8snvrfWW2VLv3J9y4uu+MeydvVNDHWbbTdPc+190YqPPb0MhEcW2Nv7boMjWOhIFZUww0hKmp1x+690KP8j7de4d7/wApL+X1uXdOZymezlX8bNi0VZlMvW1WVyFYuFFThaBqqtrbzuabHYuKKMsToRQgLBVJ917q1z37r3XRIH1IFzYXIFz9bc/mw9+691pT/wDC1zPfa/Ez4Z4AVSRLlvkNvLLvAE8s1Sm3+uJIG8KLdgIRnbs1iFBube/de6+bJIulraGTgeljdvpYk8CxJ/H49+691j9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691yT9a8gepeSNQHI5K86gP6fn37r3X2d/5B0OOp/wCTt/L2jxq06RyfHzb01QIGRtVfUV2WqciZNJ4natldmB5BJ9+691b/AO/de697917rXm/n/fPGP+XpTfy1O/IcBLvCo2/88qCbO7OpBGcnuHrjJ9B909f9hU+DMgZF3FTY/sKnkoCw0GpCg8kA+691f7icjS5fE4vK0vnSmy+OoK6k+7QQ1a0+Spo6qFJ4D/mZkidSy/hwR/X37r3XxQP5rXdo+Qv8yb5xdwxVZq8Xvb5J9pJtyvDwWm2rtXdWS2hsly4Zk0na2BxxYKSNIP8Aj7917quL37r3Xvfuvde9+691737r3Xvfuvde9+691//R+f8A+/de697917r3v3Xuve/de697917r3v3Xuve/de6tZ/k3/wAxHFfyxPnV1L8pNwbYzW8tkYah3Rsfs/bG25aWDcWS2DvuiGPzNZt9sjJT4yqzmCqaakr4KaokghqzSCA1EHkE0Puvdbj3/Cib+cl/LI+WX8qKp6s6O7v253r2p3tujq7cfW2z9pll3L1VUbP3NhN0bj3F25hsrBT5Pr6ZdpLX4aKjqVir5q6uDwJJFBUOnuvdW8f8JnPkT1Z3D/KR+Lewtn9iba3Rv/onamX677Q2dQZCP+9OxMpTbvz1biKTceBm8WTo6StwNfTzUdWYzSVcDBopHsbe691sAyVVNEnkkmjRPJHCGZgNU0riKKFb/qlmlYIijlnIUXJt7917oOO1e3OqemtsV28+3ezNi9WbUw9JU5LJbl3/ALtwmz8PRUFGoaqqpchnKyjpxHACL8/kD6ke/de6+Xl/wpy/m+9SfzHvkB1b1T8bMrU7l+O/xloN2jHdhy0NRQ47tbsve0mLp907i2nTVlNT5H+5mGx23KTHUU9SsP3r/dTRRineGSX3XutWmcxmQtGzMjAMA2q6auTGS310Xtf8+/de6w+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de65xMUkjcC5R0YAcXKsDa/+NvfuvdfVT/4So/PXpnub+XH1p8Vcj2Ft3HfIf4zZXduyMx11lcvQY7cOZ2DlN4ZrcXX26tp46qkhqs/t1cRnFxc0kAlkiyNBN5VQSw6/de62oNY/o39n+w9/UbDi1+Pz/QfX37r3XETRm/rHpUOw/IUgHUf8LH37r3WgT/wrC+eHUWG+dn8vLo3LYyl7O278R9zw/JLvjZu38xRR5Wqqdybr2ZVYfrnJTz+emwWZk2bsWStENRE4qIc1ThwqsGHuvdWf/M7/AIVefy+usfii/Y/xG3lUd+fIjfuCmh676fyG19zbVk6/zlVj2eXNdu1WWxFNQYzFbLlZZJKGhqqmbLTIiUsop5DVx+6918uHP5J8pWVNZUVH3VdV19dW1037jCarq53nqJg8o1uJZnY3JJN+ffuvdMHv3Xuve/de697917r3v3Xuve/de697917r/9L5/wD7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XunlMotqdJEJSIR+XSrKXWJo/HEoSeMhIWQyK1wxkYj9Jt7917oZOj/AJL92/GffeN7Q+PXbHY/S/YmJgmpaTd3XO6K/bGWeiqoJIKnHVkmMlp46+hdZCTDMr07sWZotbFvfuvdWMdt/wA/X+av3l0tufoDtH5dbz3X11vCiwtDn0bbOy8JuusTb+Tos5jKiHe2ExNJunHVa5fGwSyyU1VE84SzGxt7917qr3encPYfZMtNN2Pv/sDsJ6FWWgO/N4Z/eUtCsgUSR0c25Mlk1pbapFR0jGkNdlc/T3Xug5rqlaqXyK1Q31LNUOHkZmsWLabJqvwSAuqwJAJPv3XuoXv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de65I2llawbSwbSbgNYg2JUhrH/AAIPv3XulVid2ZHb+YpM9t6uyu38vj6lavGZXBZGow2XxdSqonnxeVx8kNXjpWjBjUxFSiAXL3a/uvdWUfH/APnN/wAzboPcvXuW2V8x+9M9iutc7Qbkw3XnYvYG5t89c5ipxlNV0aY/c23M3lZo8xiZ6PISxyQyNcqQUZHWNo/de6+hF81/nb8p8f8A8Jm/9niw3YuU2L8od89A/HjP1XYvW+Lp9tVWGzfZ3c3Xe1tyZrb9Lj4paPbJqttbgnRZ4DGKQya4pVOlvfuvdfLD3dvDcO7M/k907wzOZ3TuXclXNldw5/PZSsy+dz2XlkkM+Zym4sjLU5PJ1dRVgyF5S1xYXIHv3Xuk3JkVkhKNG7FyvkRvEVkKt5PM8hjLiR5CQRGI/T+STf37r3TZIQ0jst9LOxF73sSSL3Zze39ST/iffuvdcPfuvde9+691737r3Xvfuvde9+691737r3X/0/n/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6ccWCaqw/MbXNl0gAqxDM94Y/JbQHkBjVmBawFx7r3W+x80PlJ1/u/8A4SR/GnbO29z/ABzbJbmk6e6Rn2tjNzZ1d20u4OqN7YzN7qodnYGqxlNWS9sUtFj4qrdiVYgxlNjszUyw1LCqozL7r3WhTlL+ZCbm6v6yCNTLK6uALIiiNwVsqIotYA21H3Xumz37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/1Pn/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6mUN/OTdQEhnlbWFIPiieVV5sw1OgHpIbngj6+/de6vB+f0p6r/lifycug4LwV+5Or/kh8ytzxzj/K48z3d23JsvbU0qOS7Cr2f1dTTwtINSxzEx2DBj7r3VG80zzvrktewUaRpUKvCKqj0qqLwALce/de6xe/de697917r3v3Xuve/de697917r3v3Xuve/de697917r//V+f8A+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917pQbVwGR3TuHD7bw9FU5LL57JUOGxNBSU7VdTW5TLVcGOx1HBTKytPUVlbVRxRICC8rqPz7917q47+fZnqDFfPWf487drqet218Kvj78cfhhja6gqUqMfk63pHqTbdDvGvpvGFSJ6jeeWr1qARraojctz7917qlH37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691/9b5/wD7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917qTRsq1UDMnkCyKQhBKlh+jUoDFkD2JFuRx7917q5f+Sb1NtXcnzTxHyJ7OphU9FfAvY+5/mz2/NKkStUUvRVMc31zs+lq6iP7KLNb/7cOGpMdQyMfvtTRX9VvfuvdVfd6dobo7w7T7D7p3tVtX7x7c7C3z2Vumr+kMu4N8bmyO58uKZVIijhXIZSQKii0agRglUHv3Xugg9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf//X+f8A+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6k0n/AqD1Mt5FGpAjOCxsCgkBTXz6SfoeePfuvdXu78qIvg3/Jv2J19FIMb3v8AzZewIu5uw9MztmsF8Lvj5nqzDdT7dybRinyUeN7j7d+/zo1P9tkqDF0s6cABfde6opr6r7pkNy2gBdbuWkYBURQ4CpGBGqWXSo9P159+6903+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv/0Pn/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917rsAkgAXJNgB+SfoPfuvdGV+I/xs3b8sPk90J8bdneX+Pd19r7L66gqqQIanFUe4svDDmM94KkwFoMDgEqq9ybKY6dhct6ffuvdG8/nHfIba/wAiPnb3HU9Yy0y9EdEvtn4ofHHE42WUYTC9F/G7Dp1lsw4SCfRLHi9z1OFrc7EhDeJ8tIpIPHv3Xuqrffuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf//R+f8A+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XuucYBdA1tJdQ2olRa4vdhcgW/Pv3Xur3P5QIXovafz4/mO5FGgf4efGDPbK6Zy0o0FvlB8sp5en+pGxcopzUw5PCYKtz+apDGS9PPQLKSFcFfde6o+ybyOJWnbz1BEJqp3KyyJUPJPLKjyvK0rVEszvJM3q1u39kDn3XumH37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//0vn/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917rnGA0iKQSGdQQLXIJAsLsov/sR/r+/de6vZ+S3j+M38lv4QfH+gU0O+fnD232v86+3BLHVUmUm6x64nk6E+M+HqvE6HJ7czMNJntw0TMP2KrWT6CB7917qiqSpkljjifRoiFkCoEsTbU5K21u9uS1z7917rB7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r//T+f8A+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XunTD0M2Tr4MfSxNPW1skFHQRKWDPX1lTBS0iqVIOpp5lA+vJ9+691db/Ppr4Nu/NTC/HTb9Vq2Z8Mvin8T/iltOkJdXxtNsvp7A7v3pi5VawEkXZ298zK/JUvN/q7Bfde6o+9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//U+f8A+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XulRszMjbm58HuIw/cjb+XxGd+21+M1P8ABstQ5I04k/sNOKXSDza/v3Xurkf5+u3pF/mPdu9vY2Y5HYPyq2F0x8rOs8/H6MXndk9zdV7PzMH8FqAWStx+39z02SxbMv8AnKuhckXBC+691SN7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuv//V+f8A+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XuuaX1pbSTrWwblb3FtQ/1P9ffuvdXzbrjHzo/k34PdEDvlfkT/KQ3PD1/ud9Jlyu7vgf3/uOqrNgViszVNdXU/QHcxrcYUNosXhs1CzMGm4917qhlo5EF2Rl5I5FiCLfqH1X9Q+v19+691w9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//1vn/APv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917rtf1D6fUfW4H1/JFiB/re/de6vB/kM5qLcHzzg+MOTlMuxfnZ0R358R924yvfyYmtk7I65zWT2TX5GnKtFUja/aG18VkIgQCjQI6+v6+691TTubHNhazI4SpRlrcTkKjFVTMCGarw9XV42cSGxUEpErBQfSLcm9/fuvdJP37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/2Q=="

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "data:image/jpg;base64,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Z1BDAAAAAExlZnRVbnRGI1JsdAAAAAAAAAAAAAAAAFRvcCBVbnRGI1JsdAAAAAAAAAAAAAAAAFNjbCBVbnRGI1ByY0BZAAAAAAAAAAAAEGNyb3BXaGVuUHJpbnRpbmdib29sAAAAAA5jcm9wUmVjdEJvdHRvbWxvbmcAAAAAAAAADGNyb3BSZWN0TGVmdGxvbmcAAAAAAAAADWNyb3BSZWN0UmlnaHRsb25nAAAAAAAAAAtjcm9wUmVjdFRvcGxvbmcAAAAAADhCSU0D7QAAAAAAEABIAAAAAQACAEgAAAABAAI4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAB44QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAI4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAA0cAAAAGAAAAAAAAAAAAAAKAAAAEcAAAAAkAbABhAG4AZABzAGMAYQBwAGUAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAABHAAAAKAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAKAAAAAAFJnaHRsb25nAAAEcAAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9u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eC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTA2LTE1VDA0OjQ3OjEwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNy0wNi0xNVQxMTo1NTowMyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0wNi0xNVQxMTo1NTowMyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iQWRvYmUgUkdCICgxOTk4KSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NzAzZThmZS1mNmI0LTRmM2EtOTg1Ni1hMTFjZmRiMGVlNTUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmZjc4MWMxYy05MWI3LTExN2EtOTFmOC1jZGI3NDZkOTY5ODEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkM2JkN2U5NS02ZTdmLTQ1NmMtOGQyNS02YTgwOTIxZjhhMmQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQzYmQ3ZTk1LTZlN2YtNDU2Yy04ZDI1LTZhODA5MjFmOGEyZCIgc3RFdnQ6d2hlbj0iMjAxNy0wNi0xNVQwNDo0NzoxMCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjk1MWMzMzk5LTZjZmYtNDEzZC04YmY5LThjMjU3YzkyMzZkMSIgc3RFdnQ6d2hlbj0iMjAxNy0wNi0xNVQwNDo1MToxNyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjUwYjdkYzE2LWRjMWQtNDJkNi04ZGMxLTgzZDc4NGQxNTQyNCIgc3RFdnQ6d2hlbj0iMjAxNy0wNi0xNVQxMTo1NTowMyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gaW1hZ2UvanBlZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvcG5nIHRvIGltYWdlL2pwZWciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY3MDNlOGZlLWY2YjQtNGYzYS05ODU2LWExMWNmZGIwZWU1NSIgc3RFdnQ6d2hlbj0iMjAxNy0wNi0xNVQxMTo1NTowMyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjUwYjdkYzE2LWRjMWQtNDJkNi04ZGMxLTgzZDc4NGQxNTQyNCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmMwNjFiNzBlLTkxN2MtMTE3YS05MWY4LWNkYjc0NmQ5Njk4MSIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmQzYmQ3ZTk1LTZlN2YtNDU2Yy04ZDI1LTZhODA5MjFmOGEyZCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+ICQElDQ19QUk9GSUxFAAEBAAACMEFEQkUCEAAAbW50clJHQiBYWVogB88ABgADAAAAAAAAYWNzcEFQUEwAAAAAbm9uZQAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1BREJFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKY3BydAAAAPwAAAAyZGVzYwAAATAAAABrd3RwdAAAAZwAAAAUYmtwdAAAAbAAAAAUclRSQwAAAcQAAAAOZ1RSQwAAAdQAAAAOYlRSQwAAAeQAAAAOclhZWgAAAfQAAAAUZ1hZWgAAAggAAAAUYlhZWgAAAhwAAAAU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xRijFGKMUYoxRiiEQjFGKIRCMUYohGKMUYohGKMUzFIxRCIRiiEYoxRCMUQjFGKMUYoggxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKMUYoxRijFGKPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzxM8TPEzFmNjGxjYxZizFmNjFmLMWYsxsYsxsYsxZjYxZizFmLMWYsxsYsxZjYxsYsxZjYxZizFmLMbGNjFmLMbGLMbGNjFmLMWY2MbGNjFmLMWY2MWYsxZizGxizGxizFmNjFmLMWYsxZizGxizFmNjGxizFmNjFmLMWYsxsY2MWYsxsYsxsY2MWYsxZjYxsY2MWYsxZjYxZizFmLMbGLMbGLMWY2MWYsxZizFmLMbGLMWY2MbGLMWY2MWYsxZizGxjYxZizGxizGxjYxZizFmLMWY2IRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCIRCPGjAwPGeNCojBHjPGjBGCMDBGCFrMDAwMEYIwMDBGCMEYI8aMB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lzZJZsksySzZJZklmySzZJZsks2SWbJLNklmySzZLmySJc2SWbKElzJLNklmyS5klmySzZJZsks2SRJZkkSRJZsoSXMlzZLmySzZJZklmSWbJLNklmSRJElmySzKEubJLNklmSWbJLMks2SWbJLNklmySzZJZsks2SWbJc2SRLmySzZQkuZJZsks2SXMks2SWbJLNklmySJLMkiSJLNlCS5kubJc2SWbJLMksySzZJZsksySJIks2SWZQlzZJZsksySzZJZklmySzZJZsks2SWbJLNklmySzZLmySzZLmySzZJZlOZXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgV14FdeBXXgUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChQoUKFChIlyJMkyRLoS5exLl7EmSIQPx5GBLkSZIkyTIQfUl0JGKJEiRIwJGC6EuhIxRLkSJciWBIlgSZLAlyJdCECXQxJPIlyJciTJMkS6EuXsS5exJkiED8eRgS5EmSJMkyEH1JdCRiiRIkSMCRguhLoSMUS5EiXIlgSJYEmSwJciXQhAl0MSTyJciXIkyTJEuhLl7EuXsSZIhA/HkYEuRJkiTJMhB9SXQkYokSJEjAkYLoS6EjFEuRIlyJYEiWBJksCX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"

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);