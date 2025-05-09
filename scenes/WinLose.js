
export default class WinLose extends Phaser.Scene {
    constructor() {
        super('WinLose');
    }
    create() {
        this.add.text(400, 300, 'Win or Lose Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}