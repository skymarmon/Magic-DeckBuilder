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
        this.load.image('class_alchemist', 'assets/images/class_alchemist.png');
        this.load.image('class_scholar', 'assets/images/class_scholar.png');
        this.load.image('class_witch', 'assets/images/class_witch.png');
        this.load.image('class_electromancer', 'assets/images/class_electromancer.png');
        this.load.image('class_arbiter', 'assets/images/class_arbiter.png');
        this.load.image('class_archmage', 'assets/images/class_archmage.png');
        this.load.image('class_archaeologist', 'assets/images/class_archaeologist.png');
        this.load.image('class_magician', 'assets/images/class_magician.png');
        this.load.image('class_mage', 'assets/images/class_mage.png');
        this.load.image('class_battlemage', 'assets/images/class_battlemage.png');
        this.load.image('class_warlord', 'assets/images/class_warlord.png');
        this.load.image('class_blackmage', 'assets/images/class_blackmage.png');
        this.load.image('location_name', 'assets/images/location_name.png');
        this.load.image('location_info', 'assets/images/location_info.png');
        this.load.image('button_game', 'assets/images/button_game.png');
        this.load.image('location_backspace', 'assets/images/location_backspace.png');
        this.load.image('field_shadow', 'assets/images/field_shadow.png');
        this.load.image('field_shadow_obstacle', 'assets/images/field_shadow_obstacle.png');
        this.load.image('field_character', 'assets/images/field_character.png');
    }

    create() {
        this.scene.start('License');
    }
}