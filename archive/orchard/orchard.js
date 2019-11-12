/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var grid = [];
var cWidth;
var cHeight;
var w = 20;
var fc = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	cWidth = ceil(width / w);
	cHeight = ceil(height / w);
	grid = [];
	fc = 0;
	for (var x = 0; x < cWidth; x++) {
		var col = [];
		for (var y = 0; y < cHeight; y++) {
			if (x % y != 0 && y % x != 0) {
				col.push(true);
			} else {
				col.push(false);
			}
		}
		grid.push(col);
	}
}

function draw() {
	background(51);
	fc++;
	translate(w / 2, w / 2);
	for (var x = 0; x < min((fc * width) / height, cWidth); x++) {
		for (var y = 0; y < min(fc, cHeight); y++) {
			if (grid[x][y]) {
				fill(255, 0, 0);
			} else {
				fill(0, 255, 0);
			}
			ellipse(x * w, y * w, w, w);
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
