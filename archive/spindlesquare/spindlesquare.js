/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var points = 100;
var w = 4;
var r = 100;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	r = min(width, height) * 0.2;
	stroke(240);
	fill(240);
}

function draw() {
	translate(width / 2, height / 2);
	background(51);
	for (var i = 0; i < points; i++) {
		var t = (TAU * i) / points;
		var c = cos(t);
		var s = sin(t);
		var rr = min(r / abs(cos(t + frameCount * 0.01)), r / abs(sin(t + frameCount * 0.01)));
		var x = rr * c;
		var y = rr * s;
		ellipse(x, y, w, w);
		var rrr = lerp(r, rr, 0.5 * (1 + sin(frameCount * 0.01)));
		var x1 = rrr * 1.8 * c;
		var y1 = rrr * 1.8 * s;
		line(x, y, x1, y1);
		ellipse(x1, y1, w, w);
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
