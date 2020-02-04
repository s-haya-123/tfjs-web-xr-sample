import * as THREE from "three";

// init renderer
var renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setClearColor(new THREE.Color("lightgrey"), 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0px";
renderer.domElement.style.left = "0px";
renderer.domElement.style.width = `${window.innerWidth}px`;
renderer.domElement.style.height = `${window.innerWidth}px`;
document.body.appendChild(renderer.domElement);
// array of functions for the rendering loop
var onRenderFcts: any = [];
// init scene and camera
var scene = new THREE.Scene();
//////////////////////////////////////////////////////////////////////////////////
//		Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////
// Create a camera
var camera = new THREE.PerspectiveCamera(
  60,
  document.body.offsetWidth / document.body.offsetHeight,
  1,
  10);
camera.position.z = 3;
scene.add(camera);
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
light.position.set(0, 1, 0);
scene.add(light);
////////////////////////////////////////////////////////////////////////////////
//          handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////
var arToolkitSource = new THREEx.ArToolkitSource({
  // to read from the webcam
  sourceType: "webcam"
  // // to read from an image
  // sourceType : 'image',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',
  // to read from a video
  // sourceType : 'video',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
});
arToolkitSource.init(function onReady() {
  setTimeout(()=>{onResize()},1000);
});
// handle resize
window.addEventListener("resize", function() {
  onResize();
});
function onResize() {
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
  }
}

// create atToolkitContext
var arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl:
    THREEx.ArToolkitContext.baseURL + "../data/data/camera_para.dat",
  detectionMode: "mono"
});
// initialize it
arToolkitContext.init(function onCompleted() {
  // copy projection matrix to camera
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});
// update artoolkit on every frame
onRenderFcts.push(function() {
  if (arToolkitSource.ready === false) return;
  arToolkitContext.update(arToolkitSource.domElement);
  // update scene.visible if the marker is seen
  scene.visible = camera.visible;
});
const makerRoot = new THREE.Group();
scene.add(makerRoot);

// init controls for camera
var markerControls = new THREEx.ArMarkerControls(arToolkitContext, makerRoot, {
  type: "pattern",
  patternUrl: THREEx.ArToolkitContext.baseURL + "../data/data/patt.hiro",
  // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
  // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
  // changeMatrixMode: "cameraTransformMatrix"
});
// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false;

// add a torus knot
var geometry = new (THREE as any).CubeGeometry(1, 1, 1);
var material = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
});
var mesh = new THREE.Mesh(geometry, material);
mesh.position.y = geometry.parameters.height / 2;

makerRoot.add(mesh);

onRenderFcts.push(function(delta: number) {
  mesh.rotation.x += Math.PI * delta;
  mesh.rotation.y += Math.PI * delta;
});

// render the scene
onRenderFcts.push(function() {
  renderer.render(scene, camera);
});
// run the rendering loop
var lastTimeMsec: number;
requestAnimationFrame(function animate(nowMsec) {
  // keep looping
  requestAnimationFrame(animate);

  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec = nowMsec;
  // call each update function
  onRenderFcts.forEach(function(onRenderFct: (a: number, b: number) => void) {
    onRenderFct(deltaMsec / 1000, nowMsec / 1000);
  });
});
