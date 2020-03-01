/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID, args) => p => {
	const chroma = require('chroma-js');
	var colors = chroma
		.cubehelix()
		.start(200)
		.rotations(-0.5)
		.gamma(0.8)
		.lightness([0.3, 0.7])
		.scale()
		.colors(16);
	var hinges = [];
	var traces = [];

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
		hinges = [];
		traces = [];
		for (let x = 0; x < 4; x++) {
			const randOffset = p.random() + 0.5;
			hinges.push({
				x: ((x + 1) * p.width) / 5,
				y: p.height * 0.1,
				t: (x - 1) * 0.01 * randOffset,
			});
		}
		for (let y = 0; y < 4; y++) {
			const randOffset = p.random() + 0.5;
			hinges.push({
				x: p.width * 0.1,
				y: ((y + 1.5) * p.height) / 5,
				t: (y - 1) * 0.01 * randOffset,
			});
		}
		for (let x = 0; x < 4; x++) {
			let col = [];
			for (let y = 0; y < 4; y++) {
				col.push([]);
			}
			traces.push(col);
		}
	};

	p.draw = () => {
		p.background(51);
		p.stroke(255);
		p.noFill();
		const w = p.width / 32;
		const a = p.frameCount * 0.01 * Math.PI;
		for (let hinge of hinges) {
			p.circle(hinge.x, hinge.y, w * 2);
			const offsetX = Math.cos(a + hinge.t * p.frameCount) * w;
			const offsetY = Math.sin(a + hinge.t * p.frameCount) * w;
			if (hinge.x > p.width * 0.1) {
				p.line(hinge.x + offsetX, hinge.y + offsetY, hinge.x + offsetX, hinge.y + offsetY + p.height);
				hinge.trueX = hinge.x + offsetX;
			} else {
				p.line(hinge.x + offsetX, hinge.y + offsetY, hinge.x + offsetX + p.width, hinge.y + offsetY);
				hinge.trueY = hinge.y + offsetY;
			}
		}
		if (traces.length == 0) {
			return;
		}

		// console.log(ch);
		p.noFill();
		p.stroke(255);
		for (let x = 0; x < 4; x++) {
			for (let y = 0; y < 4; y++) {
				traces[x][y].push({ x: hinges[x].trueX, y: hinges[y + 4].trueY });
				p.stroke(colors[x * 4 + y]);
				p.beginShape();
				for (let i = 0; i < traces[x][y].length; i++) {
					p.vertex(traces[x][y][i].x, traces[x][y][i].y);
				}
				p.endShape();
			}
		}
	};
};
