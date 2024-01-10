export default function sketch(p) {

	let card;
	let card2;
	let suits = [
		"♠️", "♥️", "♣️", "♦️"
	];
	let deck;
	let player_hand = [];

	p.setup = () => {
		p.createCanvas(400, 400);
		card = new Card({ value: 2, suit: suits[2] });
		card.x = 175;
		card.y = 125;

		card2 = new Card({ value: 6, suit: suits[3] });
		card2.x = 230;
		card2.y = 125;
		deck = new Deck();
		deck.shuffle();
		console.log(deck);
		for (let i = 0; i < 5; i++) {
			player_hand.push(deck.draw_card());
		}
		console.log(player_hand);
	}
	p.draw = () => {
		p.background("blue");
		card.draw();
		card2.draw();
		draw_player_hand();
	}

	let draw_player_hand = () => {
		for (let i = 0; i < player_hand.length; i++) {
			player_hand[i].set_position(50 + (i * 60), 300);
			player_hand[i].draw();
		}
	}

	class Card {
		constructor({ value, suit }) {
			// this.card = card;
			this.x = 0;
			this.y = 0;
			this.value = value;
			this.suit = suit;
		}

		stringify_value = () => {
			switch (this.value) {
				case 1:
					return "A";
				case 11:
					return "J";
				case 12:
					return "Q";
				case 13:
					return "K";
				default:
					return `${this.value}`
			}
		}

		set_position = (x, y) => {
			this.x = x;
			this.y = y;
		}

		draw = () => {
			p.push();
			p.fill("white");
			p.rect(this.x, this.y, 50, 70, 5);
			p.fill("black");
			p.textSize(20);
			p.textAlign(p.CENTER);
			p.text(`${this.stringify_value()}${this.suit}`, this.x + 25, this.y + 35);
			p.pop();
		}
	}

	class Deck {
		constructor() {
			this.cards = this.generateCards();
			this.created = false;
		}

		generateCards = () => {
			if (this.created) { return; }
			let cardArray = [];
			suits.forEach((suit) => {
				for (let i = 1; i < 14; i++) {
					cardArray.push(new Card({ value: i, suit: suit }));
				}
			});
			this.created = true;
			return cardArray;
		}

		shuffle = () => {
			for (let i = this.cards.length - 1; i > 0; i--) {
				const randomIndex = Math.floor(Math.random() * (i + 1));
				[this.cards[i], this.cards[randomIndex]] = [this.cards[randomIndex], this.cards[i]];
			}
		}

		draw_card = () => {
			if (this.cards.length > 0) {
				return this.cards.pop();
			}
		}
	}
}