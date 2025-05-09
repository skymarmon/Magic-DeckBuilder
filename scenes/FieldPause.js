
export default class FieldPause extends Phaser.Scene {
    constructor() {
        super('FieldPause');
    }
    create() {
        this.add.text(400, 300, 'Field Pause Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}