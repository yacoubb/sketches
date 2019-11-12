/// <reference path="../../node_modules/@types/p5/global.d.ts" />

//TODO implement seeded rng so maps can have IDs

var mapWidth, mapHeight;
var w = 10;
var nodes = [];
var synchronous = false;
var finished = false;
var current;
var stack = [];
var running = true;
var speed;

function setup() {
	//createCanvas(windowWidth - windowWidth % w, windowHeight - windowHeight % w);
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	mapWidth = floor((width - 1) / w);
	mapHeight = floor((height - 1) / w);
	speed = 1;
	nodes = [];
	frameRate(120);
	for (var y = 0; y < mapHeight; y++) {
		var row = [];
		for (var x = 0; x < mapWidth; x++) {
			var node = new Node(x, y);
			row.push(node);
		}
		nodes.push(row);
	}

	current = nodes[0][0];
}

function draw() {
	background(51);
	for (var x = 0; x < mapWidth; x++) {
		for (var y = 0; y < mapHeight; y++) {
			nodes[y][x].show();
		}
	}

	if (!synchronous) {
		for (var i = 0; i < speed; i++) {
			current.visited = true;
			current.highlight();
			if (running) {
				var next = current.checkNeighbours();
				if (next) {
					next.visited = true;
					stack.push(current);
					removeWalls(current, next);
					current = next;
				} else if (stack.length > 0) {
					current = stack.pop();
				} else if (!finished) {
					//remove bottom right wall
					nodes[mapHeight - 1][mapWidth - 1].walls[1] = false;
					finished = true;
				}
			}
		}
	}
}

function genMazeSync() {
	while (current.checkNeighbours() || stack.length > 0) {
		current.visited = true;
		current.highlight();
		var next = current.checkNeighbours();
		if (next) {
			next.visited = true;
			stack.push(current);
			removeWalls(current, next);
			current = next;
		} else if (stack.length > 0) {
			current = stack.pop();
		}
	}
	nodes[mapHeight - 1][mapWidth - 1].walls[1] = false;

	background(51);
	for (var x = 0; x < mapWidth; x++) {
		for (var y = 0; y < mapHeight; y++) {
			nodes[y][x].show();
		}
	}
}

function keyPressed() {
	console.log(keyCode);
	if (keyCode == 83) {
		synchronous = !synchronous;
		if (synchronous) {
			genMazeSync();
		} else {
			init();
		}
	} else if (keyCode == 32) {
		running = !running;
	} else if (keyCode == 'D'.charCodeAt(0)) {
		speed++;
	} else if (keyCode == 'A'.charCodeAt(0)) {
		speed--;
		if (speed <= 0) speed = 1;
	}
}

function removeWalls(a, b) {
	var x = a.x - b.x;
	var y = a.y - b.y;
	if (x === 1) {
		a.walls[3] = false;
		b.walls[1] = false;
	} else if (x === -1) {
		a.walls[1] = false;
		b.walls[3] = false;
	} else if (y === 1) {
		a.walls[0] = false;
		b.walls[2] = false;
	} else if (y === -1) {
		a.walls[2] = false;
		b.walls[0] = false;
	}
}

function Node(x, y) {
	this.x = x;
	this.y = y;
	this.walls = [true, true, true, true];
	this.visited = false;

	this.show = function() {
		var xCoord = x * w;
		var yCoord = y * w;
		stroke(255);
		noFill();
		if (this.walls[0]) {
			line(xCoord, yCoord, xCoord + w, yCoord);
		}
		if (this.walls[1]) {
			line(xCoord + w, yCoord, xCoord + w, yCoord + w);
		}
		if (this.walls[2]) {
			line(xCoord + w, yCoord + w, xCoord, yCoord + w);
		}
		if (this.walls[3]) {
			line(xCoord, yCoord + w, xCoord, yCoord);
		}

		if (this.visited) {
			noStroke();
			fill(255, 0, 255, 100);
			rect(xCoord, yCoord, w, w);
		}
	};

	this.checkNeighbours = function() {
		var neighbours = [];
		var top, right, bottom, left;
		if (y > 0) {
			var top = nodes[this.y - 1][this.x];
		}
		if (x < mapWidth - 1) {
			var right = nodes[this.y][this.x + 1];
		}
		if (y < mapHeight - 1) {
			var bottom = nodes[this.y + 1][this.x];
		}
		if (x > 0) {
			var left = nodes[this.y][this.x - 1];
		}

		if (top && !top.visited) {
			neighbours.push(top);
		}
		if (right && !right.visited) {
			neighbours.push(right);
		}
		if (bottom && !bottom.visited) {
			neighbours.push(bottom);
		}
		if (left && !left.visited) {
			neighbours.push(left);
		}

		if (neighbours.length > 0) {
			var r = floor(random(0, neighbours.length));
			return neighbours[r];
		} else {
			return undefined;
		}
	};

	this.highlight = function() {
		var xCoord = x * w;
		var yCoord = y * w;
		noStroke();
		fill(255, 255, 0, 100);
		rect(xCoord, yCoord, w, w);
	};
}
