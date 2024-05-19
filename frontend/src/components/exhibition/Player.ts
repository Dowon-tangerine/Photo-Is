import {
    Mesh,
    BoxGeometry,
    MeshBasicMaterial,
    MathUtils,
    Scene
} from 'three';

import {
    Vec3,
    Box,
    Body,
    Material,
    World
} from 'cannon-es';

interface PlayerInfo {
    name: string;
    width?: number;
    height?: number;
    depth?: number;
    color?: string;
    differenceY?: number;
    x?: number;
    y?: number;
    z?: number;
    rotationX?: number;
    rotationY?: number;
    rotationZ?: number;
    mass?: number;
    cannonMaterial?: Material;
    cannonWorld: World;
    scene: Scene;
}

export class Player {
    name: string;
    width: number;
    height: number;
    depth: number;
    color: string;
    differenceY: number;
    x: number;
    y: number;
    z: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    mass: number;
    cannonMaterial?: Material;
    cannonWorld: World;
    mesh: Mesh;
    cannonBody?: Body;

    constructor(info: PlayerInfo) {
        this.name = info.name;
        this.width = info.width || 1;
        this.height = info.height || 1;
        this.depth = info.depth || 1;
        this.color = info.color || 'white';
        this.differenceY = info.differenceY || 0.4;
        this.x = info.x || 0;
        this.y = info.y || this.height / 2 + this.differenceY;
        this.z = info.z || 0;
        this.rotationX = info.rotationX || 0;
        this.rotationY = info.rotationY || 0;
        this.rotationZ = info.rotationZ || 0;
        this.mass = info.mass || 0;
        this.cannonMaterial = info.cannonMaterial;
        this.cannonWorld = info.cannonWorld;

        const geometry = new BoxGeometry(this.width, this.height, this.depth);
        const material = new MeshBasicMaterial({
            transparent: true,
            opacity: 0
        });
        this.mesh = new Mesh(geometry, material);
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
        this.setCannonBody();
        info.scene.add(this.mesh);
    }

    walk(value: number, direction: 'left' | 'right' | 'forward' | 'backward'): void {
        if (direction === 'left') {
            this.rotationY -= MathUtils.degToRad(90);
        }
        if (direction === 'right') {
            this.rotationY += MathUtils.degToRad(90);
        }
        this.x += Math.sin(this.rotationY) * value;
        this.z += Math.cos(this.rotationY) * value;
        if (this.cannonBody) {
            this.cannonBody.position.x = this.x;
            this.cannonBody.position.z = this.z;
            this.mesh.position.x = this.x;
            this.mesh.position.z = this.z;
        }
    }

    setCannonBody(): void {
        this.cannonBody = new Body({
            mass: this.mass,
            position: new Vec3(this.x, this.y, this.z),
            shape: new Box(new Vec3(this.width / 2, this.height / 2, this.depth / 2)),
            material: this.cannonMaterial
        });

        this.cannonWorld.addBody(this.cannonBody);
    }
}
