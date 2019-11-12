/// <reference path="../../node_modules/@types/p5/global.d.ts" />

showToolTip = true;
toolTipText = [
	'rock paper scissors cellular automata',
	'red is rock',
	'green is scissors',
	'blue is paper',
	'h to show/hide this',
];

cells = [];
cWidth = 400;
cHeight = 400;
w = 6;
var count = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	cells = [];
	rectMode(CENTER);
	cWidth = floor(windowWidth / w);
	cHeight = floor(windowHeight / w);
	console.log(cWidth, cHeight);
	for (var x = 0; x < cWidth; x++) {
		row = [];
		for (var y = 0; y < cHeight; y++) {
			row.push(0);
		}
		cells.push(row);
	}
	console.log(cells);
	for (var i = 1; i <= 3; i++) {
		cells[floor(random() * cWidth)][floor(random() * cHeight)] = i;
		cells[floor(random() * cWidth)][floor(random() * cHeight)] = i;
	}
	drawOnce();
}

function drawOnce() {
	background(51);
	noStroke();
	for (x = 0; x < cWidth; x++) {
		for (y = 0; y < cHeight; y++) {
			if (cells[x][y] != 0) {
				switch (cells[x][y]) {
					case 1:
						fill(255, 0, 0);
						break;
					case 2:
						fill(0, 255, 0);
						break;
					case 3:
						fill(0, 0, 255);
						break;
				}
				rect(x * w, y * w, w, w);
			}
		}
	}
}

function step() {
	newMap = [];
	for (x = 0; x < cWidth; x++) {
		for (y = 0; y < cHeight; y++) {
			if (cells[x][y] != 0) {
				i = round(random(max(0, x - 1), min(cWidth - 1, x + 1)));
				j = round(random(max(0, y - 1), min(cHeight - 1, y + 1)));
				while (i < 0 || i > cWidth - 1 || j < 0 || j > cHeight - 1) {
					i = round(random(max(0, x - 1), min(cWidth - 1, x + 1)));
					j = round(random(max(0, y - 1), min(cHeight - 1, y + 1)));
				}
				if (cells[i][j] == 0 || cells[x][y] - cells[i][j] == -1 || cells[x][y] - cells[i][j] == 2) {
					newMap.push([i, j, cells[x][y]]);
				}
			}
		}
	}
	noStroke();
	for (i = 0; i < newMap.length; i++) {
		x = newMap[i][0];
		y = newMap[i][1];
		cells[x][y] = newMap[i][2];
		switch (cells[x][y]) {
			case 1:
				fill(255, 0, 0);
				break;
			case 2:
				fill(0, 255, 0);
				break;
			case 3:
				fill(0, 0, 255);
				break;
		}
		rect(x * w, y * w, w, w);
	}
}

function draw() {
	step();
	if (showToolTip) {
		xBlocks = 220 / w;
		yBlocks = 60 / w;
		for (x = 0; x < xBlocks; x++) {
			for (y = 0; y < yBlocks; y++) {
				if (cells[x][y] != 0) {
					switch (cells[x][y]) {
						case 1:
							fill(255, 0, 0);
							break;
						case 2:
							fill(0, 255, 0);
							break;
						case 3:
							fill(0, 0, 255);
							break;
					}
					rect(x * w, y * w, w, w);
				}
			}
		}
		noStroke();
		fill(255, 255, 255, 255);
		for (var i = 0; i < toolTipText.length; i++) {
			text(toolTipText[i], 0, 11 * (i + 1));
		}
	}
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
}
