declare module THREEx {
    export class ArToolkitSource{
        constructor(
            config: {
                // to read from the webcam
                sourceType: 'webcam'
                // resolution of at which we initialize the source image
                sourceWidth?: number,
                sourceHeight?: number,
                // resolution displayed for the source 
                displayWidth?: number,
                displayHeight?: number,
        });
        init(func: (arg: any) => void): void;
        onResizeElement(): void;
        copyElementSizeTo(element: HTMLCanvasElement): void;
        ready: boolean;
        domElement: HTMLElement;
    }
    export class ArToolkitContext{
        static baseURL: string;
        arController: any;
        constructor(config: {
        cameraParametersUrl: string,
        detectionMode: "mono",
        canvasWidth?: number,
        canvasHeight?: number
      });
      init(func: (arg: any) => void): void;
      getProjectionMatrix(): THREE.Matrix4;
      update(element: HTMLElement): void;
    }
    export class ArMarkerControls{
        constructor(context: ArToolkitContext, camera: THREE.Camera | THREE.Group, config: {
        type: string,
        patternUrl: string
        // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
        // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
        changeMatrixMode?: "cameraTransformMatrix"
      })
    }
}