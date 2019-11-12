/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var running = true;

var insidePoints = [];
var outsidePoints = [];
var r = 1;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	r = min(width, height) * 0.47;
}

function draw() {
	//background(51);
	translate(width / 2, height / 2);
	if (running) {
		for (var i = 0; i < 1000; i++) {
			var randPoint = [random(-r, r), random(-r, r)];
			if (squareDist(randPoint[0], randPoint[1], 0, 0) <= r * r) {
				insidePoints.push(randPoint);
				stroke(255);
			} else {
				outsidePoints.push(randPoint);
				stroke(100);
			}
			point(randPoint[0], randPoint[1]);
		}
	}
	translate(-width / 2, -height / 2);
	fill(51);
	noStroke();
	rect(0, 0, 200, 100);
	fill(255);
	text(str((insidePoints.length * 4) / (insidePoints.length + outsidePoints.length)), 0, 11);
	text(str(insidePoints.length + outsidePoints.length) + ' points', 0, 22);
}

function squareDist(x1, y1, x2, y2) {
	return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (keyCode == 32) {
		running = !running;
	}
}
