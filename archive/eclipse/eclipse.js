/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 100;

function setup() {
	createCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
	init();
}

function init() {
	noStroke();
	fill(255);
	w = min(width, height) * 0.1;
}

function draw() {
	background(10);
	translate(width / 2, height / 2);
	push();
	rotate(radians(10));
	for (var i = 0; i < 12; i++) {
		var coord =
			((frameCount - 3 + i * w) % (min(width, height) + 2 * w)) - w - min(width, height) / 2;
		fill(255, 0, 0);
		ellipse(coord, coord, w, w);
	}
	for (var i = 0; i < 12; i++) {
		var coord =
			((frameCount + 2 + i * w) % (min(width, height) + 2 * w)) - w - min(width, height) / 2;
		fill(0, 255, 255);
		ellipse(coord, coord, w, w);
	}
	for (var i = 0; i < 12; i++) {
		var coord =
			((frameCount - 1 + i * w) % (min(width, height) + 2 * w)) - w - min(width, height) / 2;
		fill(255, 255, 0);
		ellipse(coord, coord, w, w);
	}
	for (var i = 0; i < 12; i++) {
		var coord = ((frameCount + i * w) % (min(width, height) + 2 * w)) - w - min(width, height) / 2;
		fill(255);
		ellipse(coord, coord, w, w);
	}
	pop();
	rotate(radians(20));
	for (var i = 0; i < 12; i++) {
		var coord = ((frameCount + i * w) % (min(width, height) + 2 * w)) - w - min(width, height) / 2;
		fill(10);
		ellipse(coord, coord, w * 0.9, w * 0.9);
	}
}

function windowResized() {
	resizeCanvas(min(windowWidth, windowHeight), min(windowWidth, windowHeight));
	init();
}
