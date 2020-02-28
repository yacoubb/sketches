/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID, params) => p => {
	var cells = [];
	var w = 10;
	var mapWidth, mapHeight;
	var cellTypes = [];
	var typeCount = 0;
	var iteration = 0;
	var smoothness = 10;
	var wSlider;

	p.setup = () => {
		p.createCanvas(width, height);
		setTimeout(() => {
			p.windowResized();
		}, 10);
	};

	p.windowResized = function() {
		p.resizeCanvas(document.getElementById(parentDivID).offsetWidth, document.getElementById(parentDivID).offsetHeight);
		p.init([Math.floor(p.width / w), Math.floor(p.height / w), p.color(0, 0, 0, 255), 0.48, p.color(255, 255, 255, 255), 0.52]);
	};

	p.init = options => {
		cells = [];
		iteration = 0;
		mapWidth = options[0];
		mapHeight = options[1];
		cellTypes = options.splice(2, options.length - 2);
		typeCount = cellTypes.length / 2;
		for (var y = 0; y < mapHeight; y++) {
			var row = [];
			for (var x = 0; x < mapWidth; x++) {
				var type = p.random();
				var cell;
				var total = 0;
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
	};

	// p.setup = () => {
	// 	p.createCanvas(windowWidth, windowHeight);
	// 	// wSlider = createSlider(2, 40, 10, 1);
	// };

	p.keyPressed = () => {
		if (p.keyCode == 32) {
			p.init([Math.floor(p.width / w), Math.floor(p.width / w), p.color(0, 0, 0, 255), 0.48, p.color(255, 255, 255, 255), 0.52]);
		}
	};

	p.smoothMap = () => {
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
	};

	p.draw = () => {
		p.background(0);
		// w = wSlider.value();
		w = 10;
		if (iteration < smoothness) {
			p.smoothMap();
			iteration++;
		}
		for (var x = 0; x < mapWidth; x++) {
			for (var y = 0; y < mapHeight; y++) {
				cells[y][x].show();
			}
		}
	};

	class Cell {
		constructor(x, y, type) {
			this.x = x;
			this.y = y;
			this.type = type;
		}

		neighbourCount(neighborType) {
			let count = 0;
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
		}

		show() {
			var xCoord = this.x * w;
			var yCoord = this.y * w;
			p.noStroke();
			p.fill(cellTypes[2 * this.type]);
			p.rect(xCoord, yCoord, w, w);
		}
		highlight() {
			var xCoord = this.x * w;
			var yCoord = this.y * w;
			p.noStroke();
			p.fill(255, 0, 255, 255);
			p.rect(xCoord, yCoord, w, w);
		}
	}
};
