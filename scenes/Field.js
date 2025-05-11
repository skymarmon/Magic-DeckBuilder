export default class Field extends Phaser.Scene {
    constructor() {
        super('Field');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        // 배경
        this.cameras.main.setBackgroundColor('#dddddd');

        // 무한 맵 설정
        const worldSize = 10000;
        this.physics.world.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        // 캐릭터 생성
        this.player = this.physics.add.image(0, 0, 'field_character');
        this.player.setCollideWorldBounds(true);
        this.player.setDamping(true);
        this.player.setDrag(0.95);
        this.player.setMaxVelocity(200);

        // 캐릭터 크기 화면 기준으로 20% 축소
        const originalWidth = this.textures.get('field_character').getSourceImage().width;
        const scale = Math.min((width * 0.1) / originalWidth, 1); // 대략 화면 폭의 10% → 원래 크기의 20% 수준
        this.player.setScale(scale);

        // 카메라
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        // 키 입력
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
    }

    update() {
        const speed = 200;

        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown) vx = -speed;
        else if (this.cursors.right.isDown) vx = speed;

        if (this.cursors.up.isDown) vy = -speed;
        else if (this.cursors.down.isDown) vy = speed;

        this.player.setVelocity(vx, vy);
    }
}
