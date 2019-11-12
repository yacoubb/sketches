/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = true;
var toolTipText = ['p5 project', 'h to show/hide this'];
var running = true;

var r = 200;
var activeNodes = [];
var allNodes = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	r = min(width, height) * 0.45;
	console.log(r);
	activeNodes = [];
	var pos = randomCirclePoint(r);
	activeNodes.push(new Node(pos[0], pos[1], random(0, TAU), 0));
	console.log(activeNodes);
	fill(255);
	noStroke();
}

function draw() {
	background(51);
	fill(255);
	noStroke();
	translate(width / 2, height / 2);
	ellipse(0, 0, r * 2, r * 2);

	for (var i = 0; i < allNodes.length; i++) {
		fill(100);
		var w = 20 - 3 * allNodes[i].generation;
		ellipse(allNodes[i].x, allNodes[i].y, w, w);
	}
	if (frameCount < 2000 && frameCount % 1 == 0) {
		step();
	}
}

function step() {
	var newNodes = [];
	while (activeNodes.length > 0) {
		if (activeNodes[0].lifetime > 50 && random() > 0.7) {
			//split node
			var leftAngle = (activeNodes[0].angle + QUARTER_PI) % TAU;
			var leftNode = new Node(
				activeNodes[0].x,
				activeNodes[0].y,
				leftAngle,
				activeNodes[0].generation + 1
			);
			var rightAngle = (activeNodes[0].angle - QUARTER_PI) % TAU;
			var rightNode = new Node(
				activeNodes[0].x,
				activeNodes[0].y,
				rightAngle,
				activeNodes[0].generation + 1
			);
			newNodes.push(leftNode);
			newNodes.push(rightNode);
		} else {
			var newAngle = (activeNodes[0].angle + random(-1, 1) * 0.2) % TAU;
			var newNode = new Node(
				activeNodes[0].x + 2 * cos(newAngle),
				activeNodes[0].y + 2 * sin(newAngle),
				newAngle,
				activeNodes[0].generation
			);
			newNode.lifetime = activeNodes[0].lifetime + 1;
			if (newNode.x * newNode.x + newNode.y * newNode.y < r * r * 0.95) {
				newNodes.push(newNode);
			}
		}
		allNodes.push(activeNodes.shift());
	}
	activeNodes = newNodes;
}

function randomCirclePoint(radius) {
	var angle = random(0, TAU);
	var len = random(0, radius);
	return [len * cos(angle), len * sin(angle)];
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

function Node(x, y, angle, generation) {
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.lifetime = 0;
	this.generation = generation;
}
