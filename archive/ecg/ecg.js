/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var frameConstant = 0.04;
var startFrame = 0;
var speedConst = 10;
var debug = false;
var w = 40;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	noFill();
}

function draw() {
	background(220);
	strokeWeight(2);
	stroke(100);
	for (var x = 0; x < floor(width / w); x++) {
		line(x * w, 0, x * w, height);
	}
	for (var y = 0; y < floor(width / w); y++) {
		line(0, y * w, width, y * w);
	}
	translate(0, height / 2);
	if (debug) {
		stroke(255, 0, 0);

		beginShape();
		for (var x = 0; x < width; x++) {
			var xx = (x / width) * 2 * TAU * speedConst + frameCount * frameConstant;
			var y = (f1(xx) * height) / 4;
			vertex(x, y);
		}
		endShape();

		stroke(0, 0, 255);

		beginShape();
		for (var x = 0; x < width; x++) {
			var xx = (x / width) * 2 * TAU * speedConst + frameCount * frameConstant;
			var y = (f2(xx) * height) / 4;
			vertex(x, y);
		}
		endShape();

		stroke(0, 255, 0);

		beginShape();
		for (var x = 0; x < width; x++) {
			var xx = (x / width) * 2 * TAU * speedConst + frameCount * frameConstant;
			var y = (f3(xx) * height) / 4;
			vertex(x, y);
		}
		endShape();
	} else {
		stroke(0, 200, 0);

		beginShape();
		for (var x = 0; x < frameCount - startFrame; x++) {
			var xx = (x / width) * 2 * TAU * speedConst;
			var y = (calcECG(xx) * height) / 2;
			vertex(x, y);
		}
		endShape();
	}
}

function calcECG(t) {
	var m = 1;
	return f1(t * m) - f2(t * m) * f3(t * m) + noise(t * 4) * 0.1;
}

function f1(t) {
	return -max(0.6, cos(t) * sin(2 * t)) + 0.7;
}

function f2(t) {
	return sin(pow(8, sin(t * 4 + PI * 0.6)) * 0.5) + noise(t / speedConst) * 0.1;
}

function f3(t) {
	return -pow(sin(t * 0.5 - 2.324), 100);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
