import * as THREE from 'three';

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

    setItem(posX) {
        const geometry = new THREE.PlaneGeometry(0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(posX, 6, 0);
        
        mesh.renderOrder = 2;
        mesh.userData.canCollideTop = true;
        mesh.userData.canCollideSide = true;
        mesh.userData.collidedTop = false;
        mesh.userData.collidedSide = false;
        mesh.userData.collidedMiddle = false;
        mesh.userData.pointAdded = false;
        
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