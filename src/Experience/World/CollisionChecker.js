import * as THREE from "three";

export default class CollisionChecker {
  constructor(_options) {
    this.event = _options.event;
    this.parameter = _options.parameter;
    this.player = _options.player;
    this.spawner = _options.spawner;
  }

  checkCollision() {
    const playerCollider = new THREE.Box3().setFromObject(this.player.bucketForeground);
  
    for (let list of this.spawner.objectLists) {
      for (let item of list) {
        const itemCollider = new THREE.Box3().setFromObject(item);
  
        if (playerCollider.intersectsBox(itemCollider)) {
          this.handleCollision(item);
        }
      }
    }
  }
  

  handleCollision(item) {
    const list = this.spawner.objectLists.find((list) => list.includes(item));
    if (list) {
      list.splice(list.indexOf(item), 1);
    }
  
    if (item.name === "good") {
      this.parameter.score += 1;
    } else if (item.name === "bad") {
      if (this.parameter.score > 0) {
        this.parameter.score -= 1;
      }
      this.parameter.multiplier = 1;
    } else if (item.name === "bonus") {
      this.parameter.score += 5 * this.parameter.multiplier;
      this.parameter.multiplier += 1;
    }
  
    console.log("Current score:", this.parameter.score);
  
    const scoreValueElement = document.getElementById("scoreValue");
    scoreValueElement.innerHTML = this.parameter.score;
  
    this.event.updateScoreIndicator();
    this.parameter.destroy(item); 
  }
  update() {
    this.checkCollision();
  }
}
