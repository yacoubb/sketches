/// <reference path="../../node_modules/@types/p5/global.d.ts" />

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
}

function draw() {
	background(20);
	translate(width / 2, height / 2);
	var count = 50;
	var rootCount = sqrt(count);
	for (var z = count; z > 0; z--) {
		for (var t = 0; t < 10; t++) {
			var h = (map(t, 0, 9, 0, 360) + frameCount * 2) % 360;
			//(frameCount * 2 + t * 10) % 360;
			var rootZ = sqrt(z);
			fill(h, 255, 255);
			var r = 350 + 20 * sin(frameCount / 10);
			var x = cos((t / 10 + (((frameCount - 200) * z) / count) * 0.01) * TAU) * r;
			var y = sin((t / 10 + (((frameCount - 200) * z) / count) * 0.01) * TAU) * r;
			ellipse((x * rootZ) / 4, (y * rootZ) / 4, 20 * z, 20 * z);
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
