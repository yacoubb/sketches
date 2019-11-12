/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var cWidth;
var cHeight;
var dungeon;
var rooms;
var seperation = 4;
var generations = 0;
var mst;
var allPaths = [];

var roomCount = 200;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
	GenerateMap();
}

function init() {
	cWidth = width / 4;
	cHeight = height / 4;
	scale(min(width / cWidth, height / cHeight));
}

function GenerateMap() {
	console.log('generatemap');
	rooms = [];
	dungeon = [];
	for (var x = 0; x < cWidth; x++) {
		var col = [];
		for (var y = 0; y < cHeight; y++) {
			col.push(0);
		}
		dungeon.push(col);
	}

	for (var i = 0; i < roomCount; i++) {
		GenerateRoom();
	}
	CheckRooms();
	UpdateMap();
}

function GenerateRoom() {
	generations++;
	if (generations > roomCount * roomCount) {
		return;
	}
	console.log('generateroom');
	//var maxWidth = 20; var maxHeight = 15;
	var maxWidth = cWidth / 13;
	var maxHeight = cHeight / 15;
	var x = floor(random(cWidth / 2 - maxWidth, cWidth / 2 + maxHeight));
	var y = floor(random(cHeight / 2 - maxHeight, cHeight / 2 + maxHeight));

	var roomWidth = floor(random(5, maxWidth));
	var roomHeight = floor(random(5, maxHeight));
	if (x + roomWidth < cWidth - seperation && y + roomHeight < cHeight - seperation) {
		var room = new Room(x, y, roomWidth, roomHeight);
		rooms.push(room);
	} else {
		GenerateRoom();
	}
}

function CheckRooms() {
	console.log('checkrooms');
	var moved = true;
	while (moved) {
		moved = false;
		for (var i = 0; i < rooms.length; i++) {
			for (var j = 0; j < rooms.length; j++) {
				if (i == j || i >= rooms.length || j >= rooms.length) {
					continue;
				}
				if (
					rooms[i].x < rooms[j].x + rooms[j].width + seperation &&
					rooms[i].x + rooms[i].width > rooms[j].x - seperation
				) {
					if (
						rooms[i].y < rooms[j].y + rooms[j].height + seperation &&
						rooms[i].y + rooms[i].height > rooms[j].y - seperation
					) {
						moved = true;
						var xShift = rooms[i].x > cWidth / 2 ? 1 : -1;
						var yShift = floor(random(-20, 20));
						rooms[i].x = rooms[i].x + xShift;
						rooms[i].y = rooms[i].y + yShift;
						if (
							rooms[i].x < seperation ||
							rooms[i].y < seperation ||
							rooms[i].x + rooms[i].width > cWidth - seperation ||
							rooms[i].y + rooms[i].height > cHeight - seperation
						) {
							rooms.splice(i, 1);
							GenerateRoom();
						}
					}
				}
			}
		}
	}
	UpdateMap();
	var doors = AddDoors();
	CalcMST(doors);
}

function AddDoors() {
	console.log('adddoors');
	var allDoors = [];
	for (var i = 0; i < rooms.length; i++) {
		var room = rooms[i];
		var doorNum = room.area() > 150 ? (room.area > 200 ? 3 : 2) : 1;
		var doors = [];
		for (var u = 0; u < doorNum; u++) {
			var x;
			var y;
			if (random() > 0.5) {
				x = floor(random(room.x + 2, room.x + room.width));
				y = random > 0.5 ? room.y : room.y + room.height;
			} else {
				x = random() > 0.5 ? room.x : room.x + room.width;
				y = floor(random(room.y + 2, room.y + room.height));
			}
			var addDoor = new Door(x, y, rooms[i]);
			if (!DoorsAround(doors, addDoor)) {
				doors.push(addDoor);
				allDoors.push(addDoor);
			} else {
				u--;
			}
		}
		rooms[i].doors = doors;
	}
	return allDoors;
}

function DoorsAround(doors, door) {
	for (var i = 0; i < doors.length; i++) {
		for (var x = doors[i].x - 1; x <= doors[i].x + 1; x++) {
			for (var y = doors[i].y - 1; y <= doors[i].y + 1; y++) {
				if (door.x == x || door.y == y) {
					return true;
				}
			}
		}
	}
	return false;
}

function CalcMST(doors) {
	console.log('calcmst');
	//console.log(doors);
	var graph = [];
	for (var i = 0; i < doors.length; i++) {
		for (var j = i + 1; j < doors.length; j++) {
			graph.push(new Edge(doors[i], doors[j]));
			graph.push(new Edge(doors[j], doors[i]));
		}
	}
	graph.sort(function(a, b) {
		return a.weight - b.weight;
	});
	//console.log(graph);
	mst = [];
	var closed = [];
	mst.push(graph[0]);
	closed.push(graph[0].a);
	closed.push(graph[0].b);
	doors.splice(doors.indexOf(graph[0].a), 1);
	doors.splice(doors.indexOf(graph[0].b), 1);
	while (doors.length > 0) {
		for (var i = 0; i < graph.length; i++) {
			if (search(closed, graph[i].a) >= 0 && search(doors, graph[i].b) >= 0) {
				mst.push(graph[i]);
				closed.push(graph[i].b);
				doors.splice(search(doors, graph[i].b), 1);
				break;
			}
		}
	}
	console.log(mst);

	Pathfind();
}

function search(arr, elem) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].compare(elem)) {
			return i;
		}
	}
	return -1;
}

function Pathfind() {
	console.log('startpathfind');
	console.log(mst.length);
	allPaths = [];
	for (var i = 0; i < mst.length; i++) {
		if (mst[i].a.room.compare(mst[i].b.room)) {
			continue;
		}

		var closed = [];
		var open = [];

		var start = new Node(mst[i].a.x, mst[i].a.y);
		var goal = new Node(mst[i].b.x, mst[i].b.y);

		open.push(start);

		var cameFrom = [];
		var gScore = [];
		var fScore = [];
		for (var x = 0; x < cWidth; x++) {
			var cola = [];
			var colb = [];
			var colc = [];
			for (var y = 0; y < cHeight; y++) {
				if (dungeon[x][y] == 0 || true) {
					cola.push(null);
				} else {
					cola.push(-1);
				}
				colb.push(Infinity);
				colc.push(Infinity);
			}
			cameFrom.push(cola);
			gScore.push(colb);
			fScore.push(colc);
		}

		gScore[start.x][start.y] = 0;
		fScore[start.x][start.y] = Heuristic(start, goal);
		cameFrom[start.x][start.y] = null;
		cameFrom[goal.x][goal.y] = null;

		while (open.length > 0) {
			var current = start;
			var index = -1;
			for (var k = 0; k < open.length; k++) {
				if (fScore[open[k].x][open[k].y] < fScore[current.x][current.y]) {
					current = open[k];
				}
			}
			if (current.compare(goal)) {
				allPaths.push(Reconstruct(cameFrom, current));
				break;
			}

			open.splice(k, 1);
			closed.push(current);
			var neighbours = [
				new Node(current.x, current.y + 1),
				new Node(current.x + 1, current.y),
				new Node(current.x, current.y - 1),
				new Node(current.x - 1, current.y),
			];
			for (var n = 0; n < neighbours.length; n++) {
				if (
					neighbours[n].x > 1 &&
					neighbours[n].x < cWidth - 1 &&
					neighbours[n].y > 1 &&
					neighbours[n].y < cHeight - 1
				) {
					if (search(closed, neighbours[n]) != -1) {
						continue;
					}
					if (search(open, neighbours[n] == -1)) {
						open.push(neighbours[n]);
					}

					var tenativeG = gScore[current.x][current.y] + 1;
					if (tenativeG > gScore[neighbours[n].x][neighbours[n].y]) {
						continue;
					}

					cameFrom[neighbours[n].x][neighbours[n].y] = current;
					//calculate directional difference
					var neighborDir = neighbours[n].x - current.x + 1 + 2 * (neighbours[n].y - current.y);
					var currentDir = neighborDir;
					if (cameFrom[current.x][current.y] != null) {
						currentDir =
							current.x -
							cameFrom[current.x][current.y].x +
							1 +
							2 * (current.y - cameFrom[current.x][current.y].y);
					}
					var delta = 0;
					if (neighborDir != currentDir) {
						delta = 1;
					}
					gScore[neighbours[n].x][neighbours[n].y] = tenativeG + delta;
					fScore[neighbours[n].x][neighbours[n].y] =
						tenativeG + Heuristic(neighbours[n], goal) + delta;
				}
			}
		}
	}
	console.log(allPaths);
}

function Reconstruct(cameFrom, current) {
	var total = [current];
	while (cameFrom[current.x][current.y] != null) {
		current = cameFrom[current.x][current.y];
		total.push(current);
	}
	return total;
}

function Heuristic(a, b) {
	return floor(5 * dist(a.x, a.y, b.x, b.y));
}

function UpdateMap() {
	console.log('updatemap');
	dungeon = [];
	for (var x = 0; x < cWidth; x++) {
		var col = [];
		for (var y = 0; y < cHeight; y++) {
			col.push(0);
		}
		dungeon.push(col);
	}
	if (rooms.length > 0) {
		for (var i = 0; i < rooms.length; i++) {
			for (var x = rooms[i].x; x <= rooms[i].x + rooms[i].width; x++) {
				for (var y = rooms[i].y; y <= rooms[i].y + rooms[i].height; y++) {
					dungeon[x][y] = 1;
				}
			}
			for (var j = 0; j < rooms[i].doors.length; j++) {
				dungeon[rooms[i].doors[j].x][rooms[i].doors[j].y] = 2;
			}
			dungeon[rooms[i].x][rooms[i].y] = 3;
		}
	}
	if (allPaths != undefined) {
		for (var i = 0; i < allPaths.length; i++) {
			for (var j = 0; j < allPaths[i].length; j++) {
				dungeon[allPaths[i][j].x][allPaths[i][j].y] = 4;
			}
		}
	}
	//console.log(dungeon);
	drawMap();
}

function drawMap() {
	for (var x = 0; x < cWidth; x++) {
		for (var y = 0; y < cHeight; y++) {
			switch (dungeon[x][y]) {
				case 0:
					stroke(0);
					break;
				case 1:
					stroke(255);
					break;
				case 2:
					stroke(255, 0, 0);
					break;
				case 3:
					stroke(0, 0, 255);
					break;
				case 4:
					stroke(255, 255, 0);
					break;
			}
			point(x, y);
		}
	}
	strokeWeight(1);
	stroke(255, 0, 0);
	if (mst != undefined) {
		for (var i = 0; i < mst.length; i++) {
			//line(mst[i].a.x, mst[i].a.y, mst[i].b.x, mst[i].b.y);
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function Room(x, y, roomWidth, roomHeight) {
	this.x = x;
	this.y = y;
	this.width = roomWidth;
	this.height = roomHeight;
	this.doors = [];

	this.area = function() {
		return this.width * this.height;
	};

	this.compare = function(other) {
		return (
			this.x == other.x &&
			this.y == other.y &&
			(this.width == other.width && this.height == other.height)
		);
	};
}

function Door(x, y, room) {
	this.x = x;
	this.y = y;
	this.room = room;
	this.connectingEdges = [];

	this.compare = function(other) {
		return this.x == other.x && this.y == other.y;
	};
}

function Edge(a, b) {
	this.a = a;
	this.b = b;

	this.weight = dist(a.x, a.y, b.x, b.y);

	this.compare = function(other) {
		return (this.a == other.a && this.b == other.b) || (this.a == other.b && this.b == other.a);
	};
}

function Node(x, y) {
	this.x = x;
	this.y = y;

	this.compare = function(other) {
		return this.x == other.x && this.y == other.y;
	};
}
