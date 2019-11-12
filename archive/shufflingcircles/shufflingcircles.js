/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 40;
var xOff = 0;
var yOff = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	fill(255);
	noStroke();
	colorMode(HSB);
}

function draw() {
	background(20);
	if (frameCount % (w * 2) > w) {
		xOff += 1;
		if (frameCount % (w * 4) > 2 * w) {
			yOff += 1;
		} else {
			yOff -= 1;
		}
	}
	xOff = 0;
	yOff = 0;
	translate(width / 2, height / 2);
	scale(1.1);
	translate(-width / 2, -height / 2);
	fill(255);
	for (var x = 0; x <= ceil(width / w); x++) {
		for (var y = 0; y <= ceil(height / w); y++) {
			var x1 = wrap(x * w + (y % 2 == 0 ? 1 : -1) * xOff, width);
			var y1 = wrap(y * w + yOff, height);
			var r = 0.2 + 0.8 * abs(sin(frameCount * 0.02 + dist(x1, y1, width / 2, height / 2) * 0.01));
			fill((r - 0.2) * 360, 255, 255);
			ellipse(x1, y1, w * r, w * r);
		}
	}
}

function wrap(x, n) {
	if (x < 0) {
		return n + (x % n);
	}
	return x % n;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
