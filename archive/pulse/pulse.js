/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	w = min(width, height) * 0.7;
	noStroke();
}

function draw() {
	background(51);
	noStroke();
	fill(255, 0, 0);
	ellipse(width / 2 - 4, height / 2, w, w);
	fill(0, 255, 255);
	ellipse(width / 2 + 4, height / 2, w, w);
	fill(255);
	ellipse(width / 2, height / 2, w, w);

	translate(width / 2, height / 2);
	noFill();
	strokeWeight(3);
	var mod = frameCount % 50;
	if (mod > 46 || mod < 4) {
		var delta = mod;
		if (mod > 20) {
			delta = mod - 50;
		}
		stroke(255, 0, 0);
		beginShape();
		for (var x = -w / 2 + 2; x <= w / 2; x += 0.25) {
			var y = w * 0.4 * exp(-abs(x * 0.02)) * cos(0.2 * x + frameCount * 0.01 * TAU);
			vertex(x + delta, y);
		}
		endShape();

		stroke(0, 255, 255);
		beginShape();
		for (var x = -w / 2; x <= w / 2 - 2; x += 0.25) {
			var y = w * 0.4 * exp(-abs(x * 0.02)) * cos(0.2 * x + frameCount * 0.01 * TAU);
			vertex(x - delta, y);
		}
		endShape();
	} else {
		stroke(0);
		beginShape();
		for (var x = -w / 2; x <= w / 2; x += 0.25) {
			var y = w * 0.4 * exp(-abs(x * 0.02)) * cos(0.2 * x + frameCount * 0.01 * TAU);
			vertex(x, y);
		}
		endShape();
	}
}

function sigmoid(x) {
	return 1 / (1 + exp(-x));
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
