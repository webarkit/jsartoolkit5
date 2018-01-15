// Type definitions for Javascript ARToolKit v5.x 
// Project: https://github.com/artoolkit/jsartoolkit5
// Definitions by: Hakan Dilek <https://github.com/hakandilek>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped  

import { Scene, Renderer } from 'three';
import { ARCameraParam } from 'jsartoolkit5';
import { ARControllerStatic} from 'jsartoolkit5';

export interface ARControllerStatic {
  getUserMediaThreeScene(config: GetUserMediaThreeSceneConfig): HTMLVideoElement;
}

declare class GetUserMediaThreeSceneConfig {
  width?: number; height?: number;
  maxARVideoSize?: number;
  cameraParam: string | ARCameraParam;
  onSuccess: GetUserMediaThreeSceneConfigSuccessHandler;
}

type GetUserMediaThreeSceneConfigSuccessHandler = (arScene, arController, arCamera) => void;

export interface ARThreeScene {
  scene: Scene;
  process(): void;
  renderOn (renderer: Renderer);
}