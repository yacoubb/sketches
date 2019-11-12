/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = false;
var toolTipText = ['p5 project', 'h to show/hide this'];
var running = true;

var cWidth = 1;
var cHeight = 1;
var w = 10;
var field = [];
var particles = [];
var fieldDt = 0.003;
var particleDt = 0.1;
var drawField = false;
var xOffset = 0;
var yOffset = 0;
var myFrameCount = 0;
var fieldScale = 3;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	xOffset = random() * 20;
	yOffset = random() * 20;
	myFrameCount = 0;
	colorMode(RGB);
	background(51);
	colorMode(HSB);
	field = [];
	particles = [];
	cWidth = ceil(width / w);
	cHeight = ceil(height / w);
	strokeWeight(2);
	for (var x = 0; x < cWidth; x++) {
		var col = [];
		for (var y = 0; y < cHeight; y++) {
			var v = p5.Vector.fromAngle(
				noise(xOffset + (x * fieldScale) / cWidth, yOffset + (y * fieldScale) / cHeight, 0) * TWO_PI
			);
			col.push(v);
			if (drawField) {
				stroke(255);
				push();
				translate(x * w, y * w);
				rotate(v.heading());
				line(0, 0, w, 0);
				pop();
			}
		}
		field.push(col);
	}

	for (var i = 0; i < 100; i++) {
		particles.push(new Particle(random() * cWidth, random() * cHeight));
		particles[i].show();
	}
}

function updateField() {
	if (drawField) {
		background(20);
		strokeWeight(2);
	}
	var z = 0;
	for (var x = 0; x < cWidth; x++) {
		for (var y = 0; y < cHeight; y++) {
			z = (myFrameCount * fieldDt) / 2;
			var v = p5.Vector.fromAngle(
				noise(xOffset + (x * fieldScale) / cWidth, yOffset + (y * fieldScale) / cHeight, z) * TWO_PI
			);
			field[x][y] = v;
			if (drawField) {
				stroke(255);
				push();
				translate(x * w, y * w);
				rotate(v.heading());
				line(0, 0, w, 0);
				pop();
			}
		}
	}
}

function draw() {
	//background(20);
	if (running) {
		myFrameCount++;
		//init();
		updateField();
		for (var i = 0; i < particles.length; i++) {
			particles[i].update();
			particles[i].show();
		}
	}
	if (showToolTip) {
		noStroke();
		textAlign(RIGHT);
		fill(0, 0, 255, 255);
		for (var i = 0; i < toolTipText.length; i++) {
			text(toolTipText[i], width, 11 * (i + 1));
		}
		if (running) {
			text('running', width, 11 * (toolTipText.length + 1));
		}
		text('framerate ' + floor(frameRate()), width, 11 * (toolTipText.length + 2));
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	cWidth = ceil(width / w);
	cHeight = ceil(height / w);
}

function keyPressed() {
	if (keyCode == 72) {
		//showToolTip = !showToolTip;
	}
	if (keyCode == 32) {
		running = !running;
	}
	if (keyCode == 'A'.charCodeAt(0)) {
		init();
	}
	if (keyCode == 'D'.charCodeAt(0)) {
		drawField = !drawField;
		background(20);
	}
}

function Particle(x, y) {
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.tail = [];
	var widthVect = createVector(cWidth, 0);
	var heightVect = createVector(cHeight, 0);
	widthVect.mult(0.99);
	heightVect.mult(0.99);

	this.update = function() {
		this.pos.add(this.vel);
		this.vel.add(this.acc.mult(particleDt));
		this.vel.limit(w / 50);

		while (this.pos.x < 0) {
			this.pos.set(cWidth - 1, this.pos.y);
			this.setPrev();
		}
		while (this.pos.x > cWidth) {
			this.pos.set(0, this.pos.y);
			this.setPrev();
		}

		while (this.pos.y < 0) {
			this.pos.set(this.pos.x, cHeight - 1);
			this.setPrev();
		}
		while (this.pos.y > cHeight) {
			this.pos.set(this.pos.x, 0);
			this.setPrev();
		}
		this.acc = field[floor(this.pos.x)][floor(this.pos.y)].mult(0.1);
		this.show();
	};

	this.setPrev = function() {
		if (this.tail.length > 1) {
			this.tail.pop();
			this.tail.pop();
		}
	};

	this.show = function() {
		this.tail.unshift([
			this.pos.x * w,
			this.pos.y * w,
			(sin(myFrameCount * fieldDt * PI) * 360) / 2 + 360 / 2,
			170,
			255,
			1,
		]);
		if (this.tail.length > 2) {
			this.tail.pop();
		}
		strokeWeight(1);
		stroke(this.tail[0][2], this.tail[0][3], this.tail[0][4], this.tail[0][5]);
		if (this.tail.length > 1) {
			line(this.tail[0][0], this.tail[0][1], this.tail[1][0], this.tail[1][1]);
		}
		/*
         for(var i = 0; i < this.tail.length; i ++) {
            stroke(this.tail[i][2], this.tail[i][3], this.tail[i][4], this.tail[i][5])
            point(this.tail[i][0], this.tail[i][1]);
        } */
		//stroke(sin(myFrameCount * fieldDt * PI) * 124 + 125, 255, 255, 1);
		//stroke(0, 0.1);
		//strokeWeight(1);
		//point(this.pos.x * w, this.pos.y * w);
	};
}
