/// <reference path="../../node_modules/@types/p5/global.d.ts" />

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
}

showToolTip = true;
var lastMouseX, lastMouseY;
var points = [];
var maxPoints = 50;
var hu = 0;
var reduce = true;

function draw() {
	background(20);
	if (showToolTip) {
		noStroke();
		fill(hu, 255, 255, 255);
		text('lines', 0, 11);
		text('click for longer line', 0, 22);
		text('h to show/hide this', 0, 33);
	}
	if (mouseX != lastMouseX || mouseY != lastMouseY) {
		if (points.length > maxPoints && reduce) {
			if (points.length > maxPoints + 1 && reduce) {
				points.splice(0, 3);
			} else {
				points.splice(0, 1);
			}
		}
		points.push([mouseX, mouseY]);
		lastMouseX = mouseX;
		lastMouseY = mouseY;
	}
	hu += 0.5;
	hu %= 360;
	stroke(hu, 255, 255, 255);
	noFill();
	beginShape();
	for (var i = 0; i < points.length; i++) {
		vertex(points[i][0], points[i][1]);
	}
	endShape();
}

function mouseClicked() {
	reduce = !reduce;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
}
