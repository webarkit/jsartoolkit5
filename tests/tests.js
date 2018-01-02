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
    }
});
QUnit.test("Create ARController default", assert => {
    const videoWidth = 640, videoHeight = 480;
    const arController = new ARController(videoWidth, videoHeight, this.cameraPara);
    this.checkDefault(arController);

    assert.deepEqual(arController.cameraParam, this.cameraPara, "Check the default values: cameraPara");
    assert.deepEqual(arController.videoWidth, videoWidth, "Check the default values: videoWidth");
    assert.deepEqual(arController.videoHeight, videoHeight, "Check the default values: videoHeight");
    assert.notOk(arController.image, "Check the default values: image === undefined");

    assert.deepEqual(arController.canvas.width, videoWidth,"Check the default values: canvas.width");
    assert.deepEqual(arController.canvas.height, videoHeight, "Check the default values: canvas.height");

});
QUnit.test("Create ARController track image", assert => {
    const arController = new ARController(v1, this.cameraPara);
    this.checkDefault(arController);

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
    assert.timeout(500);
    //ARController calls _initialize, which in turn contains a timeOut-function that waits for 1ms 
    const done = assert.async();
    const arController = new ARController(videoWidth, videoHeight, cameraParaUrl);
    arController.onload = (err) => {
        console.log("ARC onload");
        assert.notOk(err, "no error");
        assert.ok(true, "successfully loaded");
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
    assert.timeout(500);
    //ARController calls _initialize, which in turn contains a timeOut-function that waits for 1ms 
    const done = assert.async();
    const arController = new ARController(videoWidth, videoHeight, cameraParaUrl);
    arController.onload = (err) => {
        assert.deepEqual(err, 404, "error while loading");
        done();
    };
});
QUnit.test("Create ARController empty", assert => {
    assert.timeout(500);
    const done = assert.async();
    const arController = new ARController();
    arController.onload = (err) => {
        assert.deepEqual(err, 404, "error while loading");
        done();
    };
    assert.ok(false,"TODO");
});