/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var cHeight;
var w = 10;
var r;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	init();
}

function init() {
	cHeight = floor((height * 0.7) / w);
	r = width * 0.07;
}

function draw() {
	background(20);
	translate(width / 2, height * 0.15);
	noFill();
	strokeWeight(2);
	for (var y = 0; y < cHeight; y++) {
		var a = sin((y / cHeight) * PI * 1.5 + frameCount * 0.03);
		//var flux = a * r * (1 + 0.6 * sin(frameCount * 0.03));
		var flux = a * r * (1 + 0.6 * a);
		var bright = map(cHeight - y, cHeight, 0, 200, 40);
		stroke(30, bright, bright * 1.5);
		translate(0, w);
		beginShape();
		vertex(-r, 0);
		vertex(flux, -10 * w);
		vertex(r, 0);
		vertex(-flux, -10 * w);
		endShape(CLOSE);
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
