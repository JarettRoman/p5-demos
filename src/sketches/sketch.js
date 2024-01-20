export default function sketch(p) {
    p.setup = () => {
        p.createCanvas(400, 400);
    };

    p.draw = () => {
        if (p.mouseIsPressed) {
            p.fill(0);
        } else {
            p.fill(255);
        }
        p.ellipse(p.mouseX, p.mouseY, 80, 80);
    };
}
