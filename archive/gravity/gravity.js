/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var stars = [];
var planets = [];
var dt = 0.02;
var root3;
var held = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	colorMode(HSB);
	root3 = sqrt(3);
	stroke(255);
	fill(255);
	stars = [];
	planets = [];
	stars.push(new Star(width / 2, height / 2, 1000));
	for (var i = 0; i < 4; i++) {
		stars.push(new Star(random() * width, random() * height, random() * 1000 + 400));
	}
	planets.push(new Planet(width * 0.3, height * 0.3, 400, 20, 0));
	console.log(stars, planets);
	drawOnce();
}

function drawOnce() {
	//background(51);
	stars.forEach(star => {
		star.show();
	});

	for (var x = 0; x < width; x += 20) {
		for (var y = 0; y < height; y += 20) {
			var a = createVector(0, 0);
			var smallestDist = Infinity;
			for (var i = 0; i < stars.length; i++) {
				var ithVector = createVector(stars[i].x - x, stars[i].y - y);
				var dSquared = ithVector.magSq();
				if (dSquared < smallestDist) {
					smallestDist = dSquared;
				}
				ithVector.normalize();
				ithVector.mult((400 * stars[i].m) / dSquared);
				a.add(ithVector);
			}
			stroke(map(a.magSq(), 0, 20000, 0, 300), 255, 255);
			noFill();
			push();
			translate(x, y);
			rotate(-PI / 2 + a.heading());
			var r = min(sqrt(smallestDist), a.mag());
			//line(0, 0, 0, r);
			translate(0, r);
			//equilateral(0, 0, 4);
			translate(0, -r / 2);
			line(-10, -0, 10, 0);

			pop();
		}
	}
}

function draw() {
	stroke(255);
	for (var i = 0; i < planets.length; i++) {
		planets[i].step();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function equilateral(x, y, r) {
	triangle(x, y + (root3 / 3) * r, x + r / 2, y - (root3 / 6) * r, x - r / 2, y - (root3 / 6) * r);
}

function Star(x, y, m) {
	this.x = x;
	this.y = y;
	this.m = m;

	this.show = function() {
		fill(map(this.m, 100, 2000, 0, 100), 255, 255);
		noStroke();
		ellipse(this.x, this.y, sqrt(this.m), sqrt(this.m));
	};
}

function Planet(x, y, m, vx, vy) {
	this.x = x;
	this.y = y;
	this.m = m;
	this.v = createVector(vx, vy);
	var a = createVector(0, 0);

	this.step = function() {
		a = createVector(0, 0);
		for (var i = 0; i < stars.length; i++) {
			var ithVector = createVector(stars[i].x - this.x, stars[i].y - this.y);
			var dSquared = ithVector.magSq();
			ithVector.normalize();
			ithVector.mult((this.m * stars[i].m) / dSquared);
			a.add(ithVector);
		}
		var dv = a.copy();
		dv.mult(dt);
		this.v.add(dv);
		this.x += this.v.x * dt;
		this.y += this.v.y * dt;
		this.show();
	};

	this.show = function() {
		//ellipse(this.x, this.y, sqrt(this.m), sqrt(this.m));
		//fill(map(this.v.magSq(), 0, 40000, 0, 300), 255, 255);
		fill(255);
		noStroke();
		ellipse(this.x, this.y, 2, 2);
		if (frameCount % 4 == 0 && false) {
			push();
			translate(this.x, this.y);
			rotate((3 * PI) / 2 + a.heading());
			stroke(255);
			line(0, 0, 0, 100);
			pop();
		}
	};
}
