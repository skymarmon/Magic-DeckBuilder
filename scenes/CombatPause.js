
export default class CombatPause extends Phaser.Scene {
    constructor() {
        super('CombatPause');
    }
    create() {
        this.add.text(400, 300, 'Combat Pause Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}