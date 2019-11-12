/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = true;
var toolTipText = [
	'random sampling',
	'use numbers to change mode',
	"mode: mitchell's best candidate",
	'h to show/hide this',
];
var running = true;

var w = 2;
var k = 30;
var mode = 1;
var maxPoints = 20000;
var points = [];
var active = [];
var bPoints = [];
var m = 4;
var r = 1;
var r2;
var rSquared = 1;
var speed = 10;
var modeText = ["mitchell's best candidate", "bridson's algorithm", 'uniform distribution'];

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	resizeCanvas(windowWidth, windowHeight);
	toolTipText[2] = 'mode: ' + modeText[mode - 1];
	maxPoints = ceil((width * height) / 64);
	//console.log(maxPoints);
	points = [];
	points.push(new samplePoint((random() * width) / m, (random() * height) / m));
	if (mode == 2) {
		active = [];
		active.push(points[0]);
		bPoints = [];
		for (var x = 0; x < floor(width / m); x++) {
			var col = [];
			for (var y = 0; y < floor(height / m); y++) {
				col.push(undefined);
			}
			bPoints.push(col);
		}

		bPoints[floor(points[0].x)][floor(points[0].y)] = points[0];
		r = m * sqrt(2);
		r2 = 2 * r;
		rSquared = r * r;
	}
}

function draw() {
	if (running) {
		for (var i = 0; i < speed; i++) {
			if (points.length < maxPoints) {
				switch (mode) {
					case 1:
						points.push(mitchellsbestcandidate());
						break;
					case 2:
						for (var j = 0; j < 20; j++) {
							bridsonsalgorithm();
						}
						break;
					case 3:
						points.push(uniform());
						break;
				}
			}
		}
	}
	background(51);
	stroke(255);
	for (var i = 0; i < points.length; i++) {
		strokeWeight(w);
		if (points[i] != undefined) {
			points[i].update();
		}
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

function mitchellsbestcandidate() {
	var bestCandidate;
	var mostDistance = 0;
	for (var i = 0; i < k; i++) {
		var sample = new samplePoint(random() * width, random() * height);
		var lowestDist = Infinity;
		for (var j = 0; j < points.length; j++) {
			if (sqrDist(sample, points[j]) < lowestDist) {
				lowestDist = sqrDist(sample, points[j]);
			}
		}
		if (lowestDist > mostDistance) {
			bestCandidate = sample;
			mostDistance = lowestDist;
		}
	}
	return bestCandidate;
}

function bridsonsalgorithm() {
	if (active.length > 0) {
		var selected = active[floor(random() * active.length)];
		var valid = true;
		var newCandidate;
		for (var i = 0; i < k; i++) {
			//generate new candidate;
			do {
				var d = random(r, r2);
				var angle = random(TAU);
				newCandidate = new samplePoint(selected.x + d * cos(angle), selected.y + d * sin(angle));
			} while (
				newCandidate.x < 0 ||
				newCandidate.x > floor(width / m) - 1 ||
				newCandidate.y < 0 ||
				newCandidate.y > floor(height / m) - 1
			);
			valid = true;
			for (var x = floor(newCandidate.x - 1); x <= floor(newCandidate.x + 1); x++) {
				for (var y = floor(newCandidate.y - 1); y <= floor(newCandidate.y + 1); y++) {
					if (x >= 0 && x < bPoints.length) {
						if (bPoints[x][y] != undefined) {
							if (sqrDist(newCandidate, bPoints[x][y]) < rSquared) {
								valid = false;
							}
						}
					}
				}
			}
			if (valid) {
				break;
			}
		}
		if (valid) {
			active.push(newCandidate);
			points.push(newCandidate);
			bPoints[floor(newCandidate.x)][floor(newCandidate.y)] = newCandidate;
		} else {
			active.splice(active.indexOf(selected), 1);
		}
	}
}

function uniform() {
	return new samplePoint(random() * width, random() * height);
}

function sqrDist(v1, v2) {
	return (v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y);
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
	if (keyCode == 'R'.charCodeAt(0)) {
		init();
	}
	if (keyCode >= 49 && keyCode <= 57) {
		mode = ((keyCode - 49) % 3) + 1;
		init();
	}
}

function samplePoint(x, y) {
	this.x = x;
	this.y = y;
	this.time = 0;

	this.update = function() {
		this.time++;
		this.show();
	};

	this.show = function() {
		strokeWeight(map(this.time, 0, 10, 0, w, true));
		if (mode != 2) {
			point(this.x, this.y);
		} else {
			point(this.x * m, this.y * m);
		}
	};
}
