// import * as handtrackjs from "../assets/handtrackjs/index";
import * as handtrackjs from "handtrackjs";

const modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6,
    path: '../assets/handtrackjs/web_model/model.json'
  };

export function startVideo(video: HTMLVideoElement) {
    video.width = video.width || document.body.offsetWidth;
    video.height = video.height || document.body.offsetHeight;
    return;
}
let model: handtrackjs.HandtrackModel;
let video: HTMLVideoElement;
export async function start() {
    console.log("detect-hand start");
    model = await handtrackjs.load(modelParams);
    video = document.getElementById("arjs-video") as HTMLVideoElement;
    startVideo(video);
    return {model, video};
}
export async function runDetect() {
    const predictions = await model.detect(video);
    return predictions;
}