/// <reference path="../../node_modules/@types/p5/global.d.ts" />

screenRatio = 1;
maxIteration = 1000;
cells = [];
synchronous = false;
done = false;
var x, y;
chunkWidth = 1;
scaleFloat = 1;
totalScaleFloat = 1;
boxUpdateCells = [];
oldMouseX = 0;
oldMouseY = 0;
offsetX = 0;
offsetY = 0;
showTooltip = true;

function setup() {
	createCanvas(windowWidth, windowHeight);
	//createCanvas(600,windowHeight);
	init();
}

function init() {
	synchronous = false;
	colorMode(HSB);
	screenRatio = width / height;
	x = 0;
	y = 0;
	scaleFloat = 1;
	totalScaleFloat = 1;
	boxUpdateCells = [];
	offsetX = 0;
	offsetY = 0;
	if (!synchronous) {
		drawMandelbrotAsync();
	} else {
		drawMandelbrotSync();
	}
}

function drawMandelbrotSync() {
	cells = [];
	background(0, 255, 255, 255);
	synchronous = true;
	done = false;
	for (x = 0; x < width; x++) {
		var col = [];
		for (y = 0; y < height; y++) {
			var a = map(x, 0, width, -2 / totalScaleFloat, 1 / totalScaleFloat) + offsetX;
			var b =
				map(
					y,
					0,
					height,
					-1.5 / (totalScaleFloat * screenRatio),
					1.5 / (totalScaleFloat * screenRatio)
				) + offsetY;
			steps = 0;
			z = 0;
			var ca = a;
			var cb = b;
			while (steps < 100) {
				var aa = a * a - b * b;
				var bb = 2 * a * b;

				a = aa + ca;
				b = bb + cb;

				steps++;

				if (a * a + b * b > 4) {
					break;
				}
			}
			bright = map(steps, 0, maxIteration, 0, 1);
			bright = map(sqrt(bright), 0, 1, 0, 255);
			col.push(bright);
		}
		cells.push(col);
	}
	done = true;
}

function drawMandelbrotAsync() {
	cells = [];
	x = y = 0;
	background(0, 255, 255, 255);
	done = false;
	synchronous = false;
}

function draw() {
	if (!synchronous && !done) {
		i = 0;
		while (i < chunkWidth) {
			if (x < width) {
				var col = [];
				for (y = 0; y < height; y++) {
					var a = map(x, 0, width, -2 / totalScaleFloat, 1 / totalScaleFloat) + offsetX;
					var b =
						map(
							y,
							0,
							height,
							-1.5 / (totalScaleFloat * screenRatio),
							1.5 / (totalScaleFloat * screenRatio)
						) + offsetY;
					steps = 0;
					z = 0;
					var ca = a;
					var cb = b;
					while (steps < maxIteration && a * a + b * b < 4) {
						var aa = a * a - b * b;
						var bb = 2 * a * b;

						a = aa + ca;
						b = bb + cb;

						if (a * a + b * b > 4) {
							break;
						}

						steps++;
					}
					bright = map(steps, 0, maxIteration, 0, 1);
					bright = map(sqrt(bright), 0, 1, 0, 255);
					stroke(bright, 255, 255, 255);
					point(x, y);
					col.push(bright);
				}
				cells.push(col);
				x++;
				i++;
			} else {
				i = chunkWidth + 1;
				done = true;
				scaleFloat *= 2;
			}
		}
	} else if (done) {
		if (keyIsDown(188)) {
			scaleFloat -= 0.1;
			updateViewport();
		}
		if (keyIsDown(190)) {
			scaleFloat += 0.1;
			updateViewport();
		}
		if (mouseX != oldMouseX || mouseY != oldMouseY) {
			updateViewport();
		}
	}

	if (showTooltip) {
		//change this to a function so man can redraw the mandel if the user changes the ting off the ling
		//stroke(255, 255, 0, 255);
		noStroke();
		fill(21, 21, 21, 255);
		rect(0, 0, 180, 70);
		fill(255, 0, 255, 255);
		text('mandelbrot viewer', 0, 11);
		text('when image is done move mouse', 0, 22);
		text('control zoom level with , and .', 0, 33);
		text('click to zoom', 0, 44);
		text('space to start again', 0, 55);
		text('h to show/hide this', 0, 66);
	}
}

function updateViewport() {
	for (i = 0; i < boxUpdateCells.length; i++) {
		stroke(boxUpdateCells[i].bright, 255, 255, 255);
		point(boxUpdateCells[i].x, boxUpdateCells[i].y);
	}
	boxUpdateCells = [];

	yMin = mouseY - floor(height / (2 * scaleFloat));
	yMax = mouseY + floor(height / (2 * scaleFloat));
	xMin = mouseX - floor(width / (2 * scaleFloat));
	xMax = mouseX + floor(width / (2 * scaleFloat));
	if (xMin < 0) {
		xMin = 0;
	}
	if (xMax > width - 1) {
		xMax = width - 1;
	}
	if (yMin < 0) {
		yMin = 0;
	}
	if (yMax > height - 1) {
		yMax = height - 1;
	}

	stroke(100, 255, 0, 255);
	for (x = xMin; x <= xMax; x++) {
		boxUpdateCells.push({ bright: cells[x][yMin], x: x, y: yMin });
		boxUpdateCells.push({ bright: cells[x][yMax], x: x, y: yMax });
		point(x, yMin);
		point(x, yMax);
	}
	for (y = yMin; y <= yMax; y++) {
		boxUpdateCells.push({ bright: cells[xMin][y], x: xMin, y: y });
		boxUpdateCells.push({ bright: cells[xMax][y], x: xMax, y: y });
		point(xMin, y);
		point(xMax, y);
	}

	oldMouseX = mouseX;
	oldMouseY = mouseY;
}

function zoom() {
	offsetX += map(mouseX, 0, width, -2 / totalScaleFloat, 1 / totalScaleFloat);
	offsetY += map(
		mouseY,
		0,
		height,
		-1.5 / (totalScaleFloat * screenRatio),
		1.5 / (totalScaleFloat * screenRatio)
	);
	if (totalScaleFloat == 1) {
		totalScaleFloat = 2 * scaleFloat;
	} else {
		totalScaleFloat *= 2 * scaleFloat;
	}
	//maxIteration = 1000 * totalScaleFloat;
	console.log(totalScaleFloat);
	scaleFloat = 1;
	boxUpdateCells = [];
	drawMandelbrotAsync();
}

function mouseClicked() {
	if (done) {
		zoom();
	}
}

function keyPressed() {
	if (keyCode == 32) {
		init();
	}
	if (keyCode == 72) {
		showTooltip = !showTooltip;
	}
}

function drawCompleteSet() {
	for (i = 0; i < width; i++) {
		for (j = 0; j < height; j++) {
			stroke(cells[i][j], 255, 255, 255);
			point(i, j);
		}
	}
}
