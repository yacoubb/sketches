/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var rad = 100;
var count = 30;
var a = 2;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	drawOnce();
}

function draw() {
	a += 0.01;
	//a = 36;
	drawOnce();
}

function drawOnce() {
	rad = min(width, height) * 0.5;
	background(20);
	translate(width / 2, height * 0.52);
	noFill();
	stroke(255);
	for (var i = 0; i < count; i++) {
		//fill(map(i, 0, count, 0, 340), 255, 255);
		polygon(0, 0, rad, 5);
		rad *= mult();
		//rad = min(width, height) * 0.5 / i * cos(radians(a));
		rotate(a);
	}
}

function mult() {
	return sin(radians(108)) / (sin(radians(72 - a)) + sin(radians(a)));
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function polygon(x, y, r, n) {
	beginShape();
	for (var t = 0; t <= TAU + 0.01; t += TAU / n) {
		vertex(x + r * sin(t), y - r * cos(t));
	}
	endShape(CLOSE);
}
