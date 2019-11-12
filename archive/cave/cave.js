/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var cells = [];
var w = 10;
var mapWidth, mapHeight;
cellTypes = [];
typeCount = 0;
iteration = 0;
smoothness = 10;
var wSlider;

function setup() {
	createCanvas(windowWidth, windowHeight);
	initMap([
		floor(width / w),
		floor(height / w),
		color(0, 0, 0, 255),
		0.48,
		color(255, 255, 255, 255),
		0.52,
	]);
	print(cells);
	wSlider = createSlider(2, 40, 10, 1);
}

function keyPressed() {
	if (keyCode == 32) {
		initMap([
			floor(width / w),
			floor(width / w),
			color(0, 0, 0, 255),
			0.48,
			color(255, 255, 255, 255),
			0.52,
		]);
	}
}

function initMap(options) {
	cells = [];
	iteration = 0;
	mapWidth = options[0];
	mapHeight = options[1];
	cellTypes = options.splice(2, options.length - 2);
	typeCount = cellTypes.length / 2;
	for (var y = 0; y < mapHeight; y++) {
		var row = [];
		for (var x = 0; x < mapWidth; x++) {
			type = random();
			var cell;
			total = 0;
			for (var i = 0; i < typeCount; i++) {
				total += cellTypes[2 * i + 1];
				if (type < total) {
					cell = new Cell(x, y, i);
					break;
				}
			}
			row.push(cell);
		}
		cells.push(row);
	}
}

function smoothMap() {
	var newMap = cells.slice();
	for (var x = 0; x < mapWidth; x++) {
		for (var y = 0; y < mapHeight; y++) {
			if (cells[y][x].neighbourCount(1) > 4) {
				newMap[y][x].type = 1;
			}
			if (cells[y][x].neighbourCount(1) <= 3) {
				newMap[y][x].type = 0;
			}
			if (y == 0 || x == 0 || y == mapHeight - 1 || x == mapWidth - 1) {
				newMap[y][x].type = 0;
			}
		}
	}
	cells = newMap.slice();
}

function draw() {
	background(0);
	w = wSlider.value();
	if (iteration < smoothness) {
		smoothMap();
		iteration++;
	}
	for (var x = 0; x < mapWidth; x++) {
		for (var y = 0; y < mapHeight; y++) {
			cells[y][x].show();
		}
	}
}

function Cell(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.neighbourCount = function(neighborType) {
		count = 0;
		for (var j = this.y - 1; j <= this.y + 1; j++) {
			for (var i = this.x - 1; i <= this.x + 1; i++) {
				if (j != this.y || i != this.x) {
					if (j >= 0 && j < mapHeight - 1 && i >= 0 && i < mapWidth - 1) {
						if (cells[j][i].type == neighborType) {
							count++;
						}
					}
				}
			}
		}
		return count;
	};

	this.show = function() {
		var xCoord = this.x * w;
		var yCoord = this.y * w;
		noStroke();
		fill(cellTypes[2 * this.type]);
		/*
        switch(this.type) {
            case 0:
            fill(0,0,0,255);
            break;
            case 1:
            fill(255,255,255,255);
            break;
            case 2:
            fill(255,0,255,255);
            break;
        }
        */
		rect(xCoord, yCoord, w, w);
	};
	this.highlight = function() {
		var xCoord = this.x * w;
		var yCoord = this.y * w;
		noStroke();
		fill(255, 0, 255, 255);
		rect(xCoord, yCoord, w, w);
	};
}
