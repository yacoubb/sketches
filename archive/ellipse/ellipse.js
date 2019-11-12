/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var pointA = true;
var pointB = true;
var pointC = true;

var a, b;
var startFrame = 0;

var speed = 0.03;

var x1, y1;
var x2, y2;
var px, py;
var ox, oy;

function setup() {
	createCanvas(windowWidth, windowHeight);
}

function init() {
	ox = (x1 + x2) / 2;
	oy = (y1 + y2) / 2;
	a = (dist(x1, y1, px, py) + dist(x2, y2, px, py)) / 2;
	var c = dist(x1, y1, x2, y2) / 2;
	b = sqrt(a * a - c * c);
	startFrame = frameCount;
}

function draw() {
	if (pointA || pointB || pointC) {
		background(51);
	}
	if (pointA || pointB) {
		fill(255);
		noStroke();
		ellipse(mouseX, mouseY, 10, 10);
	}
	if (!pointA) {
		push();
		translate(width / 2, height / 2);
		ellipse(x1, y1, 10, 10);
		pop();
	}
	if (!pointB) {
		push();
		translate(width / 2, height / 2);
		ellipse(x2, y2, 10, 10);
		pop();
	}
	if (pointC) {
		stroke(255);
		line(x2 + width / 2, y2 + height / 2, mouseX, mouseY);
	}
	if (!pointA && !pointB && !pointC && (frameCount - startFrame) * speed <= TAU + speed) {
		background(51);
		translate(width / 2, height / 2);
		var v = createVector(x1 - ox, y1 - oy);
		push();
		translate(ox, oy);
		rotate(v.heading());
		beginShape();
		for (var t = 0; t <= min(TAU, (frameCount - startFrame) * speed); t += 0.007) {
			vertex(-a * cos(t), b * sin(t));
		}
		endShape();
		pop();
		fill(100);
		ellipse(x1, y1, 10, 10);
		ellipse(x2, y2, 10, 10);
	}
}

function mouseClicked() {
	if (pointA) {
		x1 = mouseX - width / 2;
		y1 = mouseY - height / 2;
		pointA = false;
	} else if (pointB) {
		x2 = mouseX - width / 2;
		y2 = mouseY - height / 2;
		pointB = false;
	} else if (pointC) {
		px = mouseX - width / 2;
		py = mouseY - height / 2;
		pointC = false;
		init();
	} else {
		pointA = pointB = pointC = true;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
