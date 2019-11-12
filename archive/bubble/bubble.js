/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var showToolTip = true;
var toolTipText = ['bubblesort', 'h to show/hide this'];
var running = true;
var count = 100;
var items = [];
var selected = 0;
var w = 20;
var locked = 1;
var confirmed = 0;
var speed = 1;
var comparisons = 0;
var swapped = true;

function setup() {
	createCanvas(windowWidth, windowHeight);
	frameRate(30);
	init();
}

function init() {
	items = [];
	for (var i = 1; i <= count; i++) {
		items.push(i);
	}
	items = shuffle(items);
	//items.reverse();
	w = width / (2 * count);
	locked = count - 1;
	//speed = ceil(count * count / 1000);
	speed = 1; // + floor(Math.log10(count));
}

function draw() {
	translate(0, height * 0.9);
	//if(!isSorted(items) && running) {
	if (running) {
		background(51);
		console.log(locked);
		if (locked > 0) {
			for (var i = 0; i < count; i++) {
				fill(255);
				if (i >= locked) {
					fill(255, 255, 0);
				}
				rect((i + 0.25) * 2 * w, 0, w, (-items[i] / count) * height * 0.85);
			}
			for (var s = 0; s < speed && locked > 0; s++) {
				if (swapped) {
					var temp;
					swapped = false;
					for (var i = 0; i < locked; i++) {
						comparisons++;
						if (items[i] > items[i + 1]) {
							temp = items[i];
							items[i] = items[i + 1];
							items[i + 1] = temp;
							swapped = true;
						}
					}
					locked--;
				}
				if (!swapped) {
					locked = 0;
				}
			}
		} else {
			for (var i = 0; i < count; i++) {
				if (i < confirmed) {
					fill(0, 255, 0);
				} else {
					fill(255);
				}
				rect((i + 0.25) * 2 * w, 0, w, (-items[i] / count) * height * 0.85);
			}
			if (confirmed < count) {
				confirmed += ((frameCount % 2) * count) / frameRate();
			}
		}
	}

	if (showToolTip) {
		textAlign(LEFT);
		noStroke();
		fill(255, 255, 255, 255);
		for (var i = 0; i < toolTipText.length; i++) {
			text(toolTipText[i], 0, -0.9 * height + 11 * (i + 1));
		}
		if (running) {
			text('running', 0, -0.9 * height + 11 * (toolTipText.length + 1));
		}
		textAlign(RIGHT);
		text(count + ' elements', width, -0.9 * height + 11);
		text(comparisons + ' comparisons', width, -0.9 * height + 22);
	}
}

function isSorted(arr) {
	for (var i = 0; i < arr.length - 1; i++) {
		if (arr[i] > arr[i + 1]) {
			return false;
		}
	}
	return true;
}

function keyPressed() {
	if (keyCode == 72) {
		showToolTip = !showToolTip;
	}
	if (keyCode == 32) {
		running = !running;
	}
}
