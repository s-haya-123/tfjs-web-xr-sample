import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { VRM, VRMSchema, VRMHumanoid } from '@pixiv/three-vrm'


export function loadVRM(fileName: string): Promise<VRM> {
    return new Promise((resolve, reject)=>{
        let vrm: VRM;
        const loader = new GLTFLoader();
        loader.load(
            fileName,
            async (gltf) => {
                vrm = await VRM.from(gltf);
                vrm.scene.rotation.y += 3;
                vrm.scene.rotation.x -= 0.5;
                resolve(vrm);
            },
            ( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),
            ( error ) => {
                console.error( error );
                reject(error);
            }
        );
    });
}

export function setPose(vrm: VRM) {
    const humanoid = vrm.humanoid!;
    const chest = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Chest)!;
    const neck = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Neck)!;
    const rightArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm)!;
    const leftArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm)!;
    const rightUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperLeg)!;
    const rightLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerLeg)!;
    const leftUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperLeg)!;
    const leftLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerLeg)!;
    vrm.scene.rotation.set(0.7,3,0);
    neck.rotation.x = 1.5;
    chest.rotation.x = -1.0;
    rightArm.rotation.y = 0.5;
    leftArm.rotation.y = -0.5;

    leftUpperLeg.rotation.z = -0.3;
    leftLowerLeg.rotation.x = -0.3;
    leftUpperLeg.rotation.x = 0.5;
    rightUpperLeg.rotation.z = 0.3;
    rightLowerLeg.rotation.x = -0.5;
    rightUpperLeg.rotation.x = -0.2;
}
export function resetPose(humanoid: VRMHumanoid) {
    const chest = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Chest)!;
    const neck = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Neck)!;
    const rightArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm)!;
    const leftArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm)!;
    const rightUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperLeg)!;
    const rightLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerLeg)!;
    const leftUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperLeg)!;
    const leftLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerLeg)!;
    neck.rotation.x = 0;
    chest.rotation.x = 0;
    rightArm.rotation.y = 0;
    leftArm.rotation.y = 0;

    leftUpperLeg.rotation.z = 0;
    leftLowerLeg.rotation.x = 0;
    leftUpperLeg.rotation.x = 0;
    rightUpperLeg.rotation.z = 0;
    rightLowerLeg.rotation.x = 0;
    rightUpperLeg.rotation.x = 0;
}

export function setWalkPose(humanoid: VRMHumanoid) {
    const rightArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm)!;
    const leftArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm)!;
    rightArm.rotation.z = -1.2;
    leftArm.rotation.z = 1.2;
}
export function resetWalkPose(humanoid: VRMHumanoid) {
    const rightArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm)!;
    const leftArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm)!;
    rightArm.rotation.z = 0;
    leftArm.rotation.z = 0;
}
export function animationWalk(vrm: VRM, clock: THREE.Clock, speed = 3, r = 1) {
    animationWalkLeg(vrm!.humanoid!, clock, speed);
    setVrmPosition(vrm, clock, speed, r)
}
function setVrmPosition(vrm: VRM, clock: THREE.Clock, speed: number, r: number) {
    const angle = Math.PI * clock.elapsedTime * speed * 0.1;
    const upDownCicle =  Math.sin(Math.PI * clock.elapsedTime * speed * 2 + Math.PI /2);
    const x = - r * Math.cos( angle );
    const y = - r * Math.sin( angle );
    vrm.scene.position.set(x, 0.02 * (1 + upDownCicle),y);
    vrm.scene.rotation.set(0,-angle,0);
}
function animationWalkLeg(humanoid: VRMHumanoid, clock: THREE.Clock, speed: number) {
    const s = Math.sin( Math.PI * clock.elapsedTime * speed);
    const c = Math.cos( Math.PI * clock.elapsedTime * speed);
    const s_high = Math.sin( Math.PI * clock.elapsedTime * speed * 2 + Math.PI / 2);
    const rightArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm)!;
    const leftArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm)!;
    const neck = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Neck)!;
    const rightUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperLeg)!;
    const rightLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerLeg)!;
    const leftUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperLeg)!;
    const leftLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerLeg)!;
    leftArm.rotation.x =   0.5 * s;
    rightArm.rotation.x = - 0.3 * s;
    rightUpperLeg.rotation.x = 0.5 * s;
    neck.rotation.z = - 0.1 * s;
    rightLowerLeg.rotation.x = s >0 && c>0 || s < 0 && c> 0? -0.5 * (1 + s_high): 0;
    leftUpperLeg.rotation.x = - 0.5 * s;
    leftLowerLeg.rotation.x = s <0 && c<0 || s > 0 && c<0 ?  - 0.5 * (1 + s_high): 0;
}
export function animationCatched(humanoid: VRMHumanoid, clock: THREE.Clock, speed = 2) {
    const s = Math.sin( Math.PI * clock.elapsedTime * speed);
    const s_high = Math.sin( Math.PI * clock.elapsedTime * speed * 2 + Math.PI / 2);
    const rightArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm)!;
    const leftArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm)!;
    const neck = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Neck)!;
    const rightUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperLeg)!;
    const rightLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerLeg)!;
    const leftUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperLeg)!;
    const leftLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerLeg)!;
    neck.rotation.z = 0.1 * s;
    leftArm.rotation.x = 0.5 + 0.5 * s;
    rightArm.rotation.x = 0.5 - 0.5 * s;
    rightUpperLeg.rotation.x = 0.5 + 0.5 * s;
    rightLowerLeg.rotation.x =  -0.2 * (1 + s_high);
    leftUpperLeg.rotation.x = 0.5 - 0.5 * s;
    leftLowerLeg.rotation.x = - 0.2 * (1 + s_high);
}