/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var cWidth;
var cHeight;
var w = 100;
var a;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	cWidth = ceil(width / w);
	cHeight = ceil(height / w);
	fill(255);
	a = 0;
}

function draw() {
	translate(w / 2, w / 2);
	background(51);
	if (frameCount % 60 <= 20) {
		a = (frameCount * PI) / 20;
	}
	for (var x = 0; x < cWidth; x++) {
		for (var y = 0; y < cHeight; y++) {
			var b = a;
			if (x % 2 == 1) {
				if (y % 2 == 1) {
					b += (3 * PI) / 2;
				} else {
					b += PI;
				}
			} else {
				if (y % 2 == 1) {
					b += 0;
				} else {
					b += PI / 2;
				}
			}
			//var a = frameCount * 0.01;
			arc(x * w * 1.1, y * w * 1.1, w, w, b, b + (3 * PI) / 2);
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
