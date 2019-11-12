/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var r = 100;
var phi = 1;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	r = min(width, height) * 0.5;
	fill(255);
	phi = (1 + sqrt(5)) / 2;
}

function draw() {
	background(51);
	var angle = 0;
	translate(width / 2, height / 2);
	var i = 1;
	var rootI = sqrt(i);
	while (rootI < r) {
		ellipse(rootI * cos(angle), rootI * sin(angle), min(6, rootI / 5 + 1), min(6, rootI / 5 + 1));
		angle += phi;
		i += 50;
		rootI = sqrt(i);
	}
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
