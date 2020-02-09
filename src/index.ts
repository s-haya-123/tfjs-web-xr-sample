import { VRM } from '@pixiv/three-vrm';
import * as THREE from "three";
import { loadVRM, animationWalk, setWalkPose,resetPose,resetWalkPose,setPose,animationCatched } from "./vrm";
import { start,runDetect } from './handdetection';
import * as handtrackjs from "handtrackjs";
import { ObjectLoader } from 'three';

document.getElementById('start')?.addEventListener('click',()=>{
  startAR();
  document.getElementById('start')!.remove();
});

function startAR() {
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(new THREE.Color("lightgrey"), 0);
  renderer.setSize(640, 480);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.left = "0px";

  document.body.appendChild(renderer.domElement);
  
  var scene = new THREE.Scene();
  
  var camera = new THREE.PerspectiveCamera(
    60,
    document.body.offsetWidth / document.body.offsetHeight,
    1,
    10);
  camera.position.z = 3;
  scene.add(camera);
  
  const light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1.0, 1.0, 1.0 ).normalize();
  scene.add(light);
  
  const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
    // displayWidth: document.body.offsetWidth,
    // displayHeight: document.body.offsetHeight
  });
  arToolkitSource.init(function onReady(){
    // onResize();
    setTimeout(()=>{onResize()},1000);
  });
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
  
  const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl:
      THREEx.ArToolkitContext.baseURL + "../data/data/camera_para.dat",
    detectionMode: "mono"
  });
  
  arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });
  
  const makerRoot = new THREE.Group();
  scene.add(makerRoot);
  
  
  const markerControls = new THREEx.ArMarkerControls(arToolkitContext, makerRoot, {
    type: "pattern",
    patternUrl: THREEx.ArToolkitContext.baseURL + "../data/data/patt.hiro",
  });

  scene.visible = false;
  
  let vrm: VRM;
  let hand = new THREE.Vector2(-2,-2);
  const raycaster = new THREE.Raycaster();
  const clock = new THREE.Clock();
  // const geometry = new (THREE as any).CubeGeometry(.1, .1, .1);
  // const material = new THREE.MeshNormalMaterial();
  setTimeout(async ()=>{
    await start();
    predict();
    timer(500);
  }, 2000);
  
  function timer(msec: number) {
    predict();
    setTimeout(()=>{
      timer(msec);
    },msec);
  }
  async function predict() {
    const predictions = await runDetect();
    setRaycastVec(hand,predictions);
  }
  function setRaycastVec(point: THREE.Vector2, predictions: handtrackjs.prediction[]) {
    // console.log(predictions)
    if (predictions.length) {
      const [x,y,width,height] = predictions[0].bbox;
      point.x = 1 - ( (x + width / 2) / document.body.offsetWidth) * 2;
      point.y = 1 - ( (y + height) / document.body.offsetHeight ) * 2;
      // if(mesh) mesh.visible = true;
    } else {
      mode = 'walk';
      resetPose(vrm!.humanoid!);
      setWalkPose(vrm!.humanoid!)
      vrm.scene.position.set(0,0,0);
      point.x = -4;
      point.y = -4;
      // if(mesh) mesh.visible = false;
    }
    // if(mesh) mesh.position.set(point.x, point.y,0);
  }
  setVRMOnScene(makerRoot, '../assets/sd9_3.vrm');
  async function setVRMOnScene(root: THREE.Group | THREE.Scene,fileName: string) {
    vrm = await loadVRM(fileName);
    root.add(vrm.scene);
    setWalkPose(vrm.humanoid!);
    animate();
  }
  let mode: 'walk' | 'catched' = 'walk'
  let origin: THREE.Vector2;
  let originVRM: THREE.Scene;
  function animate() {
    requestAnimationFrame( animate);
    if (arToolkitSource.ready === false) {
      return;
    }
    const deltaTime = clock.getDelta();
    arToolkitContext.update(arToolkitSource.domElement);
    scene.visible = camera.visible;
    raycaster.setFromCamera( hand, camera );
      
      if(vrm) {
            // calculate objects intersecting the picking ray
          const intersects = raycaster.intersectObjects( vrm.scene.children );
          for ( let i = 0; i < intersects.length; i++ ) {
              if(mode === 'walk') {
                  mode = 'catched';
                  resetWalkPose(vrm!.humanoid!);
                  setPose(vrm);
                  origin = hand.clone();
                  originVRM = vrm.scene.clone();
              }
              console.log('interact');
          }
          // blendShape(vrm, deltaTime);
          switch(mode) {
              case 'walk':
                  // console.log('walk')
                  animationWalk(vrm, clock,3,2);
                  break;
              case 'catched':
                // console.log('catched')
                  animationCatched(vrm.humanoid!, clock);
                  vrm.scene.position.x = (hand.x - origin.x) * 10;
                  vrm.scene.position.y = (hand.y - origin.y) * 10;
                  console.log(vrm.scene.position.x,vrm.scene.position.y)
                  break;
          }
      }
    renderer.render( scene, camera );
  }
}