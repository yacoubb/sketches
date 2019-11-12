/// <reference path="../../node_modules/@types/p5/global.d.ts" />

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
}

function draw() {
	background(20);
	translate(width / 2, height / 2);
	for (var j = 20; j > 0; j--) {
		var rootj = sqrt(j);
		var y = cos(frameCount * 0.01 - (j * PI) / 20) * 200;
		var h = (frameCount * 2 + j * 10) % 360;

		fill(h, 255, 255);
		for (var i = 0; i < 9; i++) {
			var x = ((i - 4) * width) / 10;
			ellipse((x * rootj) / 4, y, 20 * j, 20 * j);
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
