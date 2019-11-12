/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 25;
var root3;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	root3 = sqrt(3);
	fill(255);
	noStroke();
	stroke(0);
	//drawOnce();
}

function draw() {
	background(51);
	for (var x = 0; x < 2 * ceil(width / w); x++) {
		for (var y = 0; y < (ceil(height / w) * 2) / root3; y++) {
			equilateral(x * w, y * w, w);
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function equilateral(x, y, r) {
	triangle(x, y + (root3 / 3) * r, x + r / 2, y - (root3 / 6) * r, x - r / 2, y - (root3 / 6) * r);
}
