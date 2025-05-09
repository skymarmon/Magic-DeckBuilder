export default class Images extends Phaser.Scene {
    constructor() {
        super('Images');
    }

    preload() {
        this.load.image('credit', 'assets/images/credit.png');
        this.load.image('main', 'assets/images/main.png');
    }

    create() {
        this.scene.start('License');
    }
}