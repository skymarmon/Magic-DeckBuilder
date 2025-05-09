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
import Images from './scenes/Images.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    scene: [
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
        WinLose,
        Images
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