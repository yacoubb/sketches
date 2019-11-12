/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = false;
var toolTipText = ['p5 project', 'h to show/hide this'];
var running = true;
var xWidth = 10;
var yHeight = 10;
var w = 40;

function setup() {
	createCanvas(windowWidth, windowHeight);
	xWidth = ceil(width / w);
	yHeight = ceil(height / w);
	noStroke();
	colorMode(HSB);
}

function draw() {
	background(30);
	fill(255);
	for (var x = -1; x <= xWidth; x++) {
		for (var y = -1; y <= yHeight; y++) {
			var xAngle = (Math.PI * x) / xWidth;
			var yAngle = (Math.PI * y) / yHeight;
			var h = sin(xAngle + frameCount * 0.01 + cos(yAngle + frameCount * 0.01));
			fill(map(h, -2, 2, 0, 255), 255, 255);
			ellipse(x * w, y * w + 10 * h, w, w);
		}
	}
	if (showToolTip) {
		noStroke();
		fill(255, 255, 255, 255);
		for (var i = 0; i < toolTipText.length; i++) {
			text(toolTipText[i], 0, 11 * (i + 1));
		}
		if (running) {
			text('running', 0, 11 * (toolTipText.length + 1));
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	xWidth = ceil(width / w);
	yHeight = ceil(height / w);
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = false;
	}
	if (keyCode == 32) {
		running = !running;
	}
}
