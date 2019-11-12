/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var r;
var n = 2000;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	init();
}

function init() {
	r = min(width, height) * 0.4;
	console.log(r);
	strokeWeight(10);
}

function draw() {
	background(20);
	translate(width / 2, height / 2);
	rotate(frameCount * 0.01);
	stroke(0, 0, 255);
	for (var i = 0; i < 2; i++) {
		var currentPoint = [0, 0];
		var lastPoint = [0, r];
		beginShape();
		vertex(lastPoint[0], lastPoint[1]);
		for (var t = 0; t <= n; t++) {
			var rr = r;
			var a = n / 2;
			var delta = abs(t - a);
			if (abs(delta) <= n / 4) {
				var m =
					1 +
					map(delta, n / 4, 0, 0, 0.2) *
						cos(((t * TAU) / n) * 10 + frameCount * 0.1 + ((i + 1) / 2) * TAU);
				var bright = map(delta, n / 4, 0, 0.2, 1);
				rr = r * m;
				currentPoint = [rr * cos((t / n) * TAU), rr * sin((t / n) * TAU)];
				//line(lastPoint[0], lastPoint[1], currentPoint[0], currentPoint[1]);
				vertex(currentPoint[0], currentPoint[1]);
				lastPoint = currentPoint;
			}
		}
		endShape();
	}
	noFill();
	rotate(-PI / 2);
	arc(0, 0, r * 2, r * 2, 0, PI);
}

function sigmoid(t) {
	return 1 / (1 + Math.exp(t));
	//return 1/(1 + abs(t));
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init();
}
