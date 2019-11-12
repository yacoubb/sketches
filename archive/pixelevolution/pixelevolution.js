/// <reference path="../../node_modules/@types/p5/global.d.ts" />

//generated variables
var showToolTip = false;
var toolTipText = ['p5 project', 'h to show/hide this'];
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
var imgWidth, imgHeight;
var evolvingPixelGrid = [];
var evolvingPixels = [];
var gotImage = false;
var delta = 10;
var zoom;

function setup() {
	createCanvas(windowWidth, windowHeight);
	init(1);
}

function init(i) {
	if (i < 0 || i >= imagePaths.length) {
		i = 0;
	}
	loadImage(imagePaths[i], function(img) {
		gotImage = true;
		imgWidth = img.width;
		imgHeight = img.height;
		console.log(width, height, imgWidth, imgHeight);
		extractImageData(img);
		start();
	});
}

function start() {
	evolvingPixelGrid = [];
	evolvingPixels = [];
	for (var x = 0; x < imgWidth; x++) {
		var col = [];
		for (var y = 0; y < imgHeight; y++) {
			col.push(undefined);
		}
		evolvingPixelGrid.push(col);
	}
	console.log(evolvingPixels);
	for (var i = 0; i < 3; i++) {
		evolvingPixels.push(
			new cell(floor(random() * imgWidth), floor(random() * imgHeight), [100, 100, 100, 255], i)
		);
		evolvingPixelGrid[evolvingPixels[i].x][evolvingPixels[i].y] = evolvingPixels[i];
	}
}

//for specific xy index is ((imageWidth * y) + x) * 4

function extractImageData(img) {
	pixelDensity(1);
	resizeCanvas(imgWidth, imgHeight);
	image(img, 0, 0);
	loadPixels();
	resizeCanvas(windowWidth, windowHeight);
	background(51);
	zoom = min(width / imgWidth, height / imgHeight);
	//resizeCanvas(windowWidth, windowHeight);
	/* console.log(pixels.length, pixels[0],pixels[1],pixels[2],pixels[3]);
    for(var y = 0; y < imgHeight; y ++) {
        for(var x = 0; x < imgWidth; x ++) {
            stroke(pixels[((imgWidth * y) + x) * 4], pixels[((imgWidth * y) + x) * 4 + 1], pixels[((imgWidth * y) + x) * 4 + 2], pixels[((imgWidth * y) + x) * 4 + 3]);
            point(x, y);
        }
    } */
	console.log('done');
}

function step() {
	var startLength = evolvingPixels.length;
	for (var p = 0; p < startLength; p++) {
		var parent = evolvingPixels[p];
		var i = round(random(max(0, parent.x - 1), min(imgWidth - 1, parent.x + 1)));
		var j = round(random(max(0, parent.y - 1), min(imgHeight - 1, parent.y + 1)));

		var mutatedColors = [];
		for (var a = 0; a < 4; a++) {
			mutatedColors.push(
				max(0, min(255, parent.col[a] - floor(delta / 2) + round(random() * delta)))
			);
		}
		var child = new cell(i, j, mutatedColors);
		if (evolvingPixelGrid[i][j] != undefined) {
			if (pixelDelta(child) < pixelDelta(evolvingPixelGrid[i][j])) {
				child.index = evolvingPixelGrid[i][j].index;
				evolvingPixels[child.index] = child;
				stroke(mutatedColors[0], mutatedColors[1], mutatedColors[2], mutatedColors[3]);
				point(i, j);
			}
		} else {
			child.index = evolvingPixels.length;
			evolvingPixelGrid[i][j] = child;
			evolvingPixels.push(child);
			stroke(mutatedColors[0], mutatedColors[1], mutatedColors[2], mutatedColors[3]);
			point(i, j);
		}
	}
}

function pixelDelta(p) {
	var delta = 0;
	for (var i = 0; i < 4; i++) {
		delta += abs(pixels[(imgWidth * p.y + p.x) * 4 + i] - p.col[i]);
	}
	return delta;
}

function draw() {
	//background(51);
	if (running) {
		if (gotImage) {
			zoom = min(width / imgWidth, height / imgHeight);
			scale(zoom, zoom);
			//scale(width/imgWidth, height/imgHeight);
			step();
		}
	}
	if (showToolTip) {
		noStroke();
		fill(255, 255, 255, 255);
		for (var i = 0; i < toolTipText.length; i++) {
			text(toolTipText[i], 0, 11 * (i + 1));
		}
		if (running) {
			text('running', 0, 11 * (toolTipText.length + 1));
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
	if (keyCode == 32) {
		running = !running;
	} else if (keyCode >= 49 && keyCode <= 57) {
		init(keyCode - 49);
	}
}

function cell(x, y, col, index) {
	this.x = x;
	this.y = y;
	this.col = col;
	this.index = index;

	this.show = function() {
		stroke(col[0], col[1], col[2], col[3]);
		point(x, y);
	};
}
