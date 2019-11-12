/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = false;
var toolTipText = ['p5 project', 'h to show/hide this'];
var running = true;
var xWidth;
var yHeight;
var w = 40;

function setup() {
	createCanvas(windowWidth, windowHeight);
	xWidth = ceil(width / w);
	yHeight = ceil(height / w);
	noStroke();
}

function draw() {
	background(51);
	for (var x = -1; x <= xWidth; x++) {
		for (var y = -1; y <= yHeight; y++) {
			a =
				frameCount * 0.01 +
				Math.sin((x * Math.PI * 2) / xWidth) +
				Math.cos((y * Math.PI * 2) / yHeight);
			fill(0, 255, 0);
			arc(x * 1.1 * w, y * 1.1 * w, w, w, a, a + Math.PI);
			fill(255, 0, 0);
			arc(x * 1.1 * w, y * 1.1 * w, w * 0.8, w * 0.8, a, a + Math.PI);
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
