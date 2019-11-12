/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 10;
var n;
var r = 200;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	n = floor(width / w);
}

function draw() {
	background(0);
	strokeWeight(2);
	r = min(width / 2 - mouseX, height / 2);
	for (var x = 0; x <= n; x++) {
		var theta = ((x * w) / width) * TAU + frameCount * 0.01;
		stroke(((n - x * 1.5) / n) * 255, 0, ((x * 1.5) / n) * 255);
		line(x * w, height / 2, width / 2 + cos(theta) * r, height / 2 - sin(theta) * r);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function sig(x) {
	return x / (1 + abs(x));
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
	if (keyCode == 32) {
		running = !running;
	}
}
