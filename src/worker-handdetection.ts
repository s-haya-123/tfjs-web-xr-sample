import * as handtrackjs from "../assets/handtrackjs/index";
import * as comlink from "comlink";
const modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.3, // ioU threshold for non-max suppression
    scoreThreshold: 0.2,
    path: '../assets/handtrackjs/web_model/model.json'
  };

let model: handtrackjs.HandtrackModel;
let canvas: OffscreenCanvas;
let ctx: OffscreenCanvasRenderingContext2D | null;

comlink.expose({
    async init(width: number, height: number) {
        model = await handtrackjs.load(modelParams);
        canvas = new OffscreenCanvas(width,height);
        console.log(canvas);
        ctx = canvas.getContext('2d');
        return;
    },
    async detect(bitmap: ImageBitmap) {
        ctx?.drawImage(bitmap,0,0);
        const predictions = await model.detect(canvas as any);
        return predictions;
    }
})