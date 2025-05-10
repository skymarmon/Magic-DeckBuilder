import Images from './scenes/Images.js';
import License from './scenes/License.js';
import Lobby from './scenes/Lobby.js';
import Research from './scenes/Research.js';
import Record from './scenes/Record.js';
import Class from './scenes/Class.js';
import Location from './scenes/Location.js';
import Field from './scenes/Field.js';
import Combat from './scenes/Combat.js';
import FieldPause from './scenes/FieldPause.js';
import CombatPause from './scenes/CombatPause.js';
import WinLose from './scenes/WinLose.js';

let class_level = {
    wizard: 1,
    astronomer: 0,
    cryomancer: 0,
    shaman: 0,
    warlock: 0,
    arcanist: 0,
    summoner: 0,
    bishop: 0,
    occultist: 0,
    druid: 0,
    pyromancer: 0,
    sorcerer: 0,
    alchemist: 0,
    scholar: 0,
    witch: 0,
    electromancer: 0,
    arbiter: 0,
    archmage: 0,
    archaeologist: 0,
    magician: 0,
    mage: 0,
    battlemage: 0,
    warlord: 0,
    blackmage: 0
};

let now_class = '';

export function updateClassTint(classname, ifPressed) {
    const button = class_[classname];
    const level = class_level[classname] || 0;

    let baseColor;

    if (now_class === classname) {
        baseColor = 0xffffcc; // 연노랑
    } else {
        switch (level) {
            case 0: baseColor = 0x555555; break; // 회색
            case 1: baseColor = 0xffffff; break; // 흰색
            case 2: baseColor = 0xccffcc; break; // 연두
            case 3: baseColor = 0x9999ff; break; // 파랑
            case 4: baseColor = 0xffccff; break; // 분홍
            case 5: baseColor = 0xffff99; break; // 노랑
            default: baseColor = 0xffffff;
        }
    }

    // 눌렸다면 살짝 어둡게
    if (ifPressed) {
        baseColor = Phaser.Display.Color.IntegerToColor(baseColor).darken(20).color;
    }

    button.setTint(baseColor);
}

Phaser.GameObjects.GameObjectFactory.prototype.addText = function (x, y, text, style = {}) {
    const defaultStyle = {
        fontFamily: 'JejuHallasan',
        fontSize: '24px',
        color: '#000000'
    };
    return this.scene.add.text(x, y, text, Object.assign(defaultStyle, style));
};

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000000',
    scene: [
        Images,
        License,
        Lobby,
        Research,
        Record,
        Class,
        Location,
        Field,
        Combat,
        FieldPause,
        CombatPause,
        WinLose
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
