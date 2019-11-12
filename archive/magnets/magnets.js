/// <reference path="../../node_modules/@types/p5/global.d.ts" />

magnets = [];
w = 60;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	for (x = 0; x < floor(width / w); x++) {
		for (y = 0; y < floor(height / w); y++) {
			magnets.push(new magnet(x, y));
		}
	}
	console.log(magnets);
}

function draw() {
	translate((w * 2) / 3 - width / 2, (w * 2) / 3 - height / 2);
	background(255, 216, 53, 255);
	for (i = 0; i < magnets.length; i++) {
		//magnets[i].angle = magnets[i].angle + 0.1;
		magnets[i].update();
		magnets[i].show();
	}
}

function magnet(x, y) {
	this.x = x;
	this.y = y;
	this.angle = 0;

	this.update = function() {
		this.angle = getAngle(this.x * w, this.y * w, mouseX - (2 / 3) * w, mouseY - (2 / 3) * w);
	};

	this.show = function() {
		push();
		noStroke();
		translate(x * w, y * w);
		rotateZ(this.angle);
		fill(70, 70, 70, 255);
		box(w / 3, w / 3, 1);

		translate((-1 / 3) * w, 0);
		fill(255, 0, 0, 255);
		box((w * 1) / 3, (w * 1) / 3, 1);

		translate((2 / 3) * w, 0);
		fill(0, 255, 255, 255);
		box((w * 1) / 3, (w * 1) / 3, 1);

		pop();
	};
}

function getAngle(x1, y1, x2, y2) {
	a = Math.abs(Math.atan2(Math.abs(y1 - y2), Math.abs(x1 - x2)));
	if (x1 - x2 >= 0) {
		if (y1 - y2 >= 0) {
			return a;
		} else {
			return 2 * Math.PI - a;
		}
	} else {
		if (y1 - y2 >= 0) {
			return Math.PI - a;
		} else {
			return Math.PI + a;
		}
	}
}
