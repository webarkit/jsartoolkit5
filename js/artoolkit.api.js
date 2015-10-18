(function() {
	'use strict'

	var ARController = function(width, height, camera) {
		var id;
		var w = width, h = height;

		this.orientation = 'landscape';

		this.listeners = {};

		if (typeof width !== 'number') {
			var image = width;
			camera = height;
			w = image.videoWidth || image.width;
			h = image.videoHeight || image.height;
			this.image = image;
		}

		this.canvas = document.createElement('canvas');
		this.canvas.width = w;
		this.canvas.height = h;
		this.ctx = this.canvas.getContext('2d');

		this.addEventListeners();

		this.id = artoolkit.setup(w, h, camera.id);

		this.setScale(1);
		this.setMarkerWidth(1);
		this.setProjectionNearPlane(0.1)
		this.setProjectionFarPlane(1000);

	};

	ARController.prototype.addEventListener = function(name, callback) {
		if (!this.listeners[name]) {
			this.listeners[name] = [];
		}
		this.listeners[name].push(callback);
	};

	ARController.prototype.removeEventListener = function(name, callback) {
		if (this.listeners[name]) {
			var index = this.listeners[name].indexOf(callback);
			if (index > -1) {
				this.listeners[name].splice(index, 1);
			}
		}
	};

	ARController.prototype.dispatchEvent = function(event) {
		var listeners = this.listeners[event.name];
		if (listeners) {
			for (var i=0; i<listeners.length; i++) {
				listeners[i].call(this, event);
			}
		}
	};

	/* Setter / Getter Proxies */

	ARController.prototype.setScale = function(value) {
		return artoolkit.setScale(this.id, value);
	};

	ARController.prototype.getScale = function() {
		return artoolkit.getScale(this.id);
	};

	ARController.prototype.setMarkerWidth = function(value) {
		return artoolkit.setMarkerWidth(this.id, value);
	};

	ARController.prototype.getMarkerWidth = function() {
		return artoolkit.getMarkerWidth(this.id);
	};

	ARController.prototype.setProjectionNearPlane = function(value) {
		return artoolkit.setProjectionNearPlane(this.id, value);
	};

	ARController.prototype.getProjectionNearPlane = function() {
		return artoolkit.getProjectionNearPlane(this.id);
	};

	ARController.prototype.setProjectionFarPlane = function(value) {
		return artoolkit.setProjectionFarPlane(this.id, value);
	};

	ARController.prototype.getProjectionFarPlane = function() {
		return artoolkit.getProjectionFarPlane(this.id);
	};

	ARController.prototype.setThresholdMode = function(mode) {
		return artoolkit.setThresholdMode(this.id, mode);
	};

	ARController.prototype.getThresholdMode = function() {
		return artoolkit.getThresholdMode(this.id);
	};

	ARController.prototype.setThreshold = function(mode) {
		return artoolkit.setThreshold(this.id, mode);
	};

	ARController.prototype.getThreshold = function() {
		return artoolkit.getThreshold(this.id);
	};

	ARController.prototype.setPatternDetectionMode = function(value) {
		return artoolkit.setPatternDetectionMode(this.id, value);
	};

	ARController.prototype.getPatternDetectionMode = function() {
		return artoolkit.getPatternDetectionMode(this.id);
	};

	ARController.prototype.setMatrixCodeType = function(value) {
		return artoolkit.setMatrixCodeType(this.id, value);
	};

	ARController.prototype.getMatrixCodeType = function() {
		return artoolkit.getMatrixCodeType(this.id);
	};

	ARController.prototype.setLabelingMode = function(value) {
		return artoolkit.setLabelingMode(this.id, value);
	};

	ARController.prototype.getLabelingMode = function() {
		return artoolkit.getLabelingMode(this.id);
	};

	ARController.prototype.setPattRatio = function(value) {
		return artoolkit.setPattRatio(this.id, value);
	};

	ARController.prototype.getPattRatio = function() {
		return artoolkit.getPattRatio(this.id);
	};

	ARController.prototype.setImageProcMode = function(value) {
		return artoolkit.setImageProcMode(this.id, value);
	};

	ARController.prototype.getImageProcMode = function() {
		return artoolkit.getImageProcMode(this.id);
	};

	ARController.prototype.getCameraMatrix = function() {
		return this.camera_mat;
	};

	ARController.prototype.getTransformationMatrix = function() {
		return this.transform_mat;
	};

	ARController.prototype.addEventListeners = function() {

		var self = this;

		this._detected_markers = [];

		artoolkit.addEventListener('markerNum', function(ev) {
			if (ev.target === self.id) {
				self._detected_markers = new Array(ev.data);
				self.dispatchEvent(ev);
			}
		});

		artoolkit.addEventListener('frameMalloc', function(ev) {
			if (ev.target === self.id || self.id === undefined) {

				console.log('ARController '+ev.target+' got frame malloc', ev.data);

				var params = ev.data;
				self.framepointer = params.framepointer;
				self.framesize = params.framesize;

				self.dataHeap = new Uint8Array(Module.HEAPU8.buffer, self.framepointer, self.framesize);

				self.camera_mat = new Float64Array(Module.HEAPU8.buffer, params.camera, 16);
				self.transform_mat = new Float64Array(Module.HEAPU8.buffer, params.modelView, 16);
			}
		});

		artoolkit.addEventListener('getMarker', function(ev) {
			if (ev.target === self.id) {
				self._detected_markers[ev.data.index] = ev.data.marker;
				self.dispatchEvent(ev);
			}
		});

		artoolkit.addEventListener('getMultiMarker', function(ev) {
			if (ev.target === self.id) {
				self.dispatchEvent(ev);
			}
		});

		artoolkit.addEventListener('getMultiMarkerSub', function(ev) {
			if (ev.target === self.id) {
				self.dispatchEvent(ev);
			}
		});

	};

	ARController.prototype.process = function(image) {
		if (!image) {
			image = this.image;
		}

		this.ctx.save();

		if (this.orientation === 'portrait') {
			this.ctx.translate(this.canvas.width, 0);
			this.ctx.rotate(Math.PI/2);
			this.ctx.drawImage(image, 0, 0, this.canvas.height, this.canvas.width); // draw video
		} else {
			this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height); // draw video
		}

		this.ctx.restore();

		var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		var data = imageData.data;

		if (this.dataHeap) {
			this.dataHeap.set( new Uint8Array(data.buffer) );

			artoolkit.process(this.id);

			this.debugDraw();
		}
	};

	ARController.prototype.debugSetup = function() {
		document.body.appendChild(this.canvas)
		this.bwpointer = artoolkit.setDebugMode(this.id, 1);
	};

	ARController.prototype.debugDraw = function() {
		var debugBuffer = new Uint8ClampedArray(Module.HEAPU8.buffer, this.bwpointer, this.framesize);
		var id = new ImageData(debugBuffer, this.canvas.width, this.canvas.height)
		this.ctx.putImageData(id, 0, 0)

		for (var i=0; i<this._detected_markers.length; i++) {
			this.debugMarker(this._detected_markers[i]);
		}
	};

	ARController.prototype.debugMarker = function(marker) {
		var vertex, pos;
		vertex = marker.vertex;
		var ctx = this.ctx;
		ctx.strokeStyle = 'red';

		ctx.beginPath()
		ctx.moveTo(vertex[0][0], vertex[0][1])
		ctx.lineTo(vertex[1][0], vertex[1][1])
		ctx.stroke();

		ctx.beginPath()
		ctx.moveTo(vertex[2][0], vertex[2][1])
		ctx.lineTo(vertex[3][0], vertex[3][1])
		ctx.stroke()

		ctx.strokeStyle = 'green';
		ctx.beginPath()
		ctx.lineTo(vertex[1][0], vertex[1][1])
		ctx.lineTo(vertex[2][0], vertex[2][1])
		ctx.stroke();

		ctx.beginPath()
		ctx.moveTo(vertex[3][0], vertex[3][1])
		ctx.lineTo(vertex[0][0], vertex[0][1])
		ctx.stroke();

		pos = marker.pos
		ctx.beginPath()
		ctx.arc(pos[0], pos[1], 8, 0, Math.PI * 2)
		ctx.fillStyle = 'red'
		ctx.fill()
	};

	ARController.prototype.dispose = function() {
		Module._teardown(this.id);

		for (var t in this) {
			this[t] = null;
		}
	};

	var ARCameraParam = function() {
		this.id = -1;
		this._src = '';
		this.complete = false;
	};

	Object.defineProperty(ARCameraParam.prototype, 'src', {
		set: function(src) {
			if (src === this._src) {
				return;
			}
			this.dispose();
			this._src = src;
			if (src) {
				var self = this;
				artoolkit.loadCamera(src, function(id) {
					self.id = id;
					self.complete = true;
					self.onload();
				});
			}
		},
		get: function() {
			return this._src;
		}
	});

	ARCameraParam.prototype.dispose = function() {
		if (this.id !== -1) {
			artoolkit.deleteCamera(this.id);
		}
		this.id = -1;
		this._src = '';
		this.complete = false;
	};

	// ARToolKit JS API
	var artoolkit = {
		setup: setup,
		process: process,

		listeners: {},

		addEventListener: function(name, callback) {
			if (!this.listeners[name]) {
				this.listeners[name] = [];
			}
			this.listeners[name].push(callback);
		},

		removeEventListener: function(name, callback) {
			if (this.listeners[name]) {
				var index = this.listeners[name].indexOf(callback);
				if (index > -1) {
					this.listeners[name].splice(index, 1);
				}
			}
		},

		dispatchEvent: function(event) {
			var listeners = this.listeners[event.name];
			if (listeners) {
				for (var i=0; i<listeners.length; i++) {
					listeners[i].call(this, event);
				}
			}
		},

		loadCamera: loadCamera,

		addMarker: addMarker,
		addMultiMarker: addMultiMarker,

		onFrameMalloc: onFrameMalloc,
		onMarkerNum: onMarkerNum,
		_onGetMarker: onGetMarker,

		onGetMultiMarker: onGetMultiMarker,
		onGetMultiMarkerSub: onGetMultiMarkerSub,

		setLogLevel: setLogLevel,
		setDebugMode: setDebugMode
	};

	var FUNCTIONS = [
		'setScale',
		'getScale',

		'setMarkerWidth',
		'getMarkerWidth',


		'setProjectionNearPlane',
		'getProjectionNearPlane',

		'setProjectionFarPlane',
		'getProjectionFarPlane',

		'setThresholdMode',
		'getThresholdMode',

		'setThreshold',
		'getThreshold',

		'setPatternDetectionMode',
		'getPatternDetectionMode',

		'setMatrixCodeType',
		'getMatrixCodeType',

		'setLabelingMode',
		'getLabelingMode',

		'setPattRatio',
		'getPattRatio',

		'setImageProcMode',
		'getImageProcMode',
	];

	function runWhenLoaded() {
		FUNCTIONS.forEach(function(n) {
			artoolkit[n] = Module[n];
		})

		artoolkit.CONSTANTS = {};

		for (var m in Module) {
			if (m.match(/^AR/))
			artoolkit.CONSTANTS[m] = Module[m];
		}
	}

	function onFrameMalloc(id, params) {
		this.dispatchEvent({name: 'frameMalloc', target: id, data: params});
	}

	function onMarkerNum(id, number) {
		this.dispatchEvent({name: 'markerNum', target: id, data: number});
	}

	function onGetMarker(object, i, id) {
		this.dispatchEvent({name: 'getMarker', target: id, data: {index: i, marker: object}});
	}

	function onGetMultiMarker(id, multiId) {
		this.dispatchEvent({name: 'getMultiMarker', target: id, data: {multiMarkerId: multiId}});
	}

	function onGetMultiMarkerSub(id, multiId, subMarker, subMarkerId) {
		this.dispatchEvent({name: 'getMultiMarkerSub', target: id, data: {multiMarkerId: multiId, markerId: subMarkerId, marker: subMarker}});
	}

	function setup(_w, _h, _camera_id) {
		return _setup(_w, _h, _camera_id);
	}

	var marker_count = 0;
	function addMarker(arId, url, callback) {
		var filename = '/marker_' + marker_count++;
		ajax(url, filename, function() {
			var id = Module._addMarker(arId, filename);
			if (callback) callback(id);
		});
	}

	function bytesToString(array) {
		return String.fromCharCode.apply(String, array);
	}

	function parseMultiFile(bytes) {
		var str = bytesToString(bytes);

		var lines = str.split('\n');

		var files = [];

		var state = 0; // 0 - read,
		var markers = 0;

		lines.forEach(function(line) {
			line = line.trim();
			if (!line || line.startsWith('#')) return;

			switch (state) {
				case 0:
					markers = +line;
					state = 1;
					return;
				case 1: // filename or barcode
					if (!line.match(/^\d+$/)) {
						files.push(line);
					}
				case 2: // width
				case 3: // matrices
				case 4:
					state++;
					return;
				case 5:
					state = 1;
					return;
			}
		});

		return files;
	}

	var multi_marker_count = 0;

	function addMultiMarker(arId, url, callback) {
		var filename = '/multi_marker_' + multi_marker_count++;
		ajax(url, filename, function(bytes) {
			var files = parseMultiFile(bytes);

			function ok() {
				var markerID = Module._addMultiMarker(arId, filename);
				var markerNum = Module._getMultiMarkerNum(arId, markerID);
				if (callback) callback(markerID, markerNum);
			}

			if (!files.length) return ok();

			var path = url.split('/').slice(0, -1).join('/')
			files = files.map(function(file) {
				return [path + '/' + file, file]
			})

			ajaxDependencies(files, ok);
		});
	}

	var camera_count = 0;
	function loadCamera(url, callback) {
		var filename = '/camera_param_' + camera_count++;
		var writeCallback = function() {
			var id = Module._loadCamera(filename);
			if (callback) callback(id);
		};
		if (typeof url === 'object') { // Maybe it's a byte array
			writeByteArrayToFS(filename, url, writeCallback);
		} else if (url.indexOf("\n") > -1) { // Or a string with the camera param
			writeStringToFS(filename, url, writeCallback);
		} else {
			ajax(url, filename, writeCallback);
		}
	}

	function setLogLevel(level) {
		return _setLogLevel(level);
	}

	function setDebugMode(arId, mode) {
		return _setDebugMode(arId, mode);
	}


	// transfer image

	function process(arId) {
		_process(arId);
	}

	function writeStringToFS(target, string, callback) {
		var byteArray = new Uint8Array(string.length);
		for (var i=0; i<byteArray.length; i++) {
			byteArray[i] = string.charCodeAt(i) & 0xff;
		}
		writeByteArrayToFS(target, byteArray, callback);
	}

	function writeByteArrayToFS(target, byteArray, callback) {
		FS.writeFile(target, byteArray, { encoding: 'binary' });
		console.log('FS written', target);

		callback(byteArray);
	}

	// Eg.
	//	ajax('../bin/Data2/markers.dat', '/Data2/markers.dat', callback);
	//	ajax('../bin/Data/patt.hiro', '/patt.hiro', callback);

	function ajax(url, target, callback) {
		var oReq = new XMLHttpRequest();
		oReq.open('GET', url, true);
		oReq.responseType = 'arraybuffer'; // blob arraybuffer

		oReq.onload = function(oEvent) {
			console.log('ajax done for ', url);
			var arrayBuffer = oReq.response;
			var byteArray = new Uint8Array(arrayBuffer);
			writeByteArrayToFS(target, byteArray, callback);
		};

		oReq.send();
	}

	function ajaxDependencies(files, callback) {
		var next = files.pop();
		if (next) {
			ajax(next[0], next[1], function() {
				ajaxDependencies(files, callback);
			});
		} else {
			callback();
		}
	}

	/* Exports */
	window.artoolkit = artoolkit;
	window.ARController = ARController;
	window.ARCameraParam = ARCameraParam;

	if (window.Module) {
		runWhenLoaded();
	} else {
		window.Module = {
			onRuntimeInitialized: function() {
				runWhenLoaded();
			}
		};
	}

})();