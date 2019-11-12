/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var x;
var y;
var r = 100;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	init();
}

function init() {
	background(20);
	frameRate(120);
	x = mouseX;
	y = mouseY;
	r = min(width, height) * 0.4;
}

function draw() {
	stroke((frameCount * 0.1) % 360, 255, 255, 70);
	x = lerp(x, mouseX, 1 / 40);
	y = lerp(y, mouseY, 1 / 40);
	var x1 = x + r * sin(frameCount * 0.01);
	var y1 = y + r * cos(frameCount * 0.01);
	line(x, y, x1, y1);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
