QUnit.module("ARCameraPara");
QUnit.test( "Create object and load camera parameter", function( assert ) {
    const cParaUrl = './camera_para.dat';
    const done = assert.async();
    const success = function() {
        assert.ok(true, "Successfully loaded camera para");
        done();
    }
    const error = function () {
        assert.ok(false, "Failed loading camera para");
        done();
    }
    const cameraPara = new ARCameraParam(cParaUrl, success, error, false);
    assert.equal(cameraPara.src, cParaUrl, "Camera para URL is equal to: " + cParaUrl);
});
QUnit.test( "Create object and fail to load camera parameter", function( assert ) {
    const cParaUrl = './camera_para_error.dat';
    const done = assert.async();
    const success = function() {
        assert.ok(false, "Successfully loaded camera para");
        done();
    }
    const error = function () {
        assert.ok(true, "Failed loading camera para");
        done();
    }
    const cameraPara = new ARCameraParam(cParaUrl, success, error, false);
});
QUnit.test("Test that missing callbacks create errors", assert => {
    const cParaUrl = './camera_para_error.dat';
    const onload = () => {};
    assert.throws(() => {new ARCameraParam(cParaUrl)}, "missing onload callback throws error");
    assert.throws(() => {new ARCameraParam(cParaUrl,onload)}, "missing onerror callback throws error");
});
QUnit.test("Try to load twice", assert => {
    const cParaUrl = './camera_para_error.dat';
    const success = function() {
    }
    const error = function () {
    }
    const cameraPara = new ARCameraParam(cParaUrl, success, error);

    assert.throws(() => {cameraPara.load('./camera_para.dat')},"Throws an error that calibration tried to load twice");
});
QUnit.test("Try to load twice but empty existing ARCameraPara before loading", assert => {
    const cParaUrl = './camera_para_error.dat';
    const success = function() {
    }
    const error = function () {
    }
    const cameraPara = new ARCameraParam(cParaUrl, success, error);
    cameraPara.dispose();
    assert.deepEqual("",cameraPara.src);

    const cameraParaString = './camera_para.dat';
    cameraPara.load(cameraParaString);
    assert.deepEqual(cameraParaString, cameraPara.src, "load after dispose should work");
});

/* #### ARController Module #### */
QUnit.module("ARController", {
    beforeEach : assert => {
        const cParaUrl = './camera_para.dat';
        const success = function() {
        }
        const error = function () {
        }
        this.cameraPara = new ARCameraParam(cParaUrl, success, error);
        this.checkDefault = (arController) => {
            assert.ok(arController);
            assert.deepEqual(arController.orientation, "landscape", "Check the default values: landscape");
            assert.deepEqual(arController.listeners, {}, "Check the default values: listeners");
            assert.deepEqual(arController.defaultMarkerWidth, 1, "Check the default values: defaultMarkerWidth");
            assert.deepEqual(arController.patternMarkers,{},"Check the default values: patternMarkers==={}");
            assert.deepEqual(arController.barcodeMarkers,{},"Check the default values: barcodeMarkers==={}");
            assert.deepEqual(arController.transform_mat,new Float32Array(16),"Check the default values: transform_mat");
            assert.ok(arController.canvas, "Check the default values: canvas");
            assert.ok(arController.ctx, "Check the default values: ctx");
        }
    },
    afterEach : assert => {
        this.arController.dispose();
    }
});
QUnit.test("Create ARController default", assert => {
    const videoWidth = 640, videoHeight = 480;
    const done = assert.async();
    const arController = new ARController(videoWidth, videoHeight, this.cameraPara);
    this.checkDefault(arController);

    arController.onload = (err) => {
        assert.notOk(err, "no error");
        assert.ok(true, "successfully loaded");
        this.arController = arController;
        done();
    };


    assert.deepEqual(arController.cameraParam, this.cameraPara, "Check the default values: cameraPara");
    assert.deepEqual(arController.videoWidth, videoWidth, "Check the default values: videoWidth");
    assert.deepEqual(arController.videoHeight, videoHeight, "Check the default values: videoHeight");
    assert.notOk(arController.image, "Check the default values: image === undefined");

    assert.deepEqual(arController.canvas.width, videoWidth,"Check the default values: canvas.width");
    assert.deepEqual(arController.canvas.height, videoHeight, "Check the default values: canvas.height");

});
QUnit.test("Create ARController track image", assert => {
    const done = assert.async();
    const arController = new ARController(v1, this.cameraPara);
    this.checkDefault(arController);

    arController.onload = (err) => {
        assert.notOk(err, "no error");
        assert.ok(true, "successfully loaded");
        this.arController = arController;
        done();
    };

    assert.deepEqual(arController.cameraParam, this.cameraPara, "Check the default values: cameraPara");
    assert.deepEqual(arController.image, v1, "Check the default values: image");
    assert.deepEqual(arController.videoWidth, v1.width, "Check the default values: image.width");
    assert.deepEqual(arController.videoHeight, v1.height, "Check the default values: image.height");

    assert.deepEqual(arController.canvas.width, v1.width,"Check the default values: canvas.width");
    assert.deepEqual(arController.canvas.height, v1.height, "Check the default values: canvas.height");
});
QUnit.test("Create ARController default, CameraPara as string", assert => {
    const videoWidth = 640, videoHeight = 480;
    const cameraParaUrl = './camera_para.dat';
    assert.timeout(5000);
    //ARController calls _initialize, which in turn contains a timeOut-function that waits for 1ms 
    const done = assert.async();
    const arController = new ARController(videoWidth, videoHeight, cameraParaUrl);

    arController.onload = (err) => {
        assert.notOk(err, "no error");
        assert.ok(true, "successfully loaded");
        this.arController = arController;
        done();
    };
    this.checkDefault(arController);

    assert.deepEqual(arController.videoWidth, videoWidth, "Check the default values: videoWidth");
    assert.deepEqual(arController.videoHeight, videoHeight, "Check the default values: videoHeight");
    assert.notOk(arController.image, "Check the default values: image === undefined");

    assert.deepEqual(arController.canvas.width, videoWidth,"Check the default values: canvas.width");
    assert.deepEqual(arController.canvas.height, videoHeight, "Check the default values: canvas.height");
});
QUnit.test("Create ARController default, CameraPara as invalid string", assert => {
    const videoWidth = 640, videoHeight = 480;
    const cameraParaUrl = './camera_para_error.dat';
    assert.timeout(5000);
    //ARController calls _initialize, which in turn contains a timeOut-function that waits for 1ms 
    const done = assert.async();
    const arController = new ARController(videoWidth, videoHeight, cameraParaUrl);

    arController.onload = (err) => {
        assert.deepEqual(err, 404, "error while loading");
        this.arController = arController;
        done();
    };
});
// QUnit.test("Create ARController empty", assert => {
//     assert.timeout(500);
//     const done = assert.async();
//     const arController = new ARController();
//     arController.onload = (err) => {
//         assert.deepEqual(err, 404, "error while loading");
//         done();
//     };
//     assert.ok(false,"TODO");
// });

/* #### ARController.getUserMedia module #### */ 
QUnit.module("ARController.getUserMedia", {
    afterEach : assert => {
        if(this.video.srcObject) {
            const track = this.video.srcObject.getTracks()[0];
            track.stop();
            this.video.srcObject = null;
        }
        this.video.src = null;
    }
});
QUnit.test("getUserMedia", assert => {
    const width = 640;
    const height = 480;
    const facingMode = 'environment';
    const success = (video) => {
        assert.ok(video,"Successfully created video element");
        assert.ok(video.srcObject, "Check the source object");
        assert.deepEqual(video.srcObject.getTracks().length,1, "Ensure we only get one Track back ... ");
        assert.deepEqual(video.srcObject.getVideoTracks().length,1, ".. and that that track is of type 'video'");
        const videoTrack = video.srcObject.getVideoTracks()[0];
        console.log("videoTrack.label: " + videoTrack.label);

        assert.ok(videoTrack.getSettings(), "Check if the video track has settings available");
        const videoTrackSettings = videoTrack.getSettings();
        assert.deepEqual(videoTrackSettings.width, width, "Video width from constraints");
        assert.deepEqual(videoTrackSettings.height, height, "Video height from constraints");
        
        const supported = navigator.mediaDevices.getSupportedConstraints();
        // Mobile supports facingMode to be set. Desktop states that facingMode is supported but doesn't list the facing mode inside the settings and hence it will fail
        if(supported["facingMode"] && videoTrackSettings.facingMode)
            assert.deepEqual(videoTrackSettings.facingMode, facingMode, "Video facing mode from constraints");

        // Don't check video.src anymore because it should not be available in modern browsers
        //assert.ok(video.src);
        this.video = video;
        done();
    }
    const error = err => {
        assert.notOk(err);
        done();
    }

    const configuration = {
        onSuccess : success,
        onError : error,
        width : width,
        height : height,
        facingMode : facingMode

    };
    assert.timeout(10000);
    const done = assert.async();
    const video = ARController.getUserMedia(configuration);
    // The video element is lazy loading better to check it inside the success function
    assert.ok(video, "The created video element");
    // Add the video element to html
    document.body.appendChild(video);
});
QUnit.test("getUserMedia with max/min constraints", assert => {
    const width = {min: 320, max: 640};
    const height = {min: 240, max: 480};
    const facingMode = {ideal: 'environment'};
    const success = (video) => {
        this.video = video;
        const videoTrack = video.srcObject.getVideoTracks()[0];
        const videoTrackSettings = videoTrack.getSettings();
        assert.deepEqual(videoTrackSettings.width, width.max, "Video width from constraints");
        assert.deepEqual(videoTrackSettings.height, height.max, "Video height from constraints");

        done();
    }
    const error = err => {
        assert.notOk(err);
        done();
    }

    const configuration = {
        onSuccess : success,
        onError : error,
        width : width,
        height : height,
        facingMode : facingMode

    };
    assert.timeout(10000);
    const done = assert.async();
    const video = ARController.getUserMedia(configuration);
    // The video element is lazy loading better to check it inside the success function
    assert.ok(video, "The created video element");
    // Add the video element to html
    document.body.appendChild(video);
});
QUnit.test("getUserMedia with ideal constraints", assert => {
    const width = {min: 320, ideal: 640};
    const height = {min: 240, ideal: 480};
    const facingMode = {ideal: 'environment'};
    const success = (video) => {
        this.video = video;
        const videoTrack = video.srcObject.getVideoTracks()[0];
        const videoTrackSettings = videoTrack.getSettings();
        assert.deepEqual(videoTrackSettings.width, width.ideal, "Video width from constraints");
        assert.deepEqual(videoTrackSettings.height, height.ideal, "Video height from constraints");
        done();
    }
    const error = err => {
        assert.notOk(err);
        done();
    }

    const configuration = {
        onSuccess : success,
        onError : error,
        width : width,
        height : height,
        facingMode : facingMode

    };
    assert.timeout(10000);
    const done = assert.async();
    const video = ARController.getUserMedia(configuration);
    // The video element is lazy loading better to check it inside the success function
    assert.ok(video, "The created video element");
    // Add the video element to html
    document.body.appendChild(video);
});

QUnit.test("getUserMedia facing user", assert => {
    const facingMode = {ideal: 'user'};
    const success = (video) => {
        this.video = video;
        const videoTrack = video.srcObject.getVideoTracks()[0];
        const videoTrackSettings = videoTrack.getSettings();

        const supported = navigator.mediaDevices.getSupportedConstraints();
        // Mobile supports facingMode to be set. Desktop states that facingMode is supported but doesn't list the facing mode inside the settings and hence it will fail
        if(supported["facingMode"] && videoTrackSettings.facingMode)
            assert.deepEqual(videoTrackSettings.facingMode, facingMode.ideal, "Video facing mode from constraints");
        done();
    }
    const error = err => {
        assert.notOk(err);
        done();
    }

    const configuration = {
        onSuccess : success,
        onError : error,
        facingMode : facingMode

    };
    assert.timeout(10000);
    const done = assert.async();
    const video = ARController.getUserMedia(configuration);
    // The video element is lazy loading better to check it inside the success function
    assert.ok(video, "The created video element");
    // Add the video element to html
    document.body.appendChild(video);
});