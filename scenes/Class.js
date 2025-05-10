export default class Class extends Phaser.Scene {
    constructor() {
        super('Class');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        const bg = this.add.rectangle(0, 0, width, height, 0x222222).setOrigin(0);

        const text = this.add.image(width / 2, height * 0.1, 'text_choose_class');

        // 이미지 원본 크기 얻기
        const iw = this.textures.get('text_choose_class').getSourceImage().width;
        const ih = this.textures.get('text_choose_class').getSourceImage().height;

        // 가로 너비의 60%를 기준으로 스케일 설정 (또는 필요에 따라 조정 가능)
        const scale = Math.min((width * 0.6) / iw, 1);
        text.setScale(scale);
    }
}