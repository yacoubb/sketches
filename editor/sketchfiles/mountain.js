/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID, params) => p => {
	var w = 10;
	var n;
	var r = 200;

	p.setup = () => {
		p.createCanvas(width, height);
		setTimeout(() => {
			p.windowResized();
		}, 10);
	};

	p.windowResized = function() {
		p.resizeCanvas(
			document.getElementById(parentDivID).offsetWidth,
			document.getElementById(parentDivID).offsetHeight
		);
		p.init();
	};

	p.init = () => {
		n = Math.floor(p.width / w);
	};

	p.draw = () => {
		p.background(0);
		p.strokeWeight(2);
		r = Math.min(p.width / 2 - p.mouseX, p.height / 2);
		for (var x = 0; x <= n; x++) {
			var theta = ((x * w) / p.width) * Math.PI * 2 + p.frameCount * 0.01;
			p.stroke(((n - x * 1.5) / n) * 255, 0, ((x * 1.5) / n) * 255);
			p.line(
				x * w,
				p.height / 2,
				p.width / 2 + Math.cos(theta) * r,
				p.height / 2 - Math.sin(theta) * r
			);
		}
	};

	p.sig = x => {
		return x / (1 + abs(x));
	};
};
