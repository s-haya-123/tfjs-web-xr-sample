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
                vrm.scene.scale.set(1.5,1.5,1.5);
                resolve(vrm);
            },
            ( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),
        
            // called when loading has errors
            ( error ) => {
                console.error( error );
                reject(error);
            }
        );
    });
}

export function setPose(humanoid: VRMHumanoid) {
    const chest = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Chest)!;
    const neck = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Neck)!;
    const rightArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm)!;
    const leftArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm)!;
    const rightUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperLeg)!;
    const rightLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerLeg)!;
    const leftUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperLeg)!;
    const leftLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerLeg)!;
    neck.rotation.x += 1.5;
    chest.rotation.x -= 1.0;
    rightArm.rotation.y += 0.5;
    leftArm.rotation.y -= 0.5;

    leftUpperLeg.rotation.z -= 0.3;
    leftLowerLeg.rotation.x -= 0.3;
    leftUpperLeg.rotation.x += 0.5;
    rightUpperLeg.rotation.z += 0.3;
    rightLowerLeg.rotation.x -= 0.5;
    rightUpperLeg.rotation.x -= 0.2;
}

export function animationLeg(humanoid: VRMHumanoid, clock: THREE.Clock) {
    const s = Math.sin( Math.PI * clock.elapsedTime );
    const rightArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm)!;
    const leftArm = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm)!;
    const rightUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperLeg)!;
    // const rightLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightLowerLeg)!;
    const leftUpperLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperLeg)!;
    // const leftLowerLeg = humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftLowerLeg)!;
    leftArm.rotation.z = 0.5 - 0.2 * s;
    rightArm.rotation.z = 0.5 + 0.3 * s;
    rightUpperLeg.rotation.x = 0.5 + 0.5 * s;
    leftUpperLeg.rotation.x = 0.5 - 0.5 * s;
}