declare module THREEx {
    export class ArToolkitSource{
        constructor(
            config: {
                // to read from the webcam
                sourceType: 'webcam'
                // // to read from an image
                // sourceType : 'image',
                // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',
                // to read from a video
                // sourceType : 'video',
                // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
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
        detectionMode: "mono"
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