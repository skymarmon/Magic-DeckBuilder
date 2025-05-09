export default class Class extends Phaser.Scene {
    constructor() {
        super('Class');
    }
    create() {
        this.add.text(400, 300, '에에에Class Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}