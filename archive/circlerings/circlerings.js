/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var r = 300;
var count = 40;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	colorMode(HSB);
	noStroke();
	r = (300 / 974) * min(width, height);
}

function draw() {
	translate(width / 2, height / 2);
	background(20);
	for (var i = 0; i < 3; i++) {
		for (var t = 0; t < count; t++) {
			var R = r * (1 + 0.5 * sin((t / count) * TAU + frameCount * 0.1));
			var h = (map(t, 0, count, 0, 360) * 1 + frameCount) % 360;
			fill(h, 255, 255);
			var x = cos((t / count) * TAU + (i / 4) * PI) * R;
			var y = sin((t / count) * TAU + (i / 4) * PI) * R;
			ellipse(x, y, 20, 20);
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
