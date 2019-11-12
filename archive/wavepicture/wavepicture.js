/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var address = 'https://c1.staticflickr.com/4/3484/3909641785_8c934debd8_b.jpg';
var img;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init();
}

function init() {
	pixelDensity(1);
	img = loadImage(address, function(img) {
		image(img, 0, 0);
		loadPixels();
		loaded(img.width);
	});
}

function loaded(imwidth) {
	stroke(255, 0, 0);
	for (var i = 0; i <= pixels.length; i++) {
		if (pixels[i] <= 5 && pixels[i + 1] <= 5 && pixels[i + 2] <= 5) {
			point((i / 4) % imwidth, floor(i / 4 / imwidth));
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
