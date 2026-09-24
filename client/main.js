import {Game} from './game.js';
import {initUI} from './ui.js';
const game=new Game(document.querySelector('#game'));initUI(game);game.loop();
