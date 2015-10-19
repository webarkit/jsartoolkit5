/* THREE.js ARToolKit integration */

(function() {
	var integrate = function() {
		/**
			Set this matrix's elements to the given column-major matrix array.

			@param {Float32Array} m - The array to copy
		*/
		THREE.Matrix4.prototype.setFromArray = function(m) {
			return this.elements.set(m);
		};

		/**
			Helper for setting up a Three.js AR scene using the device camera as input.
			Pass in the maximum dimensions of the video you want to process and onSuccess and onError callbacks.

			On a successful initialization, the onSuccess callback is called with an ThreeARScene object.
			The ThreeARScene object contains two THREE.js scenes (one for the video image and other for the 3D scene)
			and a couple of helper functions for doing video frame processing and AR rendering.

			Here's the structure of the ThreeARScene object:
			{
				scene: THREE.Scene, // The 3D scene. Put your AR objects here.
				camera: THREE.Camera, // The 3D scene camera.

				video: HTMLVideoElement, // The userMedia video element.

				videoScene: THREE.Scene, // The userMedia video image scene. Shows the video feed.
				videoCamera: THREE.Camera, // Camera for the userMedia video scene.

				process: function(), // Process the current video frame and update the markers in the scene.
				renderOn: function( THREE.WebGLRenderer ) // Render the AR scene and video background on the given Three.js renderer.
			}

			You should use the arScene.video.videoWidth and arScene.video.videoHeight to set the width and height of your renderer.

			In your frame loop, use arScene.process() and arScene.renderOn(renderer) to do frame processing and 3D rendering, respectively.

			@param {number} width - The maximum width of the userMedia video to request.
			@param {number} height - The maximum height of the userMedia video to request.
			@param {function} onSuccess - Called on successful initialization with an ThreeARScene object.
			@param {function} onError - Called if the initialization fails with the error encountered.
		*/
		ARController.getUserMediaThreeScene = function(configuration) {
			var width = configuration.width;
			var height = configuration.height;
			var cameraParamURL = configuration.cameraParam;
			var onSuccess = configuration.onSuccess;
			var onError = configuration.onError;
			var facing = configuration.facing;

			if (!onError) {
				onError = function(err) {
					console.log("ERROR: artoolkit.getUserMediaThreeScene");
					console.log(err);
				};
			}
			var video = document.createElement('video');
			navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
			var hdConstraints = {
				audio: false,
				video: {
					mandatory: {}
			  	}
			};

			var initProgress = function() {
				if (this.videoWidth !== 0) {
					completeInit();
				}
			};

			var success = function(stream) {
				video.addEventListener('loadedmetadata', initProgress, false);

				video.src = window.URL.createObjectURL(stream);
				video.play();
			};

			var completeInit = function() {

				var arCameraParam = new ARCameraParam();
				arCameraParam.onload = function() {
					var f = Math.min(width / video.videoWidth, height / video.videoHeight);
					var w = f * video.videoWidth;
					var h = f * video.videoHeight;
					if (video.videoWidth < video.videoHeight) {
						var tmp = w;
						w = h;
						h = tmp;
					}
					var arController = new ARController(w, h, arCameraParam);
					if (video.videoWidth < video.videoHeight) {
						arController.orientation = 'portrait';
					}
					var scenes = arController.createThreeScene(video);
					onSuccess(scenes, arController, arCameraParam);
				};
				arCameraParam.src = cameraParamURL;
			};

			if (facing && (navigator.mediaDevices || window.MediaStreamTrack)) {
				if (navigator.mediaDevices) {
					navigator.mediaDevices.getUserMedia({
						audio: false,
						video: {
							facingMode: facing
						}
					}).then(success, onError); 
				} else if (window.MediaStreamTrack) {
					MediaStreamTrack.getSources(function(sources) {
						for (var i=0; i<sources.length; i++) {
							if (sources[i].kind === 'video' && sources[i].facing === facing) {
								hdConstraints.video.mandatory.sourceId = sources[i].id;
								break;
							}
						}
						if (navigator.getUserMedia) {
							navigator.getUserMedia(hdConstraints, success, onError);
						} else {
							onError('navigator.getUserMedia is not supported on your browser');
						}
					});
				}
			} else {
				if (navigator.getUserMedia) {
					navigator.getUserMedia(hdConstraints, success, onError);
				} else {
					onError('navigator.getUserMedia is not supported on your browser');
				}
			}


		};

		ARController.prototype.createThreeScene = function(video) {
			if (!this.THREE_JS_ENABLED) {
				this.setupThree();
			}

			// To display the video, first create a texture from it.
			var videoTex = new THREE.Texture(video);

			videoTex.minFilter = THREE.LinearFilter;
			videoTex.flipY = false;

			// Then create a plane textured with the video.
			var plane = new THREE.Mesh(
			  new THREE.PlaneBufferGeometry(2, 2),
			  new THREE.MeshBasicMaterial({map: videoTex, side: THREE.DoubleSide})
			);

			// The video plane shouldn't care about the z-buffer.
			plane.material.depthTest = false;
			plane.material.depthWrite = false;

			// Create a camera and a scene for the video plane and
			// add the camera and the video plane to the scene.
			var videoCamera = new THREE.OrthographicCamera(-1, 1, -1, 1, -1, 1);
			var videoScene = new THREE.Scene();
			videoScene.add(plane);
			videoScene.add(videoCamera);

			if (this.orientation === 'portrait') {
				plane.rotation.z = Math.PI/2;
			}

			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera(45, 1, 1, 1000)
			scene.add(camera);

			camera.matrixAutoUpdate = false;

			var self = this;

			return {
				scene: scene,
				videoScene: videoScene,
				camera: camera,
				videoCamera: videoCamera,

				arController: self,

				video: video,

				process: function() {
					for (var i in self.patternMarkers) {
						self.patternMarkers[i].visible = false;
					}
					for (var i in self.barcodeMarkers) {
						self.barcodeMarkers[i].visible = false;
					}
					for (var i in self.multiMarkers) {
						self.multiMarkers[i].visible = false;
						for (var j=0; j<self.multiMarkers[i].markers.length; j++) {
							if (self.multiMarkers[i].markers[j]) {
								self.multiMarkers[i].markers[j].visible = false;
							}
						}
					}
					self.process(video);
					camera.projectionMatrix.setFromArray(self.getCameraMatrix());
				},

				renderOn: function(renderer) {
					videoTex.needsUpdate = true;

					var ac = renderer.autoClear;
					renderer.autoClear = false;
					renderer.clear();
					renderer.render(this.videoScene, this.videoCamera);
					renderer.render(this.scene, this.camera);
					renderer.autoClear = ac;
				}
			};
		};

		ARController.prototype.setupThree = function() {
			if (this.THREE_JS_ENABLED) {
				throw("ARController.prototype.setupThree: Trying to setup Three.js support multiple times.");
				return;
			}
			this.THREE_JS_ENABLED = true;

			/**
				Overrides the artoolkit.onGetMarker method to keep track of Three.js markers.

				@param {Object} marker - The marker object received from ARToolKitJS.cpp
			*/
			this.addEventListener('getMarker', function(ev) {
				var obj = this.patternMarkers[ev.data.marker.idPatt];
				if (obj) {
					obj.matrix.setFromArray(this.getTransformationMatrix());
					obj.visible = true;
				}
				var obj = this.barcodeMarkers[ev.data.marker.idMatrix];
				if (obj) {
					obj.matrix.setFromArray(this.getTransformationMatrix());
					obj.visible = true;
				}
			});

			/**
				Overrides the artoolkit.onGetMultiMarker method to keep track of Three.js multimarkers.

				@param {Object} marker - The multimarker object received from ARToolKitJS.cpp
			*/
			this.addEventListener('getMultiMarker', function(ev) {
				var obj = this.multiMarkers[ev.data.multiMarkerId];
				if (obj) {
					obj.matrix.setFromArray(this.getTransformationMatrix());
					obj.visible = true;
				}
			});

			/**
				Overrides the artoolkit.onGetMultiMarkerSub method to keep track of Three.js multimarker submarkers.

				@param {Object} marker - The multimarker object received from ARToolKitJS.cpp
			*/
			this.addEventListener('getMultiMarkerSub', function(ev) {
				var marker = ev.data.multiMarkerId;
				var subMarkerID = ev.data.markerId;
				var subMarker = ev.data.marker;
				var obj = this.multiMarkers[marker];
				if (obj && obj.markers && obj.markers[subMarkerID]) {
					obj.markers[subMarkerID].matrix.setFromArray(this.getTransformationMatrix());
					obj.markers[subMarkerID].visible = (subMarker.visible >= 0);
				}
			});

			/**
				Index of Three.js pattern markers, maps markerID -> THREE.Object3D.
			*/
			this.patternMarkers = {};

			/**
				Index of Three.js barcode markers, maps markerID -> THREE.Object3D.
			*/
			this.barcodeMarkers = {};

			/**
				Index of Three.js multimarkers, maps markerID -> THREE.Object3D.
			*/
			this.multiMarkers = {};
		};

		/**
			Loads a marker from the given URL and calls the onSuccess callback with the UID of the marker.

			arController.loadMarker(markerURL, onSuccess, onError);

			Synonym for artoolkit.addMarker.

			@param {string} markerURL - The URL of the marker pattern file to load.
			@param {function} onSuccess - The success callback. Called with the id of the loaded marker on a successful load.
			@param {function} onError - The error callback. Called with the encountered error if the load fails.
		*/
		ARController.prototype.loadMarker = function(markerURL, onSuccess, onError) {
			return artoolkit.addMarker(this.id, markerURL, onSuccess, onError);
		};

		/**
			Loads a multimarker from the given URL and calls the onSuccess callback with the UID of the marker.

			arController.loadMultiMarker(markerURL, onSuccess, onError);

			Synonym for artoolkit.addMultiMarker.

			@param {string} markerURL - The URL of the multimarker pattern file to load.
			@param {function} onSuccess - The success callback. Called with the id and the number of sub-markers of the loaded marker on a successful load.
			@param {function} onError - The error callback. Called with the encountered error if the load fails.
		*/
		ARController.prototype.loadMultiMarker = function(markerURL, onSuccess, onError) {
			return artoolkit.addMultiMarker(this.id, markerURL, onSuccess, onError);
		};

		/**
			Creates a Three.js marker Object3D for the given marker UID.
			The marker Object3D tracks the marker pattern when it's detected in the video.

			Use this after a successful artoolkit.loadMarker call:

			artoolkit.loadMarker('/bin/Data/patt.hiro', function(markerUID) {
				var markerRoot = artoolkit.createThreeMarker(markerUID);
				markerRoot.add(myFancyHiroModel);
				arScene.scene.add(markerRoot);
			});

			@param {number} markerUID - The UID of the marker to track.
			@return {THREE.Object3D} Three.Object3D that tracks the given marker.
		*/
		ARController.prototype.createThreeMarker = function(markerUID) {
			var obj = new THREE.Object3D();
			obj.matrixAutoUpdate = false;
			this.patternMarkers[markerUID] = obj;
			return obj;
		};

		/**
			Creates a Three.js marker Object3D for the given multimarker UID.
			The marker Object3D tracks the multimarker when it's detected in the video.

			Use this after a successful artoolkit.loadMarker call:

			artoolkit.loadMultiMarker('/bin/Data/multi-barcode-4x3.dat', function(markerUID) {
				var markerRoot = artoolkit.createThreeMultiMarker(markerUID);
				markerRoot.add(myFancyMultiMarkerModel);
				arScene.scene.add(markerRoot);
			});

			@param {number} markerUID - The UID of the marker to track.
			@return {THREE.Object3D} Three.Object3D that tracks the given marker.
		*/
		ARController.prototype.createThreeMultiMarker = function(markerUID) {
			var obj = new THREE.Object3D();
			obj.matrixAutoUpdate = false;
			obj.markers = [];
			this.multiMarkers[markerUID] = obj;
			return obj;
		};

		/**
			Creates a Three.js marker Object3D for the given barcode marker UID.
			The marker Object3D tracks the marker pattern when it's detected in the video.

			var markerRoot20 = artoolkit.createThreeBarcodeMarker(20);
			markerRoot20.add(myFancyNumber20Model);
			arScene.scene.add(markerRoot20);

			var markerRoot5 = artoolkit.createThreeBarcodeMarker(5);
			markerRoot5.add(myFancyNumber5Model);
			arScene.scene.add(markerRoot5);

			@param {number} markerUID - The UID of the barcode marker to track.
			@return {THREE.Object3D} Three.Object3D that tracks the given marker.
		*/
		ARController.prototype.createThreeBarcodeMarker = function(markerUID) {
			var obj = new THREE.Object3D();
			obj.matrixAutoUpdate = false;
			this.barcodeMarkers[markerUID] = obj;
			return obj;
		};
	};

	var tick = function() {
		if (window.ARController && window.THREE) {
			integrate();
			if (window.ARThreeOnLoad) {
				window.ARThreeOnLoad();
			}
		} else {
			setTimeout(tick, 50);
		}			
	};

	tick();

})();

