/// <reference path="../../node_modules/@types/p5/global.d.ts" />

angle = 0.4127;
oldAngle = 0;
showTooltip = true;

var slider;

function setup() {
	createCanvas(windowWidth, windowHeight - 20);
	slider = createSlider(0, Math.PI, 0.4127, 0.0001);
}

function draw() {
	angle = slider.value();
	if (angle != oldAngle) {
		oldAngle = angle;
		console.log(angle);
		drawTree();
	}
}

function drawTree() {
	background(51);
	if (showTooltip) {
		noStroke();
		fill(255);
		text('recursive fractal trees', 0, 11);
		text('change angle of the branches with the slider', 0, 22);
		text('press h to show/hide this', 0, 33);
	}
	stroke(255);
	translate(width / 2, height);
	branch((2.5 * min(height, width)) / 8);
}

function branch(len) {
	if (len > 3) {
		stroke(255);
		strokeWeight(ceil(len / 10));
		line(0, 0, 0, -len);
		translate(0, -len);
		push();
		rotate(angle);
		branch(len * 0.67);
		pop();
		rotate(-angle);
		branch(len * 0.67);
	}
}

function keyPressed() {
	if (keyCode == 72) {
		showTooltip = !showTooltip;
		drawTree();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight - 20);
	drawTree();
}
