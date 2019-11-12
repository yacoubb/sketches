/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var imgPath = 'https://i.imgur.com/DDqTHan.jpg';
var globalImg;
var scale = 1;
var debug = false;

var particleCount = 300;
var particles = [];

var urlInput;
var goButton;

function setup() {
	createCanvas(windowWidth, windowHeight);
	urlInput = createInput(imgPath);
	goButton = createButton('go');
	goButton.mouseClicked(init);
	init();
}

function init() {
	pixelDensity(1);
	particles = [];
	imgPath = urlInput.value();
	console.log(imgPath);
	loadImage(imgPath, function(img) {
		console.log(img);
		globalImg = img;
		background(51);
		if (img.width <= width && img.height <= height) {
			resizeCanvas(img.width, img.height);
			image(img, 0, 0);
		} else {
			scale = min(width / img.width, height / img.height);
			resizeCanvas(img.width * scale, img.height * scale);
			image(img, 0, 0, img.width * scale, img.height * scale);
		}
		filter(GRAY);
		filter(INVERT);
		loadPixels();
		background(51);
		//spawn particles
		partciles = [];
		for (var i = 0; i < particleCount; i++) {
			particles.push(
				new Particle(
					random((1 / 3) * width, (2 / 3) * width),
					random((1 / 3) * height, (2 / 3) * height),
					i
				)
			);
			particles[i].show();
		}
	});
}

function draw() {
	step();
}

function step() {
	background(51);
	if (debug) {
		if (globalImg.width <= width && globalImg.height <= height) {
			image(globalImg, 0, 0);
		} else {
			scale = min(width / globalImg.width, height / globalImg.height);
			image(globalImg, 0, 0, globalImg.width * scale, globalImg.height * scale);
		}
		filter(GRAY);
		filter(INVERT);
	}
	particles.forEach(particle => {
		particle.step();
		particle.show();
	});
}

function keyPressed() {
	if (keyCode == 32) {
		step();
	}
	if (keyCode == 'D'.charCodeAt(0)) {
		debug = !debug;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function Particle(x, y, index) {
	this.x = x;
	this.y = y;
	this.v = createVector(0, 0);
	this.a = createVector(0, 0);
	this.index = index;
	this.shade =
		(pixels[floor(this.x) + floor(this.y) * width * 4] +
			pixels[floor(this.x) + floor(this.y) * width * 4 + 1] +
			pixels[floor(this.x) + floor(this.y) * width * 4 + 2]) /
		3;
	this.show = function() {
		fill(this.shade);
		noStroke();
		ellipse(this.x, this.y, 2 + ceil((this.shade / 255) * 10), 2 + ceil((this.shade / 255) * 10));
	};

	this.step = function() {
		this.a = createVector(width / 2 - this.x, height / 2 - this.y);
		this.a = this.a.mult(particleCount * 0.000001);
		//this.v.mult(0.4);
		this.shade =
			(pixels[floor(this.x) + floor(this.y) * width * 4] +
				pixels[floor(this.x) + floor(this.y) * width * 4 + 1] +
				pixels[floor(this.x) + floor(this.y) * width * 4 + 2]) /
			3;
		for (var i = 0; i < particles.length; i++) {
			if (i == this.index) {
				continue;
			}
			var add = createVector(this.x - particles[i].x, this.y - particles[i].y);
			add = add.mult(((this.shade / 255) * particles[i].shade) / 255);
			add = add.div(squareDist(this.x, this.y, particles[i].x, particles[i].y));
			this.a = this.a.add(add);
		}
		//this.v = this.v.add(this.a);
		//this.x += this.v.x;
		//this.y += this.v.y;
		this.x += this.a.x;
		this.y += this.a.y;
		this.x = clamp(this.x, 0, width - 1);
		this.y = clamp(this.y, 0, height - 1);
	};
}

function squareDist(x1, y1, x2, y2) {
	return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

function clamp(n, min, max) {
	if (n < min) {
		return min;
	}
	if (n > max) {
		return max;
	}
	return n;
}
