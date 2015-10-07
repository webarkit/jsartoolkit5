# ARToolKit.js
Emscripten port of ARToolKit to JavaScript

## Project Structure

- web (demos and examples using ARToolKit.js)
- tools (build scripts for building ARToolKit.js)
- emscripten (source code for ARToolKit.js)
- builds (compiled versions of ARToolKit.js)
- docs (documentation, coming...)

## Build Instructions

1. Install Emscripten (w/ node.js + python)
2. Configure parameters in tools/makem.js
3. Run `node tools/makem.js`
	(Make sure EMSCRIPTEN env variable is set. E.g. EMSCRIPTEN=/usr/lib/emsdk_portable/emscripten/master/ node tools/makem)


# ARToolKit JS API
`<script src="common.js></script>` - include loading script and JS API

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