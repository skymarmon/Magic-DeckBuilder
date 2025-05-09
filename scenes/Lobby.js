export default class Lobby extends Phaser.Scene {
    constructor() {
        super('Lobby');
    }
    create() {
        this.add.text(400, 300, 'Lobby Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}