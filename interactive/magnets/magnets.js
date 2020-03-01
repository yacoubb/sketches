/// <reference path="../../node_modules/@types/p5/global.d.ts" />

export default (width, height, parentDivID, args) => p => {
	let magnets = [];
	const w = 60;

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
		magnets = [];
		for (let x = -1; x < Math.floor(p.width / w) + 1; x++) {
			for (let y = -1; y < Math.floor(p.height / w) + 1; y++) {
				magnets.push(new p.magnet(x, y));
			}
		}
	};

	p.draw = () => {
		// p.translate((w * 2) / 3 - p.width / 2, (w * 2) / 3 - p.height / 2);
		p.background(255, 216, 53, 255);
		// p.background(51);
		for (let i = 0; i < magnets.length; i++) {
			magnets[i].update();
			magnets[i].show();
		}
	};

	p.magnet = function(x, y) {
		this.x = x;
		this.y = y;
		this.angle = 0;

		this.update = function() {
			this.angle = getAngle(this.x * w * 1.2, this.y * w * 1.2, p.mouseX, p.mouseY);
		};

		this.show = function() {
			p.push();
			p.noStroke();
			p.translate(this.x * w * 1.2, this.y * w * 1.2);
			p.rotate(this.angle);
			p.fill(70);
			p.rect(-w / 6, -w / 6, w / 3, w / 3);

			p.translate((-1 / 3) * w, 0);
			p.fill(255, 0, 0, 255);
			p.rect(-w / 6, -w / 6, w / 3, w / 3);

			p.translate((2 / 3) * w, 0);
			p.fill(0, 255, 255, 255);
			p.rect(-w / 6, -w / 6, w / 3, w / 3);

			p.pop();
		};
	};

	function getAngle(x1, y1, x2, y2) {
		let a = Math.abs(Math.atan2(Math.abs(y1 - y2), Math.abs(x1 - x2)));
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
};
