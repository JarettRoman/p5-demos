import Roboto from './assets/RobotoMono-VariableFont_wght.ttf'

export default function sketch(p) {
	let car;
	let coins = [];
	let font;
	let time = 0;
	let timer;
	let best_time_display;
	let record_time = Number.MAX_VALUE;
	let fontSize = 20;
	let platforms = [];
	let game_active = true;
	let game_over_screen;
	const DIRECTIONS = {
		LEFT: 0,
		RIGHT: 1,
		NONE: 2
	};


	p.preload = () => {
		font = p.loadFont(Roboto, font => {
			console.log("Font loaded successfully.");
		});
	}

	p.setup = () => {
		p.createCanvas(400, 400);
		p.frameRate(60);

		p.textFont(font);
		p.textSize(fontSize);
		p.textAlign(p.CENTER, p.CENTER);

		car = new Car(0, 300, 25, 25);
		car.set_speed(3);
		car.set_jump_height(10);
		car.set_color(p.color("white"));
		car.set_gravity(0.1);

		coins.push(new Coin(30, 60));
		coins.push(new Coin(350, 275));
		coins.push(new Coin(200, 200));
		coins.push(new Coin(325, 50));
		
		platforms.push(new Platform(50, 200, 100));
		platforms.push(new Platform(150, 250, 100));
		platforms.push(new Platform(100, 325, 150));
		platforms.push(new Platform(75, 100, 200));

		platforms[3].set_moving(true);
		platforms[1].set_moving(true);

		timer = new Timer();
		best_time_display = new BestTimeDisplay();
	}

	p.draw = () => {
		if (game_active) {
			win_condition_check();
			p.background("black");
			for (let i in platforms) {
				platforms[i].draw();
			}
			for (let i in coins) {
				coins[i].draw();
			}
			p.noStroke();
			keyDown();
			car.update();
			car.check_gravity();
			car.check_coin_collision();
			car.draw();
			if (best_time_display.best_time > 0) {
				best_time_display.draw();
			}
			timer.draw();
			
			timer.set_time(time + p.deltaTime);
		} else {
			if (game_over_screen) {
				game_over_screen.draw();	
			}
		}
	}

	p.keyPressed = () => {
		if (!car) {
			return
		}
		if (p.key === ' ') {
			car.jump();

			if (!game_active) {
				reset();
				game_active = true;
				game_over_screen = null;	
			}

		}
		return false;
	}

	let reset = () => {
		car = null;
		coins = [];
		time = 0;

		platforms = [];
		car = new Car(0, 300, 25, 25);
		car.set_speed(3);
		car.set_jump_height(10);
		car.set_color(p.color("white"));
		car.set_gravity(0.1);

		coins.push(new Coin(100, 60));
		coins.push(new Coin(350, 275));
		coins.push(new Coin(200, 200));
		coins.push(new Coin(325, 50));

		platforms.push(new Platform(50, 200, 100));
		platforms.push(new Platform(150, 250, 100));
		platforms.push(new Platform(100, 325, 150));
		platforms.push(new Platform(75, 100, 200));

		platforms[3].set_moving(true);
		platforms[1].set_moving(true);
		timer = new Timer();
	}

	let keyDown = () => {
		if (p.keyIsDown(p.LEFT_ARROW)) {
			car.direction = DIRECTIONS.LEFT;
		} else if (p.keyIsDown(p.RIGHT_ARROW)) {
			car.direction = DIRECTIONS.RIGHT;
		} else {
			car.direction = DIRECTIONS.NONE;
		}
	}

	let win_condition_check = () => {
		if (coins.length <= 0) {
			let current_time = timer.time / 1000; 
			game_active = false;
			if (current_time < record_time) {
				record_time = current_time;
				best_time_display.set_best_time(record_time);
			}
			game_over_screen = new GameOverScreen(record_time);
		}
	}
	
	class Car {
		constructor(x, y, width, height) {
			this.x = x;
			this.y = y;
			this.speed = 3;
			this.width = width;
			this.height = height;
			this.direction = DIRECTIONS.NONE;
			this.forceY = 0;
			this.gravity = 1;
			this.able_to_jump = false;
			this.jump_height = 25;
			this.color = p.color(255, 0, 0)
		}

		set_speed(speed) {
			this.speed = speed;
		}

		set_gravity(gravity) {
			this.gravity = gravity;
		}

		set_jump_height(jump_height) {
			this.jump_height = jump_height;
		}

		set_color(color) {
			this.color = color;
		}

		draw() {
			p.push();
			p.fill(this.color);
			p.stroke("white");
			p.rect(this.x, this.y, this.width, this.height);
			p.pop();
		}

		jump() {
			if (this.able_to_jump) {
				this.forceY -= this.jump_height;
			}
		}

		is_on_platform(platform) {
			let adj_height = this.y + this.height;
			let adj_width = this.x + this.width;
			var is_stable_y = adj_height >= platform.y && adj_height <= platform.y + this.forceY;
			var is_stable_x = this.x < platform.x + platform.size && adj_width > platform.x;

			return is_stable_x && is_stable_y;
		}

		check_platform(platform) {
			
			let on_ground = this.at_canvas_boundary()

			// on platform or ground
			if (this.is_on_platform(platform) || on_ground) {
				this.forceY = 0;
				this.y = (on_ground ? p.height : platform.y) - this.height;
				this.able_to_jump = true;
				return true;
			} else {
				// falling
				this.forceY = this.forceY + this.gravity;
				this.able_to_jump = false;
				return false;
			}
		}

		at_canvas_boundary() {
			let adj_height = this.get_adj_measurements().height;
			return adj_height >= p.height && adj_height <= p.height + this.forceY;
		}

		check_coin_collision() {
			let adj_height = this.get_adj_measurements().height;
			let adj_width = this.get_adj_measurements().width;

			if (coins.length > 0) {
				coins.forEach((coin, idx) => {
					if (coin.x < adj_width && coin.x + coin.width > this.x) {
						if (coin.y < adj_height && coin.y + coin.height > this.y) {
							coins.splice(idx, 1);
						}
					}
				})
			}
		}

		get_adj_height() {
			return this.y + this.height;
		}

		get_adj_measurements() {
			return {
				width: this.x + this.width,
				height: this.y + this.height,
			}
		}

		check_gravity() {
			for (let i in platforms) {
				if (this.check_platform(platforms[i])) {
					break;
				}
			}
			this.y += this.forceY;
		}

		update() {
			if (this.direction === DIRECTIONS.RIGHT) {
				if (this.x > p.width - this.width) { return; }
				this.x += this.speed;
			} else if (this.direction === DIRECTIONS.LEFT) {
				if (this.x < 0) { return; }
				this.x -= this.speed;
			}
		}
	}

	class PlatformMotion {
		constructor() {
			this.moving = false;
			this.is_moving_right = true;
			this.dx = 0;
		}

		update_dx(pixels) {
			if (this.moving) {
				if (this.is_moving_right) {
					this.dx += pixels;
				} else {
					this.dx -= pixels;
				}
				if (this.dx >= 3) {
					this.is_moving_right = false;
				}
				if (this.dx <= -3) {
					this.is_moving_right = true;
				}
			}
		}
	}

	class Platform {
		constructor(x, y, size) {
			this.x = x;
			this.y = y;
			this.size = size;
			this.motion = new PlatformMotion();
		}

		set_moving(bool) {
			this.motion.moving = bool;
		}

		draw() {
			this.motion.update_dx(0.1);
			this.x += this.motion.dx;

			//moves car on platform
			if (car.is_on_platform(this)) {
				car.x += this.motion.dx;
			}
			p.push();
			p.stroke("red");
			p.line(this.x, this.y, this.x + this.size, this.y);
			p.pop();
		}
	}

	class Coin {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.width = 10;
			this.height = 10;
		}

		draw() {
			p.push();
			p.noStroke();
			p.fill("yellow");
			p.ellipse(this.x, this.y + 2, 25);
			p.fill("green");
			p.text('$', this.x, this.y);
			p.pop();
		}
	}

	class GameOverScreen {
		constructor(best_time) {
			this.x = 200;
			this.y = 200;
			this.color = p.color(0, 128, 128, 255);
			this.best_time = best_time;
		}

		draw() {
			p.push();
			p.fill(this.color);
			p.text("Press space to play again!", this.x, this.y);
			p.text("Best time: " + this.best_time, 200, 250);
			p.pop();
		}
	}

	class Timer {
		constructor() {
			this.x = 75;
			this.y = 10;
			this.time = 0;
		}

		set_time(time) {
			this.time = this.time + time;
		}

		draw() {
			p.push();
			p.fill(0, 128, 128);
			p.text("Time: " + (this.time / 1000).toFixed(3), this.x, this.y);
			p.pop();
		}
	}

	class BestTimeDisplay {
		constructor() {
			this.x = 275;
			this.y = 10;
			this.best_time = 0;
		}

		set_best_time(best_time) {
			this.best_time = best_time
		}

		draw() {
			p.push();
			p.fill(0, 128, 128);
			console.log(this.best_time);
			p.text("Best Time: " + this.best_time.toFixed(3), this.x, this.y);
			p.pop();
		}
	}
}
