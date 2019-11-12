/// <reference path="../../node_modules/@types/p5/global.d.ts" />

function setup() {
	createCanvas(windowWidth, windowHeight);
	console.log(cos(radians(60)));
}

function draw() {
	background(51);
	translate(width / 2, height / 2);
	rotate(PI);
	for (var i = 0; i < 20; i++) {
		var rad = (min(width, height) * 0.8 * (20 - i)) / 20;
		rotate(sin((frameCount - i) * 0.2) * 0.05);
		triangle(-rad / 2, -rad / 2, rad / 2, -rad / 2, 0, rad / 2);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
