/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var currentX = 0;
var currentY = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	init();
}

function init() {
	background(20);
	stroke(255);
	currentX = 0;
	currentY = 0;
}

function draw() {
	translate(width / 2, height);
	for (var i = 0; i < 1000; i++) {
		stroke(map(currentY, 0, 10, 0, 340), 255, 255);
		point(
			map(currentX, -2.182, 2.6558, -height / 2, height / 2),
			-map(currentY, 0, 9.9983, 0, height)
		);
		//point(currentX * 100, -currentY * 100);
		var val = random();
		if (val <= 0.01) {
			var newCoords = f1(currentX, currentY);
			currentX = newCoords[0];
			currentY = newCoords[1];
		} else if (val <= 0.86) {
			var newCoords = f2(currentX, currentY);
			currentX = newCoords[0];
			currentY = newCoords[1];
		} else if (val <= 0.93) {
			var newCoords = f3(currentX, currentY);
			currentX = newCoords[0];
			currentY = newCoords[1];
		} else {
			var newCoords = f4(currentX, currentY);
			currentX = newCoords[0];
			currentY = newCoords[1];
		}
	}
}

function f1(x, y) {
	return [0, 0.16 * y];
}

function f2(x, y) {
	return [0.85 * x + 0.04 * y, -0.04 * x + 0.85 * y + 1.6];
}

function f3(x, y) {
	return [0.2 * x - 0.26 * y, 0.23 * x + 0.22 * y + 1.6];
}

function f4(x, y) {
	return [-0.15 * x + 0.28 * y, 0.26 * x + 0.24 * y + 0.44];
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (keyCode == 32) {
		init();
	}
}
