(function() {

	var video = document.createElement('video');
	navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	var tw = 1280 / 2;
	var th = 720 / 2;
	var hdConstraints = {
		audio: false,
		video: {
			mandatory: {
				maxWidth: tw,
				maxHeight: th
	    	}
	  	}
	};
	if (navigator.getUserMedia) {
		navigator.getUserMedia(hdConstraints, success, errorCallback);
	} else {
		errorCallback('');
	}

	function errorCallback(e) {
		console.log("Can't access user media", e);
	}

	artoolkit.init('../../builds')

	function completeInit() {
		artoolkit.setup(video.videoWidth, video.videoHeight);
		artoolkit.debugSetup();

		initThreeJS();
	}

	var initWaitCount = 2;
	function initProgress() {
		initWaitCount--;
		if (initWaitCount === 0) {
			completeInit();
		}
	}

	function success(stream) {
		video.addEventListener('loadedmetadata', initProgress, false);

		video.src = window.URL.createObjectURL(stream);
		document.body.appendChild(video);
		video.play();

		console.log('success', stream);

		artoolkit.onReady(initProgress);

	}

	function getFrame() {
		artoolkit.process(video);
	}

	var initThreeJS = function() {
		THREE.Matrix4.prototype.setFromArray = function(m) {
			return this.elements.set(m);
		};
		var renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(video.videoWidth, video.videoHeight);
		document.body.appendChild(renderer.domElement);

		// To display the video, first create a texture from it.
		var videoTex = new THREE.Texture(video);

		videoTex.minFilter = THREE.LinearFilter;
		videoTex.flipY = false;

		// Then create a plane textured with the video.
		var plane = new THREE.Mesh(
		  new THREE.PlaneGeometry(2, 2),
		  new THREE.MeshBasicMaterial({map: videoTex, side: THREE.DoubleSide})
		);
		//plane.rotation.y = Math.PI;

		// The video plane shouldn't care about the z-buffer.
		plane.material.depthTest = false;
		plane.material.depthWrite = false;

		// Create a camera and a scene for the video plane and
		// add the camera and the video plane to the scene.
		var videoCam = new THREE.OrthographicCamera(-1, 1, -1, 1, -1, 1);
		var videoScene = new THREE.Scene();
		videoScene.add(plane);
		videoScene.add(videoCam);


		// Create the scene and the camera for the AR 3D scene.
		var scene = new THREE.Scene();
		var camera = new THREE.Camera();
		scene.add(camera);

		// Create an object that tracks the marker transform.
		var markerRoot = new THREE.Object3D();
		scene.add(markerRoot);

		// We're updating these manually with the matrices from ARToolKit, so turn auto-update off.
		// markerRoot.matrixAutoUpdate = false;
		// camera.matrixAutoUpdate = false;

		// Create a couple of lights for our AR scene.
		var light = new THREE.PointLight(0xffffff);
		light.position.set(40, 40, 40);
		scene.add(light);

		var light = new THREE.PointLight(0xff8800);
		light.position.set(-40, -20, -30);
		scene.add(light);

		// The AR scene.
		//
		// The box object is going to be placed on top of the marker in the video.
		// I'm adding it to the markerRoot object and when the markerRoot moves,
		// the box and its children move with it.
		//
		var box = new THREE.Object3D();
		var boxWall = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 0.1, 1, 1, 1),
			new THREE.MeshLambertMaterial({color: 0xffffff})
		);
		boxWall.position.z = -0.5;
		box.add(boxWall);

		boxWall = boxWall.clone();
		boxWall.position.z = +0.5;
		box.add(boxWall);

		boxWall = boxWall.clone();
		boxWall.position.z = 0;
		boxWall.position.x = -0.5;
		boxWall.rotation.y = Math.PI/2;
		box.add(boxWall);

		boxWall = boxWall.clone();
		boxWall.position.x = +0.5;
		box.add(boxWall);

		boxWall = boxWall.clone();
		boxWall.position.x = 0;
		boxWall.position.y = -0.5;
		boxWall.rotation.y = 0;
		boxWall.rotation.x = Math.PI/2;
		box.add(boxWall);

		// Keep track of the box walls to test if the mouse clicks happen on top of them.
		var walls = box.children.slice();

		// Create a pivot for the lid of the box to make it rotate around its "hinge".
		var pivot = new THREE.Object3D();
		pivot.position.y = 0.5;
		pivot.position.x = 0.5;

		// The lid of the box is attached to the pivot and the pivot is attached to the box.
		boxWall = boxWall.clone();
		boxWall.position.y = 0;
		boxWall.position.x = -0.5;
		pivot.add(boxWall);
		box.add(pivot);

		walls.push(boxWall);

		box.position.z = 0.5;
		box.rotation.x = Math.PI/2;

		// Add the box to the markerRoot object to make it track the marker.
		markerRoot.add(box);

		var open = false;
		renderer.domElement.onclick = function(ev) {
			if (findObjectUnderEvent(ev, renderer, camera, walls)) {
				open = !open;
			}
		};

		var findObjectUnderEvent = function(ev, renderer, camera, objects) {
			var mouse3D = new THREE.Vector3(
				( ev.layerX / renderer.domElement.width ) * 2 - 1,
				-( ev.layerY / renderer.domElement.height ) * 2 + 1,
				0.5
			);
			mouse3D.unproject( camera );
			mouse3D.sub( camera.position );
			mouse3D.normalize();
			var raycaster = new THREE.Raycaster( camera.position, mouse3D );
			var intersects = raycaster.intersectObjects( objects );
			if ( intersects.length > 0 ) {
				var obj = intersects[ 0 ].object
				return obj;
			}
		};

		Box = box;

		var tick = function() {
			requestAnimationFrame(tick);
			var camera_mat = artoolkit.getCameraMatrix();
			var transform_mat = artoolkit.getTransformationMatrix();

			var target = markerRoot;

			if (!transform_mat || !camera_mat) {
				return;
			}

			target.matrix.setFromArray(transform_mat);
			camera.projectionMatrix.setFromArray(camera_mat);
			target.matrixAutoUpdate = false;
			camera.matrixAutoUpdate = false;

			// ??? How to track several markers?
			
			// How to track barcode markers?
			// How to track square image markers?
			// How to track multimarkers?
			// How to track NFT?

			// target.matrix.setFromArray(transformposition.set(transform_mat[12], transform_mat[13], transform_mat[14]);
			// box.scale.set(30, 30, 30);
			// camera.position.z = -500;
			// camera.lookAt(new THREE.Vector3(0,0,0));

			getFrame();

			videoTex.needsUpdate = true;

			// box.rotation.y += 0.01;
			// box.rotation.x += 0.02;
			// box.scale.set(0.1, 0.1, 0.1);

			pivot.rotation.z += ((open ? -Math.PI/1.5 : 0) - pivot.rotation.z) * 0.1;

			renderer.autoClear = false;
			renderer.clear();
			renderer.render(videoScene, videoCam);
			renderer.render(scene, camera);
		};
		tick();
	};
})();
