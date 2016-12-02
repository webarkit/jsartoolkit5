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
    }

    interface ARControllerConstructor {
        new (width: number, height: number, cameraData: string | ARCameraParam): ARController;
    }


    export interface ARCameraParam {

    }

}
