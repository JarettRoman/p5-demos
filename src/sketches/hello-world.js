export default function sketch(p) {

	let r, g, b;

	p.setup = () => {
		p.createCanvas(600, 400);
		r = p.random(255);
		g = p.random(255);
		b = p.random(255);
	}

	p.draw = () => {
		p.background(127);
		//draw a circle
		p.strokeWeight(2);
		p.stroke(r, g, b);
		p.fill(r, g, b, 127);
		p.ellipse(300, 200, 200, 200);
	}

	p.mousePressed = () => {
		let d = p.dist(p.mouseX, p.mouseY, 360, 200);
		if (d < 100) {
			r = p.random(255);
			g = p.random(255);
			b = p.random(255);
		}
	}
}