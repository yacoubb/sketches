/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var bigR = 400;
var sw = 7;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
	colorMode(HSB);
}

function init() {
	bigR = (400 / 974) * min(width, height);
	sw = (7 / 400) * bigR;
}

function draw() {
	background(20);
	translate(width / 2, height / 2);
	noFill();
	strokeWeight(sw);
	var count = 17;
	for (var t = 0; t < count; t++) {
		var h = (map(t, 0, count, 0, 360) + frameCount * 2) % 360;
		stroke(h, 255, 255);
		var r = 1.2 * sin(frameCount * 0.01 + t * 0.1) * bigR;
		rect(-bigR / 2, -r / 2, bigR, r);
		rotate(PI / count);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
