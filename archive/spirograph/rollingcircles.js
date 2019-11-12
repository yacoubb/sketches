/// <reference path="../../node_modules/@types/p5/global.d.ts" />

showToolTip = true;
radiusString = '1, 0.87';
baseRadii = [1, 0.87];
radii = [];
scaleFactor = 1;
angle = 0;
increment = 0.05;
outside = 1;
running = true;
points = [];
oldExtent = 1;
extent = 1;
var radiusArrayInp, buttonInp, incrementSlider, extentSlider;

function setup() {
	createCanvas(windowWidth, windowHeight - 30);
	radiusArrayInp = createInput('1, 0.87');
	buttonInp = createButton('go');
	buttonInp.mouseClicked(init);
	radiusArrayInp.input(inp);
	incrementSlider = createSlider(0.01, 0.1, 0.05, 0.01);
	extentSlider = createSlider(-1, 3, 1, 0.01);
	updateScale();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight - 30);
	updateScale();
}

function inp() {
	radiusString = this.value();
	console.log(radiusString);
}

function init() {
	radiusString = radiusString.replace(' ', '');
	baseRadii = radiusString.split(',');
	baseRadii = baseRadii.map(parseFloat);
	console.log(baseRadii);
	updateScale();
	angle = 0;
	background(51);
	points = [];
}

function updateScale() {
	scaleFactor = Math.abs(baseRadii[0]);
	for (var i = 1; i < baseRadii.length - 1; i++) {
		if (baseRadii[i] > 0) {
			scaleFactor += Math.abs(baseRadii[i] * 2);
		}
	}

	scaleFactor += Math.abs(baseRadii[baseRadii.length - 1] * 2 * (0.1 + extent));

	scaleFactor = min(width, height) / (scaleFactor * 2);

	//radii = baseRadii.map(function(element) {
	//    return element * scaleFactor;
	//});
	radii = baseRadii;
	console.log(width, height, scaleFactor, radii);
}

function draw() {
	background(51);
	extent = extentSlider.value();
	if (extent != oldExtent) {
		oldExtent = extent;
		updateScale();
	}

	if (showToolTip) {
		noStroke();
		fill(255, 255, 255, 255);
		text('spirograph sim', 0, 11);
		text('change circle sizes using the text box', 0, 22);
		text('seperate the radii using commas', 0, 33);
		text('space to pause', 0, 44);
		text('h to show/hide this', 0, 55);
	}
	translate(width / 2, height / 2);
	stroke(255);
	noFill();
	x = 0;
	y = 0;
	ellipse(x, y, radii[0] * 2 * scaleFactor, radii[0] * 2 * scaleFactor);
	x += (radii[0] + radii[1]) * Math.cos(angle);
	y += (radii[0] + radii[1]) * Math.sin(angle);
	for (var i = 1; i < radii.length; i++) {
		if (showToolTip) {
			ellipse(
				x * scaleFactor,
				y * scaleFactor,
				radii[i] * 2 * scaleFactor,
				radii[i] * 2 * scaleFactor
			);
		}
		if (i + 1 < radii.length) {
			x += (radii[i] + radii[i + 1]) * Math.cos(angle * pow(2, i - 1));
			y += (radii[i] + radii[i + 1]) * Math.sin(angle * pow(2, i - 1));
		}
	}
	lastRadius = radii[radii.length - 1];
	secondLastRadius = radii[radii.length - 2];
	rotations = (lastRadius + secondLastRadius) / lastRadius;
	if (outside == -1) {
		rotations -= 2;
	}
	fill(255, 0, 0, 255);
	x += lastRadius * extent * Math.cos(outside * rotations * angle);
	y += lastRadius * extent * Math.sin(outside * rotations * angle);
	if (showToolTip) {
		ellipse(x * scaleFactor, y * scaleFactor, 10, 10);
	}
	if (running) {
		points.push([x, y]);
		increment = incrementSlider.value();
		angle += increment;
	}
	noFill();
	stroke(255, 255, 255, 200);
	beginShape();
	for (var i = 0; i < points.length; i++) {
		vertex(points[i][0] * scaleFactor, points[i][1] * scaleFactor);
	}
	endShape();
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	} else if (keyCode == 32) {
		running = !running;
	}
}
