/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 50;
var G = 6.674;
var held = 0;
var running = true;

function setup() {
	createCanvas(windowWidth, windowHeight);
	fill(255);
	colorMode(HSB);
	G = 6.674 * pow(10, -11);
	M = 5.972 * pow(10, 24);
	GM = (G * M) / pow(10, 9); // about 30000
	//drawOnce();
}

function draw() {
	background(20);
	if (running) {
		if (mouseIsPressed) {
			if (held == 0) {
				held = 30;
			}
			held *= 1.02;
		} else {
			held *= 0.98;
			if (held < 0) {
				held = 0;
			}
		}
	}

	for (var x = 0; x <= width / w; x++) {
		for (var y = 0; y <= height / w; y++) {
			var x1 = x * w;
			var y1 = y * w;
			var p1 = createVector(mouseX - x1, mouseY - y1);
			//var p1 = createVector(width/2 - x1, height/2 - y1);
			var m = (GM - held * 1000) / (p1.magSq() + 0.01);
			m = min(m, w / 1.41);
			m = max(m, -w / 1.41);
			//var m = GM/(p1.mag() + 0.01)/ 100;
			//m = 10;
			if (m > 0) {
				stroke(map(m, 0, 35, 0, 300, true), 255, 255);
			} else {
				stroke(map(m, 0, -35, 0, 300, true), 255, 255);
			}
			m = min(m, dist(x1, y1, mouseX, mouseY));
			push();
			translate(x1, y1);
			rotate(PI + PI / 2 + p1.heading());
			line(0, 0, 0, m);
			translate(0, m);
			if (m < 0) {
				rotate(PI);
			}
			triangle(-1, 0, 1, 0, 0, 1);
			pop();
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (keyCode == 32) {
		running = !running;
	}
}
