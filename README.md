# ARToolKit.js

Emscripten port of [ARToolKit](https://github.com/artoolkit/artoolkit5) to JavaScript.

## Project Structure

- web (demos and examples using ARToolKit.js)
- tools (build scripts for building ARToolKit.js)
- emscripten (source code for ARToolKit.js)
- builds (compiled versions of ARToolKit.js)
- docs (documentation, coming...)

## Build Instructions

1. Install Emscripten (w/ node.js + python)
2. Configure parameters in jsartoolkit/tools/makem.js
3. Run `node jsartoolkit/tools/makem.js`
	(Make sure EMSCRIPTEN env variable is set. E.g. EMSCRIPTEN=/usr/lib/emsdk_portable/emscripten/master/ node jsartoolkit/tools/makem)
4. The built ASM.js files are in jsartoolkit/build. There's a build with debug symbols in artoolkit.debug.js and the optimized build with bundled JS API in artoolkit.min.js.

# ARToolKit JS API
`<script async src="jsartoolkit/build/artoolkit.min.js></script>` - include optimized ASM.js build and JS API

# ARToolKit JS debug build
`<script src="jsartoolkit/build/artoolkit.debug.js></script>` - include debug build

`<script src="jsartoolkit/js/artoolkit.api.js></script>` - include JS API

# ARToolKit Three.js helper API
`<script async src="jsartoolkit/build/artoolkit.min.js></script>` - include optimized ASM.js build and JS API

`<script async src="three.min.js"></script>` - include Three.js

`<script async src="jsartoolkit/js/artoolkit.three.js></script>` - include Three.js helper API

    <script>
    window.ARThreeOnLoad = function() {
        console.log("Three.js helper API loaded");
    };

    if (window.ARController && window.ARController.getUserMediaThreeScene) {
        ARThreeOnLoad();
    }
    </script>

# Examples

See jsartoolkit/examples for examples on using the raw API and the Three.js helper API.

The basic operation goes like this: load a camera param, create an AR controller, set pattern detection mode, load pattern markers or multimarkers if needed, add a getMarker event listener, and call the AR controller's process method with the image.

    <script src="jsartoolkit/build/artoolkit.min.js"></script>
    <script>
        var param = new ARCameraParam();
        param.onload = function() {
            var img = document.getElementById('my-image');
            var ar = new ARController(img.width, img.height, param);

            // Set pattern detection mode to detect both pattern markers and barcode markers.
            // This is more error-prone than detecting only pattern markers (default) or only barcode markers.
            //
            // For barcode markers, use artoolkit.AR_MATRIX_CODE_DETECTION
            // For pattern markers, use artoolkit.AR_TEMPLATE_MATCHING_COLOR
            // 
            ar.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX);

            ar.addEventListener('markerNum', function(ev) {
                console.log('got markers', markerNum);
            })
            ar.addEventListener('getMarker', function(ev) {
                console.log('found marker?', ev);
            })

            ar.loadMarker('Data/patt.hiro', function(marker) {
                console.log('loaded marker', marker);
                ar.process(img);
            });
        };
        param.src = 'Data/camera_para.dat';


## Public
*the calls your JS apps needs*
- `artoolkit.init(path, camera_param_path)` - load path for artoolkit emscripten files
- `artoolkit.onReady(callback)` - runs callback when artoolkit has completely downloaded, initalized and ready to run
- `artoolkit.setup(width, height);` - initalize a buffer size for a canvas of width & height
- `artoolkit.process(canvas);` - extracts a frame from a canvas and process it
- `artoolkit.debugSetup()` - enables debugging, adds a threshold image to the dom
- `artoolkit.getDetectedMarkers()` - returns an array of detected markers from last detection process
- `artoolkit.getCameraMatrix()` -
- `artoolkit.getTransformationMatrix()` -

## Internals

*calls called from emscripten runtime -> artoolkit.js*
- `artoolkit.onFrameMalloc(object)` - gets called when frame buffer gets allocated for canvas
- `artoolkit.onMarkerNum(number)` - gets called with the numbers of markers detected
- `artoolkit.onGetMarker(object, index)` - gets called with the marker struct for the positioned marker

*calls available from js -> emscripten*
- `_setup(width, height)`
- `_setThreshold(int)` - 0 to 255
- `_process()`
- `_setDebugMode(boolean)`
- `_addMarker(string)`
- `setThreshold`
- `setThresholdMode()` eg. `Module.setThresholdMode(Module.AR_LABELING_THRESH_MODE_AUTO_MEDIAN / AR_LABELING_THRESH_MODE_AUTO_OTSU );
- `setLabelingMode`
- `setPatternDetectionMode`
- `setMatrixCodeType()` : Eg. Module.setMatrixCodeType(Module.AR_MATRIX_CODE_3x3);
- `setImageProcMode`
- `setPattRatio`

## Examples
```
artoolkit.init('', 'camera_para.dat').onReady(function() {
  artoolkit.setProjectionNearPlane(1);
  artoolkit.setProjectionFarPlane(1000);
  artoolkit.setPatternDetectionMode(artoolkit.CONSTANTS.AR_MATRIX_CODE_DETECTION);
  artoolkit.setMatrixCodeType(artoolkit.CONSTANTS.AR_MATRIX_CODE_4x4);
})

artoolkit.init('', 'camera_para.dat').onReady(function() {
  artoolkit.addMarker('../bin/Data/patt.hiro', function(marker) {
    artoolkit.process(v);
  })
})
```

## Constants
*prepend all these constants with `Module.` or `artoolkit.CONSTANTS` to access them*
```
- AR_DEBUG_DISABLE
- AR_DEBUG_ENABLE
- AR_DEFAULT_DEBUG_MODE
- AR_LABELING_WHITE_REGION
- AR_LABELING_BLACK_REGION
- AR_DEFAULT_LABELING_MODE
- AR_DEFAULT_LABELING_THRESH
- AR_IMAGE_PROC_FRAME_IMAGE
- AR_IMAGE_PROC_FIELD_IMAGE
- AR_DEFAULT_IMAGE_PROC_MODE
- AR_TEMPLATE_MATCHING_COLOR
- AR_TEMPLATE_MATCHING_MONO
- AR_MATRIX_CODE_DETECTION
- AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX
- AR_TEMPLATE_MATCHING_MONO_AND_MATRIX
- AR_DEFAULT_PATTERN_DETECTION_MODE
- AR_USE_TRACKING_HISTORY
- AR_NOUSE_TRACKING_HISTORY
- AR_USE_TRACKING_HISTORY_V2
- AR_DEFAULT_MARKER_EXTRACTION_MODE
- AR_MAX_LOOP_COUNT
- AR_LOOP_BREAK_THRESH
- AR_MATRIX_CODE_3x3
- AR_MATRIX_CODE_3x3_HAMMING63 5
- AR_MATRIX_CODE_3x3_PARITY65 2
- AR_MATRIX_CODE_4x4
- AR_MATRIX_CODE_4x4_BCH_13_9_3 7
- AR_MATRIX_CODE_4x4_BCH_13_5_5 10
- AR_LABELING_THRESH_MODE_MANUAL
- AR_LABELING_THRESH_MODE_AUTO_MEDIAN
- AR_LABELING_THRESH_MODE_AUTO_OTSU
- AR_LABELING_THRESH_MODE_AUTO_ADAPTIVE
- AR_MARKER_INFO_CUTOFF_PHASE_NONE
- AR_MARKER_INFO_CUTOFF_PHASE_PATTERN_EXTRACTION
- AR_MARKER_INFO_CUTOFF_PHASE_MATCH_GENERIC
- AR_MARKER_INFO_CUTOFF_PHASE_MATCH_CONTRAST
- AR_MARKER_INFO_CUTOFF_PHASE_MATCH_BARCODE_NOT_FOUND
- AR_MARKER_INFO_CUTOFF_PHASE_MATCH_BARCODE_EDC_FAIL
- AR_MARKER_INFO_CUTOFF_PHASE_MATCH_CONFIDENCE
- AR_MARKER_INFO_CUTOFF_PHASE_POSE_ERROR
- AR_MARKER_INFO_CUTOFF_PHASE_POSE_ERROR_MULTI
- AR_MARKER_INFO_CUTOFF_PHASE_HEURISTIC_TROUBLESOME_MATRIX_CODES
```
