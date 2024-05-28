import {
    Mesh,
    BoxGeometry,
    MeshLambertMaterial,
    Texture
} from 'three';

import {
    Vec3,
    Box,
    Body,
    Quaternion,
    Material,
    World // cannon-es에서 World를 가져와야 함
} from 'cannon-es';

interface MeshObjectInfo {
    onLoading?: (percent: number) => void;
    name: string;
    width?: number;
    height?: number;
    depth?: number;
    color?: string;
    texture?: Texture;
    differenceY?: number;
    x?: number;
    y?: number;
    z?: number;
    rotationX?: number;
    rotationY?: number;
    rotationZ?: number;
    mass?: number;
    cannonMaterial?: Material;
    cannonWorld?: World; // cannonWorld를 World 타입으로 변경
    loadingCallback?: (percent: number) => void;
    light?: boolean;
    modelSrc?: string;
    loader?: any;
    scene?: any;
}

export class MeshObject {
    name: string;
    width: number;
    height: number;
    depth: number;
    color: string;
    texture: Texture;
    differenceY: number;
    x: number;
    y: number;
    z: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    mass: number;
    cannonMaterial: Material;
    cannonWorld: World; // cannonWorld를 World 타입으로 변경
    loadingCallback: (percent: number) => void;
    light: boolean;
    mesh: any;
    cannonBody!: Body;

    constructor(info: MeshObjectInfo) {
        this.name = info.name;
        this.width = info.width || 1;
        this.height = info.height || 1;
        this.depth = info.depth || 1;
        this.color = info.color || 'white';
        this.texture = info.texture! || null;
        this.differenceY = info.differenceY || 0.4;
        this.x = info.x || 0;
        this.y = info.y || this.height / 2 + this.differenceY;
        this.z = info.z || 0;
        this.x *= 1;
        this.y *= 1;
        this.z *= 1;
        this.rotationX = info.rotationX || 0;
        this.rotationY = info.rotationY || 0;
        this.rotationZ = info.rotationZ || 0;

        this.mass = info.mass || 0;
        this.cannonMaterial = info.cannonMaterial!;
        this.cannonWorld = info.cannonWorld!;

        this.loadingCallback = info.onLoading!;
        this.light = info.light || false;

        if(info.modelSrc) {
            info.loader.load(
                info.modelSrc,
                (glb: any) => {
                    glb.scene.traverse((child: any) => {
                        if(this.cannonWorld != null && child.isMesh) {
                            child.castShadow = true;
                            this.setEachCannonBody(child);
                        }
                    });
                    this.mesh = glb.scene;
                    this.mesh.castShadow = true;
                    if(this.light){
                        this.mesh.position.x = this.x;
                        this.mesh.position.z = this.z;
                    }
                    info.scene.add(this.mesh);
                }, 
                (xhr: any) => {
                    const percentLoaded = Math.round((xhr.loaded / 150854276) * 100);
                    if(this.loadingCallback != null){
                        this.loadingCallback(percentLoaded); 
                    }
                }, 
                (error: any) => {
                    console.log(error);
                }
            );
        } else {
            const geometry = new BoxGeometry(this.width, this.height, this.depth);
            const material = new MeshLambertMaterial({
                map: this.texture,
                color: !this.texture ? this.color : '',
            })
            this.mesh = new Mesh(geometry, material);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.mesh.position.set(this.x, this.y, this.z);
            this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
            if(this.cannonMaterial != null){
                this.setCannonBody();
            }
            info.scene.add(this.mesh);
        }
    }

    setCannonBody() {
        this.cannonBody = new Body({
            mass: this.mass,
            position: new Vec3(this.x, this.y, this.z),
            shape: new Box(new Vec3(this.width/2, this.height/2, this.depth/2)),
            material: this.cannonMaterial
        });

        this.cannonWorld.addBody(this.cannonBody); // cannonWorld에 추가
    }

    setEachCannonBody(child: Mesh) {
        this.x = child.scale.x;
        this.y = child.scale.y;
        this.z = child.scale.z;
        const quaternion = new Quaternion().setFromEuler(child.rotation.x, child.rotation.y, child.rotation.z, "XYZ");
        this.cannonBody = new Body({
            mass: 0,
            position: new Vec3(child.position.x, child.position.y - 3, child.position.z),
            quaternion: quaternion,
            shape: new Box(new Vec3(this.x, this.y + 5, this.z)),
            material: this.cannonMaterial,
        });
        this.cannonWorld.addBody(this.cannonBody);
    }
}
