import * as THREE from 'three';
import gsap from 'gsap';
import Controller from './Controller';
import { Box3Helper, Box3 } from 'three';
import CollisionChecker from './World/CollisionChecker';
import { OBB } from 'three/examples/jsm/math/OBB';


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
    this.bucketBackground.renderOrder = 1;

    this.bucketForeground = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: this.resources.items.player_foreground, transparent: true }));
    this.bucketForeground.position.x = -0.35;
    this.bucketForeground.renderOrder = 3;

    this.player.add(this.bucketBackground, this.bucketForeground);
  }

  setColliders() {
    const topWidth = 1.25;
    const colliderHeight = 0.2;
    const colliderDepth = 0.1;
  
    const obbSize = new THREE.Vector3(topWidth, colliderHeight, colliderDepth);
    const obbCenter = new THREE.Vector3(0, -colliderHeight / 2, -colliderDepth / 2);
  
    const obbBox = new Box3();
    obbBox.setFromCenterAndSize(obbCenter, obbSize);
  
    this.playerCollider = new Box3Helper(obbBox, 0xff0000); // Display the collider box with red wireframe
    this.player.add(this.playerCollider);
  
    const colliderPosition = (direction) => {
      obbBox.setFromCenterAndSize(obbCenter, obbSize);
      obbBox.translate(this.bucketForeground.position);
  
      if (direction === 'right') {
        const offset = 0.75;
        obbBox.translate(new THREE.Vector3(offset, 0, 0));
      }
  
      this.playerCollider.updateMatrixWorld(true);
    };
  
    const positionBucket = this.moveBucket.bind(this);
    this.moveBucket = (direction) => {
      positionBucket(direction);
      colliderPosition(direction);
    };
  
    colliderPosition();
  }

  updatePlayer(deltaT) {
    // No physics updates needed for OBB detection
  }

  update(deltaT) {
    // No updates needed for OBB detection
  }
}
