/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var r = 100;
var points = 40;
var segments = 100;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	r = min(width, height) * 0.2;
	strokeWeight(2);
}

function draw() {
	background(51);
	translate(width / 2, height / 2 + r / 5);
	for (var t = 0; t < points; t++) {
		fill(255);
		noStroke();
		var x = r * cos((t / points) * TAU);
		var y = r * sin((t / points) * TAU);
		push();
		translate(x, y);
		ellipse(0, 0, 10, 10);
		stroke(255);
		noFill();
		beginShape();
		for (var s = 0; s < segments; s++) {
			vertex(
				(min(frameCount / 300, (3 * s) / segments) *
					sin((s / segments) * TAU + t + frameCount * 0.01) *
					r) /
					6,
				(-s * r) / segments
			);
		}
		endShape();
		pop();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (keyCode == 72) {
	}
	if (keyCode == 32) {
	}
}
