/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var depth = 40;
var coords = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	coords = [];
	for (var i = 0; i < depth; i++) {
		coords.push([width / 2, height / 2]);
	}
}

function draw() {
	background(0);
	fill(0);
	stroke(255);
	for (var i = depth - 1; i >= 0; i--) {
		//var rooti = pow(i+2, 0.8);
		var rooti = (i * i) / 2 + 1;
		coords[i] = [lerp(coords[i][0], mouseX, 1 / rooti), lerp(coords[i][1], mouseY, 1 / rooti)];
		ellipse(coords[i][0], coords[i][1], rooti * 10);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
