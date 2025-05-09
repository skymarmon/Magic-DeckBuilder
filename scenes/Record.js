
export default class Record extends Phaser.Scene {
    constructor() {
        super('Record');
    }
    create() {
        this.add.text(400, 300, 'Record Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}