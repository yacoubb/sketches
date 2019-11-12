/// <reference path="../../node_modules/@types/p5/global.d.ts" />

let rotators = [];
let connections = [];
let vertices = [];
let drawingFrame = 0;
let speed = 1;
let sampleRate = 100;
const superSamples = 1 / sampleRate;

setup = () => {
	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER, CENTER);
	drawingFrame = 0;
	rotators = [
		{
			angularVelocity: 2,
			radius: 25,
			position: createVector(-width * 0.15, -height * 0.3),
			blob: createVector(0),
			blobRadius: 300,
		},
		{
			angularVelocity: 0.1,
			radius: 60,
			position: createVector(0, -height * 0.4),
			blob: createVector(0),
			blobRadius: 290,
		},
		{
			angularVelocity: 5,
			radius: 34,
			position: createVector(width * 0.2, -height * 0.2),
			blob: createVector(0),
			blobRadius: 400,
		},
	];
	connections = [[1, 2, 0, 100], [3, 0, 1, 300]];
	// connections = [[1, 2]];
	background(255);
};

draw = () => {
	translate(width / 2, height / 2);
	background(255);
	for (let i = 0; i < speed; i++) {
		step(i);
	}
	noFill();
	beginShape();
	for (let i = 0; i < vertices.length; i++) {
		vertex(
			vertices[i].x,
			vertices[i].y - (((1 - i / vertices.length) * drawingFrame) / speed) * 0.5
		);
	}
	endShape();
};

step = stepCount => {
	for (let i = 0; i < rotators.length; i++) {
		const rotator = rotators[i];
		rotator.blob = createVector(
			rotator.position.x +
				rotator.radius * Math.cos(rotator.angularVelocity * drawingFrame * superSamples),
			rotator.position.y +
				rotator.radius * Math.sin(rotator.angularVelocity * drawingFrame * superSamples)
		);
		if (stepCount == 0) {
			noFill();
			ellipse(rotator.position.x, rotator.position.y, rotator.radius * 2, rotator.radius * 2);

			ellipse(rotator.blob.x, rotator.blob.y, 10, 10);
			// ellipse(rotator.blob.x, rotator.blob.y, rotator.blobRadius * 2, rotator.blobRadius * 2);
			fill(0);
			text(i, rotator.position.x, rotator.position.y);
		}
	}
	let lines = rotators.map(rotator => ({
		x: rotator.blob.x,
		y: rotator.blob.y,
		r: rotator.blobRadius,
	}));
	let q;
	for (let i = 0; i < connections.length; i++) {
		const connection = connections[i];
		let a = lines[connection[0]];
		let b = lines[connection[1]];
		if (connection[2]) {
			a = lines[connection[1]];
			b = lines[connection[0]];
		}
		let d = dist(a.x, a.y, b.x, b.y);
		if (d > a.r + b.r) {
			console.log('FAILURE');
		}
		let c = (sq(b.r) - sq(a.r) + sq(d)) / (2.0 * d);
		let h = sqrt(abs(sq(b.r) - sq(c)));
		let x2 = b.x + (c * (a.x - b.x)) / d;
		let y2 = b.y + (c * (a.y - b.y)) / d;
		let x3 = x2 + (h * (a.y - b.y)) / d;
		let y3 = y2 - (h * (a.x - b.x)) / d;
		let p = createVector(x3, y3);
		q = createVector(a.x, a.y);
		let delta = p.copy().sub(a.x, a.y);
		q = q.add(delta);
		q = q.add(delta.normalize().mult(connections[i][3]));
		lines.push({ x: q.x, y: q.y, r: 200 });
		if (stepCount == 0) {
			// noFill();
			// ellipse(a.x, a.y, a.r * 2, a.r * 2);
			// ellipse(b.x, b.y, b.r * 2, b.r * 2);
			fill(0);
			ellipse(p.x, p.y, 5, 5);
			fill(255, 0, 0);
			ellipse(q.x, q.y, 5, 5);
			line(a.x, a.y, q.x, q.y);
			line(b.x, b.y, p.x, p.y);
		}
	}
	vertices.push(q);
	drawingFrame += 1;
};

windowResized = () => {
	resizeCanvas(windowWidth, windowHeight);
};
