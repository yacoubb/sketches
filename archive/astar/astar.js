/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var grid = [];
var w = 40;
var minW = 10;
var search = 1;
var drawDebug = false;

var startFrame;
var startCoords;
var endCoords;
var ggrid = [];
var closedSet = [];
var openSet = [];
var path = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	textSize(8);
	textAlign(LEFT, BOTTOM);
	for (var x = 0; x < ceil(width / w); x++) {
		var col = [];
		for (var y = 0; y < ceil(height / w); y++) {
			col.push(0);
		}
		grid.push(col);
	}
}

function draw() {
	background(51);
	stroke(0);
	for (var x = 0; x < ceil(width / w); x++) {
		for (var y = 0; y < ceil(height / w); y++) {
			if (grid[x][y] == 0) {
				fill(255);
			} else if (grid[x][y] == 2) {
				fill(255, 0, 0);
			} else if (grid[x][y] == 3) {
				fill(0, 0, 255);
			} else {
				fill(0);
			}
			rect(x * w, y * w, w, w);
		}
	}
	if (search == 1) {
		//do drawing
		if (mouseIsPressed) {
			var x = floor(mouseX / w);
			var y = floor(mouseY / w);
			if (keyIsDown(16)) {
				//shift
				grid[x][y] = 0;
			} else if (keyIsDown(83) || keyIsDown(115)) {
				//S or s
				if (startCoords != undefined) {
					grid[startCoords.x][startCoords.y] = 0;
				}
				grid[x][y] = 2;
				startCoords = createVector(x, y);
			} else if (keyIsDown(69) || keyIsDown(101)) {
				//E or e
				if (endCoords != undefined) {
					grid[endCoords.x][endCoords.y] = 0;
				}
				grid[x][y] = 3;
				endCoords = createVector(x, y);
			} else {
				grid[x][y] = 1;
			}
		}
	} else if (search == 2) {
		if (openSet.length == 0) {
			console.log('No path');
			search = 3;
			return;
		}
		openSet.sort(function(a, b) {
			return a.fCost() - b.fCost();
		});
		fill(200, 50, 50);
		stroke(0);
		openSet.forEach(tileNode => {
			rect(tileNode.x * w, tileNode.y * w, w, w);
		});
		fill(50, 200, 50);
		closedSet.forEach(tileNode => {
			rect(tileNode.x * w, tileNode.y * w, w, w);
		});
		if (drawDebug) {
			openSet.forEach(tileNode => {
				text(tileNode.hCost, tileNode.x * w + 2, tileNode.y * w + textSize());
				text(tileNode.gCost, tileNode.x * w + (w * 2) / 3, tileNode.y * w + textSize());
				text(tileNode.fCost(), tileNode.x * w + (w * 1) / 3, tileNode.y * w + w / 2 + textSize());
			});
			closedSet.forEach(tileNode => {
				text(tileNode.hCost, tileNode.x * w + 2, tileNode.y * w + textSize());
				text(tileNode.gCost, tileNode.x * w + (w * 2) / 3, tileNode.y * w + textSize());
				text(tileNode.fCost(), tileNode.x * w + (w * 1) / 3, tileNode.y * w + w / 2 + textSize());
			});
		}
		var current = openSet[0];
		if (current.x == endCoords.x && current.y == endCoords.y) {
			reconstruct_path(current);
			search = 3;
		}
		openSet.splice(0, 1);
		closedSet.push(current);
		for (var x = current.x - 1; x <= current.x + 1; x++) {
			for (var y = current.y - 1; y <= current.y + 1; y++) {
				if (
					x < 0 ||
					x >= ceil(width / w) ||
					y < 0 ||
					y >= ceil(height / w) ||
					(x == current.x && y == current.y)
				) {
					continue;
				}
				if (closedSet.includes(ggrid[x][y]) || ggrid[x][y].t == 1) {
					continue;
				}

				var tenative_gcost = current.gCost + heuristic(current, ggrid[x][y]);
				if (!openSet.includes(ggrid[x][y])) {
					openSet.push(ggrid[x][y]);
				} else if (tenative_gcost >= ggrid[x][y].gCost) {
					continue;
				}

				ggrid[x][y].cameFrom = current;
				ggrid[x][y].gCost = tenative_gcost;
				ggrid[x][y].hCost = heuristic(ggrid[x][y], ggrid[endCoords.x][endCoords.y]);
			}
		}
	} else if (search == 3) {
		fill(50, 50, 200);
		path.forEach(tileNode => {
			rect(tileNode.x * w, tileNode.y * w, w, w);
			if (drawDebug) {
				text(tileNode.hCost, tileNode.x * w + 2, tileNode.y * w + textSize());
				text(tileNode.gCost, tileNode.x * w + (w * 2) / 3, tileNode.y * w + textSize());
				text(tileNode.fCost(), tileNode.x * w + (w * 1) / 3, tileNode.y * w + w / 2 + textSize());
			}
		});
	}
}

function startSearch() {
	search = 2;
	startFrame = frameCount;
	ggrid = [];
	path = [];
	for (var x = 0; x < ceil(width / w); x++) {
		var col = [];
		for (var y = 0; y < ceil(height / w); y++) {
			var newTile = new tile(x, y, grid[x][y]);
			col.push(newTile);
		}
		ggrid.push(col);
	}

	closedSet = [];
	openSet = [];
	ggrid[startCoords.x][startCoords.y].gCost = 0;
	ggrid[startCoords.x][startCoords.y].hCost = heuristic(
		ggrid[startCoords.x][startCoords.y],
		ggrid[endCoords.x][endCoords.y]
	);
	openSet.push(ggrid[startCoords.x][startCoords.y]);
}

function reconstruct_path(current) {
	path = [current];
	while (current.cameFrom != null) {
		path.push(current.cameFrom);
		current = current.cameFrom;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function heuristic(a, b) {
	return round(10 * sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)));
}

function keyPressed() {
	if (keyCode == 32) {
		if (search == 1) {
			if (startCoords != undefined && endCoords != undefined) {
				startSearch();
			}
		} else if (search == 3) {
			search = 1;
		}
	}
	if (keyCode == 'D'.charCodeAt(0)) {
		drawDebug = !drawDebug;
	}
}

function tile(x, y, t) {
	this.x = x;
	this.y = y;
	this.t = t;
	this.cameFrom = null;
	this.gCost = Infinity;
	this.hCost = Infinity;
	this.fCost = function() {
		return this.gCost + this.hCost;
	};
}
