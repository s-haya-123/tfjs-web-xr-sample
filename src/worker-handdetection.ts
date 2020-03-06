/*
    アプデートしたhandtrack.jsを利用して、
    WebWorker上で動作させる
*/
import * as handtrackjs from "../assets/handtrackjs/index";
import * as comlink from "comlink";

const modelParams = {
    flipHorizontal: true,
    maxNumBoxes: 1,
    iouThreshold: 0.3,
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
        ctx = canvas.getContext('2d');
        return;
    },
    async detect(bitmap: ImageBitmap) {
        ctx?.drawImage(bitmap,0,0);
        const predictions = await model.detect(canvas as any);
        return predictions;
    }
})