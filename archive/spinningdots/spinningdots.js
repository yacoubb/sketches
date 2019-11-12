/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var dots = 10;
var r = 50;
var w;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
	colorMode(HSB);
}

function init() {
	r = min(width, height) * 0.04;
	w = r / 3;
	console.log(r);
	noStroke();
}

function draw() {
	translate(width / 2, height / 2);
	background(20);
	for (var i = 1; i <= dots; i++) {
		for (var j = 0; j < i * 4; j++) {
			var a = (frameCount * 0.1) / i + (j / (i * 4)) * TAU;
			fill(((a * 360) / TAU) % 360, 255, 255);
			//fill(j / (i * 4) * 360, 255, 255);
			var x = r * i * cos(a);
			var y = r * i * sin(a);
			ellipse(x, y, w, w);
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
