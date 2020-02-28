/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID, params) => p => {
	var radii = [200, 4.9 * 2, 12.1 * 2, 12.8 * 2, 6.8 * 2, 143 / 2, 120 / 2, 51.1 / 2, 49.5 / 2, 2.3 * 3];
	var baseSpeeds = [0, 47, 35, 30, 24, 13, 10, 7, 5.4, 4.7];
	var speeds = [];
	var cols = [
		[255, 174, 0],
		[137, 73, 0],
		[255, 122, 0],
		[0, 107, 249],
		[255, 49, 0],
		[251, 193, 123],
		[255, 181, 92],
		[124, 185, 252],
		[59, 108, 160],
		[255, 58, 73],
	];
	var offsets = [];
	var w = 2;
	var r = 100;
	var dt = 0.001;
	var translation = [0, 0];
	var targetTrans = [0, 0];
	var transSpeed = 5;
	var zoom = 0.4;
	var targetZoom = 0.4;

	p.setup = () => {
		p.createCanvas(width, height);
		setTimeout(() => {
			p.windowResized();
		}, 10);
	};

	p.windowResized = function() {
		p.resizeCanvas(document.getElementById(parentDivID).offsetWidth, document.getElementById(parentDivID).offsetHeight);
		p.init();
	};

	p.init = () => {
		r = (width / ((radii.length * radii.length) / 10)) * zoom;
		translation = [0, 0];
		targetTrans = [0, 0];
		speeds = baseSpeeds.map(function(e) {
			return Math.sqrt(e);
			//return 50;
		});
		for (let i = 0; i < radii.length; i++) {
			offsets.push(p.random() * 5);
		}
		p.calculateRadius();
	};

	p.calculateRadius = function() {
		r = (p.width / ((radii.length * radii.length) / 10)) * zoom * 2;
	};

	p.draw = function() {
		p.background(51);
		p.translate(translation[0] + p.width / 2, translation[1] + p.height / 2);
		p.noStroke();
		p.fill(cols[0][0], cols[0][1], cols[1][2]);
		p.ellipse(0, 0, radii[0] * w * zoom, radii[0] * w * zoom);
		for (var i = 1; i < radii.length; i++) {
			//fill(map(i, 1, radii.length, 0, 254));
			p.fill(cols[i][0], cols[i][1], cols[i][2]);
			var angle = p.frameCount * dt * speeds[i] + offsets[i];
			var rad = (r * i * i) / 10 + 220 * zoom;
			var x = Math.sin(angle) * rad;
			var y = Math.cos(angle) * rad;
			p.ellipse(x, y, radii[i] * w * zoom, radii[i] * w * zoom);
			switch (i) {
				case 3:
					//earth
					break;
				case 5:
					var planetw = radii[i] * w * zoom;
					p.fill(181, 95, 20);
					p.arc(x, y, planetw, planetw, 0, Math.PI);
					p.fill(125, 51, 0);
					p.ellipse(x + w * 18 * zoom, y + 13 * w * zoom, radii[i] * w * zoom * 0.1, radii[i] * w * zoom * 0.1);
					break;
				case 6:
					//saturn
					planetw = radii[i] * w * zoom;
					var ringWidth = 0.05;
					var ringLength = 0.8;
					p.fill(181, 95, 20);
					p.push();
					p.translate(x, y);
					p.rotate(Math.PI / 4);
					p.beginShape();
					p.vertex(-ringLength * planetw, -ringWidth * planetw);
					p.vertex(-ringLength * planetw, +ringWidth * planetw);
					p.vertex(+ringLength * planetw, +ringWidth * planetw);
					p.vertex(+ringLength * planetw, -ringWidth * planetw);
					p.endShape();
					p.pop();
					break;
			}
		}
		if (p.keyIsDown(87)) {
			//W
			targetTrans[1] = targetTrans[1] + transSpeed;
		}
		if (p.keyIsDown(65)) {
			//A
			targetTrans[0] = targetTrans[0] + transSpeed;
		}
		if (p.keyIsDown(83)) {
			//S
			targetTrans[1] = targetTrans[1] - transSpeed;
		}
		if (p.keyIsDown(68)) {
			//D
			targetTrans[0] = targetTrans[0] - transSpeed;
		}
		p.translationLerp();
		if (p.keyIsDown(90)) {
			//Z
			targetZoom = targetZoom * 1.1;
		}
		if (p.keyIsDown(88)) {
			//X
			targetZoom = targetZoom / 1.1;
		}
	};

	p.translationLerp = function() {
		translation[0] = p.lerp(translation[0], targetTrans[0], 10 / (p.frameRate() + 0.1));
		translation[1] = p.lerp(translation[1], targetTrans[1], 10 / (p.frameRate() + 0.1));
		if (zoom != targetZoom) {
			zoom = p.lerp(zoom, targetZoom, 10 / (p.frameRate() + 0.1));
			p.calculateRadius();
		}
	};

	p.keyPressed = function() {
		if (p.keyCode == 82) {
			//R
			targetTrans[0] = 0;
			targetTrans[1] = 0;
			targetZoom = 0.4;
		}
	};
};
