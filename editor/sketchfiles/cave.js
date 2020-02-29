/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID, params) => p => {
	var cells = [];
	var w = 10;
	var mapWidth, mapHeight;
	var cellTypes = [];
	var iteration = 0;
	var smoothness = 6;
	var sketchContainer;

	p.setup = () => {
		sketchContainer = document.getElementById(parentDivID);
		const canvas = p.createCanvas(width, height);
		canvas.parent(parentDivID);

		p.noLoop();
		setTimeout(() => {
			p.windowResized();
			p.loop();
		}, 10);
	};

	p.windowResized = function() {
		p.resizeCanvas(sketchContainer.offsetWidth, sketchContainer.offsetHeight);
		p.init();
	};

	p.myCustomRedrawAccordingToNewPropsHandler = newProps => {
		console.log(newProps);
	};

	p.init = () => {
		cells = [];
		iteration = 0;
		mapWidth = Math.floor(p.width / w);
		mapHeight = Math.floor(p.height / w);
		cellTypes = [p.color(0, 0, 0, 255), p.color(255, 255, 255, 255)];
		var densities = [0.48, 0.52];

		if (cellTypes.length != densities.length) {
			throw "cellTypes doesn't match densities!";
		}
		if (densities.reduce((a, b) => a + b, 0) != 1) {
			throw "densities don't add to 1!";
		}

		for (var x = 0; x < mapWidth; x++) {
			var col = [];
			for (var y = 0; y < mapHeight; y++) {
				var type = p.random();
				var cell;
				var total = 0;
				for (var i = 0; i < cellTypes.length; i++) {
					total += densities[i];
					if (type < total) {
						cell = new Cell(x, y, i);
						break;
					}
				}
				col.push(cell);
			}
			cells.push(col);
		}
	};

	// p.setup = () => {
	// 	p.createCanvas(windowWidth, windowHeight);
	// 	// wSlider = createSlider(2, 40, 10, 1);
	// };

	p.keyPressed = () => {
		if (p.keyCode == 32) {
			p.init();
		}
	};

	p.smoothMap = () => {
		var newMap = [];
		for (var x = 0; x < mapWidth; x++) {
			var col = [];
			for (var y = 0; y < mapHeight; y++) {
				col.push(new Cell(x, y, cells[x][y].type));
			}
			newMap.push(col);
		}
		for (var x = 0; x < mapWidth; x++) {
			for (var y = 0; y < mapHeight; y++) {
				if (cells[x][y].neighbourCount(1) > 4) {
					newMap[x][y].type = 1;
				}
				if (cells[x][y].neighbourCount(1) <= 3) {
					newMap[x][y].type = 0;
				}
				if (y == 0 || x == 0 || y == mapHeight - 1 || x == mapWidth - 1) {
					newMap[x][y].type = 0;
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
				cells[x][y].show();
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
			for (var i = this.x - 1; i <= this.x + 1; i++) {
				for (var j = this.y - 1; j <= this.y + 1; j++) {
					if (j != this.y || i != this.x) {
						if (j >= 0 && j < mapHeight - 1 && i >= 0 && i < mapWidth - 1) {
							if (cells[i][j].type == neighborType) {
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
			p.fill(cellTypes[this.type]);
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
