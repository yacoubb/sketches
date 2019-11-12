/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = true;
var toolTipText = ['p5 project', 'h to show/hide this'];
var running = true;

var song;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	song = loadSound('http://localhost:8000/LSD.mp3', loadCallback);
	//fix this before publish
}

function loadCallback() {
	song.play();
}

function draw() {
	background(51);
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
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
	if (keyCode == 32) {
		running = !running;
	}
}
