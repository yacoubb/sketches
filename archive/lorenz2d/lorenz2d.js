/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var x = 0,
	y = 0,
	z = 0;
var a = 10,
	b = 8.0 / 3.0,
	c = 28;
var dt = 0.007;
var t = 0;
var points = [];
scaleFloat = 15;
var angle = 0;
running = true;
showToolTip = true;

function setup() {
	init();
	createCanvas(windowWidth, windowHeight);
	windowResized();
	points.push([0, 0, 0]);
}

function init() {
	points = [];
	(x = 0.1), (y = 0), (z = 0);
	(a = 10), (b = 8.0 / 3.0), (c = 28);
	dt = 0.007;
	t = 0;
}

function keyPressed() {
	if (keyCode >= 49 && keyCode <= 51) {
		angle = keyCode - 49;
		windowResized();
	} else if (keyCode == 32) {
		running = !running;
	} else if (keyCode == 82) {
		init();
	} else if (keyCode == 188) {
		dt -= 0.001;
		if (dt <= 0) {
			dt = 0.001;
		}
	} else if (keyCode == 190) {
		dt += 0.001;
	}
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	scaleFloat = (15.0 / 974.0) * Math.min(windowWidth, windowHeight);
	if (angle == 0) {
		scaleFloat = scaleFloat * 1.2;
	}
}

function draw() {
	background(51);
	if (showToolTip) {
		noStroke();
		fill(255, 255, 255, 255);
		text('2d lorenz attractor', 0, 11);
		text('pause with space', 0, 22);
		text('change dt with , and .', 0, 33);
		text('snap to camera angles with 1 2 3', 0, 44);
		text('h to show/hide this', 0, 55);
	}
	if (angle == 0) {
		if (showToolTip) {
			text('z', 0, 66);
			text('|', 0, 77);
			text(' ----x', 0, 88);
		}
		translate(width / 2, height);
	} else if (angle == 1) {
		if (showToolTip) {
			text('x', 0, 66);
			text('|', 0, 77);
			text(' ----y', 0, 88);
		}
		translate(width / 2, height / 2);
	} else {
		if (showToolTip) {
			text('z', 0, 66);
			text('|', 0, 77);
			text(' ----y', 0, 88);
		}
		translate(width / 2, height);
	}
	if (running) {
		var dx = a * (y - x);
		var dy = x * (c - z) - y;
		var dz = x * y - b * z;
		x += dx * dt;
		y += dy * dt;
		z += dz * dt;
		t += dt;
		points.push([x, y, z]);
	}
	stroke(85, 255, 0, 255);
	noFill();
	beginShape();
	for (var i = 0; i < points.length; i++) {
		if (angle == 0) {
			vertex(points[i][0] * scaleFloat, -points[i][2] * scaleFloat);
		} else if (angle == 1) {
			vertex(points[i][0] * scaleFloat, -points[i][1] * scaleFloat);
		} else {
			vertex(points[i][1] * scaleFloat, -points[i][2] * scaleFloat);
		}
	}
	//rotateY(t);
	endShape();
}
