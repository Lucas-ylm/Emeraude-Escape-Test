import * as THREE from 'three';
import gsap from 'gsap';
import Controller from './Controller';


export default class Player {
  constructor(_options) {
    this.event = _options.event;
    this.scene = _options.scene;
    this.resources = _options.resources;
    this.parameter = _options.parameter;

    this.setPlayer();
    this.controller = new Controller(this);
  }

  moveBucket(direction) {
    const increment = 0.5;
    const duration = 0.25;

    const targetPositionX = direction === 'left' ? `-=${increment}` : `+=${increment}`;

    gsap.to([this.bucketBackground.position, this.bucketForeground.position], {
      x: targetPositionX,
      duration,
      ease: 'power2.out',
    });
  }

  setPlayer() {
    this.setMesh();
  }

  setMesh() {
    this.playerGeometry = new THREE.PlaneGeometry(2.5, 2);

    this.player = new THREE.Mesh(this.playerGeometry, new THREE.MeshBasicMaterial({ transparent: true, visible: false }));
    this.player.position.set(0, -3.8, 0);

    this.setAssets(this.playerGeometry);

    this.setColliders();

    this.scene.add(this.player);
  }

  setAssets(geometry) {
    this.bucketBackground = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: this.resources.items.player_background, transparent: true }));
    this.bucketBackground.position.x = -0.35;
    this.bucketBackground.position.y = 0.5;
    this.bucketBackground.renderOrder = 1;

    this.bucketForeground = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: this.resources.items.player_foreground, transparent: true }));
    this.bucketForeground.position.x = -0.35;
    this.bucketForeground.position.y = 0.5;
    this.bucketForeground.renderOrder = 3;

    this.player.add(this.bucketBackground, this.bucketForeground);
  }

  setColliders() {
    const box = new THREE.Box3().setFromObject(this.bucketForeground);
    this.bucketForeground.scale.set(0.8,0.8,0.8)
    this.bucketBackground.scale.set(0.8,0.8,0.8)
    this.player.userData.collider = box;
  }
 
  update(deltaT) {
  }
}
