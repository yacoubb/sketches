/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var cWidth;
var cHeight;
var w = 10;
var space = 6;
var ratio;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	ratio = width / height;
	cWidth = floor(width / w / space);
	cHeight = floor(height / w / space);
	colorMode(HSB);
	cWidth++;
	cHeight++;
	if (cWidth % 2 == 1) {
		cWidth++;
	}
	if (cHeight % 2 == 1) {
		cHeight++;
	}
	console.log(cWidth, cHeight);
}

function draw() {
	background(20);
	noStroke();
	fill(0, 0, 255);
	translate(width / 2, height / 2);
	for (var x = -cWidth / 2; x <= cWidth / 2; x++) {
		for (var y = -cHeight / 2; y <= cHeight / 2; y++) {
			var d = map(x * x + y * y, 0, 200, 0.5, 2);
			var s = sin(frameCount * 0.05 + 4 / (abs(x) + 2) + 4 / (abs(y) + 2));
			var c = cos(frameCount * 0.05 + 4 / (abs(x) + 2) + 4 / (abs(y) + 2));
			s /= d;
			var xCoord = (x + 0.5 * abs(y % 2) + 0.2 * s) * w * space;
			var yCoord = y * (1 + abs(y / 200)) * w * space;
			var xCoordB = (x + 0.5 * abs(y % 2) + 0.2 * (c / d)) * w * space;
			var yCoordB = y * w * space;
			c /= 0.5 + d;
			if (c > 0) {
				fill(0, 0, 255);
				ellipse(xCoord, yCoord, w * (1 + 0.3 * c), w * (1 + 0.3 * c));
				fill(0, 0, 0);
				ellipse(xCoordB, yCoordB, w * (1 + 0.3 * s), w * (1 + 0.3 * s));
			} else {
				fill(0, 0, 0);
				ellipse(xCoordB, yCoordB, w * (1 + 0.3 * s), w * (1 + 0.3 * s));
				fill(0, 0, 255);
				ellipse(xCoord, yCoord, w * (1 + 0.3 * c), w * (1 + 0.3 * c));
			}
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
