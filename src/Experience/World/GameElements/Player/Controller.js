export default class Controller {
  constructor(player) {
    this.player = player;

    const leftButton = document.querySelector('.left');
    const rightButton = document.querySelector('.right');

    leftButton.addEventListener('click', () => {
      this.player.moveBucket('left');
    });
    
    rightButton.addEventListener('click', () => {
      this.player.moveBucket('right');
    });
  }
}