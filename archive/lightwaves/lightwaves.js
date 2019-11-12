/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var wavelengths = [];
var amplitudes = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	init();
}

function init() {
	stroke(255);
	strokeWeight(4);
	wavelengths = [];
	amplitudes = [];
	for (var i = 0; i < 5; i++) {
		wavelengths.push(floor(random() * 300) + 400);
		amplitudes.push(0.2 + random() * 8);
	}
	drawOnce();
}

function drawOnce() {
	background(20);
	translate(0, height / 2);
	for (var i = 0; i < 5; i++) {
		stroke(map(wavelengths[i], 700, 400, 0, 300), 255, 255);
		strokeWeight(1 + ceil(sqrt(amplitudes[i])));
		for (var x = 0; x <= width; x++) {
			var y1 =
				sin((((((x * TAU) / wavelengths[i]) * PI) / 2) * 1080) / width) *
				height *
				0.05 *
				amplitudes[i];
			var y2 =
				sin(((((((x - 1) * TAU) / wavelengths[i]) * PI) / 2) * 1080) / width) *
				height *
				0.05 *
				amplitudes[i];
			line(x - 1, y2, x, y1);
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	drawOnce();
}

function keyPressed() {
	if (keyCode == 32) {
		init();
	}
}
