/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var colliders = [];
var playerX = 0;
var playerY = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	colliders.push(new Collider(20, 400, 200, 100), new Collider(500, 400, 200, 300));
	for (let i = 0; i < 10; i++) {
		colliders.push(
			new Collider(random(0, width), random(0, height), random(40, 300), random(50, 200))
		);
	}
}

function draw() {
	background(51);
	playerX = mouseX;
	playerY = mouseY;
	let startPoint = createVector(playerX, playerY);
	let vertexAngles = [];
	for (let i = 0; i < colliders.length; i++) {
		colliders[i].show();
		for (let j = 0; j < colliders[i].vertices.length; j++) {
			let angle = getAngleBetweenPoints(colliders[i].vertices[j], startPoint);
			vertexAngles.push(angle - 0.00001);
			vertexAngles.push(angle + 0.000001);
			vertexAngles.push(angle + 0.00001);
		}
	}

	vertexAngles.push(TAU - 0.01);
	for (let i = 0; i < vertexAngles.length; i++) {
		while (vertexAngles[i] < 0) {
			vertexAngles[i] += TAU;
		}
		vertexAngles[i] %= TAU;
	}
	vertexAngles.sort();

	if (frameCount == 50) {
		console.table(vertexAngles);
	}

	let hitPoints = [];
	let circleAngle = 0;
	let r = 200;

	fill(255, 0, 0);
	for (let i = 0; i < vertexAngles.length; i++) {
		while (circleAngle < vertexAngles[i]) {
			let ray = createVector(r * cos(circleAngle), r * sin(circleAngle));
			hitPoints.push(raycast(startPoint, ray)[0]);
			circleAngle += 0.01;
		}
		let ray = createVector(r * cos(vertexAngles[i]), r * sin(vertexAngles[i]));
		hitPoints.push(raycast(startPoint, ray)[0]);
	}

	noStroke();
	beginShape();
	for (let i = 0; i < hitPoints.length - 1; i++) {
		vertex(startPoint.x, startPoint.y);
		vertex(hitPoints[i].x, hitPoints[i].y);
		vertex(hitPoints[i + 1].x, hitPoints[i + 1].y);
	}
	vertex(startPoint.x, startPoint.y);
	vertex(hitPoints[hitPoints.length - 1].x, hitPoints[hitPoints.length - 1].y);
	vertex(hitPoints[0].x, hitPoints[0].y);
	endShape();

	stroke(0);
	ellipse(startPoint.x, startPoint.y, 8);

	if (keyIsDown('W'.charCodeAt(0))) {
		playerY -= 4;
	}
	if (keyIsDown('A'.charCodeAt(0))) {
		playerX -= 4;
	}
	if (keyIsDown('S'.charCodeAt(0))) {
		playerY += 4;
	}
	if (keyIsDown('D'.charCodeAt(0))) {
		playerX += 4;
	}
}

function raycast(startPoint, ray) {
	let intersections = [];
	let distances = [];
	let endPoint = startPoint.copy().add(ray);
	for (let i = 0; i < colliders.length; i++) {
		for (let j = 0; j < colliders[i].vertices.length; j++) {
			let intersectionPoint = intersect(
				startPoint,
				endPoint,
				colliders[i].vertices[j],
				colliders[i].vertices[(j + 1) % colliders[i].vertices.length]
			);
			if (intersectionPoint) {
				let k = 0;
				let intersectionDistance = squareDist(intersectionPoint, startPoint);
				while (k < intersections.length) {
					if (intersectionDistance < distances[k]) {
						break; // k now contains the index we need to insert at
					}
					k++;
				}
				intersections.splice(k, 0, intersectionPoint);
				distances.splice(k, 0, intersectionDistance);
			}
		}
	}
	if (intersections.length == 0) {
		intersections.push(endPoint);
	}
	return intersections;
}

function intersect(a, b, c, d) {
	// line between vector a and b, line between vector c and d
	// from https://stackoverflow.com/questions/385305/efficient-maths-algorithm-to-calculate-intersections
	let xab = a.x - b.x;
	let xcd = c.x - d.x;
	let yab = a.y - b.y;
	let ycd = c.y - d.y;

	let e = xab * ycd - yab * xcd;
	if (abs(e) < 0.01) {
		// no intersection
		return false;
	}
	let da = a.x * b.y - a.y * b.x;
	let db = c.x * d.y - c.y * d.x;

	let M = createVector((da * xcd - db * xab) / e, (da * ycd - db * yab) / e);
	let AB = b.copy().sub(a);
	let AM = M.copy().sub(a);
	let MB = b.copy().sub(M);
	let CD = d.copy().sub(c);
	let CM = M.copy().sub(c);
	let MD = d.copy().sub(M);
	if (AB.dot(AM) >= 0 && AB.dot(MB) >= 0 && CD.dot(CM) >= 0 && CD.dot(MD) >= 0) {
		//within segments
		return M;
	}
	return false;
}

function squareDist(a, b) {
	return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

function getAngleBetweenPoints(a, b) {
	return atan2(a.y - b.y, a.x - b.x);
	//return atan2(a.y, a.x) - atan2(b.y, b.x);
	//return atan2(a.x - b.x, a.y - b.y);
}

function Collider() {
	this.vertices = [];

	if (arguments.length == 3) {
		//create circle
	}

	if (arguments.length == 4) {
		//create rectangle
		this.x = arguments[0];
		this.y = arguments[1];
		this.w = arguments[2];
		this.h = arguments[3];
		this.vertices = [
			createVector(this.x - this.w / 2, this.y - this.h / 2),
			createVector(this.x - this.w / 2, this.y + this.h / 2),
			createVector(this.x + this.w / 2, this.y + this.h / 2),
			createVector(this.x + this.w / 2, this.y - this.h / 2),
		];
	}

	this.show = function() {
		rectMode(CENTER);
		stroke(0);
		fill(255);
		rect(this.x, this.y, this.w, this.h);
	};
}
