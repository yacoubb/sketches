/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var count = 10;
var r = 400;
var sw;
var rainbow = true;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
	colorMode(HSB);
}

function init() {
	calcR();
}

function calcR() {
	r = (400 / 974) * min(width, height);
	sw = floor(r / 40);
}

function draw() {
	background(20);
	translate(width / 2, height / 2);
	stroke(0, 0, 255);
	noFill();
	for (var i = 0; i < 10; i++) {
		if (rainbow) {
			stroke(map(i, 0, 10, 0, 360), 255, 255);
		}
		var R = r + (r / 10) * i;
		strokeWeight(1);
		ellipse(0, 0, R, R);
		strokeWeight(sw);
		var a = (i + 1) * (frameCount / 100);
		arc(0, 0, R, R, a, PI + a);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	calcR();
}

function keyPressed() {
	if (keyCode == ' '.charCodeAt(0)) {
		rainbow = !rainbow;
		stroke(0, 0, 255);
	}
}
