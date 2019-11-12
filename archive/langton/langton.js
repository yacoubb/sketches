/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var w = 2;
var rules = [-1, -1, 1, -1];
var ants = [];
var grid = [];
var xWidth;
var yHeight;
var loopAmt = 200;
var antCount;
var ruleInput;
var antCountInput;
var speedInput;
var goButton;
var helperText =
	'langtons ant simulator\nhttps://en.wikipedia.org/wiki/Langton%27s_ant\nscroll down to access control text boxes\nfirst box defines the rules\n1 means turn right, -1 means turn left\n0 means do nothing and 2 means turn around\nup to 8 rules are supported\nsecond box defines the number of ants\nthird box defines the simulation speed\nsome fun rulesets to try are:\n-1, 1, 1, -1\n-1, -1, 1, 1\n1, -1\n1, 1, 1, 2\n1, 2, 1, 1\n1, 2, -1, 2';

function setup() {
	createCanvas(windowWidth, windowHeight);
	console.log(helperText);
	ruleInput = createInput('-1, -1, 1');
	antCountInput = createInput('3');
	speedInput = createInput('200');
	goButton = createButton('go');
	goButton.mouseClicked(init);
	init();
}

function init() {
	background(51);
	noStroke();
	fill(255);
	var ruleString = ruleInput.value();
	ruleString.replace(' ', '');
	var ruleStringArray = ruleString.split(',');
	rules = [];
	for (var i = 0; i < ruleStringArray.length; i++) {
		rules.push(int(ruleStringArray[i]));
	}

	antCount = int(antCountInput.value());
	loopAmt = int(speedInput.value());

	xWidth = floor(width / w);
	yHeight = floor(height / w);
	grid = [];
	for (var x = 0; x < xWidth; x++) {
		var col = [];
		for (var y = 0; y < yHeight; y++) {
			col.push(0);
			//rect(x * w, y * w, w, w);
		}
		grid.push(col);
	}

	ants = [];
	for (var i = 0; i < antCount; i++) {
		var newAnt = new ant(floor(random(xWidth)), floor(random(yHeight)), floor(random() * 4));
		ants.push(newAnt);
	}
}

function draw() {
	for (var loop = 0; loop < loopAmt; loop++) {
		for (var i = 0; i < ants.length; i++) {
			ants[i].step(i);
			//ants[i].show();
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function ant(x, y, direction) {
	this.x = x;
	this.y = y;
	this.direction = direction; //0 up 1 right 2 down 3 left

	this.step = function(index) {
		grid[this.x][this.y] += 1;
		grid[this.x][this.y] %= rules.length;

		this.direction += rules[grid[this.x][this.y]];
		this.direction += 4;
		this.direction %= 4;

		switch (grid[this.x][this.y]) {
			case 0:
				fill(255);
				break;
			case 1:
				fill(255, 0, 0);
				break;
			case 2:
				fill(0, 255, 0);
				break;
			case 3:
				fill(0, 0, 255);
				break;
			case 4:
				fill(255, 255, 0);
				break;
			case 5:
				fill(0, 255, 255);
				break;
			case 6:
				fill(255, 0, 255);
				break;
			case 7:
				fill(0, 100, 255);
				break;
		}
		rect(this.x * w, this.y * w, w, w);

		switch (this.direction) {
			case 0:
				this.y += 1;
				break;
			case 1:
				this.x += 1;
				break;
			case 2:
				this.y -= 1;
				break;
			case 3:
				this.x -= 1;
				break;
		}
		if (this.y < 0) {
			this.y = yHeight + this.y;
		} else if (this.y >= yHeight) {
			this.y = this.y - yHeight;
		}
		if (this.x < 0) {
			this.x = xWidth + this.x;
		} else if (this.x >= xWidth) {
			this.x = this.x - xWidth;
		}
		for (var i = 0; i < ants.length; i++) {
			if (i != index) {
				if (this.x == ants[i].x && this.y == ants[i].y) {
					ants.splice(i, 1);
					if (index > i) {
						index -= 1;
					}
					ants.splice(index, 1);
				}
			}
		}
	};

	this.show = function() {
		fill(0);
		push();
		translate(this.x * w + w / 2, this.y * w + w / 2);
		rotate((TAU * this.direction) / 4);
		ellipse(0, 0, w / 2, w * 0.8);
		translate(0, w * -0.4);
		ellipse(0, 0, w * 0.1, w * 0.1);
		pop();
	};
}
