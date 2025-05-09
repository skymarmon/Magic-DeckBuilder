
export default class Images extends Phaser.Scene {
    constructor() {
        super('Images');
    }

    preload() {
        this.load.image('credit', 'assets/images/credit.png');
    }

    create() {
        this.add.text(400, 300, 'Image Preload Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}