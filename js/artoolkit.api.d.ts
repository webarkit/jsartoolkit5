// Type definitions for Javascript ARToolKit v5.x 
// Project: https://github.com/artoolkit/jsartoolkit5
// Definitions by: Hakan Dilek <https://github.com/hakandilek>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped  

export declare class artoolkit {
    public static readonly AR_TEMPLATE_MATCHING_COLOR
    public static readonly AR_TEMPLATE_MATCHING_MONO
    public static readonly AR_MATRIX_CODE_DETECTION
    public static readonly AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX
    public static readonly AR_TEMPLATE_MATCHING_MONO_AND_MATRIX
}

export interface ARController {
    width: number;
    height: number;
    camera: ARCameraParam;
    videoHeight: number;
    videoWidth: number;

    constructor(width: number, height: number, cameraData: string | ARCameraParam);

    onload(): void;
    debugSetup(): void;
    process(image: any): void;
    getCameraMatrix(): ArrayLike<number>;
    detectMarker(videoNative): void;
    debugDraw(): void;
    getMarkerNum(): number;
    getMarker(index: number): ARMarkerInfo;
    getTransMatSquare(markerIndex: number, markerWidth: number, dst: Float64Array): void;
    getTransMatSquareCont(markerIndex: number, markerWidth: number, previousMarkerTransform: Float64Array, dst: Float64Array): void;
    transMatToGLMat(transMat: Float64Array, glMat: Float32Array | Float64Array, scale?: number): void;
    /**
        Set the pattern detection mode
 
        The pattern detection determines the method by which ARToolKit
        matches detected squares in the video image to marker templates
        and/or IDs. ARToolKit v4.x can match against pictorial "template" markers,
        whose pattern files are created with the mk_patt utility, in either colour
        or mono, and additionally can match against 2D-barcode-type "matrix"
        markers, which have an embedded marker ID. Two different two-pass modes
        are also available, in which a matrix-detection pass is made first,
        followed by a template-matching pass.
 
        @param {number} mode
            Options for this field are:
            AR_TEMPLATE_MATCHING_COLOR
            AR_TEMPLATE_MATCHING_MONO
            AR_MATRIX_CODE_DETECTION
            AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX
            AR_TEMPLATE_MATCHING_MONO_AND_MATRIX
            The default mode is AR_TEMPLATE_MATCHING_COLOR.
    */
    setPatternDetectionMode(mode: number): void;

}

//export declare interface ARControllerStatic{}

export declare class ARCameraParam {
    onload(): void;
    load(cameraData: string): void;
}

export declare class ARMarkerInfo {
    /**
     * 2D position (in camera image coordinates, origin at top-left) of the centre of the marker.
     */
    pos: number[];
    /**
     * Line equations for the 4 sides of the marker.
     */
    line: number[];
    /** 
     * 2D positions (in camera image coordinates, origin at top-left) of the corners of the marker. 
     * vertex[(4 - dir)%4][] is the top-left corner of the marker. Other vertices proceed clockwise from this. 
     * These are idealised coordinates (i.e. the onscreen position aligns correctly with the undistorted camera image.)
     */
    vertex: number[];
    /**
     * Area in pixels of the largest connected region, comprising the marker border and regions connected to it. Note that this is not the same as the actual onscreen area inside the marker border.
     */
    area: number;
    /** 
     * If pattern detection mode is either pattern mode OR matrix but not both, will be marker ID (>= 0) if marker is valid, or -1 if invalid.
     */
    id: number;
    /**
     * If pattern detection mode includes a pattern mode, will be marker ID (>= 0) if marker is valid, or -1 if invalid.
     */
    idPatt: number;
    /**
     * If pattern detection mode includes a matrix mode, will be marker ID (>= 0) if marker is valid, or -1 if invalid.
     */
    idMatrix: number;
    /**
     * If pattern detection mode is either pattern mode OR matrix but not both, and id != -1, will be marker direction (range 0 to 3, inclusive).
     */
    dir: number;
    /**
     * If pattern detection mode includes a pattern mode, and id != -1, will be marker direction (range 0 to 3, inclusive).
     */
    dirPatt: number;
    /**
     * If pattern detection mode includes a matrix mode, and id != -1, will be marker direction (range 0 to 3, inclusive).
     */
    dirMatrix: number;
    /**
     * If pattern detection mode is either pattern mode OR matrix but not both, will be marker matching confidence (range 0.0 to 1.0 inclusive) if marker is valid, or -1.0 if marker is invalid.
     */
    cf: number;
    /**
     * If pattern detection mode includes a pattern mode, will be marker matching confidence (range 0.0 to 1.0 inclusive) if marker is valid, or -1.0 if marker is invalid.
     */
    cfPatt: number;
    /**
     * If pattern detection mode includes a matrix mode, will be marker matching confidence (range 0.0 to 1.0 inclusive) if marker is valid, or -1.0 if marker is invalid.
     */
    cfMatrix: number;
    errorCorrected: number;
}
