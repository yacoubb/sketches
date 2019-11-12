/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var slices = 12;
var w = 20;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
	background(51);
	noStroke();
	fill(200);
	rotateX(-PI / 6);
	rotateY(PI / 4);
	translate(0, (-w * slices) / 2);

	for (var i = 1; i <= slices; i++) {
		//fill(map(i, 1, slices + 1, 0, 360), 255, 255);
		rotateY(i * frameCount * 0.0005);
		push();

		fill(204, 46, 41);
		translate(0, w / 2);
		box(w * slices, 0, w * slices);
		translate(0, -w);
		box(w * slices, 0, w * slices);

		fill(251, 197, 40);
		translate((w * slices) / 2, w / 2);
		box(0, w, w * slices);
		translate(-w * slices, 0);
		box(0, w, w * slices);

		fill(41, 51, 94);
		translate((w * slices) / 2, 0, (w * slices) / 2);
		box(w * slices, w, 0);
		translate(0, 0, -w * slices);
		box(w * slices, w, 0);

		pop();
		translate(0, w * 1.001, 0);
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
