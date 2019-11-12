/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var imgPath = 'https://i.imgur.com/Dcbv3P5.jpg';
var globalImg;
var scale = 1;
var debug = false;
var surround = 5;
var pixelsDone = [];
var distLimit = 30;
var colorLimit = 2;
var startColor = [];

var curvePoints = [];

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
	stroke(0);
	noFill();
	curvePoints = [];
	pixelsDone = [];
	for (var x = 0; x < width; x++) {
		var col = [];
		for (var y = 0; y < height; y++) {
			col.push(false);
		}
		pixelsDone.push(col);
	}
	imgPath = urlInput.value();
	console.log(imgPath);
	loadImage(imgPath, function(img) {
		console.log(img);
		globalImg = img;
		if (img.width <= width && img.height <= height) {
			resizeCanvas(img.width, img.height);
			image(img, 0, 0);
		} else {
			scale = min(width / img.width, height / img.height);
			resizeCanvas(img.width * scale, img.height * scale);
			image(img, 0, 0, img.width * scale, img.height * scale);
		}
		loadPixels();
		//background(255);
		drawCurve();
	});
}

function drawCurve() {
	var l = 255;
	var x = 0;
	var y = 0;
	while (l == 255) {
		x = floor(random(0, width));
		y = floor(random(0, height));
		l = brightnessAtIndex(x, y);
	}
	startColor = [x, y];
	console.log('start ' + x + ',' + y);
	mark(x, y);
	var count = 0;
	while (count < 5000) {
		var tries = 0;
		while (tries < 100) {
			var xx = max(0, min(width - 1, x + floor(random(-distLimit, distLimit))));
			var yy = max(0, min(height - 1, y + floor(random(-distLimit, distLimit))));
			if (pixelsDone[xx][yy] == false) {
				if (compareColors(xx, yy, x, y) < colorLimit) {
					//if(compareColors(xx, yy, startColor[0], startColor[1]) < colorLimit) {
					mark(xx, yy);
					x = xx;
					y = yy;
					break;
				}
			}
			tries++;
		}
		count++;
	}
	stroke(255, 0, 0);
	beginShape();
	for (var i = 0; i < curvePoints.length; i++) {
		vertex(curvePoints[i][0], curvePoints[i][1]);
	}
	endShape();
}

function brightnessAtIndex(x, y) {
	return (
		(pixels[x + y * width * 4] + pixels[x + y * width * 4 + 1] + pixels[x + y * width * 4 + 2]) / 3
	);
}

function compareColors(x1, y1, x2, y2) {
	return (
		(abs(pixels[x1 + y1 * width * 4] - pixels[x2 + y2 * width * 4]) +
			abs(pixels[x1 + y1 * width * 4 + 1] - pixels[x2 + y2 * width * 4 + 1]) +
			abs(pixels[x1 + y1 * width * 4 + 2] - pixels[x2 + y2 * width * 4 + 2])) /
		3
	);
}

function mark(x, y) {
	//console.log("mark " + x + "," + y);
	curvePoints.push([x, y]);
	for (var xx = max(0, x - surround); xx < min(width - 1, x + surround); xx++) {
		for (var yy = max(0, y - surround); yy < min(height - 1, y + surround); yy++) {
			pixelsDone[xx][yy] = true;
		}
	}
}

function draw() {}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
	if (keyCode == 32) {
		running = !running;
	}
}
