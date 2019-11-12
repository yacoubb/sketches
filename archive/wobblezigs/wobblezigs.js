/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 40;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {}

function draw() {
	background(51);
	translate(width / 2, height / 2);
	rotate(PI / 4);
	translate(-width * 0.6, -height * 1.2);
	for (var x = 0; x < (width / w) * 1.2; x++) {
		fill(255 * (x % 2), 0, 0);
		beginShape();
		for (var y = 0; y <= (height * 2.4) / w; y++) {
			vertex(0, y * w);
		}
		for (var y = 0; y <= (height * 2.4) / w; y++) {
			vertex(w, y * w);
		}
		endShape(CLOSE);
		translate(w, 0);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
