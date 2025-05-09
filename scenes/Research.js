export default class Research extends Phaser.Scene {
    constructor() {
        super('Research');
    }
    create() {
        this.add.text(400, 300, 'Research Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}