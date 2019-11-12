/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var symmetries = 15;
var lastX = 0;
var lastY = 0;
var hu = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	background(20);
	stroke(0);
	strokeWeight(2);
	colorMode(HSB);
}

function draw() {
	if (mouseIsPressed) {
		hu++;
		hu %= 360;
		stroke(hu, 255, 255);
		translate(width / 2, height / 2);
		for (var i = 0; i < symmetries; i++) {
			line(lastX - width / 2, lastY - height / 2, mouseX - width / 2, mouseY - height / 2);
			rotate((TAU * 1) / symmetries);
		}
		lastX = mouseX;
		lastY = mouseY;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
	lastX = mouseX;
	lastY = mouseY;
}

function mouseReleased() {}
