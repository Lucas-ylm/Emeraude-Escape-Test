import * as THREE from "three";
import { ceilPowerOfTwo } from "three/src/math/MathUtils";

export default class CollisionChecker{
    constructor(_options){
        this.event = _options.event;
        this.parameter = _options.parameter;
        this.player = _options.player;
        this.spawner = _options.spawner;
    }

    checkCollision() {
        const playerCollider = this.player.playerCollider;
        const items = this.spawner.items;

        const playerMatrixWorld = playerCollider.matrixWorld;
        const playerPosition = new THREE.Vector3();
        playerPosition.setFromMatrixPosition(playerMatrixWorld);
    
        const playerDirection = new THREE.Vector3(0, 0, -1);
        playerDirection.transformDirection(playerMatrixWorld);
    
        this.raycaster.set(playerPosition, playerDirection);
    
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const intersects = this.raycaster.intersectsObject(item, true);
    
          if (intersects.length > 0) {
            this.addPoint(item);
            this.spawner.remove(item);
            i--;
          }
        }
      }

    addPoint(item){
        if(item.name == 'good'){
            this.parameter.score += 1;
        } else if (item.name == 'bad'){
            if(this.parameter.score > 0){
                this.parameter.score -= 1;
            }
            this.parameter.multiplier = 1;
        } else {
            this.parameter.score += 5 * this.parameter.multiplier;
            this.parameter.multiplier += 1
        }
        this.event.updateScoreIndicator();
    }



    update(){
        this.checkCollision();
    }
}