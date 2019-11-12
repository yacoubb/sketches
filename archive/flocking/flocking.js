/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var running = true;

var cars = [];
var w = 10;
var fWidth, fHeight;
var field;
var drawArrow = true;
var border = 0.03;
var colors = ['#aabf12', '#33ab12', '#165512', '#fe3fa2', '#a345cd'];
var minR = 10,
	maxR = 40;
var hasClicked = false;
var clickOpacity = 255;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	cars = [];
	const carOpacity = 140;
	colors = [
		color(255, 255, 0, carOpacity),
		color(0, 255, 255, carOpacity),
		color(255, 0, 255, carOpacity),
		color(255, 0, 0, carOpacity),
		color(0, 255, 0, carOpacity),
	];
	console.log(colors);
	for (var i = 0; i < 200; i++) {
		cars.push(new Car(random(width), random(height), random(minR, maxR)));
	}
}

function mousePressed() {
	hasClicked = true;
}

function draw() {
	scale(1 + 2 * border);
	translate(-border * width, -border * height);
	background(51);
	// background('#fafaff');
	if (hasClicked) {
		clickOpacity *= 0.7;
	}
	if (clickOpacity > 0) {
		textSize(200);
		noStroke();
		fill(0, 255, 255, clickOpacity);
		textAlign(CENTER, CENTER);
		text('click', width / 2, height / 2);
	}
	fill(200, 255);

	for (var i = 0; i < cars.length; i++) {
		if (running) {
			cars[i].update();
		}
		cars[i].show();
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

function squareDist(x1, y1, x2, y2) {
	return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

function Car(x, y, r, colParam) {
	var target = createVector(0, 0);
	var power = 100;
	var maxSpeed = 80;
	var maxForce = 200;

	var viewRadius = 70 * 70;
	viewRadius = 100 * 100;

	this.pos = createVector(x, y);
	this.vel = createVector(random(maxSpeed / 10), random(maxSpeed / 10));
	this.acc = createVector(0, 0);
	this.r = r;
	this.col = colors[floor(random(colors.length))];

	//var desiredSeperation = this.r * this.r * 4;
	var desiredSeperation = maxR * 2.2 * (maxR * 2.2);

	this.update = function() {
		this.acc = createVector(0, 0);
		target = createVector(0, 0);
		//if((winMouseX != pwinMouseX || winMouseY != pwinMouseY) && !mouseIsPressed) {
		if (mouseIsPressed) {
			this.attract(500);
		}
		//this.seperate(200);
		//this.align(4);
		this.seperateAndAlign(4);

		this.pos.add(this.vel.copy().mult(0.1));
		if (this.pos.x > width) {
			this.pos.set(this.pos.x % width, this.pos.y);
		} else if (this.pos.x < 0) {
			this.pos.set(this.pos.x + width, this.pos.y);
		}
		if (this.pos.y > height) {
			this.pos.set(this.pos.x, this.pos.y % height);
		} else if (this.pos.y < 0) {
			this.pos.set(this.pos.x, this.pos.y + height);
		}
		this.vel.add(this.acc);
		this.vel.limit(maxSpeed);
	};

	this.applyForce = function(force) {
		this.acc.add(force);
		this.acc.limit(maxForce);
	};

	this.align = function(multiplier) {
		alignmentForce = createVector(0, 0);
		var count = 0;
		for (var i = 0; i < cars.length; i++) {
			var d = squareDist(this.pos.x, this.pos.y, cars[i].pos.x, cars[i].pos.y);
			if (d <= viewRadius) {
				alignmentForce.add(cars[i].vel);
				count++;
			}
		}
		//alignmentForce.div(count);
		//alignmentForce.add(createVector(random(4), random(4)));
		alignmentForce.normalize().mult(multiplier);
		this.applyForce(alignmentForce);
	};

	this.seperate = function(multiplier) {
		var seperateForce = createVector(0, 0);
		var count = 0;
		for (var i = 0; i < cars.length; i++) {
			var d = squareDist(this.pos.x, this.pos.y, cars[i].pos.x, cars[i].pos.y);
			//desiredSeperation = (this.r + cars[i].r) * (this.r + cars[i].r) * 2;
			if (d > 0 && d < desiredSeperation) {
				var diff = this.pos.copy().sub(cars[i].pos);
				//diff.normalize();
				diff.div(d);
				seperateForce.add(diff);
				count++;
			}
		}
		seperateForce.mult(multiplier);
		this.applyForce(seperateForce);
	};

	this.seperateAndAlign = function(multiplier) {
		var seperateForce = createVector(0, 0);
		var alignmentForce = createVector(0, 0);
		var count = 0;
		for (var i = 0; i < cars.length; i++) {
			var d = squareDist(this.pos.x, this.pos.y, cars[i].pos.x, cars[i].pos.y);
			if (d > 0) {
				if (d <= viewRadius) {
					alignmentForce.add(cars[i].vel);
					count++;
					if (d < desiredSeperation) {
						var diff = this.pos.copy().sub(cars[i].pos);
						//diff.normalize();
						diff.div(d);
						seperateForce.add(diff);
					}
				}
			}
		}
		seperateForce.mult(multiplier * 50);
		this.applyForce(seperateForce);
		alignmentForce.normalize().mult(multiplier);
		this.applyForce(alignmentForce);
	};

	this.attract = function(multiplier) {
		var attractForce = this.pos.copy().sub(createVector(mouseX, mouseY));
		var d = squareDist(this.pos.x, this.pos.y, mouseX, mouseY);
		attractForce.normalize();
		attractForce.div(sqrt(d));
		attractForce.mult(multiplier);
		this.applyForce(attractForce);
	};

	this.show = function() {
		noStroke();
		fill(this.col);
		ellipse(this.pos.x, this.pos.y, 2 * r, 2 * r);
		if (drawArrow) {
			stroke(this.col);
			strokeWeight(2);
			push();
			translate(this.pos.x, this.pos.y);
			rotate(this.vel.heading() - PI / 2);
			//var a = map(this.acc.mag(), this.r / 2, this.r * 2, 0, 255);
			//stroke(255, 255, 0, 70);
			//fill(255, 255, 0, 70);
			line(0, 0, 0, 0.5 * this.vel.mag());
			translate(0, 0.5 * this.vel.mag());
			triangle(0, 10, -5, 0, 5, 0);
			pop();
		}
	};
}
