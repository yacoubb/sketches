/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = false;
var toolTipText = ['p5 project', 'h to show/hide this'];
var running = true;
var w = 40;
var myAngle = 0;
var xWidth = 10;
var yHeight = 10;
dt = 0.07;

function setup() {
	createCanvas(windowWidth, windowHeight);
	xWidth = width / w;
	yHeight = height / w;
}

function draw() {
	translate(w / 2, w / 2);
	if (running) {
		myAngle++;
	}
	background(51);
	for (var x = -1; x <= xWidth; x++) {
		for (var y = -1; y <= yHeight; y++) {
			a =
				myAngle * dt + Math.sin((x * Math.PI * 2) / xWidth) + Math.cos((y * Math.PI * 2) / yHeight);
			offset = 0.3 + 0.2 * sin(myAngle * dt);
			wScale = 0.4 + 1.5 * (1 - sigmoid((abs(x * w - mouseX) + abs(y * w - mouseY)) / 100));
			arc(x * w, y * w, w * wScale, w * wScale, a, a + offset * (0.5 + wScale));
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
	xWidth = width / w;
	yHeight = height / w;
}

function sigmoid(t) {
	return 1 / (1 + Math.exp(-t));
}

function keyPressed() {
	if (keyCode == 32) {
		running = !running;
	}
}
