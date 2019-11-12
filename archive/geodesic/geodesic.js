/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = true;
var toolTipText = ['p5 project', 'h to show/hide this'];
var running = true;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	init();
}

function init() {}

function draw() {
	background(51);
	rotateX(frameCount * 0.01);
	rotateY(frameCount * 0.01);
	sphere(200, 12, 6);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
	if (keyCode == 32) {
		running = !running;
	}
}
