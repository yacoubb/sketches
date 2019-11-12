/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var x = 0.01,
	y = 0,
	z = 0;
var a = 10,
	b = 8.0 / 3.0,
	c = 28;
var dt = 0.01;
var points = [];
scaleFloat = 15;
var running = true;
showPoint = false;

//camera control variables
var ox = 0,
	oy = 0,
	oz = -400;
var t = 0.5 * Math.PI;
var s = 0.5 * Math.PI;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	colorMode(HSB);
	points.push([0, 0, 0]);
}

function keyPressed() {
	console.log(keyCode);
	if (keyCode == 49) {
		console.log('camera1');
		t = 0.5 * Math.PI;
		s = 0.5 * Math.PI;
		ox = oy = 0;
		oz = -400;
		scaleFloat = 15;
	}
	if (keyCode == 50) {
		t = Math.PI;
		s = Math.PI;
		ox = oy = oz = 0;
		scaleFloat = 9;
	}
	if (keyCode == 51) {
		t = 0.5 * Math.PI;
		s = 0;
		ox = oy = 0;
		oz = -400;
		scaleFloat = 12;
	}
	if (keyCode == 32) {
		//reset camera
		console.log(t, s);
		console.log(ox, oy, oz);
		running = !running;
	}
	if (keyCode == 72) {
		showPoint = !showPoint;
	}
}

function draw() {
	background(20);
	//text("3d lorenz attractor", 0, 11);
	//text("move camera with arrow keys", 0, 22);
	//text("move scene centre with WASDZX", 0, 33);
	//text("snap to camera angles with 1 2 3", 0, 44);
	if (keyIsDown(UP_ARROW)) {
		t += 0.1;
		if (t > Math.PI) {
			t = Math.PI - 0.001;
		}
	}
	if (keyIsDown(RIGHT_ARROW)) {
		s -= 0.1;
	}
	if (keyIsDown(DOWN_ARROW)) {
		t -= 0.1;
		if (t < 0) {
			t = 0.001;
		}
	}
	if (keyIsDown(LEFT_ARROW)) {
		s += 0.1;
	}
	if (keyIsDown(87)) {
		//W
		oy -= 10;
	}
	if (keyIsDown(65)) {
		//A
		ox -= 10;
	}
	if (keyIsDown(83)) {
		//S
		oy += 10;
	}
	if (keyIsDown(68)) {
		//D
		ox += 10;
	}
	if (keyIsDown(90)) {
		//Z
		oz += 10;
	}

	if (keyIsDown(81)) {
		//Q
		oz -= 10;
	}

	if (running) {
		var dx = a * (y - x);
		var dy = x * (c - z) - y;
		var dz = x * y - b * z;

		x += dx * dt;
		y += dy * dt;
		z += dz * dt;

		points.push([x, y, z]);
	}

	stroke(100, 255, 255, 100);
	for (var i = 0; i < points.length; i++) {
		push();
		translate(points[i][0] * scaleFloat, -points[i][2] * scaleFloat, points[i][1] * scaleFloat);
		box(0.5, 0.5, 0.5);
		//sphere(0.05, 6, 6);
		pop();
	}
	r = 822;
	if (showPoint) {
		stroke(0, 255, 255, 255);
		push();
		translate(ox, oz, oy);
		box(2, 2, 2);
		pop();
	}
	camera(r * cos(s) * sin(t) + ox, r * cos(t) + oz, r * sin(s) * sin(t) + oy, ox, oz, oy, 0, 1, 0);
}
