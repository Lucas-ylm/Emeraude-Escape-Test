import * as THREE from "three";
import { ceilPowerOfTwo } from "three/src/math/MathUtils";

export default class CollisionChecker{
    constructor(_options){
        this.event = _options.event;
        this.parameter = _options.parameter;
        this.player = _options.player;
        this.spawner = _options.spawner;
    }

    checkCollision(){
        
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