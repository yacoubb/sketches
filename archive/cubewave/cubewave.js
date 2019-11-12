/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w;
var cWidth;
var rot = 0;
var maxD;
var a;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	ortho();
	init();
	directionalLight(255, 255, 255, createVector(-1, -1, -1));
}

function init() {
	w = 20;
	a = 0;
	cWidth = floor((min(width, height) * 0.7) / w);
	rot = atan(cos(PI / 4));
	maxD = dist(0, 0, cWidth / 2, cWidth / 2);
	camera(0, 0, height / 2 / tan(PI / 6), 0, 0, 0, 0, 1, 0);
	ortho();
	//stroke(0);
	noStroke();
}

function draw() {
	background(51);
	rotateX(-rot);
	rotateY(PI / 4);
	translate((-cWidth / 2) * w, 0, (-cWidth / 2) * w);
	for (var x = 0; x < cWidth; x++) {
		push();
		for (var y = 0; y < cWidth; y++) {
			var d = dist(x, y, cWidth / 2, cWidth / 2);
			var h = map(sin(frameCount * 0.1 - (15 * d) / maxD), -1, 1, 0.4, 1.2);
			//fill(map(h, 0.4, 1.2, 0, 360), 255, 255);
			normalMaterial();
			box(w, h * w * 10, w);
			translate(0, 0, w);
		}
		pop();
		translate(w, 0, 0);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
