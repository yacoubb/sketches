/// <reference path="../../node_modules/@types/p5/global.d.ts" />

showToolTip = true;
toolTipText = ['planets', 'h to show/hide this'];
radii = [200, 4.9 * 2, 12.1 * 2, 12.8 * 2, 6.8 * 2, 143 / 2, 120 / 2, 51.1 / 2, 49.5 / 2, 2.3 * 3];
baseSpeeds = [0, 47, 35, 30, 24, 13, 10, 7, 5.4, 4.7];
speeds = [];
cols = [
	[255, 174, 0],
	[137, 73, 0],
	[255, 122, 0],
	[0, 107, 249],
	[255, 49, 0],
	[251, 193, 123],
	[255, 181, 92],
	[124, 185, 252],
	[59, 108, 160],
	[255, 58, 73],
];
offsets = [];
w = 2;
r = 100;
dt = 0.001;
myFrames = 0;
running = true;
translation = [0, 0];
targetTrans = [0, 0];
transSpeed = 5;
zoom = 0.4;
targetZoom = 0.4;

function setup() {
	createCanvas(windowWidth, windowHeight);
	r = (width / ((radii.length * radii.length) / 10)) * zoom;
	translation = [width / 2, height / 2];
	targetTrans = [width / 2, height / 2];
	speeds = baseSpeeds.map(function(e) {
		return sqrt(e);
		//return 50;
	});
	for (i = 0; i < radii.length; i++) {
		offsets.push(random() * 5);
	}
	//speeds = baseSpeeds;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	calculateRadius();
}

function calculateRadius() {
	r = (width / ((radii.length * radii.length) / 10)) * zoom;
}

function draw() {
	if (running) {
		myFrames++;
	}
	background(51);
	translate(translation[0], translation[1]);
	noStroke();
	fill(cols[0][0], cols[0][1], cols[1][2]);
	ellipse(0, 0, radii[0] * w * zoom, radii[0] * w * zoom);
	for (var i = 1; i < radii.length; i++) {
		//fill(map(i, 1, radii.length, 0, 254));
		fill(cols[i][0], cols[i][1], cols[i][2]);
		angle = myFrames * dt * speeds[i] + offsets[i];
		rad = (r * i * i) / 10 + 220 * zoom;
		x = sin(angle) * rad;
		y = cos(angle) * rad;
		ellipse(x, y, radii[i] * w * zoom, radii[i] * w * zoom);
		switch (i) {
			case 3:
				//earth
				break;
			case 5:
				planetw = radii[i] * w * zoom;
				fill(181, 95, 20);
				arc(x, y, planetw, planetw, 0, Math.PI);
				fill(125, 51, 0);
				ellipse(
					x + w * 18 * zoom,
					y + 13 * w * zoom,
					radii[i] * w * zoom * 0.1,
					radii[i] * w * zoom * 0.1
				);
				break;
			case 6:
				//saturn
				planetw = radii[i] * w * zoom;
				ringWidth = 0.05;
				ringLength = 0.8;
				fill(181, 95, 20);
				push();
				translate(x, y);
				rotate(Math.PI / 4);
				beginShape();
				vertex(-ringLength * planetw, -ringWidth * planetw);
				vertex(-ringLength * planetw, +ringWidth * planetw);
				vertex(+ringLength * planetw, +ringWidth * planetw);
				vertex(+ringLength * planetw, -ringWidth * planetw);
				endShape();
				pop();
				break;
		}
	}
	if (showToolTip) {
		noStroke();
		fill(255, 255, 255, 255);
		for (i = 0; i < toolTipText.length; i++) {
			text(toolTipText[i], -translation[0], -translation[1] + 11 * (i + 1));
		}
		if (running) text('running', -translation[0], -translation[1] + 11 * (toolTipText.length + 1));
	}
	if (keyIsDown(87)) {
		//W
		targetTrans[1] = targetTrans[1] + transSpeed;
	}
	if (keyIsDown(65)) {
		//A
		targetTrans[0] = targetTrans[0] + transSpeed;
	}
	if (keyIsDown(83)) {
		//S
		targetTrans[1] = targetTrans[1] - transSpeed;
	}
	if (keyIsDown(68)) {
		//D
		targetTrans[0] = targetTrans[0] - transSpeed;
	}
	translationLerp();
	if (keyIsDown(90)) {
		//Z
		targetZoom = targetZoom * 1.1;
	}
	if (keyIsDown(88)) {
		//X
		targetZoom = targetZoom / 1.1;
	}
}

function translationLerp() {
	translation[0] = lerp(translation[0], targetTrans[0], 10 / (frameRate() + 0.1));
	translation[1] = lerp(translation[1], targetTrans[1], 10 / (frameRate() + 0.1));
	if (zoom != targetZoom) {
		zoom = lerp(zoom, targetZoom, 10 / (frameRate() + 0.1));
		calculateRadius();
	}
}

function keyPressed() {
	if (keyCode == 72) {
		//H
		showToolTip = !showToolTip;
	} else if (keyCode == 32) {
		//Space
		running = !running;
	} else if (keyCode == 82) {
		//R
		targetTrans[0] = width / 2;
		targetTrans[1] = height / 2;
		targetZoom = 0.4;
	}
}
