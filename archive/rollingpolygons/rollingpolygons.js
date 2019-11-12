/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = true;
var toolTipText = [
	'rolling polygons',
	'change the number of points with a and d',
	'space to pause',
	'h to show/hide this',
];
var running = true;
var circles = 8;
var coords = [];
var bigRadius = 300;
var smallRadius = 50;
var myAngle = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	for (var i = 0; i < circles; i++) {
		coords.push([0, 0]);
	}
	bigRadius = (300 / 750) * min(height, width);
	smallRadius = bigRadius / 4;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	bigRadius = (300 / 750) * min(height, width);
	smallRadius = bigRadius / 4;
}

function draw() {
	if (running) {
		myAngle++;
	}
	background(51);
	translate(width / 2, height / 2);
	noFill();
	stroke(255);
	var mult = ((8 / circles) * Math.PI) / 2;
	for (var i = 0; i < circles; i++) {
		var x = Math.cos((Math.PI * 2 * i) / circles) * bigRadius;
		var y = Math.sin((Math.PI * 2 * i) / circles) * bigRadius;
		coords[i][0] = x + Math.cos(myAngle / 10 + mult * i) * smallRadius;
		coords[i][1] = y + Math.sin(myAngle / 10 + mult * i) * smallRadius;
		ellipse(x, y, smallRadius * 2, smallRadius * 2);
	}
	for (var i = 0; i < circles; i++) {
		for (var j = 0; j < circles; j++) {
			if (i != j) {
				line(coords[i][0], coords[i][1], coords[j][0], coords[j][1]);
			}
		}
	}
	if (showToolTip) {
		noStroke();
		fill(255, 255, 255, 255);
		for (var i = 0; i < toolTipText.length; i++) {
			text(toolTipText[i], -width / 2, -height / 2 + 11 * (i + 1));
		}
		if (running) {
			text('running', -width / 2, -height / 2 + 11 * (toolTipText.length + 1));
		}
	}
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
	if (keyCode == 32) {
		running = !running;
	}
	if (keyCode == 65) {
		circles--;
		if (circles < 2) {
			circles = 2;
		}
		coords = [];
		for (var i = 0; i < circles; i++) {
			coords.push([0, 0]);
		}
	}
	if (keyCode == 68) {
		circles++;
		coords = [];
		for (var i = 0; i < circles; i++) {
			coords.push([0, 0]);
		}
	}
	if (keyCode == 190) {
		myAngle++;
	}
	if (keyCode == 188) {
		myAngle--;
	}
}
