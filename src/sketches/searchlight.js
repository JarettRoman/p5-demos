export default function sketch(p) {
    let light, target;

    let targets;

    const TARGET_RADIUS = 16;

    let update = () => {
        light.update();

        // check if light intersects with target

        let distSq = Math.sqrt(
            (light.x - target.x) * (light.x - target.x) +
                (light.y - target.y) * (light.y - target.y)
        );

        if (distSq + target.r === light.r || distSq + target.r < light.r) {
            console.log('target is completely inside light');
        }
    };

    p.setup = () => {
        p.createCanvas(400, 400);
        target = new Target(
            Math.floor(Math.random() * 300) + TARGET_RADIUS,
            Math.floor(Math.random() * 300) + TARGET_RADIUS,
            TARGET_RADIUS
        );
        targets = [
            target,
            new Target(
                Math.floor(Math.random() * 300) + TARGET_RADIUS,
                Math.floor(Math.random() * 300) + TARGET_RADIUS,
                TARGET_RADIUS
            )
        ];
        console.log(targets);
        light = new Light();
    };

    p.draw = () => {
        update();
        p.background('purple');
        light.draw();
        targets.forEach((target) => target.draw());
        // target.draw();
    };

    class Light {
        constructor() {
            this.x = p.mouseX;
            this.y = p.mouseY;
            this.r = 50;
        }

        update = () => {
            this.x = p.mouseX;
            this.y = p.mouseY;
        };

        draw = () => {
            p.fill('white');
            p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
        };
    }

    class Target {
        constructor(x, y, r) {
            this.x = x;
            this.y = y;
            this.r = r;
        }

        found = () => {
            console.log('found target');
        };

        draw = () => {
            p.push();
            p.noStroke();
            p.fill('purple');
            p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
            p.pop();
        };
    }
}
