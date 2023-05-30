import Starter from "../Starter";
import Corn from "./Corn";

export default class ObjectSpawner {
    constructor(_options){
        this.event = _options.event;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;
        this.player = _options.player.player;

        this.corn = new Corn({
            scene: this.scene,
            resources: this.resources, 
            parameter: this.parameter
        });

        this.objectLists = [];
        this.objectLists.push(this.corn.goodItems, this.corn.badItems, this.corn.bonusItems)

        this.event.on('StopTimer', () => {
            this.destroyCorns();
        })
    }

    destroyCorns(){
        for(let list in this.objectLists){
            this.objectLists[list].forEach(element => {
                this.parameter.destroy(element)
            });
        }
    }

    spawnItem(deltaT){
        const randomN = Math.random();
        const randomSignX = (Math.random() - 0.5) * 4.3;
        
        const posX = randomSignX;

        if(randomN < .0025 * deltaT){
            this.corn.setItem(posX)
        }

    }

    moveItems(deltaT){
        for(let list in this.objectLists){
            for(let item in this.objectLists[list]){
                if(this.objectLists[list][item].position.y > -4.5){
                    this.objectLists[list][item].position.y -= this.objectLists[list][item].userData.speed * deltaT
                    this.objectLists[list][item].rotation.z += this.objectLists[list][item].userData.speed * deltaT
                } 


                if(this.objectLists[list][item].position.x < -3 || this.objectLists[list][item].position.x > 3){
                    this.parameter.destroy(this.objectLists[list][item]);
                    this.objectLists[list].splice(item, 1)
                }
            }
        }
    }

    updateStarter(){
        this.parameter.timer -= 1;
            if(this.parameter.timer == 250){
                this.starter = new Starter({
                    scene: this.scene,
                    resources: this.resources, 
                    parameter: this.parameter
                }, 1)
                this.parameter.sounds.play('sound_Starter_Number')
            } else if(this.parameter.timer == 200){
                this.starter.updateCountdown(2)
                this.parameter.sounds.play('sound_Starter_Number')
            } else if(this.parameter.timer == 150){
                this.starter.updateCountdown(3)
                this.parameter.sounds.play('sound_Starter_Number')
            } else if(this.parameter.timer == 100){
                this.starter.updateCountdown(4)
                this.parameter.sounds.play('sound_Starter_Go')
            } else if(this.parameter.timer == 50){
                this.starter.deleteCountdown();
                this.event.startTimer();
            } else if(this.parameter.timer == 0){ 
                this.parameter.counterOn = false;
                this.parameter.canSpawn = true;
            }
    }

    update(deltaT){
        if(this.parameter.canSpawn){
            this.spawnItem(deltaT);
            this.moveItems(deltaT);
        }


        if(this.parameter.counterOn){
        this.updateStarter();
        }

    }
}