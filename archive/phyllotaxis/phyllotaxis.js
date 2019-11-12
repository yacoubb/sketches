/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var a;
var aa = 137.5;
var r = 10;
var w = 7;
var i = 1;
var m = 10000;
var t = 10000;
var d = 1;
var s = false;
var h = true;
var tooltipText = [
	'phyllotaxis sim',
	'change max points using a and d',
	'control increment with caps and shift',
	'change how quickly points get drawn using q and e',
	'wobble with space',
	'change wobble amount with , and .',
	'press h to show/hide this',
];
var j = false;
var jj = 1;

function setup() {
	createCanvas(windowWidth, windowHeight);
	console.log(width);
	t = floor((width / 1920) * 20000);
	colorMode(HSB);
	updateAngle();
}

function updateAngle() {
	background(20);
	a = map(aa, 0, 360, 0, 2 * Math.PI);
}

function draw() {
	background(20);
	translate(width / 2, height / 2);
	i += d;
	if (i <= 0) {
		i = 1;
	} else if (i > m) {
		i = m;
	}
	for (var x = 0; x < i; x++) {
		drawPoint(x);
	}
	if (h) {
		fill(255, 0, 255, 255);
		textSize(12);
		textAlign(LEFT);
		for (var f = 0; f < tooltipText.length; f++) {
			text(tooltipText[f], -width / 2, -height / 2 + (f + 1) * (1 + textSize()));
		}
		textAlign(RIGHT);
		text('points: ' + i, width / 2, -height / 2 + 11);
		text('max points: ' + m, width / 2, -height / 2 + 22);
		text('draw speed: ' + d, width / 2, -height / 2 + 33);
		text('angle: ' + round(aa * 10) / 10, width / 2, -height / 2 + 44);
	}
}

function keyPressed() {
	console.log(keyCode);
	if (keyCode == 72) {
		h = !h;
	}
	amt = 1;
	if (keyIsDown(16)) {
		//shift
		if (keyIsDown(20)) {
			//caps
			amt = 1000;
		} else {
			amt = 10;
		}
	} else if (keyIsDown(20)) {
		amt = 100;
	}
	if (keyCode == 65) {
		m -= amt;
		if (m <= 0) {
			m = 1;
		}
		if (m < i) {
			i = m;
		}
	}
	if (keyCode == 68) {
		m += amt;
		if (m >= t) {
			m = t;
		}
	}
	if (keyCode == 81) {
		d -= amt;
	}
	if (keyCode == 69) {
		d += amt;
	}
	if (keyCode == 90) {
		aa -= 0.1;
		updateAngle();
	}
	if (keyCode == 67) {
		aa += 0.1;
		updateAngle();
	}

	if (keyCode == 32) {
		j = !j;
	}
	if (keyCode == 190) {
		jj += amt;
	}
	if (keyCode == 188) {
		jj -= amt;
		if (jj < 0) {
			jj = 0;
		}
	}
}

function drawPoint(n) {
	hu = map(n, 0, i, 0, 340);
	fill(hu, 255, 255, 255);
	noStroke();
	var sn = sqrt(n);
	x = r * sn * Math.sin(n * a);
	y = r * sn * Math.cos(n * a);
	if (j) {
		x += floor(random(-jj, jj + 1));
		y += floor(random(-jj, jj + 1));
	}
	ellipse(x, y, w, w);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
