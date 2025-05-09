
export default class Combat extends Phaser.Scene {
    constructor() {
        super('Combat');
    }
    create() {
        this.add.text(400, 300, 'Combat Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}