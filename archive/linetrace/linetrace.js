/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var lines;
var w = 10;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	stroke(0);
	noFill();
	lines = [];
	var line = [];
	for (var y = 0; y < height; y++) {
		//line.push((random(-1, 1)));
		line.push((w / 2) * noise(0, y));
	}
	lines.push(line);
	background(255);
	translate(w / 2, 0);
	beginShape();
	for (var y = 0; y < height; y++) {
		vertex(line[y], y);
	}
	endShape();
}

function draw() {
	if (lines.length < floor((width / w) * 2)) {
		addLine();
	}
}

function addLine() {
	var line = [];
	for (var y = 0; y < height; y++) {
		//get average first
		var den = 1;
		var num = lines[lines.length - 1][y];
		if (y > 0) {
			num += lines[lines.length - 1][y - 1];
			den++;
		}
		if (y < height - 1) {
			num += lines[lines.length - 1][y + 1];
			den++;
		}
		var x = num / den;
		x += random(-1, 1);
		line.push(x);
	}
	lines.push(line);
	translate((lines.length * w) / 2, 0);
	beginShape();
	for (var y = 0; y < height; y++) {
		vertex(line[y], y);
	}
	endShape();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
