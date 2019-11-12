/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var grid = [];
var cWidth;
var cHeight;
var w = 8;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	cWidth = floor(width / w);
	cHeight = floor(height / w);
	grid = [];
	for (var x = 0; x < cWidth; x++) {
		var col = [];
		for (var y = 0; y < cHeight; y++) {
			//col.push(floor(4 * random()));
			col.push(0);
		}
		grid.push(col);
	}
	noStroke();
	grid[floor(cWidth / 2)][floor(cHeight / 2)] = 20000;
}

function draw() {
	background(51);
	for (var x = 0; x < cWidth; x++) {
		for (var y = 0; y < cHeight; y++) {
			fill(139, 69, 19);
			switch (grid[x][y]) {
				case 0:
					fill(0, 0, 255);
					break;
				case 1:
					fill(100, 100, 255);
					break;
				case 2:
					fill(255, 255, 0);
					break;
			}
			if (grid[x][y] > 0) {
				rect(x * w, y * w, w, w);
			}
		}
	}
	for (var i = 0; i < 10; i++) {
		topple();
	}
}

function topple() {
	var nextPile = [];
	for (var x = 0; x < cWidth; x++) {
		var col = [];
		for (var y = 0; y < cHeight; y++) {
			if (grid[x][y] < 4) {
				col.push(grid[x][y]);
			} else {
				col.push(0);
			}
		}
		nextPile.push(col);
	}
	for (var x = 1; x < cWidth - 1; x++) {
		for (var y = 1; y < cHeight - 1; y++) {
			if (grid[x][y] >= 4) {
				nextPile[x][y] += grid[x][y] - 4;
				nextPile[x - 1][y]++;
				nextPile[x + 1][y]++;
				nextPile[x][y - 1]++;
				nextPile[x][y + 1]++;
			}
		}
	}
	grid = nextPile;
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
