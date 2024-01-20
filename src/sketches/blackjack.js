export default function sketch(p) {
    const suits = ['♠️', '♥️', '♣️', '♦️'];
    let deck;
    let player_data = {
        hand: [],
        score: 0
    };
    let dealer_data = {
        hand: [],
        score: 0
    };

    let score_display;
    let dealer_score_display;
    let is_dealer_turn = false;
    let hit_button;
    let stay_button;
    let end_result_display;
    let game_active = true;

    p.setup = () => {
        p.createCanvas(400, 400);
        deck = new Deck();
        score_display = new Score(15, 275);
        dealer_score_display = new Score(15, 175, "Dealer's Score: ");
        end_result_display = new EndResultDisplay(150, 220, true);
        deck.shuffle();
        for (let i = 0; i < 2; i++) {
            player_data.hand.push(deck.draw_card());
        }

        player_data = calculate_score(player_data);
        for (let i = 0; i < 2; i++) {
            dealer_data.hand.push(deck.draw_card());
        }

        //dealer has one card facedown at start
        dealer_data.hand[1].face_down();

        //calculate dealer's score for reference
        dealer_data = calculate_score(dealer_data);

        hit_button = new Button(
            'Hit',
            () => {
                if (player_data.hand.length < 5)
                    player_data.hand.push(deck.draw_card());
            },
            350,
            315
        );
        stay_button = new Button('Stay', dealer_actions, 350, 345);
    };
    p.draw = () => {
        p.background('blue');
        if (player_data.score === 21) {
            dealer_data.hand[1].face_up();
            dealer_score_display.update(dealer_data);
            end_result_display.victory = true;
            // end_result_display.draw();
            game_active = false;
            p.noLoop();
        } else if (player_data.score > 21) {
            dealer_data.hand[1].face_up();
            dealer_score_display.update(dealer_data);
            end_result_display.victory = false;
            // end_result_display.draw();
            game_active = false;
            p.noLoop();
        } else if (dealer_data.score === 21) {
            dealer_data.hand[1].face_up();
            dealer_score_display.update(dealer_data);
            end_result_display.victory = false;
            // end_result_display.draw();
            game_active = false;
            p.noLoop();
        }
        draw_hands_on_screen();
        player_data = calculate_score(player_data);
        dealer_data = calculate_score(dealer_data);
        score_display.update(player_data);
        if (is_dealer_turn) {
            dealer_score_display.update(dealer_data);
            // end_result_display.draw();
        }
        hit_button.draw();
        stay_button.draw();
        if (player_data.hand.length === 5) {
            dealer_actions();
        }

        if (!game_active) {
            end_result_display.draw();
        }
    };

    p.mousePressed = () => {
        if (stay_button) {
            stay_button.clicked();
        }
        if (hit_button) {
            hit_button.clicked();
        }
    };

    let calculate_score = (data) => {
        data.score = data.hand.reduce((a, b) => a + b.value, 0);

        /*
		Each ace card is valued at 11. Then while the value is over 21,
		subtract 11 from your total for each ace in your hand.
		*/
        let num_of_aces = 0;
        data.hand.forEach((card) => {
            if (card.value === 11) {
                num_of_aces++;
            }
        });

        if (data.score > 21) {
            // we need to take combinations of aces into account.
            for (let i = 0; i < num_of_aces && data.score > 21; i++) {
                data.score = data.score - 10;
            }
            // data.score = data.score - 10 * num_of_aces;
        }

        return data;
    };

    let reset = () => {
        deck = new Deck();
        player_data = {
            hand: [],
            score: 0
        };
        dealer_data = {
            hand: [],
            score: 0
        };

        score_display = null;
        dealer_score_display = null;
        is_dealer_turn = false;

        end_result_display = null;

        score_display = new Score(15, 275);
        dealer_score_display = new Score(15, 175, "Dealer's Score: ");
        end_result_display = new EndResultDisplay(150, 220, true);
        deck.shuffle();
        for (let i = 0; i < 2; i++) {
            player_data.hand.push(deck.draw_card());
        }

        player_data = calculate_score(player_data);
        for (let i = 0; i < 2; i++) {
            dealer_data.hand.push(deck.draw_card());
        }

        //dealer has one card facedown at start
        dealer_data.hand[1].face_down();

        //calculate dealer's score for reference
        dealer_data = calculate_score(dealer_data);

        game_active = true;
    };

    let draw_hands_on_screen = () => {
        for (let i = 0; i < player_data.hand.length; i++) {
            player_data.hand[i].set_position(20 + i * 60, 300);
            player_data.hand[i].draw();
        }
        for (let i = 0; i < dealer_data.hand.length; i++) {
            dealer_data.hand[i].set_position(20 + i * 60, 50);
            dealer_data.hand[i].draw();
        }
    };

    let dealer_actions = () => {
        dealer_data.hand[1].face_up();
        is_dealer_turn = true;

        if (dealer_data.score > player_data.score) {
            end_result_display.victory = false;
            game_active = false;
            // end_result_display.draw();
            p.noLoop();
            return;
        }
        for (
            let i = dealer_data.hand.length;
            dealer_data.hand.length < 5;
            i++
        ) {
            dealer_data.hand.push(deck.draw_card());

            dealer_data = calculate_score(dealer_data);
            // dealer_score_display.update(dealer_data);

            if (dealer_data.score === 21) {
                end_result_display.victory = false;
                // end_result_display.draw();
                game_active = false;
                p.noLoop();
                break;
            } else if (dealer_data.score > 21) {
                end_result_display.victory = true;
                game_active = false;
                // end_result_display.draw();
                p.noLoop();
                break;
            } else if (
                dealer_data.score > player_data.score &&
                dealer_data.score < 21 &&
                dealer_data.hand.length <= 5
            ) {
                end_result_display.victory = false;
                game_active = false;
                // end_result_display.draw();
                p.noLoop();
                break;
            }
        }
        // dealer_score_display.update(dealer_data);
        return;
    };

    class Button {
        constructor(label, cb, x, y) {
            this.label = label;
            this.event = cb;
            this.x = x;
            this.y = y;
            this.width = 40;
            this.height = 20;
        }

        fire_event = () => {
            this.event();
        };

        clicked = () => {
            if (
                p.mouseX > this.x &&
                p.mouseX < this.x + this.width &&
                p.mouseY > this.y &&
                p.mouseY < this.y + this.height
            ) {
                this.fire_event();
            }
        };

        draw = () => {
            p.push();
            p.fill('green');
            p.rect(this.x, this.y, this.width, this.height);
            p.fill('white');
            p.textSize(16);
            p.text(this.label, this.x + 4, this.y + 16);
            p.pop();
        };
    }

    class Score {
        constructor(x, y, label) {
            this.score = 0;
            this.x = x;
            this.y = y;
            this.label = label;
        }

        update = (data) => {
            this.score = data.score;
            this.draw();
        };

        draw = () => {
            let score_text = 'Score: ' + this.score;
            if (this.label) {
                score_text = this.label + this.score;
            }
            p.push();
            p.fill('white');
            p.textSize(30);
            p.text(score_text, this.x, this.y);
            p.pop();
        };
    }

    class EndResultDisplay {
        constructor(x, y, victory) {
            this.x = x;
            this.y = y;
            this.victory = victory;
        }

        draw = () => {
            p.push();
            p.fill('white');
            p.textSize(30);
            p.text(this.victory ? 'YOU WIN!' : 'YOU LOSE!', this.x, this.y);
            p.textSize(16);
            p.text('Refresh to play again', this.x - 20, this.y + 30);

            p.pop();
        };
    }

    class Card {
        constructor(name, suit) {
            this.x = 0;
            this.y = 0;
            this.name = name;
            this.suit = suit;
            this.value = this.determine_value();
            this.facedown = false;
        }

        // used to determine value of card based on name
        determine_value = () => {
            let val;
            if (['J', 'Q', 'K'].includes(this.name)) {
                val = 10;
            } else if (this.name === 'A') {
                val = 11;
            } else {
                val = parseInt(this.name);
            }
            return val;
        };

        face_down = () => {
            this.facedown = true;
        };

        face_up = () => {
            this.facedown = false;
        };

        update_value = (value) => {
            this.value = value;
        };

        set_position = (x, y) => {
            this.x = x;
            this.y = y;
        };

        draw = () => {
            p.push();
            if (this.facedown) {
                p.fill('red');
                p.rect(this.x, this.y, 50, 70, 5);
            } else {
                p.fill('white');
                p.rect(this.x, this.y, 50, 70, 5);
                p.fill('black');
                p.textSize(20);
                p.textAlign(p.CENTER);
                p.text(`${this.name}${this.suit}`, this.x + 25, this.y + 35);
            }
            p.pop();
        };
    }

    class Deck {
        constructor() {
            this.cards = this.generateCards();
            this.created = false;
        }

        generateCards = () => {
            if (this.created) {
                return;
            }
            let cardArray = [];
            suits.forEach((suit) => {
                for (let i = 1; i < 14; i++) {
                    switch (i) {
                        case 1:
                            cardArray.push(new Card('A', suit));
                            break;
                        case 11:
                            cardArray.push(new Card('J', suit));
                            break;
                        case 12:
                            cardArray.push(new Card('Q', suit));
                            break;
                        case 13:
                            cardArray.push(new Card('K', suit));
                            break;
                        default:
                            cardArray.push(new Card(`${i}`, suit));
                    }
                }
            });
            this.created = true;
            return cardArray;
        };

        shuffle = () => {
            for (let i = this.cards.length - 1; i > 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                [this.cards[i], this.cards[randomIndex]] = [
                    this.cards[randomIndex],
                    this.cards[i]
                ];
            }
        };

        draw_card = () => {
            if (this.cards.length > 0) {
                return this.cards.pop();
            }
        };
    }
}
