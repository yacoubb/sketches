/// <reference path="../../node_modules/@types/p5/global.d.ts" />

//var imgPath = "https://1.bp.blogspot.com/-y1ffdKTDFXI/WlCnH4XSyXI/AAAAAAAAAIw/k4cyPq6dVU0SRagRGwatBoiiy5KFwRNeACLcBGAs/s1600/s+%281%29.jpeg";
//var imgPath = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/220px-Aldrin_Apollo_11_original.jpg";
var imgPath = 'https://i.imgur.com/TWRI2SA.jpg';
var globalImg;
var scale = 1;

var pix = [];
var counter = 0;
var lumLimit = 100;

var urlInput;
var luminanceLimitInput;
var goButton;

//TODO make this more user friendly with sliders and visualisations

function setup() {
	createCanvas(windowWidth, windowHeight);
	urlInput = createInput('https://i.imgur.com/TWRI2SA.jpg');
	luminanceLimitInput = createInput('100');
	goButton = createButton('go');
	goButton.mouseClicked(init);
	init();
}

function init() {
	pixelDensity(1);
	imgPath = urlInput.value();
	console.log(imgPath);
	lumLimit = int(luminanceLimitInput.value());
	loadImage(imgPath, function(img) {
		console.log(img);
		globalImg = img;
		var c = color(255, 204, 0);
		var black = color(0, 0, 0);
		var white = color(255, 255, 255);
		counter = 0;
		background(51);
		if (img.width <= width && img.height <= height) {
			image(img, 0, 0);
		} else {
			scale = min(width / img.width, height / img.height);
			//scale = 1;
			image(img, 0, 0, img.width * scale, img.height * scale);
		}

		getLimits();
		console.log(pix.length);
	});
}

function draw() {
	counter++;
	if (counter == 40) {
		console.log('doSort');
		doSort();
	}
}

function getLimits() {
	console.log('getLimits');
	pix = [];
	loadPixels();
	for (var y = 0; y < globalImg.height * scale; y++) {
		for (var x = 0; x < globalImg.width * 4 * scale; x += 4) {
			var i = x + y * width * 4;
			var r = pixels[i];
			var g = pixels[i + 1];
			var b = pixels[i + 2];
			var l = (r + r + g + b + b + b) / 6;
			if (l > lumLimit) {
				//if(g > 200) {
				pix.push([i, color(r, g, b), l]);
				pixels[i] = pixels[i + 1] = pixels[i + 2] = 255;
			} else {
				pixels[i] = pixels[i + 1] = pixels[i + 2] = 0;
			}
		}
	}
	updatePixels();
}

function doSort() {
	if (globalImg.width <= width && globalImg.height <= height) {
		image(globalImg, 0, 0);
	} else {
		image(globalImg, 0, 0, globalImg.width * scale, globalImg.height * scale);
	}
	loadPixels();
	var counter = 0;
	var colorList = [];
	var length = floor(random(40, 300));
	for (var i = 0; i < pix.length; i++) {
		colorList.push(pix[i]);
		counter++;

		if (counter == length) {
			var sortedColorList = colorList.slice(0);
			sortedColorList.sort(function(a, b) {
				return a[2] - b[2];
			});
			for (var j = 0; j < colorList.length; j++) {
				pixels[colorList[j][0]] = red(sortedColorList[j][1]);
				pixels[colorList[j][0] + 1] = green(sortedColorList[j][1]);
				pixels[colorList[j][0] + 2] = blue(sortedColorList[j][1]);
				pixels[colorList[j][0] + 3] = alpha(sortedColorList[j][1]);
			}
			counter = 0;
			colorList = [];
			length = floor(random(40, 120));
		}
	}
	updatePixels();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
