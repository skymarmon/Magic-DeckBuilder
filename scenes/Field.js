
export default class Field extends Phaser.Scene {
    constructor() {
        super('Field');
    }
    create() {
        this.add.text(400, 300, 'Field Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}