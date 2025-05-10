export default class Images extends Phaser.Scene {
    constructor() {
        super('Images');
    }

    preload() {
        this.load.image('credit', 'assets/images/credit.png');
        this.load.image('main', 'assets/images/main.png');
        this.load.image('button_research', 'assets/images/button_research.png');
        this.load.image('button_start', 'assets/images/button_start.png');
        this.load.image('button_record', 'assets/images/button_record.png');
        this.load.image('text_choose_class', 'assets/images/text_choose_class.png');
    }

    create() {
        this.scene.start('License');
    }
}