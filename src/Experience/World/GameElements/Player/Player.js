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

    moveBucket(direction) 
    {
        const increment = 0.5;
        const duration = 0.25;
    
        const targetPositionX = direction === 'left' ? `-=${increment}` : `+=${increment}`;
    
        gsap.to([this.bucketBackground.position, this.bucketForeground.position], {
          x: targetPositionX,
          duration,
          ease: 'power2.out',
        });
    }

    setPlayer(){
        this.setMesh();
    }

    setMesh(){
        this.playerGeometry = new THREE.PlaneGeometry(2.5,2);
      
        this.player = new THREE.Mesh(this.playerGeometry,  new THREE.MeshBasicMaterial({transparent: true, visible: false}));
        this.player.position.set(0,-3.8,0)
      
        this.setAssets(this.playerGeometry);
      
        this.setColliders(this.playerGeometry)
      
        this.scene.add(this.player)
      }

    setAssets(geometry){
        this.bucketBackground = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: this.resources.items.player_background, transparent: true}));
        this.bucketBackground.position.x = -.35
        this.bucketBackground.renderOrder = 1;
        
        this.bucketForeground = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: this.resources.items.player_foreground, transparent: true}));
        this.bucketForeground.position.x = -.35
        this.bucketForeground.renderOrder = 3;

        this.player.add(this.bucketBackground, this.bucketForeground)
    }

    setColliders() 
    {
        const topWidth = 1.25;
        const bottomWidth = 1.0;
        const colliderHeight = 0.2;
        const colliderDepth = 0.1;

        const vertices = 
        [
            -topWidth / 2, 0, -colliderDepth / 2,
            topWidth / 2, 0, -colliderDepth / 2,
            -bottomWidth / 2, -colliderHeight, -colliderDepth / 3,
            bottomWidth / 2, -colliderHeight, -colliderDepth / 2
        ];

        const indices = 
        [
            0, 1, 2,
            1, 3, 2
        ];

        const colliderGeometry = new THREE.BufferGeometry();
        colliderGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        colliderGeometry.setIndex(indices);

        const colliderMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 });
        this.playerCollider = new THREE.Mesh(colliderGeometry, colliderMaterial);
        this.player.add(this.playerCollider);

        const colliderPosition = (direction) => 
        {
            this.playerCollider.position.copy(this.bucketForeground.position);
        
            if (direction === 'right') 
            {
            const offset = 0.75;
            this.playerCollider.position.x += offset;
            }
        };
        
        const positionBucket = this.moveBucket.bind(this);
        this.moveBucket = (direction) => 
        {
            positionBucket(direction);
            colliderPosition(direction);
        };

        colliderPosition();
    }
    
    updatePlayer(deltaT){
        // Move the player according to the controller
    }

    update(deltaT){
        this.updatePlayer(deltaT);
    }

}