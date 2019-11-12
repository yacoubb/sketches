/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var startR = 400;
var depth = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	startR = width;
	background(51);
	translate(width / 2, height / 2);
	stroke(255);
	rotate(PI / 2);
	translate(startR / 6, -startR / 2);
	koch(0, 0, startR, 0);
}

function draw() {
	if (frameCount % 60 == 0) {
		depth++;
		depth %= 7;
		init();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function koch(x, y, r, d) {
	translate(x, y);
	if (d < depth) {
		push();
		koch(0, 0, r / 3, d + 1);
		translate(0, r / 3);
		rotate(radians(60));
		koch(0, 0, r / 3, d + 1);
		translate(0, r / 3);
		rotate(-radians(120));
		koch(0, 0, r / 3, d + 1);
		translate(0, r / 3);
		rotate(radians(60));
		koch(0, 0, r / 3, d + 1);
		translate(0, r / 3);
		pop();
	} else {
		push();
		line(0, 0, 0, r / 3);
		translate(0, r / 3);
		rotate(radians(60));
		line(0, 0, 0, r / 3);
		translate(0, r / 3);
		rotate(-radians(120));
		line(0, 0, 0, r / 3);
		translate(0, r / 3);
		rotate(radians(60));
		line(0, 0, 0, r / 3);
		translate(0, r / 3);
		pop();
	}
}
