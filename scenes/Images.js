
export default class Images extends Phaser.Scene {
    constructor() {
        super('Images');
    }
    create() {
        this.add.text(400, 300, 'Image Preload Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}