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
        this.load.image('class_backspace', 'assets/images/class_backspace.png');
        this.load.image('button_location', 'assets/images/button_location.png');
        this.load.image('class_wizard', 'assets/images/class_wizard.png');
        this.load.image('class_astronomer', 'assets/images/class_astronomer.png');
        this.load.image('class_cryomancer', 'assets/images/class_cryomancer.png');
        this.load.image('class_shaman', 'assets/images/class_shaman.png');
        this.load.image('class_warlock', 'assets/images/class_warlock.png');
        this.load.image('class_arcanist', 'assets/images/class_arcanist.png');
        this.load.image('class_summoner', 'assets/images/class_summoner.png');
        this.load.image('class_bishop', 'assets/images/class_bishop.png');
        this.load.image('class_occultist', 'assets/images/class_occultist.png');
        this.load.image('class_druid', 'assets/images/class_druid.png');
        this.load.image('class_pyromancer', 'assets/images/class_pyromancer.png');
        this.load.image('class_sorcerer', 'assets/images/class_sorcerer.png');
    }

    create() {
        this.scene.start('License');
    }
}