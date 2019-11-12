/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 40;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	fill(255);
	noStroke();
}

function draw() {
	background(51);
	for (var x = -1; x < width / w + 1; x++) {
		for (var y = -1; y < height / w + 1; y++) {
			var rr = w * 1.1;
			var r = x * 2 + y * 2;

			/*
            r = floor(random() * 4);
            r = x*2 + y*2;
            r %= 2;
            var rr = w * 1.1;
            fill(255);
            arc(x * w, y * w, rr, rr, r/4 * TAU, r/4 * TAU + PI/2);
            arc(x * w +  w, y * w + w, rr, rr, r/4 * TAU + PI, r/4 * TAU + PI/2 + PI);
            fill(51);
            rr = w * 0.9;
            arc(x * w, y * w, rr, rr, r/4 * TAU, r/4 * TAU + PI/2);
            arc(x * w +  w, y * w + w, rr, rr, r/4 * TAU + PI, r/4 * TAU + PI/2 + PI);
            */
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
