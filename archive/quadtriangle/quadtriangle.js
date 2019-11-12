/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var coords = [];
var root3;
var r;
var w = 30;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	frameRate(30);
	coords = [];
	root3 = sqrt(3);
	r = min(width, height) * 0.7;
	stroke(255);
	strokeWeight(2);
	fill(255);
}

function draw() {
	background(51);
	coords = [];
	var triVectors = [
		createVector(0, (root3 / 3) * r),
		createVector(r / 2, (-root3 / 6) * r),
		createVector(-r / 2, (-root3 / 6) * r),
	];
	triVectors[0].rotate((frameCount * PI) / 100);
	triVectors[1].rotate((frameCount * PI) / 100);
	triVectors[2].rotate((frameCount * PI) / 100);
	var triCoords = [
		width / 2 + triVectors[0].x,
		height / 2 + triVectors[0].y,
		width / 2 + triVectors[1].x,
		height / 2 + triVectors[1].y,
		width / 2 + triVectors[2].x,
		height / 2 + triVectors[2].y,
	];
	bresenhams(triCoords[0], triCoords[1], triCoords[2], triCoords[3]);
	//bresenhams(triCoords[0] + w, triCoords[1],     triCoords[2] + w, triCoords[3]);
	//bresenhams(triCoords[0] + w, triCoords[1] + w, triCoords[2] + w, triCoords[3] + w);
	//bresenhams(triCoords[0],     triCoords[1] + w, triCoords[2]    , triCoords[3] + w);

	bresenhams(triCoords[2], triCoords[3], triCoords[4], triCoords[5]);
	//bresenhams(triCoords[2] + w, triCoords[3],     triCoords[4] + w, triCoords[5]);
	//bresenhams(triCoords[2] + w, triCoords[3] + w, triCoords[4] + w, triCoords[5] + w);
	//bresenhams(triCoords[2],     triCoords[3] + w, triCoords[4]    , triCoords[5] + w);

	bresenhams(triCoords[4], triCoords[5], triCoords[0], triCoords[1]);
	//bresenhams(triCoords[4] + w, triCoords[5],     triCoords[0] + w, triCoords[1]);
	//bresenhams(triCoords[4] + w, triCoords[5] + w, triCoords[0] + w, triCoords[1] + w);
	//bresenhams(triCoords[4],     triCoords[5] + w, triCoords[0]    , triCoords[1] + w);

	fill(255);
	for (var i = 0; i < coords.length; i++) {
		rect(coords[i].x * w, coords[i].y * w, w, w);
	}
	noFill();
	stroke(255, 0, 0);
	triangle(triCoords[0], triCoords[1], triCoords[2], triCoords[3], triCoords[4], triCoords[5]);
}

function bresenhams(x0, y0, x1, y1) {
	x0 = int(floor(x0 / w));
	y0 = int(floor(y0 / w));
	x1 = int(floor(x1 / w));
	y1 = int(floor(y1 / w));
	var dx = Math.abs(x1 - x0);
	var dy = Math.abs(y1 - y0);
	var sx = x0 < x1 ? 1 : -1;
	var sy = y0 < y1 ? 1 : -1;
	var err = dx - dy;
	while (true) {
		coords.push(createVector(x0, y0));
		if (x0 == x1 && y0 == y1) break;
		var e2 = 2 * err;
		if (e2 > -dy) {
			err -= dy;
			x0 += sx;
		}
		if (e2 < dx) {
			err += dx;
			y0 += sy;
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
