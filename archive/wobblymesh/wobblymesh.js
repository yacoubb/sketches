/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var c = 20;
var offset = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	w = (min(width, height) * 0.8) / c;
	noFill();
	stroke(255);
	strokeWeight(2);
}

function draw() {
	background(51);
	translate(width / 2, height / 2);
	stroke(255);
	for (var x = -c / 2 - 0.5; x <= c / 2 - 0.5; x++) {
		for (var y = -c / 2 - 0.5; y <= c / 2 - 0.5; y++) {
			var coordset = [];
			coordset.push(transformCoordinate(x, y));
			coordset.push(transformCoordinate(x + 1, y));
			coordset.push(transformCoordinate(x + 1, y + 1));
			coordset.push(transformCoordinate(x, y + 1));

			stroke(255, 255, 255);
			beginShape();
			vertex(coordset[0][0], coordset[0][1]);
			vertex(coordset[1][0], coordset[1][1]);
			vertex(coordset[2][0], coordset[2][1]);
			vertex(coordset[3][0], coordset[3][1]);
			endShape(CLOSE);
		}
	}
	stroke(255, 0, 0);
	//ellipse(0, 0, 2, 2);
}

function transformCoordinate(x, y) {
	var r = dist(x, y, 0, 0);
	var a = atan2(y, x);
	a += 0.4 * sin(frameCount * 0.05 + sqrt(r));
	r = map(r, 20, 0, r * 0.5, r * 1.5);
	x = cos(a) * r;
	y = sin(a) * r;
	//x = x + sin(frameCount * 0.05);
	//y = y + cos(frameCount * 0.05);
	return [x * w, y * w];
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
