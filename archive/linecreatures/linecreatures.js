/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var creatures;
var w = 80;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	creatures = [];
	for (var x = 0; x < floor(width / w / 2); x++) {
		var col = [];
		for (var y = 0; y < floor(height / w / 2); y++) {
			var newCreature = new creature(x, y);
			newCreature.show();
			col.push(newCreature);
		}
		creatures.push(col);
	}
}

function draw() {}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function creature(x, y) {
	this.x = x;
	this.y = y;
	this.arms = [];
	for (var i = 0; i < 2; i++) {
		this.arms.push(random(0.4 * w, w));
		this.arms.push(random() * TAU);
	}

	this.show = function() {
		fill(255);
		stroke(0);
		strokeWeight(3);
		translate(this.x * w * 2 + w, this.y * w * 2 + w);
		for (var i = 0; i < this.arms.length; i += 2) {
			push();
			rotate(this.arms[i] + 1);
			line(0, 0, 0, this.arms[i]);
			ellipse(0, this.arms[i], w * 0.07, w * 0.07);
			pop();
		}
		ellipse(0, 0, w * 0.12, w * 0.12);
		translate(-this.x * w * 2 - w, -this.y * w * 2 - w);
	};
}
