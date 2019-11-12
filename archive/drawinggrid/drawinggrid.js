/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 60;
var cWidth;
var cHeight;
var grid = [];
var clickGrid = [];
var heldTime = 0;
var offset = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	grid = [];
	cWidth = ceil((width * 0.6) / w);
	cHeight = ceil((height * 0.6) / w);
	rectMode(CENTER);
	for (var x = 0; x < cWidth; x++) {
		var col = [];
		var clickCol = [];
		for (var y = 0; y < cHeight; y++) {
			col.push(false);
			clickCol.push(-1);
		}
		grid.push(col);
		clickGrid.push(clickCol);
	}
	console.log(grid, clickGrid);
}

function draw() {
	background(51);
	strokeWeight(1);
	if (mouseIsPressed) {
		heldTime += 1 / frameRate();
	} else {
		heldTime = 0;
	}
	if (heldTime > 0.4) {
		if (mouseX >= width * 0.2 - w / 2 && mouseX <= width * 0.2 + cWidth * w - w / 2) {
			if (mouseY >= height * 0.2 - w / 2 && mouseY <= height * 0.2 + cHeight * w - w / 2) {
				var x = mouseX - width * 0.2 + w / 2;
				x = floor(x / w);
				var y = mouseY - height * 0.2 + w / 2;
				y = floor(y / w);
				grid[x][y] = true;
				clickGrid[x][y] = frameCount;
			}
		}
	}
	translate(width * 0.2, height * 0.2);
	noFill();
	for (var x = 0; x < cWidth; x++) {
		for (var y = 0; y < cHeight; y++) {
			var ww = w;
			//rect(x * w, y * w, ww, ww);
			if (grid[x][y]) {
				stroke(200, 200, 0);
				var wa = 0.4 * w;
				var c = cos((frameCount - offset * clickGrid[x][y]) * 0.01) * wa;
				var s = sin((frameCount - offset * clickGrid[x][y]) * 0.01) * wa;
				var c1 = cos(500 + frameCount * 0.0005) * wa;
				var s1 = sin(500 + frameCount * 0.0005) * wa;
				push();
				translate(x * w, y * w);
				beginShape();
				vertex(c1, s1);
				vertex(-c, s);
				vertex(-c1, -s1);
				vertex(c, -s);
				endShape(CLOSE);
				beginShape();
				vertex(-c1, s1);
				vertex(c, -s);
				vertex(c1, -s1);
				vertex(-c, s);
				endShape(CLOSE);
				pop();
			} else {
				stroke(255, 100, 0);
				var wa = 0.4 * w;
				var c = cos(500 * 0.01) * wa;
				var s = sin(500 * 0.01) * wa;
				var c1 = cos(500 * 0.001) * wa;
				var s1 = sin(500 * 0.001) * wa;
				push();
				translate(x * w, y * w);
				beginShape();
				vertex(c1, s1);
				vertex(-c, s);
				vertex(-c1, -s1);
				vertex(c, -s);
				endShape(CLOSE);
				beginShape();
				vertex(-c1, s1);
				vertex(c, -s);
				vertex(c1, -s1);
				vertex(-c, s);
				endShape(CLOSE);
				pop();
			}
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
	if (mouseX >= width * 0.2 - w / 2 && mouseX <= width * 0.2 + cWidth * w - w / 2) {
		if (mouseY >= height * 0.2 - w / 2 && mouseY <= height * 0.2 + cHeight * w - w / 2) {
			var x = mouseX - width * 0.2 + w / 2;
			x = floor(x / w);
			var y = mouseY - height * 0.2 + w / 2;
			y = floor(y / w);
			if (grid[x][y]) {
				grid[x][y] = false;
				clickGrid[x][y] = -1;
			} else {
				grid[x][y] = true;
				clickGrid[x][y] = frameCount;
			}
		}
	}
	heldTime = 0;
}

function keyPressed() {
	if (keyCode == 32) {
		if (offset == 0) {
			offset = 1;
		} else {
			offset = 0;
		}
	}
}
