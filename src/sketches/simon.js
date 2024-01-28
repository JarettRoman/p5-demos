export default function sketch(p) {
    let w_Button, a_Button, s_Button, d_Button;
    let button_map = {};
    let playingSequence = false;
    let currentSequence;
    let matchingLetter;
    let BUTTON_LIFETIME = 300;

    let current_state;

    let STATE = {
        START: 0,
        SEQUENCE: 1,
        PLAYER: 2,
        PLAYER_WIN: 3,
        PLAYER_LOSE: 4
    };

    p.setup = () => {
        p.createCanvas(400, 400);
        p.background(220);

        w_Button = new Button(p.width / 2, p.height / 2 - 125, 'w');
        a_Button = new Button(p.width / 2 - 125, p.height / 2, 'a');
        s_Button = new Button(p.width / 2, p.height / 2, 's');
        d_Button = new Button(p.width / 2 + 125, p.height / 2, 'd');
        button_map = {
            [w_Button.key]: w_Button,
            [a_Button.key]: a_Button,
            [s_Button.key]: s_Button,
            [d_Button.key]: d_Button
        };

        current_state = STATE.START;
        matchingLetter = keyToMatch();
    };
    p.draw = () => {
        update();
        p.clear();
        p.background(220);
        switch (current_state) {
            case STATE.START:
                drawStartMenu();
                break;
            case STATE.SEQUENCE:
                Object.values(button_map).forEach((button) => {
                    button.draw();
                });
                break;
            case STATE.PLAYER:
                Object.values(button_map).forEach((button) => {
                    button.draw();
                });
                break;
            case STATE.PLAYER_WIN:
                console.log('draw win screen');
                break;
            case STATE.PLAYER_LOSE:
                console.log('draw lose screen');
                break;
            default:
                current_state = STATE.START;
        }
    };

    p.keyReleased = () => {
        if (current_state === STATE.START) {
            setTimeout(() => {
                current_state = STATE.SEQUENCE;
            }, 1000);
        }

        if (current_state === STATE.PLAYER) {
            if (button_map.hasOwnProperty(p.key) && !button_map[p.key].active) {
                button_map[p.key].activate();
                // we want to check if the button pressed is the correct one
                matchingLetter(p.key);
            }
        }
    };

    let update = () => {
        //processes updates to game state and data each frame

        if (current_state === STATE.SEQUENCE) {
            playSequence();
        }

        if (current_state === STATE.PLAYER_WIN) {
            console.log('Player Wins');
            p.noLoop();
        }

        if (current_state === STATE.PLAYER_LOSE) {
            console.log('Player Loses');
            p.noLoop();
        }
    };

    let keyToMatch = () => {
        let index = 0;
        return (key) => {
            if (index < currentSequence.length) {
                if (key === currentSequence[index]) {
                    index++;
                    if (index === currentSequence.length) {
                        current_state = STATE.PLAYER_WIN;
                    }
                } else {
                    current_state = STATE.PLAYER_LOSE;
                }
            }
        };
    };

    let drawStartMenu = () => {
        p.push();
        p.textAlign(p.CENTER);
        p.textSize(48);
        p.fill('black');
        p.text('Press any key', p.width / 2, p.height / 2);
        p.pop();
    };

    let generateSequence = () => {
        let sequence = ['w', 'a', 's', 'd'];
        let randomizedSequence = sequence
            .map((value) => ({
                value,
                sort: Math.random()
            }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        currentSequence = randomizedSequence;
        return randomizedSequence;
    };

    let playSequence = () => {
        if (Object.keys(button_map).length === 0 || playingSequence) {
            return;
        }

        playingSequence = true;

        generateSequence();

        let index = 0;
        const interval = setInterval(() => {
            if (index < currentSequence.length) {
                button_map[currentSequence[index]].activate();
                index++;
            } else {
                playingSequence = false;
                current_state = STATE.PLAYER;
                clearInterval(interval);
            }
        }, BUTTON_LIFETIME);
    };

    class Button {
        constructor(x, y, key) {
            this.x = x;
            this.y = y;
            this.key = key;
            this.active = false;
            this.lifetime = BUTTON_LIFETIME;
            this.timeActivated = null;
        }

        activate = () => {
            this.active = true;
            this.timeActivated = p.millis();
        };

        deactivate = () => {
            this.active = false;
            this.timeActivated = null;
        };

        setTimeActivated = () => {
            if (!this.timeActivated) {
                this.timeActivated = p.millis();
            }
        };

        draw = () => {
            if (
                this.timeActivated &&
                this.timeActivated + this.lifetime < p.millis()
            ) {
                this.deactivate();
            }
            p.push();
            p.fill(this.active ? 'yellow' : 'orange');
            p.strokeWeight(8);
            p.stroke(this.active ? p.color(255, 204, 0) : 'black');
            p.rectMode(p.CENTER);
            p.square(this.x, this.y, 100);
            p.noStroke();
            p.textAlign(p.CENTER);
            p.textSize(48);
            p.fill('black');
            p.text(this.key, this.x, this.y + 10);
            p.pop();
        };
    }
}
