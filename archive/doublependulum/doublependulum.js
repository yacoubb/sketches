/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = true;
var toolTipText = ['double pendulum', 'r to restart', 'e for colors', 'h to show/hide this'];
var running = true;

var pendulums = [];
var g = 9.81;
var col = 20;
var col2 = 20;
var rainbow = true;

var l = 100;

var l1;
var l2;

var m1;
var m2;

var a1;
var a2;

var a1_v = 0;
var a2_v = 0;

var a1_a = 0;
var a2_a = 0;

var dt = 1 / 4;

var p1List = [];
var p2List = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	init();
}

function init() {
	l = min(width, height) / 4;
	l1 = l;
	l2 = l * 0.8;
	m1 = 10;
	m2 = 10;
	a1 = (random() - 0.5) * PI;
	a2 = (random() - 0.5) * PI;
	a1_v = 0;
	a2_v = 0;
	a1_a = 0;
	a2_a = 0;
	p1List = [];
	p2List = [];
	col = random(255);
	col2 = random(255);
}

function step() {
	a1 = a1 + a1_v * dt;
	a2 = a2 + a2_v * dt;

	a1_v += a1_a * dt;
	a2_v += a2_a * dt;

	a1_a =
		-g * (2 * m1 + m2) * sin(a1) -
		m2 * g * sin(a1 - 2 * a2) -
		2 * sin(a1 - a2) * m2 * (a2_v * a2_v * l2 + a1_v * a1_v * l1 * cos(a1 - a2));
	a1_a /= l1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));

	a2_a =
		2 *
		sin(a1 - a2) *
		(a1_v * a1_v * l1 * (m1 + m2) + g * (m1 + m2) * cos(a1) + a2_v * a2_v * l2 * m2 * cos(a1 - a2));
	a2_a /= l2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
}

function draw() {
	var x1 = l1 * sin(a1);
	var y1 = l1 * cos(a1);

	var x2 = x1 + l2 * sin(a2);
	var y2 = y1 + l2 * cos(a2);

	if (running) {
		step();
		p1List.push(createVector(x1, y1));
		p2List.push(createVector(x2, y2));
	}

	push();
	background(20);
	translate(floor(width / 2), floor(0.4 * height));

	strokeWeight(4);
	stroke(255);
	line(0, 0, x1, y1);
	line(x1, y1, x2, y2);
	var i;
	for (i = 0; i < p1List.length - 1; i++) {
		//stroke(map(i, 0, p1List.length, 0, 255), 255, 255);
		stroke(col, 255, 255);
		line(p1List[i].x, p1List[i].y, p1List[i + 1].x, p1List[i + 1].y);
	}

	for (i = 0; i < p2List.length - 1; i++) {
		if (rainbow) {
			var m = map(i, 0, p2List.length, 0, 360);
			stroke(m, 255, 255);
		} else {
			stroke(col2, 255, 255);
		}
		line(p2List[i].x, p2List[i].y, p2List[i + 1].x, p2List[i + 1].y);
	}

	/* noFill();

    stroke(0, 255, 255);
    beginShape();
    for(var i = 0; i < p1List.length; i ++) {
        vertex(p1List[i].x, p1List[i].y);
    }
    endShape();

    stroke(255, 255, 0);
    beginShape();
    for(var j = 0; j < p2List.length; j ++) {
        vertex(p2List[j].x, p2List[j].y);
    }
    endShape(); */
	pop();

	//background(51);
	if (showToolTip) {
		noStroke();
		fill(255, 0, 255, 255);
		for (i = 0; i < toolTipText.length; i++) {
			text(toolTipText[i], 0, 11 * (i + 1));
		}
		if (running) {
			text('running', 0, 11 * (toolTipText.length + 1));
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
	if (keyCode == 'R'.charCodeAt(0)) {
		init();
	}
	if (keyCode == 'E'.charCodeAt(0)) {
		rainbow = !rainbow;
		col2 += 20;
		col2 %= 360;
	}
}
