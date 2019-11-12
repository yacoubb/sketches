/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = true;
var toolTipText = [
	'pixel sorter',
	'change image with numbers',
	'change scan mode with m',
	'change sort mode with s',
	'h to show/hide this',
];
var running = true;

var imagePaths = [
	'https://thumbs.dreamstime.com/t/cow-funny-green-meadow-looking-to-camera-alps-background-45723755.jpg',
	'http://cdn.shopify.com/s/files/1/1537/5553/products/03576_2bfb8934-7a77-4cb1-aaee-5999fcab2cd2_grande.jpg?v=1486443009',
	'https://pbs.twimg.com/profile_images/682266692592898048/auRJ7685.jpg',
	'https://1.bp.blogspot.com/-y1ffdKTDFXI/WlCnH4XSyXI/AAAAAAAAAIw/k4cyPq6dVU0SRagRGwatBoiiy5KFwRNeACLcBGAs/s1600/s%2B%25281%2529.jpeg',
	'https://media.istockphoto.com/photos/planet-earth-with-some-clouds-americas-view-picture-id186019678?k=6&m=186019678&s=612x612&w=0&h=-gUleXGN9SYN59rP7IfLq01Y-wHmkiRx0Muf8mFdTKo=',
	'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/300px-The_Persistence_of_Memory.jpg',
	'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/220px-Aldrin_Apollo_11_original.jpg',
];

var imgWidth;
var imgHeight;
var gotImage;
var selectedImage = 1;
var sortedArray = [];
var speed;
var index = 0;
var yIndex = 0;
var mode = 1;
var sortMode = 1;
var zoom = 1;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init(0);
}

function init(i) {
	if (i < 0 || i >= imagePaths.length) {
		i = 0;
	}
	selectedImage = i + 1;
	console.log('init', i);
	loadImage(imagePaths[i], function(img) {
		imgWidth = img.width;
		imgHeight = img.height;
		zoom = min((width - 155) / (2 * imgWidth), height / imgHeight);
		console.log(width, height, imgWidth, imgHeight);
		extractImageData(img);
		start(img);
	});
}

function extractImageData(img) {
	pixelDensity(1);
	resizeCanvas(imgWidth, imgHeight);
	image(img, 0, 0);
	loadPixels();
	resizeCanvas(windowWidth, windowHeight);
	background(51);
	image(img, 0, 0);
	console.log('extractimagedata done');
}

function start(img) {
	scale(zoom, zoom);
	image(img, 0, 0);
	sortedArray = [];
	index = 0;
	yIndex = 0;
	speed = floor(imgWidth / 1);
	gotImage = true;
}

function step() {
	var pix = [
		pixels[index * 4],
		pixels[index * 4 + 1],
		pixels[index * 4 + 2],
		pixels[index * 4 + 3],
	];
	var sortVal = 0;
	if (sortMode == 1) {
		var r = pix[0] / 255;
		var g = pix[1] / 255;
		var b = pix[2] / 255;
		if (r > g && r > b) {
			sortVal = (g - b) / (r - min(g, b));
		} else if (g > r && g > b) {
			sortVal = 2.0 + (b - r) / (g - min(b, r));
		} else {
			sortVal = 4.0 + (r - g) / (b - min(r, g));
		}
	} else if (sortMode == 2) {
		sortVal = pix[0] + pix[1] + pix[2] + pix[3];
	}
	pix.unshift(sortVal);
	var inserted = false;
	for (var i = 0; i < sortedArray.length; i++) {
		if (sortVal < sortedArray[i][0]) {
			sortedArray.splice(i, 0, pix);
			inserted = true;
			break;
		}
	}
	if (!inserted) {
		sortedArray.push(pix);
	}
	index++;
}

function draw() {
	push();
	scale(zoom, zoom);
	if (running) {
		if (gotImage) {
			for (var i = 0; i < speed; i++) {
				step();
			}
			for (var i = 0; i < sortedArray.length; i++) {
				stroke(sortedArray[i][1], sortedArray[i][2], sortedArray[i][3], sortedArray[i][4]);
				point(imgWidth + (i % imgWidth), yIndex + floor(i / imgWidth));
			}
			if (mode == 2) {
				yIndex += floor(speed / imgWidth);
				sortedArray = [];
			}
			if (index * 4 >= pixels.length) {
				gotImage = false;
			}
		}
	}
	pop();
	if (showToolTip) {
		textAlign(RIGHT);
		noStroke();
		fill(51);
		rect(width - 155, 0, 155, 11 * (toolTipText.length + 5));
		fill(255, 255, 255, 255);
		for (var i = 0; i < toolTipText.length; i++) {
			text(toolTipText[i], width, 11 * (i + 1));
		}
		if (running) {
			text('running', width, 11 * (toolTipText.length + 1));
		}
		text('image ' + selectedImage, width, 11 * (toolTipText.length + 2));
		text('scanmode ' + mode, width, 11 * (toolTipText.length + 3));
		var sortTexts = ['hue', 'brightness', 'hue and brightness'];
		text('sort by ' + sortTexts[sortMode - 1], width, 11 * (toolTipText.length + 4));
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	init(0);
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
	if (keyCode == 32) {
		running = !running;
	} else if (keyCode >= 49 && keyCode <= 57) {
		init(keyCode - 49);
	} else if (keyCode == 77) {
		if (mode == 1) {
			mode = 2;
		} else {
			mode = 1;
		}
		init(selectedImage - 1);
	} else if (keyCode == 83) {
		if (sortMode == 1) {
			sortMode = 2;
		} else {
			sortMode = 1;
		}
		//init(selectedImage - 1);
	}
}
