/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var r;
var w = 30;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	r = width * 0.1;
	strokeWeight(3);
}

function draw() {
	background(51);
	translate(width / 2, height * 0.2);
	noStroke();
	strokeWeight(3);
	for (var i = 0; i < 10; i++) {
		var y = i * height * 0.07;
		fill(255, 0, 0, 200);
		var x = sin((frameCount - 1) * 0.025 + i) * r;
		//ellipse(x, y, w, w);
		var x1 = x + (1.3 + cos((frameCount - 1) * 0.1 + i * 2 + 1)) * r * 0.5;
		var x2 = x - (1.4 - cos((frameCount - 1) * 0.1 - i - 1)) * r * 0.5;
		ellipse(x1, y, w, w);
		ellipse(x2, y, w, w);
		line(x1, y, x2, y);
	}
	strokeWeight(3);
	for (var i = 0; i < 10; i++) {
		var y = i * height * 0.07;
		fill(0, 255, 255, 200);
		var x = sin((frameCount + 1) * 0.025 + i) * r;
		//ellipse(x, y, w, w);
		var x1 = x + (1.3 + cos((frameCount + 1) * 0.1 + i * 2 + 1)) * r * 0.5;
		var x2 = x - (1.4 - cos((frameCount + 1) * 0.1 - i - 1)) * r * 0.5;
		ellipse(x1, y, w, w);
		ellipse(x2, y, w, w);
		line(x1, y, x2, y);
	}
	for (var i = 0; i < 10; i++) {
		var y = i * height * 0.07;
		noFill();
		stroke(255);
		strokeWeight(3);
		ellipse(-r, y, w, w);
		ellipse(r, y, w, w);
		fill(255);
		var x = sin(frameCount * 0.025 + i) * r;
		//ellipse(x, y, w, w);
		var x1 = x + (1.3 + cos(frameCount * 0.1 + i * 2 + 1)) * r * 0.5;
		var x2 = x - (1.4 - cos(frameCount * 0.1 - i - 1)) * r * 0.5;
		ellipse(x1, y, w, w);
		ellipse(x2, y, w, w);
		strokeWeight(15 - sqrt(x1 - x2) / 2);
		line(x1, y, x2, y);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
