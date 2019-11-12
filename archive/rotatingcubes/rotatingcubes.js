/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var r;
var boxes = 6;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	colorMode(HSB);
	init();
}

function init() {
	r = min(width, height) * 0.5;
}

function draw() {
	background(20);
	noFill();
	strokeWeight(3);
	for (var i = 1; i < boxes; i++) {
		var iOver = i / boxes;
		stroke(map(i, 1, boxes, 0, 360), 255, 255);
		push();
		rotateY(frameCount * iOver * 0.05);
		rotateX(PI * 0.35);
		box(r * iOver, r * iOver, r * iOver);
		pop();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
