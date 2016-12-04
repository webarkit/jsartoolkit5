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
        getMarkerNum(): void;
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

}
