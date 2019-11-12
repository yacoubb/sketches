/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var n = 30000;
var numbers = [];
var r = 2;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	init();
}

function init() {
	numbers = [];
	for (var i = 0; i < n; i++) {
		numbers.push(floor(random(0, 10)));
	}
	translate(width / 2, height / 2);
	background(20);
	for (var i = 0; i < n; i++) {
		rotate((TAU * numbers[i]) / 10);
		stroke((i / n) * 300, 255, 255);
		line(0, 0, 0, 2);
		translate(0, 2);
	}
}

function draw() {
	if (frameCount % 100 == 0) {
		init();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
