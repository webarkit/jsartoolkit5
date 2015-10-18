#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(constant_bindings) {

	function("setup", &setup);
	function("process", &process);
	function("teardown", &teardown);

	// TODO: handle pointer return
	// function("setDebugMode", &setDebugMode, allow_raw_pointers());

	function("_addMarker", &addMarker);
	function("_addMultiMarker", &addMultiMarker);
	function("_getMultiMarkerNum", &getMultiMarkerNum);

	function("_loadCamera", &loadCamera);


	function("setScale", &setScale);
	function("getScale", &getScale);

	function("setMarkerWidth", &setMarkerWidth);
	function("getMarkerWidth", &getMarkerWidth);

	/* AR Toolkit C APIS */
	function("setProjectionNearPlane", &setProjectionNearPlane);
	function("getProjectionNearPlane", &getProjectionNearPlane);

	function("setProjectionFarPlane", &setProjectionFarPlane);
	function("getProjectionFarPlane", &getProjectionFarPlane);

	function("setThresholdMode", &setThresholdMode);
	function("getThresholdMode", &getThresholdMode);

	function("setThreshold", &setThreshold);
	function("getThreshold", &getThreshold);

	function("setPatternDetectionMode", &setPatternDetectionMode);
	function("getPatternDetectionMode", &getPatternDetectionMode);

	function("setPattRatio", &setPattRatio);
	function("getPattRatio", &getPattRatio);

	function("setMatrixCodeType", &setMatrixCodeType);
	function("getMatrixCodeType", &getMatrixCodeType);

	function("setLabelingMode", &setLabelingMode);
	function("getLabelingMode", &getLabelingMode);

	function("setImageProcMode", &setImageProcMode);
	function("getImageProcMode", &getImageProcMode);


	/* arDebug */
	constant("AR_DEBUG_DISABLE", AR_DEBUG_DISABLE);
	constant("AR_DEBUG_ENABLE", AR_DEBUG_ENABLE);
	constant("AR_DEFAULT_DEBUG_MODE", AR_DEFAULT_DEBUG_MODE);

	/* arLabelingMode */
	constant("AR_LABELING_WHITE_REGION", AR_LABELING_WHITE_REGION);
	constant("AR_LABELING_BLACK_REGION", AR_LABELING_BLACK_REGION);
	constant("AR_DEFAULT_LABELING_MODE", AR_DEFAULT_LABELING_MODE);

	/* for arlabelingThresh */
	constant("AR_DEFAULT_LABELING_THRESH", AR_DEFAULT_LABELING_THRESH);

	/* for arImageProcMode */
	constant("AR_IMAGE_PROC_FRAME_IMAGE", AR_IMAGE_PROC_FRAME_IMAGE);
	constant("AR_IMAGE_PROC_FIELD_IMAGE", AR_IMAGE_PROC_FIELD_IMAGE);
	constant("AR_DEFAULT_IMAGE_PROC_MODE", AR_DEFAULT_IMAGE_PROC_MODE);

	/* for arPatternDetectionMode */
	constant("AR_TEMPLATE_MATCHING_COLOR", AR_TEMPLATE_MATCHING_COLOR);
	constant("AR_TEMPLATE_MATCHING_MONO", AR_TEMPLATE_MATCHING_MONO);
	constant("AR_MATRIX_CODE_DETECTION", AR_MATRIX_CODE_DETECTION);
	constant("AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX", AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX);
	constant("AR_TEMPLATE_MATCHING_MONO_AND_MATRIX", AR_TEMPLATE_MATCHING_MONO_AND_MATRIX);
	constant("AR_DEFAULT_PATTERN_DETECTION_MODE", AR_DEFAULT_PATTERN_DETECTION_MODE);

	/* for arMarkerExtractionMode */
	constant("AR_USE_TRACKING_HISTORY", AR_USE_TRACKING_HISTORY);
	constant("AR_NOUSE_TRACKING_HISTORY", AR_NOUSE_TRACKING_HISTORY);
	constant("AR_USE_TRACKING_HISTORY_V2", AR_USE_TRACKING_HISTORY_V2);
	constant("AR_DEFAULT_MARKER_EXTRACTION_MODE", AR_DEFAULT_MARKER_EXTRACTION_MODE);

	/* for arGetTransMat */
	constant("AR_MAX_LOOP_COUNT", AR_MAX_LOOP_COUNT);
	constant("AR_LOOP_BREAK_THRESH", AR_LOOP_BREAK_THRESH);

	constant("AR_LOG_LEVEL_DEBUG", AR_LOG_LEVEL_DEBUG);
	constant("AR_LOG_LEVEL_INFO", AR_LOG_LEVEL_INFO);
	constant("AR_LOG_LEVEL_WARN", AR_LOG_LEVEL_WARN);
	constant("AR_LOG_LEVEL_ERROR", AR_LOG_LEVEL_ERROR);
	constant("AR_LOG_LEVEL_REL_INFO", AR_LOG_LEVEL_REL_INFO);

}