export default class Location extends Phaser.Scene {
    constructor() {
        super('Location');
    }
    create() {
        this.add.text(400, 300, 'Location Scene', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
    }
}