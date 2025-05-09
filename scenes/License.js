export default class License extends Phaser.Scene {
    constructor() {
        super('License');
    }
    create() {
        this.add.text(400, 300, 'License Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
        this.input.once('pointerdown', () => this.scene.start('Lobby'));
    }
}
