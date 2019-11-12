/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var multiplier = 2;
connections = [];
pointCount = 10;
radius = 200;
showToolTip = true;
heldTime = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	radius = min(width, height) / 2 - 10;
	drawConnections();
}

function calculateConnections() {
	connections = [];
	for (i = 0; i < pointCount; i++) {
		connections.push(i);
		connections.push(floor(i * multiplier) % pointCount);
	}
}

function drawConnections() {
	calculateConnections();
	background(51);
	translate(width / 2, height / 2);
	for (i = 0; i < pointCount; i++) {
		angle1 = map(i, 0, pointCount, 0, Math.PI * 2);
		x1 = -radius * Math.cos(angle1);
		y1 = radius * Math.sin(angle1);
		noStroke();
		fill(200, 200, 200, 255);
		ellipse(x1, y1, 10, 10);

		angle2 = map(connections[2 * i + 1], 0, pointCount, 0, Math.PI * 2);
		x2 = -radius * Math.cos(angle2);
		y2 = radius * Math.sin(angle2);
		stroke(255, 255, 255, 255);
		line(x1, y1, x2, y2);
	}
	if (showToolTip) {
		noStroke();
		fill(255, 255, 255, 255);
		textAlign(LEFT);
		textSize(12);
		text('times table visualizer', -width / 2, -height / 2 + 11);
		text('add and remove points with a and d', -width / 2, -height / 2 + 22);
		text('change multiplier with z and c', -width / 2, -height / 2 + 33);
		text('use shift and caps to add more', -width / 2, -height / 2 + 44);
		text('watch the mathologer video for an explanation', -width / 2, -height / 2 + 55);
		text('h to show/hide this', -width / 2, -height / 2 + 66);
		textAlign(RIGHT);
		text('points : '.concat(pointCount), width / 2, -height / 2 + 11);
		text('multiplier : '.concat(multiplier), width / 2, -height / 2 + 22);
	}
}

function draw() {
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
	if (keyIsDown(67)) {
		heldTime += 1 / frameRate();
		if (heldTime > 0.5) {
			multiplier += 0.01 * amt;
			drawConnections();
		}
	} else if (keyIsDown(90)) {
		heldTime += 1 / frameRate();
		if (heldTime > 0.5) {
			multiplier -= 0.01 * amt;
			if (multiplier <= 1) {
				multiplier = 1;
			}
			drawConnections();
		}
	} else {
		heldTime = 0;
	}
}

function keyPressed() {
	console.log(keyCode);
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
		pointCount -= amt;
		if (pointCount <= 1) {
			pointCount = 2;
		}
	}
	if (keyCode == 68) {
		pointCount += amt;
	}
	if (keyCode == 67) {
		multiplier += amt;
		multiplier = floor(multiplier);
	} else if (keyCode == 90) {
		multiplier -= amt;
		multiplier = floor(multiplier);
		if (multiplier <= 1) {
			multiplier = 1;
		}
	}
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
	drawConnections();
}
