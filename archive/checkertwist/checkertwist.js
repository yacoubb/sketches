/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 40;
var c = 20;
var a = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	a = 0;
	init();
}

function init() {
	c = floor(max(width, height) / w);
	noStroke();
}

function draw() {
	//rotate(PI/2);
	translate(width / 2, height / 2);
	rotate(0.3);

	var realC = floor(c * 0.7);
	a++;
	if (a <= 100) {
		background(76, 175, 80);
		fill(251, 192, 45);
		for (var x = -realC; x < realC; x++) {
			for (var y = -realC; y < realC; y++) {
				if (abs(y) % 2 != abs(x) % 2) {
					push();
					translate(x * w, y * w);
					rotate((frameCount * 0.01 * PI) / 2);
					rect(0, 0, w, w);
					pop();
				}
			}
		}
	} else if (a < 200) {
		background(251, 192, 45);
		fill(76, 175, 80);
		for (var x = -realC; x < realC; x++) {
			for (var y = -realC; y < realC; y++) {
				if (abs(y) % 2 == abs(x) % 2) {
					push();
					translate(x * w, y * w);
					rotate((-frameCount * 0.01 * PI) / 2);
					rect(0, 0, w, w);
					pop();
				}
			}
		}
	} else {
		a = 0;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
