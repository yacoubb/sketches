/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = true;
var toolTipText = ['p5 project', 'h to show/hide this'];
var running = true;

var tri1;
var tri2;
var points = [];
var debug = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	tri1 = new tri([[400, 401], [200, 202], [600, 403]]);

	tri1.show();
	tri2 = new tri([[400, 401], [500, 600], [600, 403]]);

	tri2.show();
	points = [];
}

function draw() {
	if (debug) {
		running = false;
		for (var i = 0; i < 200; i++) {
			var x = width * random();
			var y = height * random();
			strokeWeight(2);
			stroke(255);
			if (tri1.inCircle(x, y) && tri2.inCircle(x, y)) {
				stroke(255, 0, 0);
			} else if (tri1.inCircle(x, y)) {
				stroke(0, 255, 0);
			} else if (tri2.inCircle(x, y)) {
				stroke(0, 0, 255);
			}
			point(x, y);
		}
	}
	if (running) {
		background(51);
		triangulate();
		stroke(255);
		strokeWeight(2);
		points.forEach(p => {
			point(p.x, p.y);
		});
	}
	if (showToolTip) {
		noStroke();
		fill(255, 255, 255, 255);
		for (var i = 0; i < toolTipText.length; i++) {
			text(toolTipText[i], 0, 11 * (i + 1));
		}
		if (running) {
			text('running', 0, 11 * (toolTipText.length + 1));
		}
	}
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

function mousePressed() {
	if (debug) {
		background(51);
		tri1 = new tri([[400, 401], [mouseX, mouseY], [600, 403]]);
		tri1.show();
		tri2.show();
	} else {
		points.push(createVector(mouseX, mouseY));
		point(mouseX, mouseY);
		//console.log(mouseX, mouseY);
	}
}

function triangulate() {
	var pointList = points;
	var triangulation = [];
	var superTriangle = new tri([[-width, -height], [2 * width, -height], [width / 2, 2 * height]]);
	triangulation.push(superTriangle);
	for (var i = 0; i < pointList.length; i++) {
		var badTriangles = [];
		for (var j = 0; j < triangulation.length; j++) {
			if (triangulation[j].inCircle(pointList[i].x, pointList[i].y)) {
				badTriangles.push(triangulation[j]);
			}
		}
		var polygon = [];
		for (var j = 0; j < badTriangles.length; j++) {
			for (var e = 0; e < badTriangles[j].edges.length; e++) {
				var isShared = false;
				for (var o = 0; o < badTriangles.length; o++) {
					if (o != j) {
						if (badTriangles[o].hasEdge(badTriangles[j].edges[e])) {
							isShared = true;
						}
					}
				}
				if (!isShared) {
					polygon.push(badTriangles[j].edges[e]);
				}
			}
		}
		for (var j = 0; j < badTriangles.length; j++) {
			triangulation.splice(triangulation.indexOf(badTriangles[j]), 1);
		}
		for (var e = 0; e < polygon.length; e++) {
			var ed = polygon[e];
			var newTri = new tri([[ed.ax, ed.ay], [ed.bx, ed.by], [pointList[i].x, pointList[i].y]]);
			triangulation.push(newTri);
		}
	}
	for (var i = 0; i < triangulation.length; i++) {
		if (
			triangulation[i].containsVertex([-width, -height]) ||
			triangulation[i].containsVertex([2 * width, -height]) ||
			triangulation[i].containsVertex([width / 2, 2 * height])
		) {
			triangulation.splice(i, 1);
			i--;
		}
	}

	for (var i = 0; i < triangulation.length; i++) {
		triangulation[i].show();
	}
	console.log(triangulation);
}

function edge(ax, ay, bx, by) {
	this.ax = ax;
	this.ay = ay;
	this.bx = bx;
	this.by = by;
	this.length = dist(ax, ay, bx, by);

	this.compare = function(e) {
		return (
			(this.ax == e.ax && this.ay == e.ay && this.bx == e.bx && this.by == e.by) ||
			(this.ax == e.bx && this.ay == e.by && this.bx == e.ax && this.by == e.by)
		);
	};

	this.show = function() {
		stroke(255);
		strokeWeight(3);
		line(this.ax, this.ay, this.bx, this.by);
	};
}

function tri(coords) {
	var ax, bx, cx, ay, by, cy;
	//NEED TO FIX CLOCKWISE SORTING FOR FUCKY DUCKY SAKE
	//console.log("COORDS " + coords);
	var mx = coords[0][0] + coords[1][0] + coords[2][0];
	mx /= 3;
	var my = coords[0][1] + coords[1][1] + coords[2][1];
	my /= 3;
	var angles = [];
	for (var i = 0; i < 3; i++) {
		angles[i] = atan2(my - coords[i][1], my - coords[i][0]);
	}
	var maxIndex = angles.indexOf(max(angles));
	var minIndex = angles.indexOf(min(angles));

	ax = coords[maxIndex][0];
	ay = coords[maxIndex][1];

	bx = coords[3 - maxIndex - minIndex][0];
	by = coords[3 - maxIndex - minIndex][1];

	cx = coords[minIndex][0];
	cy = coords[minIndex][1];
	//console.log(ax, ay, bx, by, cx, cy);

	this.edges = [new edge(ax, ay, bx, by), new edge(bx, by, cx, cy), new edge(cx, cy, ax, ay)];

	this.inCircle = function(dx, dy) {
		var matrix = math.matrix([
			[ax, ay, ax * ax + ay * ay, 1],
			[bx, by, bx * bx + by * by, 1],
			[cx, cy, cx * cx + cy * cy, 1],
			[dx, dy, dx * dx + dy * dy, 1],
		]);
		var inside = math.det(matrix);
		return inside < 0;
	};

	this.hasEdge = function(e) {
		return this.edges[0].compare(e) || this.edges[1].compare(e) || this.edges[2].compare(e);
	};

	this.containsVertex = function(v) {
		return (ax == v[0] && ay == v[1]) || (ax == v[0] && ay == v[1]) || (ax == v[0] && ay == v[1]);
	};

	this.show = function() {
		fill(255, 0, 0);
		beginShape();
		vertex(this.edges[0].ax, this.edges[0].ay);
		vertex(this.edges[1].ax, this.edges[1].ay);
		vertex(this.edges[2].ax, this.edges[2].ay);
		endShape();
		this.edges[0].show();
		this.edges[1].show();
		this.edges[2].show();
	};
}
