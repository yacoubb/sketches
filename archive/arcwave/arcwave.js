/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var count = 20;
var w = 60;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	w = (min(width, height) / 974) * 60;
	strokeWeight(w / 6);
	stroke(255);
	noFill();
}

function draw() {
	background(51);
	translate(width / 2, height * 0.8);
	for (var i = 1; i <= count; i++) {
		//stroke(map(i, 1, count*1.15, 0, 360), 255, 255);
		arc(0, 0, i * w, i * w, PI, PI + PI * abs(sin(frameCount * 0.02 + ((i + 1) / count) * PI)));
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
