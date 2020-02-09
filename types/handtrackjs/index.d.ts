declare module "handtrackjs" {
    export function load(param: any): HandtrackModel;
    export type prediction = {
        bbox: [number, number, number, number],
        class: "hand",
        score: number
    }
    export class HandtrackModel {
        detect(img: HTMLImageElement | HTMLVideoElement | CanvasImageData): prediction[];

    }
}