import * as THREE from 'three';
import { OBB } from "three/examples/jsm/math/OBB";

export default class Corn {
    constructor(_options){
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;

        this.goodItems = [];
        this.badItems = [];
        this.bonusItems = [];

        this.setAssets();
    }

    setAssets(){
        this.bonusPopCorn = this.resources.items.popcorn_bonus;

        this.goodPopCorns = [this.resources.items.popcorn_good_1, this.resources.items.popcorn_good_2, this.resources.items.popcorn_good_3]
        
        this.badPopCorns = [this.resources.items.popcorn_bad_1, this.resources.items.popcorn_bad_2, this.resources.items.popcorn_bad_3]
    }

    setItem(posX){
        const geometry = new THREE.PlaneGeometry(.5, .5);
        
        const material = new THREE.MeshBasicMaterial({color: '#FFFFFF', transparent: true})

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(posX,6,0);

        mesh.renderOrder = 2;
        mesh.userData.canCollideTop = true;
        mesh.userData.canCollideSide = true;
        mesh.userData.collidedTop = false;
        mesh.userData.collidedSide = false;
        mesh.userData.collidedMiddle = false;
        mesh.userData.pointAdded = false;

        const boundingBox = new THREE.Box3().setFromObject(mesh);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const scale = new THREE.Vector3(1, 1, 1);
        size.multiply(scale);
        const boundary = new OBB(center, size, mesh.rotation);
        mesh.userData.boundary = boundary;

        const wireframeGeometry = new THREE.WireframeGeometry(geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        mesh.add(wireframe);

        this.chooseAssets(mesh);

        this.scene.add(mesh);
        this.goodItems.push(mesh);

    }

    chooseAssets(mesh){
        const randomType = Math.random();

        const randomAsset = Math.floor(Math.random() * 2.99);

        const randomSpeed = (Math.random() + .2) * .004

        if(randomType < .05){
            mesh.material.map = this.bonusPopCorn;
            mesh.userData.speed = .0045;
            mesh.name = 'bonus'
            this.bonusItems.push(mesh)
        } else if(randomType < .35) {
            mesh.material.map = this.badPopCorns[randomAsset];
            mesh.userData.speed = randomSpeed;
            mesh.name = 'bad'
            this.badItems.push(mesh)
        } else {
            mesh.material.map = this.goodPopCorns[randomAsset];
            mesh.userData.speed = randomSpeed;
            mesh.name = 'good'
            this.goodItems.push(mesh)
        }
    }
}