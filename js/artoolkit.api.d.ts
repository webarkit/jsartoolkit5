// Type definitions for Javascript ARToolKit v5.x 
// Project: https://github.com/artoolkit/jsartoolkit5
// Definitions by: Hakan Dilek <https://github.com/hakandilek>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped  

declare module "jsartoolkit5" {
    export class ARController {
        width: number;
        height: number;
        camera: ARCameraParam;

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
    }

    interface ARControllerConstructor {
        new (width: number, height: number, cameraData: string | ARCameraParam): ARController;
    }

    export class ARCameraParam {
        onload(): void;
        load(cameraData: string): void;
    }

    export class ARMarkerInfo {
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

}
