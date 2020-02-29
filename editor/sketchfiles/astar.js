/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID, args) => p => {
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

	p.setup = () => {
		p.createCanvas(width, height);
		setTimeout(() => {
			p.windowResized();
		}, 10);
	};

	p.windowResized = function() {
		p.resizeCanvas(document.getElementById(parentDivID).offsetWidth, document.getElementById(parentDivID).offsetHeight);
		p.init();
	};

	p.init = () => {
		p.textSize(8);
		p.textAlign(p.LEFT, p.BOTTOM);
		grid = [];
		for (var x = 0; x < Math.ceil(p.width / minW); x++) {
			var col = [];
			for (var y = 0; y < Math.ceil(p.height / minW); y++) {
				col.push(0);
			}
			grid.push(col);
		}
	};

	p.draw = () => {
		if (grid.length == 0) {
			return;
		}
		p.background(51);
		p.stroke(0);
		for (var x = 0; x < Math.ceil(p.width / w); x++) {
			for (var y = 0; y < Math.ceil(p.height / w); y++) {
				if (grid[x][y] == 0) {
					p.fill(255);
				} else if (grid[x][y] == 2) {
					p.fill(255, 0, 0);
				} else if (grid[x][y] == 3) {
					p.fill(0, 0, 255);
				} else {
					p.fill(0);
				}
				p.rect(x * w, y * w, w, w);
			}
		}
		if (search == 1) {
			//do drawing
			if (p.mouseIsPressed) {
				var x = Math.floor(p.mouseX / w);
				var y = Math.floor(p.mouseY / w);
				if (p.keyIsDown(16)) {
					//shift
					grid[x][y] = 0;
				} else if (p.keyIsDown(83) || p.keyIsDown(115)) {
					//S or s
					if (startCoords != undefined) {
						grid[startCoords.x][startCoords.y] = 0;
					}
					grid[x][y] = 2;
					startCoords = p.createVector(x, y);
				} else if (p.keyIsDown(69) || p.keyIsDown(101)) {
					//E or e
					if (endCoords != undefined) {
						grid[endCoords.x][endCoords.y] = 0;
					}
					grid[x][y] = 3;
					endCoords = p.createVector(x, y);
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
			p.fill(200, 50, 50);
			p.stroke(0);
			openSet.forEach(tileNode => {
				p.rect(tileNode.x * w, tileNode.y * w, w, w);
			});
			p.fill(50, 200, 50);
			closedSet.forEach(tileNode => {
				p.rect(tileNode.x * w, tileNode.y * w, w, w);
			});
			if (drawDebug) {
				p.fill(50, 50, 200);
				openSet.forEach(tileNode => {
					p.text(tileNode.hCost, tileNode.x * w + 2, tileNode.y * w + p.textSize());
					p.text(tileNode.gCost, tileNode.x * w + (w * 2) / 3, tileNode.y * w + p.textSize());
					p.text(tileNode.fCost(), tileNode.x * w + (w * 1) / 3, tileNode.y * w + w / 2 + p.textSize());
				});
				closedSet.forEach(tileNode => {
					p.text(tileNode.hCost, tileNode.x * w + 2, tileNode.y * w + p.textSize());
					p.text(tileNode.gCost, tileNode.x * w + (w * 2) / 3, tileNode.y * w + p.textSize());
					p.text(tileNode.fCost(), tileNode.x * w + (w * 1) / 3, tileNode.y * w + w / 2 + p.textSize());
				});
			}
			var current = openSet[0];
			if (current.x == endCoords.x && current.y == endCoords.y) {
				p.reconstruct_path(current);
				search = 3;
			}
			openSet.shift();
			closedSet.push(current);
			for (var x = current.x - 1; x <= current.x + 1; x++) {
				for (var y = current.y - 1; y <= current.y + 1; y++) {
					if (x < 0 || x >= Math.ceil(p.width / w) || y < 0 || y >= Math.ceil(p.height / w) || (x == current.x && y == current.y)) {
						continue;
					}
					if (closedSet.includes(ggrid[x][y]) || ggrid[x][y].t == 1) {
						continue;
					}

					var tenative_gcost = current.gCost + p.heuristic(current, ggrid[x][y]);
					if (!openSet.includes(ggrid[x][y])) {
						openSet.push(ggrid[x][y]);
					} else if (tenative_gcost >= ggrid[x][y].gCost) {
						continue;
					}

					ggrid[x][y].cameFrom = current;
					ggrid[x][y].gCost = tenative_gcost;
					ggrid[x][y].hCost = p.heuristic(ggrid[x][y], ggrid[endCoords.x][endCoords.y]);
				}
			}
		} else if (search == 3) {
			path.forEach(tileNode => {
				p.fill(50, 50, 200);
				p.rect(tileNode.x * w, tileNode.y * w, w, w);
				if (drawDebug) {
					p.fill(0);
					p.text(tileNode.hCost, tileNode.x * w + 2, tileNode.y * w + p.textSize());
					p.text(tileNode.gCost, tileNode.x * w + (w * 2) / 3, tileNode.y * w + p.textSize());
					p.text(tileNode.fCost(), tileNode.x * w + (w * 1) / 3, tileNode.y * w + w / 2 + p.textSize());
				}
			});
		}
	};

	p.startSearch = () => {
		search = 2;
		startFrame = p.frameCount;
		ggrid = [];
		path = [];
		for (var x = 0; x < p.ceil(p.width / w); x++) {
			var col = [];
			for (var y = 0; y < p.ceil(p.height / w); y++) {
				var newTile = new Tile(x, y, grid[x][y]);
				col.push(newTile);
			}
			ggrid.push(col);
		}

		closedSet = [];
		openSet = [];
		ggrid[startCoords.x][startCoords.y].gCost = 0;
		ggrid[startCoords.x][startCoords.y].hCost = p.heuristic(ggrid[startCoords.x][startCoords.y], ggrid[endCoords.x][endCoords.y]);
		openSet.push(ggrid[startCoords.x][startCoords.y]);
	};

	p.reconstruct_path = current => {
		path = [current];
		while (current.cameFrom != null) {
			path.push(current.cameFrom);
			current = current.cameFrom;
		}
	};

	p.heuristic = (a, b) => {
		return Math.round(10 * Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)));
	};

	p.keyPressed = () => {
		if (p.keyCode == 32) {
			if (search == 1) {
				if (startCoords != undefined && endCoords != undefined) {
					p.startSearch();
				}
			} else if (search == 3) {
				search = 1;
			}
		}
		if (p.keyCode == 'D'.charCodeAt(0)) {
			drawDebug = !drawDebug;
		}
	};

	class Tile {
		constructor(x, y, t) {
			this.x = x;
			this.y = y;
			this.t = t;
			this.cameFrom = null;
			this.gCost = Infinity;
			this.hCost = Infinity;
		}

		fCost() {
			return this.gCost + this.hCost;
		}
	}
};
