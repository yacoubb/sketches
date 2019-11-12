/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var imgAddress = 'https://i.imgur.com/eaYcr4T.jpg';
var img;
var bits = 3;
var grey = true;
var counter = 0;

function preload() {
	img = loadImage(imgAddress);
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	console.log(width, height);
	background(51);
	pixelDensity(1);
	var scale = min(width / img.width, height / img.height);
	image(img, 0, 0, img.width * scale, img.height * scale);
	if (grey) {
		filter(GRAY);
	}
}

function draw() {
	//background(51);
	counter++;
	if (counter == 50) {
		dither();
	}
}

function dither() {
	loadPixels();
	for (var y = 0; y < min(img.height, height - 1); y++) {
		for (var x = 0; x < min(img.width, width - 1) * 4; x += 4) {
			var i = x + y * width * 4;
			var r = pixels[i];
			var g = pixels[i + 1];
			var b = pixels[i + 2];

			var newR = round((r * bits) / 255) * (255 / bits);
			var newG = round((g * bits) / 255) * (255 / bits);
			var newB = round((b * bits) / 255) * (255 / bits);

			pixels[i] = newR;
			pixels[i + 1] = newG;
			pixels[i + 2] = newB;

			var deltaR = r - newR;
			var deltaG = r - newG;
			var deltaB = r - newB;

			pixels[i + 4] += (deltaR * 7) / 16;
			pixels[i + 4 + 1] += (deltaG * 7) / 16;
			pixels[i + 4 + 2] += (deltaB * 7) / 16;

			pixels[i - 4 + width * 4] += (deltaR * 3) / 16;
			pixels[i - 4 + width * 4 + 1] += (deltaG * 3) / 16;
			pixels[i - 4 + width * 4 + 2] += (deltaB * 3) / 16;

			pixels[i + width * 4] += (deltaR * 5) / 16;
			pixels[i + width * 4 + 1] += (deltaG * 5) / 16;
			pixels[i + width * 4 + 2] += (deltaB * 5) / 16;

			pixels[i + 4 + width * 4] += (deltaR * 1) / 16;
			pixels[i + 4 + width * 4 + 1] += (deltaG * 1) / 16;
			pixels[i + 4 + width * 4 + 2] += (deltaB * 1) / 16;
			/*
            pixel[x + 1][y    ] := pixel[x + 1][y    ] + quant_error * 7 / 16
            pixel[x - 1][y + 1] := pixel[x - 1][y + 1] + quant_error * 3 / 16
            pixel[x    ][y + 1] := pixel[x    ][y + 1] + quant_error * 5 / 16
            pixel[x + 1][y + 1] := pixel[x + 1][y + 1] + quant_error * 1 / 16
            */
		}
	}
	updatePixels();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (keyCode == 32) {
		grey = !grey;
		counter = 0;
		init();
	}
}
