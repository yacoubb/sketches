/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var serverAddress = 'http://localhost:3000';
var socket;
var currentMap = [];
var mapSize = 0;
var mapImg;
var zoom = 1;
var zoomLoc = [0, 0];
var maxZoom = 8;
var gridX = 0;
var gridY = 0;
var oldX = 0;
var oldY = 0;
var getUsernameTimeLimit = 60;
var getUsernameCounter = 0;
var requestedHoveringUsername = false;
var gotHoveringUsername = false;
var hoveringUsername = '';
var sliders = [];
var inputs = [];
var chosenColor = [255, 0, 0];
var username = '';
var lastAccess = 0;

function setup() {
	var canvas = createCanvas(floor(0.8 * windowWidth), windowHeight);
	canvas.parent('canvasContainer');
	init();
}

function init() {
	sliders = [
		document.getElementById('redRange'),
		document.getElementById('greenRange'),
		document.getElementById('blueRange'),
	];
	inputs = [
		document.getElementById('redInput'),
		document.getElementById('greenInput'),
		document.getElementById('blueInput'),
	];
	console.log(sliders, inputs);
	socket = io.connect(serverAddress);
	zoomLoc = [0, 0];
	socket.on('updateMap', updateMap);
	socket.on('click', click);
	socket.on('rejectusername', rejectusername);
	socket.on('acceptusername', acceptusername);
	socket.on('rejectclick', rejectclick);
	socket.on('happyclick', happyclick);
	socket.on('hoveringusername', hoveringusername);
}

function hoveringusername(data) {
	if (data != null) {
		//set username
		gotHoveringUsername = true;
		hoveringUsername = data;
		console.log('got hovering username: ' + hoveringUsername);
	} else {
		gotHoveringUsername = false;
		console.log('got empty hovering username');
	}
}

function rejectclick(data) {
	console.log('rejectclick: ' + data.err);
}

function happyclick(data) {
	lastAccess = data.time;
	console.log('lastAcces set to: ' + lastAccess);
}

function updateMap(data) {
	currentMap = data.map;
	mapSize = data.mapSize;
	mapImg = createImage(mapSize * maxZoom, mapSize * maxZoom);
	mapImg.loadPixels();
	for (var x = 0; x < mapSize; x++) {
		for (var y = 0; y < mapSize; y++) {
			var col = [currentMap[x][y][0], currentMap[x][y][1], currentMap[x][y][2], 255];
			for (var xx = x * maxZoom; xx < x * maxZoom + maxZoom; xx++) {
				for (var yy = y * maxZoom; yy < y * maxZoom + maxZoom; yy++) {
					mapImg.set(xx, yy, col);
				}
			}
		}
	}
	mapImg.updatePixels();
	drawMap();
}

function click(data) {
	console.log('click:', data);
	currentMap[data.x][data.y][0] = data.col[0];
	currentMap[data.x][data.y][1] = data.col[1];
	currentMap[data.x][data.y][2] = data.col[2];
	data.col.push(255);
	mapImg.loadPixels();
	for (var xx = data.x * maxZoom; xx < data.x * maxZoom + maxZoom; xx++) {
		for (var yy = data.y * maxZoom; yy < data.y * maxZoom + maxZoom; yy++) {
			mapImg.set(xx, yy, data.col);
		}
	}
	mapImg.updatePixels();
	drawMap();
}

function rejectusername(data) {
	console.log(data.err);
}

function acceptusername(data) {
	username = data;
	console.log('set username: ' + data);
}

function draw() {
	var shift = 10;
	var update = false;
	if (keyIsDown('W'.charCodeAt(0))) {
		zoomLoc = [zoomLoc[0], zoomLoc[1] + shift / zoom];
		update = true;
	}
	if (keyIsDown('A'.charCodeAt(0))) {
		zoomLoc = [zoomLoc[0] + shift / zoom, zoomLoc[1]];
		update = true;
	}
	if (keyIsDown('S'.charCodeAt(0))) {
		zoomLoc = [zoomLoc[0], zoomLoc[1] - shift / zoom];
		update = true;
	}
	if (keyIsDown('D'.charCodeAt(0))) {
		zoomLoc = [zoomLoc[0] - shift / zoom, zoomLoc[1]];
		update = true;
	}
	if (keyIsDown('Q'.charCodeAt(0))) {
		zoom += 0.1 * zoom;
		zoom = min(zoom, maxZoom);
		update = true;
	}
	if (keyIsDown('E'.charCodeAt(0))) {
		zoom -= 0.1 * zoom;
		zoom = max(1, zoom);
		update = true;
	}
	if (update) {
		//zoomLoc = [min(mapSize/2/maxZoom * (zoom+1), max(-mapSize/2/maxZoom * (zoom+1), zoomLoc[0])), min(mapSize/2/maxZoom * (zoom+2), max(-mapSize/2/maxZoom * (zoom+2), zoomLoc[1]))];
		drawMap();
	}
	if (mapSize > 0) {
		oldX = gridX;
		oldY = gridY;
		gridX = floor((mouseX - zoomLoc[0] * zoom - width / 2 + (mapSize / 2) * zoom) / zoom);
		gridY = floor((mouseY - zoomLoc[1] * zoom - height / 2 + (mapSize / 2) * zoom) / zoom);
		if ((oldX != gridX || oldY != gridY) && gotHoveringUsername) {
			drawMap();
		}
		fill(200);
		stroke(0);
		rect(-1, -1, 60, 20);
		fill(0);
		noStroke();
		text('(' + gridX + ', ' + gridY + ')', 0, textSize());
		if (oldX == gridX && oldY == gridY) {
			getUsernameCounter++;
			if (
				getUsernameCounter > getUsernameTimeLimit &&
				!requestedHoveringUsername &&
				gridX >= 0 &&
				gridX < mapSize &&
				gridY >= 0 &&
				gridY < mapSize
			) {
				socket.emit('requestHoveringUsername', { x: gridX, y: gridY });
				requestedHoveringUsername = true;
			}
		} else {
			requestedHoveringUsername = false;
			gotHoveringUsername = false;
			getUsernameCounter = 0;
		}

		if (gotHoveringUsername) {
			fill(200);
			stroke(0);
			rect(mouseX + textSize(), mouseY, hoveringUsername.length * textSize(), 20);
			fill(0);
			noStroke();
			text(hoveringUsername, textSize() + 2 + mouseX, mouseY + textSize());
		}
	}
}

function drawMap() {
	background(200);
	noStroke();
	if (mapSize > 0) {
		push();
		translate(width / 2 - (mapSize / 2) * zoom, height / 2 - (mapSize / 2) * zoom);
		translate(zoomLoc[0] * zoom, zoomLoc[1] * zoom);
		image(mapImg, 0, 0, mapSize * zoom, mapSize * zoom);
		pop();
	}
	console.log('drewmap');
}

function windowResized() {
	resizeCanvas(windowWidth * 0.8, windowHeight);
	drawMap();
}

function mouseClicked() {
	var data = {
		x: gridX,
		y: gridY,
		col: chosenColor,
	};
	//console.log(data);
	if (data.x >= 0 && data.x < mapSize && data.y >= 0 && data.y < mapSize) {
		socket.emit('click', data);
	}
}

function updateInputs() {
	console.log('updateinputs');
	chosenColor = [int(inputs[0].value), int(inputs[1].value), int(inputs[2].value)];
	document.getElementById('colorBox').style.background = rgbToHex(chosenColor);
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(list) {
	return '#' + componentToHex(list[0]) + componentToHex(list[1]) + componentToHex(list[2]);
}

function setUsername() {
	username = document.getElementById('usernameInput').value;
	console.log('requesting username update: ' + username);
	socket.emit('setusername', username);
}
