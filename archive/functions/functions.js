/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 120;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {}

function draw() {
	background(51);
	translate(w, w);
	for (var x = 0; x < 5; x++) {
		push();
		for (var y = 0; y < 3; y++) {
			fill(255);
			noStroke();
			var r = w / 2 - (functionList((i * TAU) / w + frameCount * 0.0, x + y * 5) * w) / 2;
			ellipse(0, 0, r, r);
			noFill();
			stroke(0);
			strokeWeight(4);
			beginShape();
			for (var i = -w * 0.7; i < w * 0.7; i++) {
				vertex(i, (functionList((i * TAU) / w + frameCount * 0.0, x + y * 5) * w) / 2);
			}
			endShape();
			translate(0, w * 2);
		}
		pop();
		translate(w * 2 * 1.2, 0);
	}
}

function functionList(t, f) {
	switch (f) {
		case 0:
			return sin(t);
		case 1:
			return cos(t) * sin(2 * t);
		case 2:
			return pow(sin(t), 3);
		case 3:
			return sin(pow(8, sin(t * 3 + PI * 1)) * 0.5);
		case 4:
			return cos(cos(t));
		case 5:
			return pow(sin(t * 0.75), 12);
		case 8:
			return -max(0.6, cos(t) * sin(2 * t)) + 0.7;
			break;
		case 13:
			break;
	}
	return sin(t);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
