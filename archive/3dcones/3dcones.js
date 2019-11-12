/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var cWidth;
var cHeight;
var w = 100;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	init();
}

function init() {
	ortho();
	cWidth = ceil(width / 2 / w);
	cHeight = ceil(height / 2 / w);
	noStroke();
	//stroke(0);
}

function draw() {
	if (frameCount % 200 <= 100) {
		background(51);
		translate(w - width / 2, -w - height / 2);
		for (var x = 0; x < cWidth; x++) {
			push();
			for (var y = 0; y < cHeight; y++) {
				translate(0, w * 2);
				fill(255);
				push();
				rotateX(frameCount * 0.01 * TAU);
				cone(w, w * 2);
				fill(255, 0, 0);
				translate(0, -w * 1.001);
				rotateX(PI / 2);
				ellipse(0, 0, w * 2);
				pop();
			}
			pop();
			translate(w * 2, 0);
		}
	} else if (frameCount % 200 <= 200) {
		background(255);
		translate(-width / 2, -w - height / 2);
		for (var x = 0; x < cWidth; x++) {
			push();
			for (var y = 0; y < cHeight; y++) {
				translate(0, w * 2);
				fill(51);
				push();
				rotateX(PI + frameCount * 0.01 * TAU);
				cone(w, w * 2);
				fill(85, 168, 98);
				translate(0, -w * 1.001);
				rotateX(PI / 2);
				ellipse(0, 0, w * 2);
				pop();
			}
			pop();
			translate(w * 2, 0);
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
