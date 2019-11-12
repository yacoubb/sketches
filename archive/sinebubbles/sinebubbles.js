/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 50;
var lines = 5;
var cWidth;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	init();
}

function init() {
	cWidth = floor((width * 1.5) / w);
	w = (min(width, height) / 974) * 50;
	noStroke();
}

function draw() {
	background(20);
	translate(0, height / 2 - w * (lines / 2 + 1));
	fill(255);
	for (var y = 0; y < lines; y++) {
		push();
		for (var x = 0; x <= cWidth; x++) {
			var s = sin(frameCount * 0.05 + x * 0.4 + (y * PI) / 4);
			var bright = (x * 10 + y * 50 + frameCount) % 360;
			var size = w * (-0.6 + s);
			//fill(map(s, -1, 1, 0, 200), 50, 255);
			fill(bright, 50, 255);

			ellipse(0, size / 2, size, size);
			translate(w + (size * 7) / w, 0);
		}
		pop();
		translate(0, w * 2);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
