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

var createBox = function() {
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

	box.open = false;

	box.tick = function() {
		// Animate the box lid to open rotation or closed rotation, depending on the value of the open variable.
		pivot.rotation.z += ((box.open ? -Math.PI/1.5 : 0) - pivot.rotation.z) * 0.1;
	};

	return {box: box, walls: walls};
};


(function() {

	var tw = 1280 / 2;
	var th = 720 / 2;

	var initThreeJS = function(arScene, arController) {
		var renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(arScene.video.videoWidth, arScene.video.videoHeight);
		document.body.appendChild(renderer.domElement);

		arController.debugSetup();

		// Create a couple of lights for our AR scene.
		var light = new THREE.PointLight(0xffffff);
		light.position.set(40, 40, 40);
		arScene.scene.add(light);

		var light = new THREE.PointLight(0xff8800);
		light.position.set(-40, -20, -30);
		arScene.scene.add(light);

		var redCube = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), new THREE.MeshLambertMaterial({ color: 0xff3333 }) );
		redCube.position.z = 0.5;

		var markerRoot20 = arController.createThreeBarcodeMarker(20);
		arScene.scene.add(markerRoot20);
		markerRoot20.add(redCube);

		var blueCube = new THREE.Mesh( new THREE.BoxGeometry(1,1,1), new THREE.MeshLambertMaterial({ color: 0x3333ff }) );
		blueCube.position.z = 0.5;

		var markerRoot5 = arController.createThreeBarcodeMarker(5);
		arScene.scene.add(markerRoot5);
		markerRoot5.add(blueCube);

		// Load the marker to use.
		arController.loadMarker('../../bin/Data/patt.hiro', function(marker) {

			// Create an object that tracks the marker transform.
			var markerRoot = arController.createThreeMarker(marker);
			arScene.scene.add(markerRoot);

			// Create the openable box object for our AR scene.
			var boxAndWalls = createBox();

			// Add the box to the markerRoot object to make it track the marker.
			markerRoot.add(boxAndWalls.box);

			renderer.domElement.onclick = function(ev) {
				if (findObjectUnderEvent(ev, renderer, arScene.camera, boxAndWalls.walls)) {
					boxAndWalls.box.open = !boxAndWalls.box.open;
				}
			};

			var tick = function() {
				requestAnimationFrame(tick);
				arScene.process();

				boxAndWalls.box.tick();
				arScene.renderOn(renderer);
			};
			tick();

		});

	};

	ARController.getUserMediaThreeScene(
		{width: tw, height: th, cameraParam: '/bin/Data/camera_para.dat', onSuccess: initThreeJS}
	);


})();
